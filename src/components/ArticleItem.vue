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
        <div class="fields">
          <b-collapse class="card">
            <div
              slot="trigger"
              slot-scope="props"
              class="card-header"
              role="button"
              aria-controls="contentIdForA11y3"
            >
              <p class="card-header-title">Idiomas</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
              </a>
            </div>
            <div class="card-content">
              <LanguageField
                @focus="changeView('language')"
                v-model="article.title_lang"
                placeholder="Idioma (título)"
                label="Idioma (tit)"
                icon="earth"
              />

              <LanguageField
                @focus="changeView('language')"
                v-model="article.abstract_lang"
                placeholder="Idioma"
                label="Idioma (abs)"
                icon="earth"
              />

              <LanguageField
                @focus="changeView('language')"
                v-model="article.lang"
                placeholder="Idioma"
                label="Idioma (corp)"
                icon="earth"
              />
            </div>
            <footer class="card-footer">
              <a class="card-footer-item">Salvar</a>
            </footer>
          </b-collapse>
        </div>
      </template>
    </section>
    <footer>
      <template v-if="open">
        <b-button @click="save" size="is-small" type="is-light">Salvar</b-button>
        <a href="#cancel" @click.prevent.stop="releaseActive">Cancelar</a>
      </template>
    </footer>
  </article>
</template>

<script>
import chroma from 'chroma-js';
import axios from 'axios';
import LanguageField from './LanguageField';

export default {
  components: {
    LanguageField
  },
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
    }
  },
  data() {
    return {
      activeView: ''
    };
  },
  methods: {
    setActive() {
      this.$emit('setActive', [this.article, this.$el.getAttribute('id')]);
      this.changeView('language');
    },
    releaseActive() {
      this.$emit('releaseActive');
    },
    changeView(name) {
      this.activeView = this.views(name);

      this.$emit('changeView', this.activeView);
    },
    views(name) {
      let selectedView;
      switch (name) {
        case 'language': {
          selectedView = {
            name: 'language',
            components: {
              left: {
                name: 'pdf',
                attrs: {
                  src: this.article.pdf_url,
                  page: 1,
                  style: 'display: inline-block; width: 100%;'
                }
              },
              right: {
                name: 'pdf',
                attrs: {
                  src: this.article.pdf_url,
                  page: 5,
                  style: 'display: inline-block; width: 100%;'
                }
              }
            }
          };
          break;
        }
        default: {
          return '';
        }
      }
      return selectedView;
    },
    save() {
      axios
        .post(`http://localhost:5000/api/article/${this.article.id}`, {
          ...this.article,
          reviewed: true
        })
        .then(() => {
          this.$set(this.article, 'reviewed', true);
          this.$emit('save');
        });
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
  width: 350px;
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

div.fields {
  margin: 50px 0 10px;
}
</style>



