<template>
  <article
    :id="`article-${art.id}`"
    @click="setActive"
    :class="{'is-active': open, 'is-reviewed': reviewed}"
  >
    <header>
      <p class="Article__HeaderField">
        texto:
        <span>{{art.lang}}</span>
      </p>
      <p class="Article__HeaderField">
        abstract:
        <span>{{art.abstract_lang}}</span>
      </p>
      <p v-score-color-scale="art.score" class="Article__HeaderField">
        nota:
        <span>{{art.score}}</span>
      </p>
    </header>
    <section>
      <h1>{{art.title}}</h1>
      <template v-if="open">
        <div class="fields">
          <RequirementField
            @save="fieldSaved(field.name)"
            @opened="changeView(field.view)"
            v-for="field in fieldsForRequirements"
            :key="field.name"
          >
            <template v-slot:summary>
              <span
                v-reviewed-style="art.requirements[field.name]"
              >{{summaryFor(art.requirements[field.name].value)}}</span>
            </template>
            <template v-slot:title>
              <span v-reviewed-style="art.requirements[field.name]">{{field.title}}</span>
            </template>
            <b-field>
              <component
                :is="field.component"
                :value="art.requirements[field.name].value"
                @input="(value) => fieldValueChanged(field.name, value)"
              >{{field.title}}</component>
            </b-field>
          </RequirementField>
        </div>
      </template>
    </section>
  </article>
</template>

<script>
import chroma from 'chroma-js';
import axios from 'axios';
import LanguageField from './LanguageField';
import RequirementField from './RequirementField';
import { pagesPDFView } from '@/views';
import { setValue } from '../utils';

export default {
  components: {
    LanguageField,
    RequirementField
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
    },
    articleDataForField(field, extraData) {},
    art() {
      return {
        ...this.article,
        data: {
          ...this.article.data,
          pdfURL: 'http://localhost:5000' + this.article.data.pdfURL
        }
      };
    },
    fieldsForRequirements() {
      return this.fieldsInfo.reduce((fields, field) => {
        if (
          this.article.requirements &&
          field.name in this.article.requirements &&
          field.component
        ) {
          fields.push(field);
        }
        return fields;
      }, []);
    }
  },
  data() {
    return {
      activeView: '',
      fieldsValues: {},
      fieldsInfo: [
        {
          name: 'titleLangEnglish',
          title: 'Título em inglês?',
          component: 'b-checkbox',
          view: 'language'
        },
        {
          name: 'titlePresence',
          title: 'Título presente no PDF?',
          component: 'b-checkbox',
          extraData: ['title'],
          view: 'language'
        },
        {
          name: 'abstractLangEnglish',
          title: 'Abstract em inglês?',
          component: 'b-checkbox',
          view: 'language'
        },
        {
          name: 'abstractPresence',
          title: 'Abstract presente no PDF?',
          component: 'b-checkbox',
          view: 'language'
        },
        {
          name: 'lang',
          title: 'Linguagem do artigo',
          component: 'b-select',
          view: 'languageArticle'
        },
        {
          name: 'referencesInRomanScript',
          title: 'Todas referências no alfabeto romano?',
          component: 'b-checkbox'
        },
        {
          name: 'referencesPage',
          title: 'Página com as referências'
        },
        {
          name: 'authorsPresence',
          title: 'Autores presentes no PDF?',
          component: 'b-checkbox'
        },
        {
          name: 'originalTitlePresence',
          title: 'Titulo original presente no PDF?',
          component: 'b-checkbox'
        }
      ]
    };
  },
  methods: {
    summaryFor(value) {
      return typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value;
    },
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
          return pagesPDFView(this.art.data.pdfURL, 1, 2);
        }
        case 'languageArticle': {
          return pagesPDFView(this.art.data.pdfURL, 2, 3);
        }
        default: {
          return '';
        }
      }
    },
    fieldValueChanged(fieldName, value) {
      const currentFieldValue = { ...this.article.requirements[fieldName] };
      this.$set(
        this.fieldsValues,
        fieldName,
        setValue(currentFieldValue, value)
      );
    },
    fieldSaved(fieldName) {
      const newRequirements = {
        ...this.article.requirements,
        ...this.fieldsValues
      };
      newRequirements[fieldName].reviewedOn = new Date().toISOString();
      this.$set(this.article, 'requirements', newRequirements);
      this.save();
    },
    save() {
      axios
        .post(`http://localhost:5000/api/article/${this.article.id}`, {
          ...this.article
        })
        .then(() => {
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
    },
    reviewedStyle: {
      bind(el, { value }) {
        if (value.reviewedOn) {
          el.classList.add('reviewed');
        } else {
          el.classList.remove('reviewed');
        }
      },
      componentUpdated(el, { value }) {
        if (value.reviewedOn) {
          el.classList.add('reviewed');
        } else {
          el.classList.remove('reviewed');
        }
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

.reviewed {
  color: green;
}
</style>



