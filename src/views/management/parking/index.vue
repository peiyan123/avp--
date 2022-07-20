<template>
  <page-wrapper :title="t('component.parking.parkingTitle')" :class="prefixCls">
    <a-button type="primary" style="margin-right: 15px" @click="handleNew">{{
      t('component.parking.btn_add')
    }}</a-button>
    <a-button type="primary" style="margin-right: 15px" @click="clearCache">{{ t('component.parking.btn_catch') }}</a-button>
    <a-button type="primary" style="margin-right: 15px" @click="handleEdit(data[0])">{{
      t('component.parking.btn_eidt')
    }}</a-button>
    <a-button type="primary" @click="handleStap(data[0])">{{ t('component.parking.btn_stap') }}</a-button>
    <div style="margin-top: 10px" v-if="data.length > 0">
      <Description
        size="middle"
        :title="t('component.parking.base_info')"
        :bordered="false"
        :column="3"
        :data="data[0]"
        :schema="refundSchema"
      />
      <a-divider />
      <Description size="middle" title="MQTT" :bordered="false" :column="3" :data="data[0]" :schema="personSchema" />
      <a-divider />
    </div>
    <div style="margin-top: 10px" v-else>
      <img style="width: 100%; height: 742px" :src="carImg" />
    </div>
    <modal @register="registerModal" @close="handleClose" />
  </page-wrapper>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { defineComponent, onMounted, ref } from 'vue';
  import { Description } from '/@/components/Description/index';
  import carImg from '/@/assets/images/nodata.png';
  import { personSchema, refundSchema } from './options/data';
  import { List } from 'ant-design-vue';
  import Modal from './components/Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { parkingApi, stapParkingApi, clearCacheApi } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: {
      PageWrapper,
      Description,
      [List.name]: List,
      [List.Item.name]: List.Item,
      Modal
    },
    setup() {
      const { createMessage, createSuccessModal, createErrorModal } = useMessage();
      const { t } = useI18n();
      const { success } = createMessage;
      const [registerModal, { openModal, closeModal }] = useModal();
      function handleNew() {
        openModal(true, { type: 'new' });
      }
      const dataList = ref('');
      async function getList() {
        dataList.value = await parkingApi('');
        if (dataList.value.length > 0) {
          localStorage.setItem('parkId', dataList.value[0].id);
        } else {
          localStorage.removeItem('parkId');
        }
      }
      onMounted(() => {
        getList();
      });

      function handleEdit(item) {
        openModal(true, { ...item, type: 'edit' });
      }
      // 点击同步
      async function handleStap(item) {
        localStorage.setItem('parkId', item.id);
        const data = await stapParkingApi({}, '/avp/parking/sync/cloud/' + item.id);
        if (data) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
        } else {
          createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
        }
      }
      function handleClose() {
        getList();
        closeModal();
      }
      // 清除缓存
      async function clearCache() {
        const data = await clearCacheApi();
        if (data) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
        } else {
          createErrorModal({ title: 'Tip', content: data.message });
        }
      }
      return {
        handleStap,
        handleNew,
        handleEdit,
        handleClose,
        personSchema,
        refundSchema,
        t,
        clearCache,
        carImg,
        prefixCls: 'list-basic',
        registerModal,
        data: dataList,
        successMsg: success
      };
    }
  });
</script>

<style lang="less" scoped>
  .list-basic {
    &__content {
      padding: 24px;
      margin-top: 12px;
      background-color: @component-background;

      .list {
        position: relative;
      }

      .icon {
        font-size: 40px !important;
      }

      .extra {
        position: absolute;
        top: 20px;
        right: 75px;
        font-weight: normal;
        color: @primary-color;
        cursor: pointer;
      }
      .stap {
        position: absolute;
        top: 20px;
        right: 15px;
        font-weight: normal;
        color: @primary-color;
        cursor: pointer;
      }
      .description {
        display: inline-block;
        width: 30%;
      }

      .info {
        display: inline-block;
        width: 40%;
        text-align: center;

        div {
          display: inline-block;
          padding: 0 20px;

          span {
            display: block;
          }
        }
      }

      // .progress {
      //   display: inline-block;
      //   width: 15%;
      //   vertical-align: top;
      // }
    }
  }
</style>
