<template>
  <div id="app">
    <aside class="ArticleList">
      <virtual-list :size="400" :remain="2" :bench="30">
        <ArticleItem
          @setActive="setActive"
          @releaseActive="releaseActive"
          :open="isArticleActive(article.id)"
          :article="article"
          v-for="article of articles"
          :key="article.id"
        />
      </virtual-list>
    </aside>
    <main>abacate</main>
  </div>
</template>

<script>
import ArticleItem from './components/ArticleItem.vue';
import virtualList from 'vue-virtual-scroll-list';

import axios from 'axios';

export default {
  name: 'app',
  components: {
    virtualList,
    ArticleItem
  },
  data() {
    return {
      articles: [],
      activeArticleId: 0
    };
  },
  methods: {
    setActive({ id }) {
      this.activeArticleId = id;
    },
    isArticleActive(id) {
      return id === this.activeArticleId;
    },
    releaseActive({ id }) {
      this.activeArticleId = 0;
    }
  },
  mounted() {
    axios
      .get('http://localhost:5000/api/articles')
      .then(response => (this.articles = response.data));
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
</style>
