import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const refundSchema = [
  {
    field: 'parkName',
    label: t('component.parking.parking_name')
  },
  {
    field: 'address',
    label: t('component.parking.parking_adress')
  },
  {
    field: 'longitude',
    label: t('component.parking.parking_jingdu')
  },
  {
    field: 'latitude',
    label: t('component.parking.parking_weidu')
  },
  {
    field: 'lotTotal',
    label: t('component.parking.parking_total')
  },
  {
    field: 'isAuto',
    label: t('component.parking.parking_autoport'),
    render: (curVal) => {
      return Number(curVal) === 0 ? '否' : '是';
    }
  },
  {
    field: 'isWash',
    label: t('component.parking.parking_wash'),
    render: (curVal) => {
      return Number(curVal) === 0 ? '否' : '是';
    }
  },
  {
    field: 'isChargingPile',
    label: t('component.parking.parking_charge'),
    render: (curVal) => {
      return Number(curVal) === 0 ? '否' : '是';
    }
  },
  {
    field: 'isGroundLock',
    label: t('component.parking.parking_lock'),
    render: (curVal) => {
      return Number(curVal) === 0 ? '否' : '是';
    }
  }
];
export const personSchema = [
  {
    field: 'serverInfo[0].ip',
    label: t('component.parking.parking_mqttAdress')
  },
  {
    field: 'serverInfo[0].port',
    label: t('component.parking.parking_severport')
  },
  {
    field: 'serverInfo[0].username',
    label: t('component.parking.parking_username')
  },
  {
    field: 'serverInfo[0].topic',
    label: t('component.parking.parking_theme')
  }
];
