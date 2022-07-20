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
  import { defineComponent, ref, nextTick, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { cameraEditApi, cameraAddApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const lang = useLocale().getLocale.value;
  const basicSchemas: FormSchema[] = [
    {
      field: 'ip',
      required: true,
      component: 'Input',
      label: t('component.camera.camera_ip'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.camera.camera_ip_placeholder'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (!/^(?!^255(\.255){3}|^127)(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])(\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)){2}\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test(value)) {
              return Promise.reject(t('component.parking.parking_iperror'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'baseAngle',
      required: true,
      component: 'Input',
      label: t('component.camera.camera_baseAngle'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.camera.camera_baseAngle_placeholder'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value == 0) {
              return Promise.resolve();
            }
            if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value) || value > 360) {
              return Promise.reject(t('component.camera.camera_baseAngle_error'));
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
        labelWidth: lang === 'zh_CN' ? 120 : 170,
        schemas: basicSchemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24
        }
      });
      onMounted(() => {});
      function handleVisibleChange(visible) {
        nextTick(() => console.info(props.formData));
        visible && props.formData && nextTick(() => onDataReceive(props.formData));
      }

      function onDataReceive(data) {
        modalTitle.value =
          data.type === 'new' ? t('component.camera.camera_add_btn') : t('component.camera.camera_edit_btn');
        localStorage.setItem('cameraId', data.id);
        if (data.type === 'new') {
          nextTick(() => {
            clearValidate();
          });
        }
        setFieldsValue({
          ip: data.ip,
          baseAngle: data.baseAngle
        });
      }

      async function handleOk() {
        const params = Object.assign({}, getFieldsValue());
        await validateFields();
        if (modalTitle.value === t('component.camera.camera_add_btn')) {
          var res = await cameraAddApi(params);
        } else {
          params.id = localStorage.getItem('cameraId');
          var res = await cameraEditApi(params);
        }
        if (res) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
          emit('close', 111);
          localStorage.removeItem('cameraId');
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
