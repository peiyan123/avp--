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
  import { carportAddApi, carportEditApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const lang = useLocale().getLocale.value;
  const basicSchemas: FormSchema[] = [
    {
      field: 'lotNo',
      required: true,
      component: 'Input',
      label: t('component.carport.carport_num'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.carport.carport_num_nottrim'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 15) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_allow_15'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'lotType',
      required: true,
      component: 'Select',
      label: t('component.carport.carport_type'),
      colProps: {
        span: 24
      },
      componentProps: {
        options: [
          {
            label: t('component.carport.carport_type_1'),
            value: 0,
            key: 0
          },
          {
            label: t('component.carport.carport_type_2'),
            value: 1,
            key: 1
          }
        ]
      }
    },
    {
      field: 'region',
      required: true,
      component: 'Input',
      label: t('component.carport.carport_region'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.carport.carport_region_nottirm'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 15) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_allow_15'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'floor',
      required: true,
      component: 'Input',
      label: t('component.carport.carport_floor'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.carport.carport_floor_nottirm'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 2) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_allow_2'));
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
      field: 'automaticFlag',
      required: true,
      component: 'RadioGroup',
      label: t('component.carport.carport_automaticFlag'),
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
      field: 'chargeFlag',
      required: true,
      component: 'RadioGroup',
      label: t('component.carport.carport_chargeFlag'),
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
      field: 'monthlyFlag',
      required: true,
      component: 'RadioGroup',
      label: t('component.carport.carport_monthlyFlag'),
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
      field: 'vipFlag',
      required: true,
      component: 'RadioGroup',
      label: t('component.carport.carport_vipFlag'),
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
      const parkId = ref<string>('');
      const [registerBasicForm, { setFieldsValue, getFieldsValue, clearValidate, validateFields }] = useForm({
        labelWidth: lang == 'zh_CN' ? 120 : 170,
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
        parkId.value = data.parkId;
        modalTitle.value =
          data.type === 'new' ? t('component.carport.carport_addbtn') : t('component.carport.carport_editbtn');
        if (data.type === 'new') {
          nextTick(() => {
            clearValidate();
          });
        }
        setFieldsValue({
          lotNo: data.lotNo,
          lotType: data.lotType,
          region: data.region,
          floor: data.floor,
          available: data.available,
          automaticFlag: data.automaticFlag,
          chargeFlag: data.chargeFlag,
          monthlyFlag: data.monthlyFlag,
          vipFlag: data.vipFlag
        });
      }

      async function handleOk() {
        const params = [getFieldsValue()];
        await validateFields();
        parkId.value = localStorage.getItem('parkId') ? localStorage.getItem('parkId') : parkId.value;
        if (modalTitle.value === t('component.carport.carport_editbtn')) {
          const paramsEdit = getFieldsValue();
          paramsEdit.parkId = parkId.value;
          paramsEdit.id = localStorage.getItem('cardPortId');
          var res = await carportEditApi(paramsEdit);
        } else {
          params[0].parkId = parkId.value;
          var res = await carportAddApi(params);
        }
        if (res) {
          createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
          emit('close', 111);
          localStorage.removeItem('cardPortId');
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
        t,
        handleOk
      };
    }
  });
</script>
