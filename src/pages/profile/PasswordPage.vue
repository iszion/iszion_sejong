<template>
  <q-page class="flex flex-center">
    <q-card flat :style="{ minWidth: '400px' }">
      <q-card-section>
        <div class="text-h4 text-center text-weight-bold">패스워드 변경</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center text-weight-bold">{{ storeUser.setEmpNm }} ({{ storeUser.setEmpCd }})</div>
        <div class="text-center text-subtitle2 text-grey">패스워드 변경 시 다시 로그인합니다. 😊</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="q-px-xl q-mb-sm">
            <q-input v-model="form.oldPassword" :type="isPwd1 ? 'password' : 'text'" label="현재비밀번호" hint="현재 비밀번호를 입력하세요" class="">
              <template v-slot:append>
                <q-icon :name="isPwd1 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd1 = !isPwd1" />
              </template>
            </q-input>
          </div>
          <div class="q-gutter-y-sm q-pa-xl">
            <!--            class="q-mt-md"-->
            <q-input v-model="form.newPassword" :type="isPwd2 ? 'password' : 'text'" label="비밀번호" hint="새로운 패스워드를 입력하세요">
              <template v-slot:append>
                <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
              </template>
            </q-input>
            <q-input v-model="form.newPasswordX" :type="isPwd3 ? 'password' : 'text'" label="비밀번호(확인)" hint="다시한번 입력하세요">
              <template v-slot:append>
                <q-icon :name="isPwd3 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd3 = !isPwd3" />
              </template>
            </q-input>
          </div>

          <q-btn type="submit" class="full-width q-mt-lg" unelevated color="primary" size="lg" label="변경하기" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { api } from 'boot/axios';
import { SessionStorage } from 'quasar';
const storeUser = useUserInfoStore();
const isPwd1 = ref(true);
const isPwd2 = ref(true);
const isPwd3 = ref(true);
const form = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordX: '',
});

const onSubmit = () => {
  if (form.value.oldPassword) {
    api
      .post('/api/sys/passwordCheck', { paramUserId: storeUser.setEmpCd, paramOldPassword: form.value.oldPassword })
      .then(res => {
        if (res.data.data.check) {
          alert('ok');
        } else {
          $q.notify({
            group: false,
            icon: 'report_problem',
            message: t('login_check_message'),
            color: 'negative',
            position: 'bottom-right',
          });
        }
      })
      .catch(res => {
        console.log(res);
        console.log('error1');
      });
  }
};
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #e1dede;
}
</style>
