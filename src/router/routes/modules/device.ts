import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const management: AppRouteModule = {
  path: '/device',
  name: 'Device',
  component: LAYOUT,
  redirect: '/device/info',
  meta: {
    orderNo: 1,
    icon: 'carbon:document-view',
    title: t('routes.menu.equipment'),
    roles: [RoleEnum.SUPER]
  },
  children: [
    {
      path: 'type',
      name: 'Type',
      component: () => import('/@/views/management/deviceType/index.vue'),
      meta: {
        title: t('routes.menu.deviceType')
      }
    },
    {
      path: 'info',
      name: 'Info',
      component: () => import('/@/views/management/equipment/index.vue'),
      meta: {
        title: t('routes.menu.deviceInfo')
      }
    },
    {
      path: 'camera',
      name: 'Camera',
      component: () => import('/@/views/management/camera/index.vue'),
      meta: {
        title: t('routes.menu.camera')
      }
    }
  ]
};

export default management;
