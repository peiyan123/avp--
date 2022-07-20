<template>
  <div class="anticon" :class="getAppLogoClass">
    <img style="width: 248px" :src="logoImg" />
    <span v-if="account !== 'admin'" class="parkTitle">xxxx停车场</span>
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import logoImg from '/@/assets/images/logo.png';

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean }
  });

  const { prefixCls } = useDesign('app-logo');
  const account = localStorage.getItem('account');
  const { getCollapsedShowTitle } = useMenuSetting();

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme,
    { 'collapsed-show-title': unref(getCollapsedShowTitle) }
  ]);
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      transition: all 0.5s;
    }
  }
  .parkTitle {
    margin-left: 15px;
    width: 180px;
    height: 33px;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 33px;
    letter-spacing: 2px;
  }
</style>
