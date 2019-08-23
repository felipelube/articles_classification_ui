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
          <router-link class="buttom" v-if="previousArticleRoute" :to="previousArticleRoute">
            <b-icon icon="arrow-left" size="is-medium"></b-icon>
          </router-link>
          <router-link class="buttom" v-if="nextArticleRoute" :to="nextArticleRoute">
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
  API_ENDPOINT_ARTICLES_IDS,
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
      articlesIds: [],
      activeArticle: null,
      activeChanges: false
    };
  },
  methods: {
    setScore,
    setReviewed,
    inValidSection,
    saveArticle(requirements) {
      /**
       * Calcula quais requisitos tem data de análise válida (foram provavelmente alterados) e
       * envia o artigo atualizado para a API.
       */
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
          .put(API_SERVER + API_ENDPOINT_ARTICLE + this.activeArticle.id, {
            ...this.activeArticle, //TODO: apesar de ser um PUT, por que vc enviando o objeto todo?
            requirements: newRequirements
          })
          .then(async () => {
            await this.fetchArticlesIds(); //Force a atualização de todos os artigos dando outro fetch na API
            this.$nextTick(() => {
              // Depois da mudança na lista de ids, retorne ao primeiro artigo dela
              this.$router.push({
                name: 'App',
                params: {
                  articleId: this.articlesIds[0]
                }
              });
            });
          });
      } else {
        this.$buefy.notification.open('Pulando para o próximo artigo');
        this.nextArticle(); // Nenhum campo foi revisado, pulando para o próximo artigo
      }
    },
    /**
     * Pega uma lista de ids de artigos, usada para navegação
     */
    fetchArticlesIds() {
      return axios
        .get(API_SERVER + API_ENDPOINT_ARTICLES_IDS)
        .then(response => (this.articlesIds = response.data));
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
    /**
     * O índice do artigo atual na lista de ids de artigos
     */
    currentArticleIndex() {
      return this.articlesIds.findIndex(
        articleId => articleId === this.activeArticle.id
      );
    },
    /**
     * Rota para o próximo artigo ao atual
     */
    nextArticleRoute() {
      try {
        const nextArticleId = this.articlesIds[this.currentArticleIndex + 1];
        if (nextArticleId) {
          return {
            name: 'App',
            params: {
              articleId: nextArticleId
            }
          };
        }
        return null;
      } catch {
        return null;
      }
    },
    /**
     * Rota para o artigo anterior ao atual
     */
    previousArticleRoute() {
      try {
        const previousArticleId = this.articlesIds[
          this.currentArticleIndex - 1
        ];
        if (previousArticleId) {
          return {
            name: 'App',
            params: {
              articleId: previousArticleId
            }
          };
        }
        return null;
      } catch {
        return null;
      }
    },
    activeArticlePDFURL() {
      return this.activeArticle
        ? API_SERVER + this.activeArticle.data.pdfURL
        : '';
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler(to) {
        const { articleId } = to.params;
        // Observe o id de artigo passado à rota e carregue o objeto do artigo correspondente da API
        if (articleId) {
          await axios
            .get(API_SERVER + API_ENDPOINT_ARTICLE + articleId)
            .then(response => {
              this.activeArticle = response.data;
            });
        }
      }
    }
  },
  async created() {
    await this.fetchArticlesIds();
    const { articleId } = this.$route.params;
    // Se nenhum id de artigo estiver presente na url, vá para a rota do primeiro na lista de artigos
    if (!articleId) {
      this.$router.push({
        name: 'App',
        params: {
          articleId: this.articlesIds[0]
        }
      });
    }
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
