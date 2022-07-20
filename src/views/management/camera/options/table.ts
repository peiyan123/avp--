import { BasicColumn } from '/@/components/Table/src/types/table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('component.camera.camera_ip'),
      dataIndex: 'ip'
    },
    {
      title: t('component.camera.camera_baseAngle'),
      dataIndex: 'baseAngle'
    }
  ];
}
