<template>
  <BasicModal
    :title="modalTitle"
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    @visible-change="handleVisibleChange"
    @ok="handleOk"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerBasicForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { userAddApi, userEditApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const lang = useLocale().getLocale.value;
  const basicSchemas: FormSchema[] = [
    {
      field: 'username',
      required: true,
      component: 'Input',
      label: t('component.user.user_username'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.user.user_username_placeholder'));
            }
            if (!/^([a-zA-Z0-9]|[_]){4,15}$/.test(value)) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.user.user_userType_placeholder'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'userType',
      required: true,
      component: 'Select',
      label: t('component.user.user_userType'),
      colProps: {
        span: 24
      },
      componentProps: {
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
    },
    {
      field: 'sex',
      required: true,
      component: 'Select',
      label: t('component.user.user_sex'),
      colProps: {
        span: 24
      },
      componentProps: {
        options: [
          {
            label: t('component.user.user_sex_woman'),
            value: 0,
            key: 0
          },
          {
            label: t('component.user.user_sex_man'),
            value: 1,
            key: 1
          }
        ]
      }
    },
    {
      field: 'phone',
      required: true,
      component: 'Input',
      label: t('component.user.user_phone'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.user.user_phone_istirm'));
            }
            if (!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.user.user_phone_error'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'available',
      required: true,
      component: 'Select',
      label: t('component.user.user_islock'),
      colProps: {
        span: 24
      },
      componentProps: {
        options: [
          {
            label: t('common.yes'),
            value: 0,
            key: 0
          },
          {
            label: t('common.no'),
            value: 1,
            key: 1
          }
        ]
      }
    }
  ];

  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      formData: { type: Object }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const { createSuccessModal, createErrorModal } = useMessage();
      const [registerModal] = useModalInner((data) => {
        data && onDataReceive(data);
      });
      const modalTitle = ref<string>('');

      const [registerBasicForm, { setFieldsValue, getFieldsValue, clearValidate, validateFields }] = useForm({
        labelWidth: lang === 'zh_CN' ? 120 : 150,
        schemas: basicSchemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24
        }
      });

      function handleVisibleChange(visible) {
        nextTick(() => console.info(props.formData));
        visible && props.formData && nextTick(() => onDataReceive(props.formData));
      }

      function onDataReceive(data) {
        localStorage.setItem('userId', data.id);
        modalTitle.value = data.type === 'new' ? t('component.user.user_add_btn') : t('component.user.user_edit_btn');
        if (data.type === 'new') {
          nextTick(() => {
            clearValidate();
          });
        }
        setFieldsValue({
          username: data.username,
          userType: data.userType,
          sex: data.sex,
          phone: data.phone,
          available: data.available
        });
      }

      async function handleOk() {
        const params = getFieldsValue();
        await validateFields();
        if (modalTitle.value == t('component.user.user_add_btn')) {
          var res = await userAddApi(params);
        } else {
          params.id = localStorage.getItem('userId');
          var res = await userEditApi(params);
        }
        if (res) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
          emit('close', 111);
          localStorage.removeItem('userId');
        } else {
          createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
        }
      }

      return {
        modalTitle,
        basicSchemas,
        registerModal,
        t,
        registerBasicForm,
        handleVisibleChange,
        handleOk
      };
    }
  });
</script>
