<template>
  <LayoutFeatures />
  <LayoutHeader class="parkingHeader" />
  <Layout class="parkingSection">
    <LayoutSideBar />
    <RouterView>
      <template #default="{ Component, route }">
        <transition
          :name="
            getTransitionName({
              route,
              openCache,
              enableTransition: getEnableTransition,
              cacheTabs: getCaches,
              def: getBasicTransition
            })
          "
          mode="out-in"
          appear
        >
          <keep-alive v-if="openCache" :include="getCaches">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </RouterView>
  </Layout>

  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import FrameLayout from '/@/layouts/iframe/index.vue';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { Layout } from 'ant-design-vue';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { getTransitionName } from './transition';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import LayoutHeader from '../default/header/index.vue';
  import LayoutSideBar from '../default/sider/index.vue';
  export default defineComponent({
    name: 'PageLayout',
    components: {
      FrameLayout,
      LayoutHeader,
      Layout,
      LayoutSideBar,
      LayoutFeatures: createAsyncComponent(() => import('/@/layouts/default/feature/index.vue'))
    },
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting();
      const tabStore = useMultipleTabStore();

      const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return [];
        }
        return tabStore.getCachedTabList;
      });

      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
        getCanEmbedIFramePage
      };
    }
  });
</script>
<style scoped lang="less">
  ::v-deep(.fullscreen-item) {
    display: none !important;
  }

  ::v-deep(.cursor-pointer) {
    display: none !important;
  }
  ::v-deep(.app-iconify) {
    display: none !important;
  }
  ::v-deep(.vben-header-user-dropdown) {
    margin-left: 55px;
    &:hover {
      background: #414554 linear-gradient(180deg, #212137 0%, #4a4f5c 100%) !important;
    }
  }
  .parkingHeader {
    height: 60px !important;
    background: #414554 linear-gradient(180deg, #212137 0%, #4a4f5c 100%) !important;
    ::v-deep.vben-layout-header-action {
      .vben-layout-header-action__item {
        height: 0px !important;
      }
    }
  }

  ::v-deep(.anticon-search) {
    color: #fff !important;
  }
  ::v-deep(.truncate) {
    color: #fff !important;
  }
  ::v-deep(.vben-app-logo) {
    width: 428px;
    height: 60px;
    background: #4a4f5c;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.3);
    border-radius: 1px 1px 20px 1px;
    img {
      width: 154px;
    }
  }
  .ant-layout-sider {
    width: 408px !important;
    min-width: 408px !important;
    background: #d8d8d8 linear-gradient(180deg, #212137 0%, #4a4f5c 100%);
  }
  .parkingSection {
    ::v-deep aside {
      min-width: 408px !important;
      background: #d8d8d8 linear-gradient(180deg, #212137 0%, #4a4f5c 100%);
    }
  }
</style>
