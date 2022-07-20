import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 60,
    schemas: [
      {
        field: `lotNo`,
        label: `车位号`,
        component: 'Input',
        colProps: {
          xl: 8,
          xxl: 6
        },
        componentProps: {
          placeholder: '请输入车位号'
        }
      }
    ]
  };
}

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.carport.carport_num'),
      width: '200px',
      dataIndex: 'lotNo'
    },
    {
      title: t('component.carport.carport_id'),
      width: '180px',
      dataIndex: 'id'
    },
    {
      title: t('component.carport.carport_type'),
      dataIndex: 'lotType',
      width: '100px',
      format: (val) =>
        Number(val) === 0 ? t('component.carport.carport_type_1') : t('component.carport.carport_type_2')
    },
    {
      title: t('component.carport.carport_region'),
      width: '100px',
      dataIndex: 'region'
    },
    {
      title: t('component.carport.carport_floor'),
      width: '100px',
      dataIndex: 'floor'
    },
    {
      title: t('component.carport.carport_availableFlag'),
      dataIndex: 'available',
      width: '120px',
      slots: { customRender: 'available' }
    },
    {
      title: t('component.carport.carport_automaticFlag'),
      dataIndex: 'automaticFlag',
      width: '120px',
      format: (val) => (Number(val) === 0 ? t('common.no') : t('common.yes'))
    },
    {
      title: t('component.carport.carport_chargeFlag'),
      dataIndex: 'chargeFlag',
      width: '120px',
      format: (val) => (Number(val) === 0 ? t('common.no') : t('common.yes'))
    },
    {
      title: t('component.carport.carport_monthlyFlag'),
      width: '80px',
      dataIndex: 'monthlyFlag',
      format: (val) => (Number(val) === 0 ? t('common.no') : t('common.yes'))
    },
    {
      title: t('component.carport.carport_vipFlag'),
      width: '80px',
      dataIndex: 'vipFlag',
      format: (val) => (Number(val) === 0 ? t('common.no') : t('common.yes'))
    }
  ];
}
export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp('\\.(' + newTypes + ')$', 'i');

  return reg.test(file.name);
}
