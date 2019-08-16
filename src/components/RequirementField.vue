<template>
  <b-collapse :open.sync="open" class="card" aria-id="contentIdForA11y3">
    <div
      slot="trigger"
      slot-scope="props"
      class="card-header"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="card-header-title">
        <slot name="title"></slot>
      </p>
      <p class="card-header-title">
        <slot name="summary"></slot>
      </p>
      <a class="card-header-icon">
        <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
      </a>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
    <footer class="card-footer">
      <a @click="save" class="card-footer-item">Save</a>
      <a @click="cancel" class="card-footer-item">Cancelar</a>
    </footer>
  </b-collapse>
</template>

<script>
export default {
  data() {
    return {
      open: false
    };
  },
  name: 'RequirementField',
  watch: {
    open: {
      handler(val) {
        if (val) {
          this.$emit('opened');
        }
      }
    }
  },
  methods: {
    save() {
      this.$emit('save');
      this.open = false;
    },
    cancel() {
      this.open = false;
    }
  }
};
</script>

<style scoped>
</style>
