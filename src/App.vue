<template>
  <div id="app">
    <aside>
      <header>
        <div class="navigation-buttons">
          <b-button size="is-small" icon-left="arrow-left" @click="previousArticle"></b-button>
          <b-button size="is-small" icon-left="arrow-right" @click="nextArticle"></b-button>
        </div>
      </header>
      <ArticleInfo
        @hasChanges="() => this.activeChanges = true"
        @cancel="() => this.activeChanges = false"
        @save="saveArticle"
        v-if="activeArticle"
        :article="activeArticle"
      />
      <footer>
        <div class="navigation-buttons">
          <b-button size="is-small" icon-left="arrow-left" @click="previousArticle"></b-button>
          <b-button size="is-small" icon-left="arrow-right" @click="nextArticle"></b-button>
        </div>
      </footer>
    </aside>
    <main v-if="activeArticlePDFURL">
      <pdf
        v-for="i in pdfNumPages"
        :key="i"
        :src="activeArticlePDFURL"
        :page="i"
        style="display: inline-block; min-width: calc(50vw - 210px);"
      ></pdf>
    </main>
  </div>
</template>

<script>
import pdf from 'vue-pdf';
import { setScore, setReviewed } from './utils';
import ArticleInfo from './components/ArticleInfo';
import {
  API_SERVER,
  API_ENDPOINT_ARTICLES,
  API_ENDPOINT_ARTICLE
} from './config';

import axios from 'axios';

export default {
  name: 'app',
  components: {
    pdf,
    ArticleInfo
  },
  data() {
    return {
      /** Artigos */
      articles: [],
      activeArticleIndex: 0,
      activeChanges: false,
      /** PDF */
      pdfNumPages: 0
    };
  },
  methods: {
    setScore,
    setReviewed,
    saveArticle(newRequirements) {
      axios
        .post(API_SERVER + API_ENDPOINT_ARTICLE + this.activeArticle.id, {
          ...this.activeArticle,
          requirements: newRequirements
        })
        .then(() => {
          this.fetchArticles(); //Force a atualização de todos os artigos dando um fetch na API
        });
    },
    fetchArticles() {
      axios
        .get(API_SERVER + API_ENDPOINT_ARTICLES)
        .then(response => (this.articles = response.data));
    },
    previousArticle() {
      if (this.confirmAbadomChanges()) {
        if (this.activeArticleIndex - 1 < 0) {
          this.activeArticleIndex = 0;
          return;
        }
        this.activeArticleIndex = this.activeArticleIndex - 1;
      }
    },
    confirmAbadomChanges() {
      if (this.activeChanges) {
        if (window.confirm('Mudanças não salvas detectadas, continuar?')) {
          this.activeChanges = false;
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    nextArticle() {
      if (this.confirmAbadomChanges()) {
        if (this.activeArticleIndex + 1 === this.sortedArticles.length) {
          this.activeArticleIndex = this.sortedArticles.length - 1;
          return;
        }
        this.activeArticleIndex = this.activeArticleIndex + 1;
      }
    }
  },
  computed: {
    activeArticle() {
      return this.sortedArticles[this.activeArticleIndex] || null;
    },
    activeArticlePDFURL() {
      return this.activeArticle
        ? API_SERVER + this.activeArticle.data.pdfURL
        : '';
    },
    sortedArticles() {
      /**
       * Retorne uma lista com os artigos classificados pela pontuação e status de análise.
       * As piores pontuações e artigos sem análise vêm primeiro.
       */
      return Array.from(this.articles)
        .map(this.setScore)
        .map(this.setReviewed)
        .sort((a, b) => b.reviewed - a.reviewed || b.score - a.score)
        .reverse();
    }
  },
  watch: {
    activeArticlePDFURL: {
      immediate: true,
      handler(val) {
        if (val) {
          pdf.createLoadingTask(val).then(document => {
            this.pdfNumPages = document.numPages;
          });
        }
      }
    }
  },
  created() {
    this.fetchArticles();
  }
};
</script>

<style scoped>
#app {
  display: flex;
}
aside {
  height: 100vh;
  width: 350px;
  position: fixed;
  z-index: 1000;
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main {
  margin-left: 350px;
  flex-grow: 1;
}

.navigation-buttons > button {
  width: 50%;
  display: inline-block;
  height: 44px;
}

.pdf-viewer-wrapper {
  overflow: hidden;
  max-height: 90vh;
  width: 50%;
}
</style>
