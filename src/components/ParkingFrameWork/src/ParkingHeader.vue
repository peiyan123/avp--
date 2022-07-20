<template>
  <div class="header"></div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const loading = ref(false);
      const pagination = ref<any>(false);
      alert(1212);
      return {
        loading,
        pagination
      };
    }
  });
</script>
<style lang="less" scoped>
  .header {
    height: 50px;
    width: 100px;
    color: red;
  }
</style>
