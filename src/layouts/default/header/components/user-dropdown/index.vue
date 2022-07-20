<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <!-- <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        /> -->
        <MenuItem key="logout" :text="t('layout.header.dropdownItemLoginOut')" />
        <MenuItem key="reset" :text="t('layout.header.resetPassword')" />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
  type MenuEvent = 'logout' | 'reset';

  export default defineComponent({
    name: 'UserDropdown'
  });
</script>

<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue';
  import { defineComponent, computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import headerImg from '/@/assets/images/header.jpg';
  import { propTypes } from '/@/utils/propTypes';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { router } from '/@/router';

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));

  defineProps({
    theme: propTypes.oneOf(['dark', 'light'])
  });

  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useI18n();
  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { realName = '', avatar, desc } = userStore.getUserInfo || {};
    return { realName, avatar: avatar || headerImg, desc };
  });

  const [register] = useModal();

  function handleLock() {
    //openModal(true);
    router.push({ name: 'Password' });
  }

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }

  function handleMenuClick(e: { key: MenuEvent }) {
    switch (e.key) {
      case 'logout':
        handleLoginOut();
        break;
      case 'reset':
        handleLock();
        break;
    }
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
