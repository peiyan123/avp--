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
  import { vehicleEditApi, vehicleAddApi } from '/@/api/sys/user';
  const basicSchemas: FormSchema[] = [
    {
      field: 'brandName',
      required: true,
      component: 'Input',
      label: '车辆品牌',
      colProps: {
        span: 24
      }
    },
    {
      field: 'seriesName',
      required: true,
      component: 'Input',
      label: '车系',
      colProps: {
        span: 24
      }
    },
    {
      field: 'modelName',
      required: true,
      component: 'Input',
      label: '车辆型号名称',
      colProps: {
        span: 24
      }
    },
    {
      field: 'displacement',
      required: true,
      component: 'Input',
      label: '排量',
      colProps: {
        span: 24
      }
    },
    {
      field: 'modelYear',
      required: true,
      component: 'Input',
      label: '车辆年款',
      colProps: {
        span: 24
      }
    },
    {
      field: 'color',
      required: true,
      component: 'Input',
      label: '车辆颜色',
      colProps: {
        span: 24
      }
    },
    {
      field: 'type',
      required: true,
      component: 'Input',
      label: '车辆类型',
      colProps: {
        span: 24
      },
      componentProps: {
        options: [
          {
            label: '轿车',
            value: 1,
            key: 1
          },
          {
            label: '小型SUV',
            value: 2,
            key: 2
          },
          {
            label: '中型SUV',
            value: 3,
            key: 3
          },
          {
            label: '大型SUV',
            value: 4,
            key: 4
          }
        ]
      }
    },
    {
      field: 'length',
      required: true,
      component: 'Input',
      label: '车长',
      colProps: {
        span: 24
      }
    },
    {
      field: 'width',
      required: true,
      component: 'Input',
      label: '车宽',
      colProps: {
        span: 24
      }
    },
    {
      field: 'height',
      required: true,
      component: 'Input',
      label: '车高',
      colProps: {
        span: 24
      }
    },
    {
      field: 'weight',
      required: true,
      component: 'Input',
      label: '车重',
      colProps: {
        span: 24
      }
    },
    {
      field: 'oilConsumption',
      required: true,
      component: 'Input',
      label: '综合油耗',
      colProps: {
        span: 24
      }
    },
    {
      field: 'passengerNumber',
      required: true,
      component: 'Input',
      label: '额定载客数',
      colProps: {
        span: 24
      }
    },
    {
      field: 'certificateNo',
      required: true,
      component: 'Input',
      label: '合格证编号',
      colProps: {
        span: 24
      }
    },
    {
      field: 'issueDate',
      required: true,
      component: 'Input',
      label: '发证日期',
      colProps: {
        span: 24
      }
    },
    {
      field: 'manufacturer',
      required: true,
      component: 'Input',
      label: '制造商',
      colProps: {
        span: 24
      }
    },
    {
      field: 'manufacturingDate',
      required: true,
      component: 'Input',
      label: '制造日期',
      colProps: {
        span: 24
      }
    },
    {
      field: 'engineModel',
      required: true,
      component: 'Input',
      label: '发动机/电机型号',
      colProps: {
        span: 24
      }
    },
    {
      field: 'phoneNumber',
      required: true,
      component: 'Input',
      label: '手机号',
      colProps: {
        span: 24
      }
    },
    {
      field: 'userName',
      required: true,
      component: 'Input',
      label: '用户名',
      colProps: {
        span: 24
      }
    },
    {
      field: 'vin',
      required: true,
      component: 'Input',
      label: '车辆VIN码',
      colProps: {
        span: 24
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
      const [registerModal] = useModalInner((data) => {
        data && onDataReceive(data);
      });
      const modalTitle = ref<string>('');

      const [registerBasicForm, { setFieldsValue, getFieldsValue, clearValidate }] = useForm({
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
        modalTitle.value = data.type === 'new' ? '新增车辆' : '编辑车辆';
        localStorage.setItem('deviceId', data.id);
        if (data.type === 'new') {
          nextTick(() => {
            clearValidate();
          });
        }
        setFieldsValue({
          deviceNo: data.deviceNo,
          deviceName: data.deviceName,
          deviceManufacturer: data.deviceManufacturer
        });
      }

      async function handleOk() {
        const params = Object.assign({}, getFieldsValue());

        if (modalTitle.value === '新增车辆') {
          await vehicleAddApi(params);
        } else {
          params.id = localStorage.getItem('deviceId');
          await vehicleEditApi(params);
        }

        console.info(getFieldsValue());
        emit('close', 111);
        localStorage.removeItem('deviceId');
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
