<template>
  <page-wrapper :title="t('component.deviceType.deviceType_title')">
    <a-button type="primary" @click="handleNew">{{ t('component.deviceType.deviceType_add_btn') }}</a-button>
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
  import { defineComponent, onMounted, ref, toRaw, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, TableActionType } from '/@/components/Table';
  import Modal from './components/Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { getBasicColumns } from './options/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deviceTypeListApi, deviceTypeDeleteApi, changeStatusApi } from '/@/api/sys/user';
  import { FormProps } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    components: { PageWrapper, BasicTable, TableAction, Modal },
    setup() {
      const { t } = useI18n();
      const lang = useLocale().getLocale.value;
      const loading = ref(false);
      const pagination = ref<any>(true);
      const tableRef = ref<Nullable<TableActionType>>(null);
      const dataList = ref<any>('');
      const searchTypeName = ref<any>('');
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
        var data = await deviceTypeListApi({
          typeName: searchTypeName.value == '' ? null : searchTypeName.value,
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
      // 切换是否可用
      async function changeAvailable(val) {
        var data = await changeStatusApi('/avp/device-type/change-status/' + val.id);
        if (data) {
          getList();
        }
      }
      function handleEdit(data) {
        localStorage.setItem('cardPortId', data.id);
        console.info(toRaw(data));
        openModal(true, { type: 'edit', ...data });
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
        localStorage.removeItem('deviceId');
        getList();
        closeModal();
      }
      function getFormConfig(): Partial<FormProps> {
        return {
          labelWidth: lang === 'zh_CN' ? 60 : 100,
          schemas: [
            {
              field: `typeName`,
              label: t('component.deviceType.deviceType_title'),
              component: 'Input',
              colProps: {
                xl: 8,
                xxl: 6
              },
              componentProps: {
                placeholder: t('component.deviceType.deviceType_placeholder')
              }
            }
          ],
          submitFunc: handleSubmit,
          resetFunc: () => {
            getTableAction().getPaginationRef().current = 1;
            getTableAction().getPaginationRef().pageSize = 10;
          }
        };
      }
      //表单提交
      async function handleSubmit(validate) {
        getTableAction().getPaginationRef().current = 1;
        searchTypeName.value = validate.typeName;
        if (validate.typeName === '') {
          getList();
        } else {
          var data = await deviceTypeListApi({
            typeName: validate.typeName
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
        changeAvailable,
        searchTypeName,
        data: dataList,
        t,
        loading,
        getList,
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
