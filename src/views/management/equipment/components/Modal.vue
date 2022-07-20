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
  import { deviceEditApi, deviceAddApi, deviceTypeListApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const lang = useLocale().getLocale.value;
  const typeList = ref<any>({});
  const basicSchemas: FormSchema[] = [
    {
      field: 'deviceNo',
      required: true,
      component: 'Input',
      label: t('component.equipment.equipment_deviceNo'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.equipment.equipment_deviceNo_placeholder'));
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
      field: 'deviceName',
      required: true,
      component: 'Input',
      label: t('component.equipment.equipment_deviceName'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.equipment.equipment_deviceName_istirm'));
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
      field: 'deviceManufacturer',
      required: true,
      component: 'Input',
      label: t('component.equipment.equipment_deviceManufacturer'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.equipment.equipment_deviceManufacturer_istirm'));
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
      field: 'typeName',
      required: true,
      component: 'Select',
      label: t('component.deviceType.deviceType_title'),
      colProps: {
        span: 24
      },
      componentProps: typeList
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

      async function getListName() {
        const data = await deviceTypeListApi({
          available: 1
        });
        var options = [];
        data.records.forEach((element) => {
          options.push({
            label: element.typeName,
            value: element.typeName,
            key: element.id
          });
        });
        typeList.value = { options };
      }
      onMounted(() => {
        getListName();
        console.info(typeList.value);
      });
      function handleVisibleChange(visible) {
        nextTick(() => console.info(props.formData));
        visible && props.formData && nextTick(() => onDataReceive(props.formData));
      }

      function onDataReceive(data) {
        modalTitle.value =
          data.type === 'new'
            ? t('component.equipment.equipment_add_btn')
            : t('component.equipment.equipment_edit_btn');
        localStorage.setItem('deviceId', data.id);
        if (data.type === 'new') {
          nextTick(() => {
            clearValidate();
          });
        }
        setFieldsValue({
          deviceNo: data.deviceNo,
          deviceName: data.deviceName,
          deviceManufacturer: data.deviceManufacturer,
          typeName: data.typeName,
          typeId: data.id
        });
      }

      async function handleOk() {
        const params = Object.assign({}, getFieldsValue());
        await validateFields();
        params.parkId = localStorage.getItem('parkId');
        typeList.value.options.forEach((element) => {
          if (params.typeName == element.label) {
            params.typeId = element.key;
          }
        });
        if (modalTitle.value === t('component.equipment.equipment_add_btn')) {
          var res = await deviceAddApi(params);
        } else {
          params.id = localStorage.getItem('deviceId');
          var res = await deviceEditApi(params);
        }
        if (res) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
          emit('close', 111);
          localStorage.removeItem('deviceId');
        } else {
          createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
        }
      }

      return {
        modalTitle,
        basicSchemas,
        registerModal,
        t,
        getListName,
        typeList,
        registerBasicForm,
        handleVisibleChange,
        handleOk
      };
    }
  });
</script>
