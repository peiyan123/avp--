<template>
  <page-wrapper :title="t('component.vehicleInfo.vehicleInfo_title')">
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
        width: 120,
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
              label: t('component.vehicleInfo.vehicleInfo_history'),
              onClick: handleHistory.bind(null, record)
            }
          ]"
        />
      </template>
    </basic-table>
    <modal @register="registerModal" @close="handleClose" />
  </page-wrapper>
</template>
<script lang="ts">
  import { router } from '/@/router';
  import { defineComponent, onMounted, ref, toRaw, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, TableActionType } from '/@/components/Table';
  import Modal from './components/Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { getBasicColumns } from './options/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { vehicleListApi } from '/@/api/sys/user';
  import { FormProps } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    components: { PageWrapper, BasicTable, TableAction, Modal },
    setup() {
      const lang = useLocale().getLocale.value;
      const { t } = useI18n();
      const loading = ref(true);
      const tableRef = ref<Nullable<TableActionType>>(null);
      const pagination = ref<any>(true);
      const dataList = ref<any>('');
      const searchCarNumber = ref<any>('');
      const [registerModal, { openModal, closeModal }] = useModal();
      const { createConfirm } = useMessage();
      function handleNew() {
        openModal(true, { type: 'new' });
      }
      function handleHistory(data) {
        router.push({
          name: 'HistoryVehicle',
          params: {
            id: data.carNumber
          }
        });
      }
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
      async function getList() {
        var data = await vehicleListApi({
          carNumber: searchCarNumber.value == '' ? null : searchCarNumber.value,
          pageNum: getTableAction().getPaginationRef().current,
          pageSize: getTableAction().getPaginationRef().pageSize
        });
        dataList.value = data.records;
        getTableAction().setPagination({
          current: getTableAction().getPaginationRef().current,
          total: data.total
        });
        getTableAction().reload();
        loading.value = false;
        // nextTick(() => {
        //   var creat = document.getElementsByClassName('ant-pagination-options-quick-jumper')[0].children
        //   creat[0].setAttribute('onkeyup', "this.value=this.value.replace('.','')")
        //   console.info(creat)
        // });
      }
      function getPagination() {
        console.info(getTableAction().getPaginationRef());
      }
      onMounted(() => {
        getList();
        getPagination();
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
        async function getList() {
          var data = await vehicleListApi('');
          dataList.value = data.records;
        }
        localStorage.removeItem('deviceId');
        getList();
        closeModal();
      }
      function getFormConfig(): Partial<FormProps> {
        return {
          labelWidth: lang === 'zh_CN' ? 60 : 140,
          schemas: [
            {
              field: `carNumber`,
              label: t('component.vehicleInfo.vehicleInfo_carNumber'),
              component: 'Input',
              colProps: {
                xl: 8,
                xxl: 6
              },
              componentProps: {
                placeholder: t('component.vehicleInfo.vehicleInfo_carNumber_placeholder')
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
        searchCarNumber.value = validate.carNumber;
        if (validate.carNumber === '') {
          getList();
        } else {
          var data = await vehicleListApi({
            carNumber: validate.carNumber
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
        searchCarNumber,
        handleHistory,
        data: dataList,
        t,
        getPagination,
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
