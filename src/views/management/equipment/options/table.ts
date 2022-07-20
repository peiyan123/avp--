import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.equipment.equipment_deviceNo'),
      dataIndex: 'deviceNo'
    },
    {
      title: t('component.equipment.equipment_deviceName'),
      dataIndex: 'deviceName'
    },
    {
      title: t('component.equipment.equipment_deviceManufacturer'),
      dataIndex: 'deviceManufacturer'
    },
    {
      title: t('component.equipment.equipment_typeName'),
      dataIndex: 'typeName'
    }
  ];
}

