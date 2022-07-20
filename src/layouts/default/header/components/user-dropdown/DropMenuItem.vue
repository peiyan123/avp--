<template>
  <MenuItem :key="itemKey">
    <span class="flex items-center">
      <Icon :icon="icon" class="mr-1" />
      <span>{{ text }}</span>
    </span>
  </MenuItem>
</template>
<script lang="ts">
  export default defineComponent({
    name: 'DropdownMenuItem'
  });
</script>

<script lang="ts" setup>
  import { Menu } from 'ant-design-vue';
  import { computed, defineComponent, getCurrentInstance } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { propTypes } from '/@/utils/propTypes';

  const MenuItem = Menu.Item;

  const props = defineProps({
    key: propTypes.string,
    text: propTypes.string,
    icon: propTypes.string
  });

  const instance = getCurrentInstance();
  const itemKey = computed(() => props.key || instance?.vnode?.props?.key);
</script>
