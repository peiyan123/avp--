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
  import { deviceTypeEditApi, deviceTypeAddApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const basicSchemas: FormSchema[] = [
    {
      field: 'typeName',
      component: 'Input',
      label: t('component.deviceType.deviceType_typeName'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.deviceType.deviceType_typeName_tirm'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 30) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_allow_30'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'typeCode',
      required: true,
      component: 'Input',
      label: t('component.deviceType.deviceType_typeCode'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.deviceType.deviceType_typeCode_tirm'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 30) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_allow_30'));
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
      component: 'RadioGroup',
      label: t('component.carport.carport_availableFlag'),
      colProps: {
        span: 24
      },
      componentProps: {
        options: [
          {
            label: t('common.yes'),
            value: 1
          },
          {
            label: t('common.no'),
            value: 0
          }
        ]
      }
    },
    {
      field: 'remark',
      component: 'Input',
      label: t('component.deviceType.deviceType_remark'),
      colProps: {
        span: 24
      },
      rules: [
        {
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.resolve();
            }
            if (value.length > 100) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_allow_100'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
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
        labelWidth: 120,
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
        localStorage.setItem('deviceTypeId', data.id);
        modalTitle.value =
          data.type === 'new'
            ? t('component.deviceType.deviceType_add_title')
            : t('component.deviceType.deviceType_edit_title');
        if (data.type === 'new') {
          nextTick(() => {
            clearValidate();
          });
        }
        setFieldsValue({
          typeName: data.typeName,
          typeCode: data.typeCode,
          available: data.available,
          remark: data.remark
        });
      }

      async function handleOk() {
        const params = Object.assign({}, getFieldsValue());
        await validateFields();

        if (modalTitle.value === t('component.deviceType.deviceType_add_title')) {
          var res = await deviceTypeAddApi(params);
        } else {
          params.id = localStorage.getItem('deviceTypeId');
          var res = await deviceTypeEditApi(params);
        }
        if (res) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
          emit('close', 111);
          localStorage.removeItem('deviceTypeId');
        } else {
          createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
        }
      }

      return {
        modalTitle,
        basicSchemas,
        registerModal,
        registerBasicForm,
        handleVisibleChange,
        handleOk
      };
    }
  });
</script>
