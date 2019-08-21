<template>
  <section class="ArticleInfo">
    <header>
      <h2>{{article.data.title}}</h2>
      <h3>{{article.data.originalTitle}}</h3>
    </header>
    <section class="requirements">
      <b-field v-for="field in fieldsForRequirementsInArticle" :key="field.name">
        <component
          @input="(e) => hasChanges(field.name, e)"
          @change="(e) => hasChanges(field.name, e)"
          :is="componentForField(field.name)"
          v-model="temporaryFieldValues[field.name].value"
        >{{field.title}}</component>
      </b-field>
    </section>
    <footer class="card-footer">
      <a @click="save" class="card-footer-item">Save</a>
      <a @click="cancel" class="card-footer-item">Cancelar</a>
    </footer>
  </section>
</template>

<script>
import { REQUIREMENT_FIELDS_INFO } from '../config';
import LanguageField from './LanguageField';
import hotkeys from 'hotkeys-js';

export default {
  name: 'ArticleInfo',
  components: {
    LanguageField
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      fieldsInfo: REQUIREMENT_FIELDS_INFO, // dicionário com informações sobre os campos
      temporaryFieldValues: {} // cópia de trabalho de article.requirements
    };
  },
  methods: {
    componentForField(fieldName) {
      return this.fieldsInfo.find(fieldInfo => fieldInfo.name === fieldName)
        .component;
    },
    save() {
      // emita um evento com a cópia dos requisitos alterados para este artigo

      const emptyKeys = Object.keys(this.temporaryFieldValues).filter(key => {
        if (Array.isArray(this.temporaryFieldValues[key])) {
          return this.temporaryFieldValues[key].some(
            item => item.reviewedOn === null
          );
        }
        return this.temporaryFieldValues[key].reviewedOn === null;
      });

      if (emptyKeys.length) {
        if (window.confirm('Confirma o valor de todos os campos?')) {
          for (const key of emptyKeys) {
            if (Array.isArray(this.temporaryFieldValues[key])) {
              this.temporaryFieldValues[key] = this.temporaryFieldValues[
                key
              ].map(item => ({
                ...item,
                reviewedOn: new Date().toISOString()
              }));
              continue;
            }
            this.temporaryFieldValues[
              key
            ].reviewedOn = new Date().toISOString();
          }
          this.$emit('save', this.temporaryFieldValues);
        }
      } else {
        this.$emit('save', this.temporaryFieldValues);
      }
    },
    reset() {
      // redefina os requisitos com base nos que estão no artigo inalterado
      this.temporaryFieldValues = JSON.parse(
        JSON.stringify(this.article.requirements)
      );
    },
    cancel() {
      this.reset();
      this.$emit('cancel');
    },
    hasChanges(fieldName, e) {
      this.temporaryFieldValues[
        fieldName
      ].reviewedOn = new Date().toISOString();
      // indique que o usuário mexeu em algum input
      this.$emit('hasChanges');
    }
  },
  computed: {
    fieldsForRequirementsInArticle() {
      /**
       * Retorna uma array com os campos para os requerimentos presentes no artigo.
       */
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
  watch: {
    article: {
      deep: true,
      immediate: true,
      handler() {
        // refaça a nossa cópia dos requisitos toda vez que o artigo alterar
        this.reset();
      }
    }
  },
  mounted() {
    hotkeys('ctrl+enter', this.save);
  },
  beforeDestroy() {
    hotkeys.unbind('ctrl+enter');
  }
};
</script>

<style scoped>
.ArticleInfo {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.ArticleInfo > footer {
}

.ArticleInfo > .requirements {
  margin-top: auto;
}
h2,
h3 {
  text-align: center;
  margin: 10px;
  font-weight: bold;
  font-size: 20px;
}

h3 {
  font-size: 18px;
  color: #686868;
}
</style>
