<template>
  <div id="app">
    <div class="pdf-viewer-wrapper">
      <component
        v-if="activeView && activeView.components && activeView.components.left"
        :is="activeView.components.left.name"
        v-bind="activeView.components.left.attrs"
      />
      <!--
      <pdf v-if="currentArticlePDF" :src="currentArticlePDF" :page="1"></pdf>
      -->
    </div>
    <aside class="ArticleList">
      <virtual-list :size="400" :remain="2" :bench="30">
        <ArticleItem
          @changeView="changeView"
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
      <component
        v-if="activeView && activeView.components && activeView.components.right"
        :is="activeView.components.right.name"
        v-bind="activeView.components.right.attrs"
      />
      <!--
      <pdf v-if="currentArticlePDF" :src="currentArticlePDF" :page="1"></pdf>
      -->
    </div>

    <!--
    <div class="pdf-viewer-wrapper">
      <pdf
        v-if="currentArticlePDF"
        :src="currentArticlePDF"
        :page="5"
        style="display: inline-block; width: 100%;"
      ></pdf>
    </div>
    -->
  </div>
</template>

<script>
import ArticleItem from './components/ArticleItem.vue';
import virtualList from 'vue-virtual-scroll-list';
import pdf from 'vue-pdf';
import { getValue } from './utils';

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
      activeArticle: {},
      activeView: {}
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
      this.activeView = {};
    },
    changeView(view) {
      this.activeView = view;
    },
    setScore(article) {
      let score = 100;
      const _setScore = (actual, value) => {
        return actual + value > 100
          ? 100
          : actual + value < 0
          ? 0
          : actual + value;
      };

      if (!getValue(article.lang)) {
        score = _setScore(score, -10);
      }

      score = Object.keys(article.requirements).reduce(
        (actualScore, requirement) => {
          if (!getValue(article.requirements[requirement])) {
            actualScore = _setScore(actualScore, -10);
          }
          return actualScore;
        },
        score
      );
      article.score = score;
      return article;
    },
    setReviewed(article) {
      const isReviewed = requirement => {
        return requirement.reviewedOn && requirement.reviewedOn !== null;
      };

      article.reviewed =
        Object.keys(article.requirements).every(requirement => {
          if (Array.isArray(article.requirements[requirement])) {
            return article.requirements[requirement].every(isReviewed);
          }
          return isReviewed(article.requirements[requirement]);
        }) && getValue(article.lang);
      return article;
    }
  },

  computed: {
    currentArticlePDF() {
      return this.activeArticle ? this.activeArticle.pdf_url : '';
    },
    articles() {
      return Array.from(this.arts)
        .map(this.setScore)
        .map(this.setReviewed)
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
