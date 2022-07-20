<template>
  <page-wrapper :title="t('component.equipment.equipment_title')">
    <a-button type="primary" @click="handleNew">{{ t('component.equipment.equipment_add_btn') }}</a-button>
    <basic-table
      rowKey="id"
      ref="tableRef"
      bordered
      striped
      canResize
      useSearchForm
      :formConfig="formConfig"
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      @change="change"
      :actionColumn="{
        width: 160,
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
              label: t('component.parking.btn_eidt'),
              onClick: handleEdit.bind(null, record)
            },
            {
              label: t('component.upload.del'),
              onClick: handleDelete.bind(null, record)
            }
          ]"
        />
      </template>
    </basic-table>
    <modal @register="registerModal" @close="handleClose" />
  </page-wrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, toRaw, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, TableActionType } from '/@/components/Table';
  import Modal from './components/Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { getBasicColumns } from './options/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deviceListApi, deviceDeleteApi } from '/@/api/sys/user';
  import { FormProps } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    components: { PageWrapper, BasicTable, TableAction, Modal },
    setup() {
      const lang = useLocale().getLocale.value;
      const { t } = useI18n();
      const loading = ref(false);
      const pagination = ref<any>(true);
      const tableRef = ref<Nullable<TableActionType>>(null);
      const dataList = ref<any>('');
      const searchDeviceNo = ref<any>('');
      const [registerModal, { openModal, closeModal }] = useModal();
      const { createConfirm } = useMessage();
      function getTableAction() {
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }
      function change() {
        getList();
      }
      function handleNew() {
        openModal(true, { type: 'new' });
      }
      async function getList() {
        var data = await deviceListApi({
          deviceNo: searchDeviceNo.value == '' ? null : searchDeviceNo.value,
          pageNum: getTableAction().getPaginationRef().current,
          pageSize: getTableAction().getPaginationRef().pageSize
        });
        dataList.value = data.records;
        getTableAction().setPagination({
          current: getTableAction().getPaginationRef().current,
          total: data.total
        });
        getTableAction().reload();
      }
      onMounted(() => {
        getList();
      });
      function handleEdit(data) {
        localStorage.setItem('cardPortId', data.id);
        console.info(toRaw(data));
        openModal(true, { type: 'edit', ...data });
      }

      function handleDelete(data) {
        console.info(data);
        createConfirm({
          iconType: 'warning',
          title: () => t('component.app.tip'),
          content: () => t('component.app.del_tip'),
          onOk: async () => {
            const params = Object.assign(
              {},
              {
                ids: data.id
              }
            );
            await deviceDeleteApi(params);
            getList();
          }
        });
      }

      function handleClose() {
        localStorage.removeItem('deviceId');
        getList();
        closeModal();
      }
      function getFormConfig(): Partial<FormProps> {
        return {
          labelWidth: lang === 'zh_CN' ? 60 : 140,
          schemas: [
            {
              field: `deviceNo`,
              label: t('component.equipment.equipment_deviceNo'),
              component: 'Input',
              colProps: {
                xl: 8,
                xxl: 6
              },
              componentProps: {
                placeholder: t('component.equipment.equipment_deviceNo_placeholder')
              }
            }
          ],
          submitFunc: handleSubmit,
          resetFunc: () => {
            getTableAction().setPagination({
              pageSize: 10,
              current: 1
            });
          }
        };
      }
      //表单提交
      async function handleSubmit(validate) {
        getTableAction().getPaginationRef().current = 1;
        searchDeviceNo.value = validate.deviceNo;
        if (validate.deviceNo === '') {
          getList();
        } else {
          var data = await deviceListApi({
            deviceNo: validate.deviceNo
          });
          dataList.value = data.records;
          getTableAction().setPagination({
            current: getTableAction().getPaginationRef().current,
            total: data.total
          });
          getTableAction().reload();
        }
      }

      return {
        tableRef,
        change,
        formConfig: getFormConfig(),
        columns: getBasicColumns(),
        data: dataList,
        searchDeviceNo,
        loading,
        getList,
        t,
        pagination,
        registerModal,
        handleNew,
        handleEdit,
        handleDelete,
        handleClose
      };
    }
  });
</script>
