<template>
  <div id="app">
    <aside>
      <ArticleInfo
        @hasChanges="() => this.activeChanges = true"
        @cancel="() => this.activeChanges = false"
        @save="saveArticle"
        v-if="activeArticle"
        :article="activeArticle"
      />
      <footer>
        <div class="navigation-buttons">
          <router-link class="buttom" :to="previousArticleRoute">
            <b-icon icon="arrow-left" size="is-medium"></b-icon>
          </router-link>
          <router-link class="buttom" :to="nextArticleRoute">
            <b-icon icon="arrow-right" size="is-medium"></b-icon>
          </router-link>
        </div>
      </footer>
    </aside>
    <main v-if="activeArticlePDFURL">
      <iframe id="PDFWrapper" :src="activeArticlePDFURL">Este browser não suporta pdfs.</iframe>
    </main>
  </div>
</template>

<script>
import { setScore, setReviewed, inValidSection } from './utils';
import ArticleInfo from './components/ArticleInfo';
import hotkeys from 'hotkeys-js';
import {
  API_SERVER,
  API_ENDPOINT_ARTICLES,
  API_ENDPOINT_ARTICLE
} from './config';

import axios from 'axios';

export default {
  name: 'app',
  components: {
    ArticleInfo
  },
  data() {
    return {
      /** Artigos */
      articles: [],
      activeChanges: false
    };
  },
  methods: {
    setScore,
    setReviewed,
    inValidSection,
    saveArticle(requirements) {
      const newRequirements = Object.keys(requirements).reduce(
        (newObj, requirementName) => {
          const requirement = requirements[requirementName];

          if (requirement.reviewedOn) {
            newObj[requirementName] = requirement;
          }
          return newObj;
        },
        {}
      );

      if (Object.keys(newRequirements).length) {
        return axios
          .post(API_SERVER + API_ENDPOINT_ARTICLE + this.activeArticle.id, {
            ...this.activeArticle,
            requirements: newRequirements
          })
          .then(() => {
            this.fetchArticles(); //Force a atualização de todos os artigos dando um fetch na API
          });
      } else {
        this.$buefy.notification.open('Pulando para o próximo artigo');
        this.nextArticle(); // Nenhum campo foi revisado, pulando para o próximo artigo
      }
    },
    fetchArticles() {
      axios
        .get(API_SERVER + API_ENDPOINT_ARTICLES)
        .then(response => (this.articles = response.data));
    },
    previousArticle() {
      if (this.confirmAbadomChanges()) {
        this.$router.push(this.previousArticleRoute);
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
        this.$router.push(this.nextArticleRoute);
      }
    }
  },
  computed: {
    activeArticleIndex() {
      return this.articles.findIndex(
        article => this.activeArticle.id === article.id
      );
    },
    nextArticleRoute() {
      try {
        const nextArticleId = this.articles[this.activeArticleIndex + 1].id;
        return {
          name: 'App',
          params: {
            articleId: nextArticleId
          }
        };
      } catch {
        return null;
      }
    },
    previousArticleRoute() {
      try {
        const nextArticleId = this.articles[this.activeArticleIndex - 1].id;
        return {
          name: 'App',
          params: {
            articleId: nextArticleId
          }
        };
      } catch {
        return null;
      }
    },
    activeArticle() {
      try {
        const articleId = parseInt(this.$route.params.articleId);
        if (articleId) {
          return this.articles.find(article => article.id === articleId);
        } else {
          return this.articles[0];
        }
      } catch {
        return this.articles[0];
      }
    },
    activeArticlePDFURL() {
      return this.activeArticle
        ? API_SERVER + this.activeArticle.data.pdfURL
        : '';
    },
    sortedArticles() {
      /**
       * Retorne uma lista com os artigos válidos (na seção correta), classificados pela pontuação
       * e status de análise.
       * As piores pontuações e artigos sem análise vêm primeiro.
       */
      return Array.from(this.articles)
        .filter(this.inValidSection)
        .map(this.setScore)
        .map(this.setReviewed)
        .sort((a, b) => b.reviewed - a.reviewed || b.score - a.score)
        .reverse();
    }
  },
  created() {
    this.fetchArticles();
  },
  mounted() {
    hotkeys('right', this.nextArticle);
    hotkeys('left', this.previousArticle);
  },
  beforeDestroy() {
    hotkeys.unbind('right');
    hotkeys.unbind('left');
  }
};
</script>


<style scoped>
#app {
  display: flex;
}

#PDFWrapper {
  flex-grow: 1;
}
aside {
  height: 100vh;
  width: 350px;
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main {
  margin-left: 350px;
  flex-grow: 1;
  position: relative;
  display: flex;
  height: 100vh;
}

.navigation-buttons > a {
  width: 50%;
  display: inline-block;
  height: 44px;
  text-align: center;
}

.pdf-viewer-wrapper {
  overflow: hidden;
  max-height: 90vh;
  width: 50%;
}
</style>
