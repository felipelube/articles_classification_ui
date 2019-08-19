<template>
  <section>
    <header>
      <h2>{{article.data.title}}</h2>
      <h2>{{article.data.originalTitle}}</h2>
    </header>
    <section class="requirements">
      <b-field v-for="field in fieldsForRequirementsInArticle" :key="field.name">
        <component
          @input="hasChanges"
          @change="hasChanges"
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
      this.$emit('save', this.temporaryFieldValues);
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
    hasChanges() {
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
  }
};
</script>

<style scoped>
</style>
