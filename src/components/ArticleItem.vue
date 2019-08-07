<template>
  <article
    :id="`article-${article.id}`"
    @click="setActive"
    :class="{'is-active': open, 'is-reviewed': reviewed}"
  >
    <header>
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
        <dl>
          <dt>Linguagem do artigo</dt>
          <dd class="field">
            <b-field>
              <b-select v-model="article.lang" placeholder="Idioma" icon="earth">
                <option :value="lang" v-for="lang in langCodes" :key="lang">{{languageName(lang)}}</option>
              </b-select>
            </b-field>
          </dd>
        </dl>
      </template>
    </section>
    <footer>
      <b-button
        v-if="!open"
        @click="setActive"
        size="is-small"
        type="is-light"
        icon-left="dots-horizontal"
      ></b-button>
      <template v-else>
        <b-button @click="save" size="is-small" type="is-light">Salvar</b-button>
        <a href="#cancel" @click.prevent="releaseActive">Cancelar</a>
      </template>
    </footer>
  </article>
</template>

<script>
import chroma from 'chroma-js';
import ISO6391 from 'iso-639-1';

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object
    }
  },
  computed: {
    reviewed() {
      return this.article.reviewed === true;
    },
    langCodes() {
      return ISO6391.getAllCodes();
    }
  },
  methods: {
    languageName(langCode) {
      return langCode ? ISO6391.getNativeName(langCode) : 'N/D';
    },
    setActive() {
      this.$emit('setActive', [this.article, this.$el.getAttribute('id')]);
    },
    releaseActive() {
      this.$emit('releaseActive');
    },
    }
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
  box-sizing: border-box;
  cursor: pointer;
}
article.is-active {
  border-color: #000;
  box-shadow: #ccc 1px 2px 6px;
}

article.is-reviewed {
  border-color: #00ff00;
}

header {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
}

h1 {
  font-size: 14px;
}

h1,
h2 {
  text-align: center;
}

article.is-active h1 {
  font-weight: 300;
}

section,
footer {
  padding: 15px;
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.Article__HeaderField > span {
  font-weight: bold;
}

dl {
  margin: 50px 0 10px;
}

dt {
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;

  text-transform: uppercase;
}

dd {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin: 5px 0;
}
</style>



