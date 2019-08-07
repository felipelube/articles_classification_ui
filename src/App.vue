<template>
  <div id="app">
    <div class="pdf-viewer-wrapper">
      <pdf
        v-if="currentArticlePDF"
        :src="currentArticlePDF"
        :page="1"
        style="display: inline-block; width: 100%;"
      ></pdf>
    </div>
    <aside class="ArticleList">
      <virtual-list :size="400" :remain="2" :bench="30">
        <ArticleItem
          @setActive="setActive"
          @releaseActive="releaseActive"
          :open="isArticleActive(article)"
          :article="article"
          v-for="article of articles"
          :key="article.id"
        />
      </virtual-list>
    </aside>

    <div class="pdf-viewer-wrapper">
      <pdf
        v-if="currentArticlePDF"
        :src="currentArticlePDF"
        :page="5"
        style="display: inline-block; width: 100%;"
      ></pdf>
    </div>
  </div>
</template>

<script>
import ArticleItem from './components/ArticleItem.vue';
import virtualList from 'vue-virtual-scroll-list';
import pdf from 'vue-pdf';

import axios from 'axios';

export default {
  name: 'app',
  components: {
    virtualList,
    ArticleItem,
    pdf
  },
  data() {
    return {
      arts: [],
      activeArticle: {}
    };
  },
  methods: {
    setActive([article]) {
      this.activeArticle = article;
      // TODO: scroll to domId
    },

    isArticleActive(article) {
      return this.activeArticle.id && article.id === this.activeArticle.id;
    },
    releaseActive() {
      this.activeArticle = {};
    }
  },
  computed: {
    currentArticlePDF() {
      return this.activeArticle ? this.activeArticle.pdf_url : '';
    },
    articles() {
      return Array.from(this.arts)
        .sort((a, b) => b.reviewed - a.reviewed || b.score - a.score)
        .reverse();
    }
  },
  mounted() {
    axios
      .get('http://localhost:5000/api/articles')
      .then(response => (this.arts = response.data));
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
