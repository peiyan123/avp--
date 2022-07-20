import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
// import { RoleEnum } from '/@/enums/roleEnum';

const management: AppRouteModule = {
  path: '/management',
  name: 'Management',
  component: LAYOUT,
  redirect: '/management/parking',
  meta: {
    orderNo: 0,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.menu.management')
    //roles: [RoleEnum.SUPER]
  },
  children: [
    {
      path: 'parking',
      name: 'Parking',
      component: () => import('/@/views/management/parking/index.vue'),
      meta: {
        title: t('routes.menu.parking')
      }
    },
    {
      path: 'carport',
      name: 'Carport',
      component: () => import('/@/views/management/carport/index.vue'),
      meta: {
        title: t('routes.menu.carport')
      }
    },
    {
      path: 'carport',
      name: 'HistoryList',
      component: () => import('/@/views/management/history/index.vue'),
      meta: {
        title: t('routes.menu.carport'),
        hideMenu: true
      }
    },
    // {
    //   path: 'equipment',
    //   name: 'Equipment',
    //   component: () => import('/@/views/management/equipment/index.vue'),
    //   meta: {
    //     title: t('routes.menu.equipment'),
    //   }
    // },
    {
      path: 'user',
      name: 'User',
      component: () => import('/@/views/management/user/index.vue'),
      meta: {
        title: t('routes.menu.user')
      }
    },
    {
      path: 'password',
      name: 'Password',
      component: () => import('/@/views/sys/password/index.vue'),
      meta: {
        title: t('routes.menu.user'),
        hideMenu: true
      }
    }
  ]
};

export default management;
