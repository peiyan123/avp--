import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.deviceType.deviceType_typeName'),
      dataIndex: 'typeName'
    },
    {
      title: t('component.deviceType.deviceType_typeCode'),
      dataIndex: 'typeCode'
    },
    {
      title: t('component.deviceType.deviceType_createDate'),
      dataIndex: 'createDate'
    },
    {
      title: t('component.carport.carport_availableFlag'),
      dataIndex: 'available',
      slots: { customRender: 'available' }
      //format: (val) => Number(val) === 1 ? '可用' : '不可用'
    },
    {
      title: t('component.deviceType.deviceType_remark'),
      dataIndex: 'remark'
    }
  ];
}
