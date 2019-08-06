<template>
  <article>
    <header v-if="!open">
      <p class="Article__HeaderField">
        texto:
        <span>{{article.lang}}</span>
      </p>
      <p class="Article__HeaderField">
        abstract:
        <span>{{article.abstract_lang}}</span>
      </p>
      <p v-score-color-scale="article.score" class="Article__HeaderField">
        nota:
        <span>{{article.score}}</span>
      </p>
    </header>
    <section>
      <h1>{{article.title}}</h1>
      <template v-if="open">
        <!--TODO: -->
      </template>
    </section>
    <footer>
      <b-button size="is-small" type="is-light" icon-left="dots-horizontal"></b-button>
    </footer>
  </article>
</template>

<script>
import chroma from 'chroma-js';
export default {
  props: {
    article: {
      type: Object
    }
  },
  data() {
    return {
      open: false
    };
  },
  directives: {
    scoreColorScale: {
      inserted(el, { value }) {
        let color;
        const score = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : 101;
        if (score > 100) {
          color = '#000';
        } else {
          const colorScale = chroma.scale(['red', 'yellow', 'green']);
          color = colorScale(score / 100);
        }
        el.querySelector('span').setAttribute('style', `color: ${color}`);
      }
    }
  }
};
</script>

<style scoped>
article {
  width: 250px;
  border: solid 1px #ccc;
  padding: 5px;
  margin: 5px;
  font-family: Roboto, sans-serif;
}
header {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
}

h1 {
  font-size: 18px;
}

h1,
h2 {
  text-align: center;
}

section,
footer {
  padding: 15px;
}
footer {
  text-align: center;
}

.Article__HeaderField > span {
  font-weight: bold;
}
</style>



