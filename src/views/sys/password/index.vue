<template>
  <PageWrapper :title="t('component.app.change_password_title')" :content="t('component.app.change_password_contant')">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> {{ t('component.cropper.btn_reset') }} </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> {{ t('component.drawer.okText') }} </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { router } from '/@/router';
  import { formSchema } from './pwd.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { passwordApi } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import AES from '/@/utils/AES.ts';

  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const { t } = useI18n();
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema
      });
      const { createSuccessModal, createErrorModal } = useMessage();
      async function handleSubmit() {
        const values = await validate();
        const userStore = useUserStore();
        const { passwordOld, passwordNew } = values;
        // if (passwordOld === passwordNew) {
        //   return createErrorModal({ title: 'Tip', content: t('component.app.change_password_same') });
        // }
        var param = {
          oldPassword: AES.aesMinEncrypt('ABCDEFGHIJKL_key', 'ABCDEFGHIJKLM_iv', passwordOld),
          newPassword: AES.aesMinEncrypt('ABCDEFGHIJKL_key', 'ABCDEFGHIJKLM_iv', passwordNew)
        };
        const data = await passwordApi(param);
        if (data) {
          createSuccessModal({ title: 'Tip', content: t('component.app.change_password_success') });
          localStorage.removeItem('token');
          localStorage.removeItem('parkId');
          localStorage.setItem('account', 'admin');
          userStore.setToken(undefined);
          userStore.setSessionTimeout(false);
          userStore.setUserInfo(null);
          router.push({ name: 'Login' });
        } else {
          createErrorModal({ title: 'Tip', content: t('component.app.change_password_error') });
        }
      }

      return { register, resetFields, handleSubmit, t };
    }
  });
</script>
