<template>
  <div id="app">
    <aside>
      <header>
        <b-button size="is-small" icon-left="arrow-left" @click="previousArticle"></b-button>
        <b-button size="is-small" icon-left="arrow-right" @click="nextArticle"></b-button>
      </header>
      <ArticleInfo
        @hasChanges="() => this.activeChanges = true"
        @cancel="() => this.activeChanges = false"
        @save="saveArticle"
        v-if="activeArticle"
        :article="activeArticle"
      />
    </aside>
    <main>
      <div class="pdf-viewer-wrapper">
        <component
          v-if="activeView && activeView.components && activeView.components.left"
          :is="activeView.components.left.name"
          v-bind="activeView.components.left.attrs"
        />
      </div>
      <div class="pdf-viewer-wrapper">
        <component
          v-if="activeView && activeView.components && activeView.components.right"
          :is="activeView.components.right.name"
          v-bind="activeView.components.right.attrs"
        />
      </div>
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
      articles: [],
      activeArticleIndex: 0,
      activeView: null,
      activeChanges: false
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
      if (this.activeArticleIndex - 1 < 0) {
        this.activeArticleIndex = 0;
        return;
      }
      this.activeArticleIndex = this.activeArticleIndex - 1;
    },
    nextArticle() {
      if (this.activeArticleIndex + 1 === this.sortedArticles.length) {
        this.activeArticleIndex = this.sortedArticles.length - 1;
        return;
      }
      this.activeArticleIndex = this.activeArticleIndex + 1;
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
  created() {
    this.fetchArticles();
  }
};
</script>

<style>
#app {
  display: flex;
}
aside.ArticleList {
  height: 100vh;
  display: flex;
  align-items: center;
}
main {
  display: flex;
  flex-grow: 1;
}

.pdf-viewer-wrapper {
  overflow: hidden;
  max-height: 90vh;
  width: 50%;
}
</style>
