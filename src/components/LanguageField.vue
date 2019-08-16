<template>
  <b-field>
    <template slot="label">
      <div class="Label">
        {{label}}
        <b-button size="is-small" @click="onInfo" icon-left="feature-search"></b-button>
        <a
          v-for="langCode in mostUsedLangCodes"
          :key="langCode"
          :class="{'LangLink': true,  'active': $attrs.value === langCode}"
          @click.prevent="() => $emit('input', langCode)"
        >{{langCode}}</a>
        <a
          :class="{'LangLink': true,  'active': unusualLangcode }"
          @click.prevent="() => userManualSelection = true"
        >+</a>
      </div>
    </template>
    <b-select
      v-on:change="$emit('change', $event.target.value)"
      v-show="languagesComboVisible"
      @focus="changeView('language')"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <option :value="lang" v-for="lang in langCodes" :key="lang">{{languageName(lang)}}</option>
    </b-select>
  </b-field>
</template>
<script>
import ISO6391 from 'iso-639-1';
export default {
  name: 'LanguageField',
  computed: {
    langCodes() {
      return ISO6391.getAllCodes();
    },
    unusualLangcode() {
      return !this.mostUsedLangCodes.find(item => item === this.$attrs.value);
    },
    languagesComboVisible() {
      return (
        this.userManualSelection || this.unusualLangcode || !this.$attrs.value
      );
    }
  },
  data() {
    return {
      userManualSelection: false,
      mostUsedLangCodes: ['en', 'ca', 'es', 'pt']
    };
  },

  methods: {
    languageName(langCode) {
      return langCode ? ISO6391.getNativeName(langCode) : 'N/D';
    },
    onInfo() {
      this.$emit('info');
    }
  },
  props: {
    label: {
      type: String,
      default: 'Idioma'
    }
  }
};
</script>

<style>
.field.active .Label {
  font-weight: bold;
}
.field .Label {
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  justify-items: safe;
  width: 100%;
}

.LangLink.active {
  font-weight: bold;
  color: #f00 !important;
}
</style>
