<template>
  <div :class="$props.class" class="markdown-viewer"></div>
</template>

<script lang="ts" setup>
  import showdown from 'showdown';

  const converter = new showdown.Converter();
  converter.setOption('tables', true);

  // const getHtmlData = computed(() => converter.makeHtml(props.value || ''));
</script>

<style scoped>
  .markdown-viewer {
    width: 100%;
  }
</style>
