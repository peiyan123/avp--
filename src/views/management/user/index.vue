<template>
  <page-wrapper :title="t('component.user.user_list_title')">
    <a-button type="primary" @click="handleNew">{{ t('component.user.user_add_btn') }}</a-button>
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
        width: 200,
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
              label: t('component.user.user_reset_password'),
              onClick: handleReset.bind(null, record)
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
  import { userListApi, userDeleteApi, userRestApi, changeStatusApi } from '/@/api/sys/user';
  import { FormProps } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { router } from '/@/router';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    components: { PageWrapper, BasicTable, TableAction, Modal },
    setup() {
      const lang = useLocale().getLocale.value;
      const loading = ref(false);
      const pagination = ref<any>(true);
      const dataList = ref<any>('');
      const userStore = useUserStore();
      const searchUserType = ref<any>('');
      const searchUserName = ref<any>('');
      const { t } = useI18n();
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerModal, { openModal, closeModal }] = useModal();
      const { createConfirm } = useMessage();
      const { createSuccessModal, createErrorModal } = useMessage();
      function handleNew() {
        openModal(true, { type: 'new' });
      }
      // 获取列表分页信息
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
      // 切换是否可用
      async function changeAvailable(val) {
        var data = await changeStatusApi('/avp/user/change-status/' + val.id);
        if (data) {
          getList();
        }
      }
      async function getList() {
        var data = await userListApi({
          username: searchUserName.value == '' ? null : searchUserName.value,
          userType: searchUserType.value == '' ? null : searchUserType.value,
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

      // 重置密码   重置本用户密码需要重新登录
      function handleReset(val) {
        localStorage.setItem('userId', val.id);
        setTimeout(() => {
          createConfirm({
            iconType: 'warning',
            title: () => t('component.app.tip'),
            content: () => t('component.user.user_reset_content'),
            onOk: async () => {
              const params = Object.assign(
                {},
                {
                  id: val.id
                }
              );
              const data = await userRestApi(params, '/avp/user/resetPassword/' + val.id);
              if (data) {
                createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
                if (val.id == userStore.getUserInfo.userId) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('parkId');
                  localStorage.setItem('account', 'admin');
                  userStore.setToken(undefined);
                  userStore.setSessionTimeout(false);
                  userStore.setUserInfo(null);
                  setTimeout(() => {
                    router.push({ name: 'Login' });
                  }, 1000);
                } else {
                  getList();
                }
              } else {
                createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
              }
            }
          });
        }, 100);
      }

      function handleClose() {
        localStorage.removeItem('userId');
        getList();
        closeModal();
      }
      function getFormConfig(): Partial<FormProps> {
        return {
          schemas: [
            {
              labelWidth: lang === 'zh_CN' ? 60 : 100,
              field: `username`,
              label: t('component.user.user_username'),
              component: 'Input',
              colProps: {
                xl: 6,
                xxl: 6
              },
              componentProps: {
                placeholder: t('component.user.user_username_placeholder')
              }
            },
            {
              labelWidth: lang === 'zh_CN' ? 80 : 100,
              field: `userType`,
              label: t('component.user.user_userType'),
              component: 'Select',
              colProps: {
                xl: 9,
                xxl: 6
              },
              componentProps: {
                placeholder: t('component.user.user_userType_error'),
                options: [
                  {
                    label: t('component.user.user_userType_1'),
                    value: 1,
                    key: 1
                  },
                  {
                    label: t('component.user.user_userType_2'),
                    value: 2,
                    key: 2
                  }
                ]
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
        searchUserType.value = validate.userType;
        searchUserName.value = validate.username;
        if (validate.userType === '' && validate.username === '') {
          getList();
        } else {
          var data = await userListApi({
            username: validate.username == '' ? null : validate.username,
            userType: validate.userType
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
        formConfig: getFormConfig(),
        columns: getBasicColumns(),
        change,
        changeAvailable,
        searchUserType,
        searchUserName,
        tableRef,
        data: dataList,
        loading,
        t,
        getList,
        pagination,
        registerModal,
        handleNew,
        handleEdit,
        handleReset,
        handleClose
      };
    }
  });
</script>
