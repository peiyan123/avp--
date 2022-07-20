import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const vehicleInfo: AppRouteModule = {
  path: '/vehicleInfo',
  name: 'VehicleInfo',
  component: LAYOUT,
  redirect: '/vehicleInfo/index',
  meta: {
    orderNo: 2,
    hideChildrenInMenu: true,
    icon: 'whh:paintroll',
    title: t('routes.menu.vehicleInfo'),
    roles: [RoleEnum.SUPER]
  },
  children: [
    {
      path: 'index',
      name: 'VehicleInfo',
      component: () => import('/@/views/vehicleInfo/index.vue'),
      meta: {
        title: t('routes.menu.vehicleInfo'),
        icon: 'whh:paintroll',
        hideMenu: true
      }
    },
    {
      path: 'index',
      name: 'HistoryVehicle',
      component: () => import('/@/views/vehicleInfo/history/index.vue'),
      meta: {
        title: t('routes.menu.carport'),
        hideMenu: true
      }
    }
  ]
};

export default vehicleInfo;
