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
      <CollapseContainer :title="t('component.parking.base_info')">
        <BasicForm @register="registerBasicForm" />
      </CollapseContainer>
      <CollapseContainer title="MQTT">
        <BasicForm @register="registerMQTTForm" />
      </CollapseContainer>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { addParkingApi, editParkingApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const basicSchemas: FormSchema[] = [
    {
      field: 'parkName',
      component: 'Input',
      required: true,
      label: t('component.parking.parking_name'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_parkNamerequire'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 30) {
              return Promise.reject(t('component.carport.no_allow_30'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'address',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_adress'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_parkAdressrequire'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 30) {
              return Promise.reject(t('component.carport.no_allow_30'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'longitude',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_jingdu'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined) {
              return Promise.reject(t('component.parking.parking_jindurequire'));
            }
            if (!/^(-?\d+)(\.\d+)?$/.test(value) || value > 180 || value < -180) {
              return Promise.reject(t('component.parking.parking_jerror'));
            }
            if (value.replace('.', '').length > 6) {
              return Promise.reject(t('component.parking.parking_len_6'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'latitude',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_weidu'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_weidurequire'));
            }
            if (!/^(-?\d+)(\.\d+)?$/.test(value) || value > 90 || value < -90) {
              return Promise.reject(t('component.parking.parking_werror'));
            }
            if (value.replace('.', '').length > 6) {
              return Promise.reject(t('component.parking.parking_len_6'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'lotTotal',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_total'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_lotTotalrequire'));
            }
            if (!/^\d+$/.test(value)) {
              return Promise.reject(t('component.parking.parking_lotTotalerror'));
            }
            if (value.length > 6) {
              return Promise.reject(t('component.parking.parking_len_6'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'isWash',
      required: true,
      component: 'RadioGroup',
      labelWidth: 180,
      label: t('component.parking.parking_wash'),
      colProps: {
        span: 20
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
      field: 'isAuto',
      required: true,
      component: 'RadioGroup',
      labelWidth: 180,
      label: t('component.parking.parking_autoport'),
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
      field: 'isChargingPile',
      required: true,
      component: 'RadioGroup',
      labelWidth: 180,
      label: t('component.parking.parking_charge'),
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
      field: 'isGroundLock',
      required: true,
      labelWidth: 180,
      component: 'RadioGroup',
      label: t('component.parking.parking_lock'),
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
  const MQTTSchemas: FormSchema[] = [
    {
      field: 'ip',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_mqttAdress'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_ipquire'));
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
      field: 'port',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_severport'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_portrequire'));
            }
            if (
              !/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
                value
              )
            ) {
              return Promise.reject(t('component.parking.parking_porterror'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'username',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_username'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_usernamerequire'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
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
      field: 'password',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_password'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_passwordrequire'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 30) {
              return Promise.reject(t('component.carport.no_allow_30'));
            }
            if (value.length < 6 || value.length > 18 || /[\u4E00-\u9FA5]/i.test(value)) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.app.password_error'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    },
    {
      field: 'topic',
      required: true,
      component: 'Input',
      label: t('component.parking.parking_theme'),
      colProps: {
        span: 24
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value === undefined || value === '') {
              return Promise.reject(t('component.parking.parking_topicrequire'));
            }
            if (value.indexOf(' ') > -1) {
              /* eslint-disable-next-line */
              return Promise.reject(t('component.carport.no_trim'));
            }
            if (value.length > 30) {
              return Promise.reject(t('component.carport.no_allow_30'));
            }
            return Promise.resolve();
          },
          trigger: 'change'
        }
      ]
    }
  ];
  const { createSuccessModal, createErrorModal } = useMessage();
  export default defineComponent({
    components: { BasicModal, BasicForm, CollapseContainer },
    props: {
      formData: { type: Object }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const [registerModal] = useModalInner((data) => {
        data && onDataReceive(data);
      });
      const modalTitle = ref<string>('');
      const modalType = ref('');
      const [
        registerBasicForm,
        {
          setFieldsValue: setBasicFieldsValue,
          getFieldsValue: getBasicFieldsValue,
          validateFields: validateFields1,
          clearValidate: clearBasicValidate
        }
      ] = useForm({
        labelWidth: 150,
        schemas: basicSchemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24
        }
      });
      const [
        registerMQTTForm,
        {
          setFieldsValue: setMQTTFieldsValue,
          getFieldsValue: getMQTTFieldsValue,
          validateFields: validateFields2,
          clearValidate: clearMQTTValidate
        }
      ] = useForm({
        labelWidth: 150,
        schemas: MQTTSchemas,
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
        modalType.value = data.type;
        if (data.type === 'edit') {
          localStorage.setItem('parkId', data.id);
          localStorage.setItem('mqttId', unref(data).serverInfo[0].id);
        }
        modalTitle.value = data.type === 'new' ? t('component.parking.btn_add') : t('component.parking.edit_parking');
        if (data.type === 'new') {
          nextTick(() => {
            clearBasicValidate();
            clearMQTTValidate();
          });
        }
        // 赋值
        setBasicFieldsValue({
          parkName: data.parkName,
          longitude: data.longitude,
          latitude: data.latitude,
          lotTotal: data.lotTotal,
          isWash: data.isWash,
          isAuto: data.isAuto,
          isChargingPile: data.isChargingPile,
          isGroundLock: data.isGroundLock,
          address: data.address
        });
        setMQTTFieldsValue({
          ip: data.serverInfo[0].ip,
          port: data.serverInfo[0].port,
          username: data.serverInfo[0].username,
          password: data.serverInfo[0].password,
          topic: data.serverInfo[0].topic
        });
      }

      async function handleOk() {
        var params = Object.assign({}, getBasicFieldsValue());
        var serverInfo = [];
        serverInfo[0] = getMQTTFieldsValue();
        params.serverInfo = serverInfo;
        var promise1 = validateFields1();
        var promise2 = validateFields2();
        Promise.all([promise1, promise2]).then(async function () {
          if (modalType.value === 'new') {
            var res = await addParkingApi(params);
          } else {
            params.id = localStorage.getItem('parkId');
            params.serverInfo[0].id = localStorage.getItem('mqttId');
            var res = await editParkingApi(params);
          }
          if (res) {
            createSuccessModal({ title: 'Tip', content: t('layout.setting.operatingTitle') });
            emit('close', 111);
            localStorage.removeItem('parkId');
            localStorage.removeItem('mqttId');
          } else {
            createErrorModal({ title: 'Tip', content: t('sys.api.operationFailed') });
          }
        });
      }

      return {
        modalTitle,
        modalType,
        t,
        basicSchemas,
        MQTTSchemas,
        registerModal,
        registerBasicForm,
        registerMQTTForm,
        handleVisibleChange,
        handleOk
      };
    }
  });
</script>
