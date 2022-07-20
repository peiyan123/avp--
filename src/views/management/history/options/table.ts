import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.carport.carport_carNumber'),
      dataIndex: 'parkingRecord.carNumber'
    },
    {
      title: t('component.carport.carport_startTime'),
      dataIndex: 'parkingRecord.startTime'
    },
    {
      title: t('component.carport.carport_endTime'),
      dataIndex: 'parkingRecord.endTime'
    },
    {
      title: t('component.carport.carport_service'),
      dataIndex: 'parkingRecord.service'
      //format: (val) => Number(val) === 1 ? '可用' : '不可用'
    },
    {
      title: t('component.carport.carport_cost'),
      dataIndex: 'parkingRecord.cost'
    },
    {
      title: t('component.carport.carport_status'),
      dataIndex: 'parkingRecord.status',
      format: (val) =>
        Number(val) === 0
          ? t('component.carport.carport_status_0')
          : Number(val) === 1
          ? t('component.carport.carport_status_1')
          : Number(val) === 2
          ? t('component.carport.carport_status_2')
          : Number(val) === 3
          ? t('component.carport.carport_status_3')
          : Number(val) === 4
          ? t('component.carport.carport_status_4')
          : t('component.carport.carport_status_5')
    },
    {
      title: t('component.carport.carport_userName'),
      dataIndex: 'vehicleDTO.userName'
    },
    {
      title: t('component.carport.carport_phoneNumber'),
      dataIndex: 'vehicleDTO.phoneNumber'
    }
  ];
}

export const personSchema = [
  {
    field: 'lotCode',
    label: t('component.carport.carport_lotCode')
  },
  {
    field: 'status',
    label: t('component.carport.carport_status'),
    render: (curVal, data) => {
      return Number(data) === 0
        ? t('component.carport.carport_status_0')
        : Number(data) === 1
        ? t('component.carport.carport_status_1')
        : Number(data) === 2
        ? t('component.carport.carport_status_2')
        : Number(data) === 3
        ? t('component.carport.carport_status_3')
        : Number(data) === 4
        ? t('component.carport.carport_status_4')
        : t('component.carport.carport_status_5');
    }
  },
  {
    field: 'startTime',
    label: t('component.carport.carport_startTime')
  },
  {
    field: 'endTime',
    label: t('component.carport.carport_endTime')
  }
];
