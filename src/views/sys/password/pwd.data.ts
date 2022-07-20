import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
let pagination = '';
export const formSchema: FormSchema[] = [
  {
    field: 'passwordOld',
    labelWidth: '200px',
    label: t('component.app.change_password_current'),
    component: 'InputPassword',
    required: true,
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          pagination = value;
          return Promise.resolve();
        },
        trigger: 'change'
      }
    ]
  },
  {
    field: 'passwordNew',
    labelWidth: '200px',
    label: t('component.app.change_password_new'),
    component: 'StrengthMeter',
    componentProps: {
      placeholder: t('component.app.change_password_new')
    },
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (value === undefined || value === '') {
            return Promise.reject(t('component.app.password_nottirm'));
          }
          if (pagination == value) {
            return Promise.reject(t('component.app.change_password_same'));
          }
          if (value.indexOf(' ') !== -1) {
            /* eslint-disable-next-line */
            return Promise.reject(t('component.app.password_not_tab'));
          }
          if (!/^([a-zA-Z0-9]){6,18}$/.test(value)) {
            /* eslint-disable-next-line */
            return Promise.reject(t('component.user.user_password_placeholder'));
          }
          return Promise.resolve();
        },
        trigger: 'change'
      }
    ]
  },
  {
    field: 'confirmPassword',
    label: t('component.app.change_password_comfirm'),
    component: 'InputPassword',
    labelWidth: '200px',
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('component.app.password_nottirm'));
            }
            if (value !== values.passwordNew) {
              return Promise.reject(t('component.app.change_password_notto'));
            }
            return Promise.resolve();
          }
        }
      ];
    }
  }
];
