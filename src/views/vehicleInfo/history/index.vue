<template>
  <page-wrapper :title="id">
    <basic-table
      rowKey="id"
      ref="tableRef"
      bordered
      striped
      canResize
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      @change="change"
      :actionColumn="{
        width: lang === 'zh_CN' ? 160 : 260,
        title: t('component.upload.operating'),
        dataIndex: 'action',
        slots: { customRender: 'action' }
      }"
      :indexColumnProps="{
        width: 60
      }"
    >
      <template #form-custom></template>
      <template #action="{ record }">
        <table-action
          :actions="[
            {
              label: t('component.carport.port_in_record'),
              onClick: handleIn.bind(null, record)
            },
            {
              label: t('component.carport.port_out_record'),
              onClick: handleOut.bind(null, record),
              disabled: !record.parkingRecord.parkingOutRecordId
            }
          ]"
        />
      </template>
      <template #available="{ record }">
        <div @click="changeAvailable(record)" style="color: #0960bd; cursor: pointer">{{
          Number(record.available) === 0 ? t('component.carport.can_not_use') : t('component.carport.can_use')
        }}</div>
      </template>
    </basic-table>
    <modal @register="registerModal" @close="handleClose" />
  </page-wrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, TableActionType } from '/@/components/Table';
  import Modal from './components/Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { getBasicColumns } from './options/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { carPortRecordApi, deviceTypeDeleteApi, changeStatusApi } from '/@/api/sys/user';
  import { FormProps } from '/@/components/Table';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: { PageWrapper, BasicTable, TableAction, Modal },
    params: {
      id: String,
      type: String
    },
    setup() {
      const { t } = useI18n();
      const loading = ref(false);
      const router = useRouter();
      const pagination = ref<any>(true);
      const tableRef = ref<Nullable<TableActionType>>(null);
      const dataList = ref<any>('');
      const typeTitle = ref<any>('');
      const id = ref<any>('');
      const [registerModal, { openModal, closeModal }] = useModal();
      const { createConfirm } = useMessage();
      function getTableAction() {
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }
      //typeTitle.value = router.currentRoute.value.params.type
      id.value = router.currentRoute.value.params.id;

      function change() {
        getList();
      }
      function handleOut(data) {
        openModal(true, { type: 'out', ...data });
      }
      async function getList() {
        if (!router.currentRoute.value.params.id) {
          return router.go(-1);
        }
        var data = await carPortRecordApi(`/avp/parking/record/find/vehicle-record/${id.value}`);
        dataList.value = data;
        getTableAction().setPagination({
          current: getTableAction().getPaginationRef().current,
          total: data.total
        });
        getTableAction().reload();
      }
      onMounted(() => {
        getList();
      });
      async function changeAvailable(val) {
        var data = await changeStatusApi('/avp/device-type/change-status/' + val.id);
        if (data) {
          getList();
        }
      }
      function handleIn(data) {
        openModal(true, { type: 'in', ...data });
      }

      function handleDelete(val) {
        console.info(val);
        createConfirm({
          iconType: 'warning',
          title: () => t('component.app.tip'),
          content: () => t('component.app.del_tip'),
          onOk: async () => {
            const params = Object.assign(
              {},
              {
                ids: val.id
              }
            );
            await deviceTypeDeleteApi(params);

            getList();
          }
        });
      }

      function handleClose() {
        async function getList() {
          dataList.value = await carPortRecordApi('');
        }
        localStorage.removeItem('deviceId');
        getList();
        closeModal();
      }

      return {
        tableRef,
        typeTitle,
        id,
        change,
        columns: getBasicColumns(),
        changeAvailable,
        data: dataList,
        loading,
        getList,
        t,
        pagination,
        registerModal,
        handleOut,
        handleIn,
        handleDelete,
        handleClose
      };
    }
  });
</script>
