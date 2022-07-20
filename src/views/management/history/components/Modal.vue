<template>
  <BasicModal
    :title="modalTitle"
    v-bind="$attrs"
    :width="1000"
    :closable="false"
    destroyOnClose
    @register="registerModal"
    @visible-change="handleVisibleChange"
    @ok="handleOk"
    :cancelButtonProps="{ hidden: true }"
  >
    <Description
      size="middle"
      :title="carNumber"
      :bordered="false"
      :column="3"
      :data="personData"
      :schema="personSchema"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description } from '/@/components/Description/index';
  import { carPortRecordApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { personSchema } from '../options/table.ts';

  export default defineComponent({
    components: { BasicModal, Description },
    props: {
      formData: { type: Object }
    },
    setup(props) {
      const [registerModal, { closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
      });
      const personData = ref<string>('');
      const modalTitle = ref<string>('');
      const { t } = useI18n();
      const parkingOutRecordId = ref<string>('');
      const parkingInRecordId = ref<string>('');
      const carNumber = ref<string>('');
      function handleVisibleChange(visible) {
        nextTick(() => console.info(props.formData));
        visible && props.formData && nextTick(() => onDataReceive(props.formData));
      }

      async function onDataReceive(data) {
        parkingOutRecordId.value = data.parkingRecord.parkingOutRecordId;
        parkingInRecordId.value = data.parkingRecord.parkingInRecordId;
        carNumber.value = data.parkingRecord.carNumber;
        modalTitle.value =
          data.type === 'in' ? t('component.carport.port_in_record') : t('component.carport.port_out_record');
        if (modalTitle.value == t('component.carport.port_in_record')) {
          var res = await carPortRecordApi('/avp/parking/record/find/parking-in/record/' + parkingInRecordId.value);
          personData.value = res;
        } else {
          var res = await carPortRecordApi('/avp/parking/record/find/parking-out/record/' + parkingOutRecordId.value);
          personData.value = res;
        }
      }

      async function handleOk() {
        closeModal();
      }

      return {
        modalTitle,
        registerModal,
        personSchema,
        parkingOutRecordId,
        t,
        carNumber,
        parkingInRecordId,
        personData,
        handleVisibleChange,
        handleOk
      };
    }
  });
</script>
