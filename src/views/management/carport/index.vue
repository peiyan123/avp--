<template>
  <page-wrapper :title="t('component.carport.carport_title')">
    <a-button type="primary" style="margin-right: 15px" @click="handleNew">{{
      t('component.carport.carport_addbtn')
    }}</a-button>
    <a-button type="primary" style="margin-right: 15px" @click="syncCloud">{{
      t('component.carport.carport_cloudbtn')
    }}</a-button>
    <Upload style="margin-right: 15px" :before-upload="addAll" class="upload-modal-toolbar__btn">
      <a-button type="primary">
        {{ t('component.carport.carport_addallbtn') }}
      </a-button>
    </Upload>
    <basic-table
      rowKey="id"
      bordered
      ref="tableRef"
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
        width: 230,
        title: t('component.carport.carport_opt'),
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
              label: t('component.carport.carport_history'),
              onClick: handleHistory.bind(null, record)
            },
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
  import { router } from '/@/router';
  import { defineComponent, onMounted, ref, toRaw, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, TableActionType } from '/@/components/Table';
  import Modal from './components/Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { Upload } from 'ant-design-vue';
  import { checkFileType } from './options/table';
  import { getBasicColumns } from './options/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { carportList, carportDelete, changeStatusApi, importApi, syncCloudApi } from '/@/api/sys/user';
  import { FormProps } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    components: { PageWrapper, BasicTable, TableAction, Modal, Upload },
    setup() {
      const loading = ref(false);
      const lang = useLocale().getLocale.value;
      const pagination = ref<any>(true);
      const tableRef = ref<Nullable<TableActionType>>(null);
      const dataList = ref<any>('');
      const searchLotNo = ref<any>('');
      const { t } = useI18n();
      const { createSuccessModal, createErrorModal } = useMessage();
      const fileRef = ref(null);
      const form = ref(null);
      const [registerModal, { openModal, closeModal }] = useModal();
      const { createConfirm } = useMessage();
      const parkId = ref<string>('');
      function handleNew() {
        openModal(true, { type: 'new', parkId: parkId });
      }
      function getTableAction() {
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }
      // 分页切换
      function change() {
        getList();
      }
      // 批量添加
      function addAll(file) {
        if (!checkFileType(file, ['xlsx', 'xls'])) {
          createErrorModal({ title: 'Tip', content: t('component.carport.file_type_error') });
        } else {
          fileChange(file);
        }
      }
      // 同步云端
      async function syncCloud() {
        const data = await syncCloudApi();
        if (data) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
        } else {
          createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
        }
      }
      async function fileChange(file) {
        var formData = new FormData();
        formData.append('file', file);
        const data = await importApi(formData);
        if (data) {
          console.info(fileRef.value);
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
          getList();
        } else {
          createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
        }
      }
      // 切换是否可用
      async function changeAvailable(val) {
        var data = await changeStatusApi('/avp/lot/change-status/' + val.id);
        if (data) {
          getList();
        }
      }
      async function getList() {
        var data = await carportList({
          lotNo: searchLotNo.value == '' ? null : searchLotNo.value,
          pageNum: getTableAction().getPaginationRef().current,
          pageSize: getTableAction().getPaginationRef().pageSize
        });
        dataList.value = data.records;
        parkId.value = dataList.value[0].parkId;
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
      // 历史记录 路由跳转
      function handleHistory(data) {
        router.push({
          name: 'HistoryList',
          params: {
            id: data.id,
            lotNo: data.lotNo,
            floor: data.floor
          }
        });
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
            await carportDelete(params);
            getList();
          }
        });
      }

      function handleClose() {
        localStorage.removeItem('cardPortId');
        getList();
        closeModal();
      }

      function getFormConfig(): Partial<FormProps> {
        return {
          labelWidth: lang == 'zh_CN' ? 60 : 140,
          schemas: [
            {
              field: `lotNo`,
              label: t('component.carport.carport_num'),
              component: 'Input',
              colProps: {
                xl: 8,
                xxl: 6
              },
              componentProps: {
                placeholder: t('component.carport.carport_numplaceholder')
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
        searchLotNo.value = validate.lotNo;
        if (validate.lotNo === '') {
          getList();
        } else {
          var data = await carportList({
            lotNo: validate.lotNo
          });
          dataList.value = data.records;
          getTableAction().setPagination({
            current: getTableAction().getPaginationRef().current,
            total: data.total
          });
        }
      }

      return {
        formConfig: getFormConfig(),
        columns: getBasicColumns(),
        searchLotNo,
        change,
        t,
        checkFileType,
        fileRef,
        fileChange,
        form,
        addAll,
        changeAvailable,
        tableRef,
        data: dataList,
        loading,
        getList,
        pagination,
        registerModal,
        handleNew,
        handleEdit,
        handleHistory,
        handleDelete,
        handleClose,
        parkId,
        syncCloud
      };
    }
  });
</script>
<style scoped>
  ::v-deep(.ant-upload-list-text) {
    display: none;
  }
</style>
