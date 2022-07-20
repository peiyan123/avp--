import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.vehicleInfo.vehicleInfo_carNumber'),
      dataIndex: 'carNumber'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_brandName'),
      dataIndex: 'brandName'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_seriesName'),
      dataIndex: 'seriesName'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_modelName'),
      dataIndex: 'modelName'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_displacement'),
      dataIndex: 'displacement'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_modelYear'),
      dataIndex: 'modelYear'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_color'),
      dataIndex: 'color'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_type'),
      dataIndex: 'type',
      format: (val) =>
        Number(val) === 1
          ? t('component.vehicleInfo.vehicleInfo_type_1')
          : Number(val) === 2
          ? t('component.vehicleInfo.vehicleInfo_type_2')
          : Number(val) === 3
          ? t('component.vehicleInfo.vehicleInfo_type_3')
          : t('component.vehicleInfo.vehicleInfo_type_4')
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_userName'),
      dataIndex: 'userName'
    },
    {
      title: t('component.vehicleInfo.vehicleInfo_phoneNumber'),
      dataIndex: 'phoneNumber'
    }
  ];
}
