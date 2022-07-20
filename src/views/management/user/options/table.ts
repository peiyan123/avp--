import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.user.user_username'),
      dataIndex: 'username'
    },
    {
      title: t('component.user.user_userType'),
      dataIndex: 'userType',
      format: (val) => (Number(val) === 1 ? t('component.user.user_userType_1') : t('component.user.user_userType_2'))
    },
    {
      title: t('component.user.user_sex'),
      dataIndex: 'sex',
      format: (val) => (Number(val) === 0 ? t('component.user.user_sex_woman') : t('component.user.user_sex_man'))
    },
    {
      title: t('component.carport.carport_availableFlag'),
      dataIndex: 'available',
      slots: { customRender: 'available' }
      //format: (val) => Number(val) === 0 ? '不可用' : '可用'
    },
    {
      title: t('component.user.user_phone'),
      dataIndex: 'phone'
    }
  ];
}
