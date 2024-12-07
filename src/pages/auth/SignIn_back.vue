<template>
  <q-page>
    <div class="row">
      <div class="col-sm-6 col-md-8 col-lg-9" :class="leftColStyle">
        <q-img height="98vh" src="~assets/images/dongil_bg.jpeg" fit="fill"> </q-img>
        <!--                <div>-->
        <!--                  <q-img src="~assets/images/dongil_bg.jpeg"> </q-img>-->
        <!--                </div>-->
        <!--        <div style="padding: 100px; height: 100%" :class="$q.dark.isActive ? 'bg-white' : 'bg-white'" class="flex flex-center">-->
        <!--          <q-img src="~assets/images/dongil_bg.jpeg" style="height: 100%"></q-img>-->
        <!--        </div>-->
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-3 flex flex-center q-pt-xs-xl q-px-xl" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
        <q-card flat :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
          <q-card-section class="q-mb-lg">
            <q-img v-if="$q.dark.mode" src="~assets/images/dongil_auth_logo2.png" style="width: 180px" />
            <q-img v-else src="~assets/images/dongil_auth_logo1.png" style="width: 180px" />
            <q-item-label>
              <div class="text-bold q-mt-lg text-deep-orange" style="font-size: 1.65em">{{ $t('project_name') }}</div>
            </q-item-label>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-y-lg">
              <q-input
                ref="userId"
                label-color="orange"
                color="orange"
                :label="$t('login_id')"
                :hint="$t('login_id_hint')"
                v-model="form.id"
                lazy-rules
                :rules="[val => !!val || $t('login_id_hint')]"
              ></q-input>
              <!--            class="q-mt-md"-->
              <q-input
                ref="passWd"
                label-color="orange"
                color="orange"
                type="password"
                :label="$t('login_password')"
                :hint="$t('login_password_hint')"
                v-model="form.password"
                lazy-rules
                :rules="[val => !!val || $t('login_password_hint')]"
              ></q-input>
              <q-toggle v-model="form.idSave" :label="$t('login_id_save')" />
              <q-btn type="submit" class="full-width q-mt-xl" unelevated color="primary" size="lg" :label="$t('login_button')" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <footer-bar />
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import FooterBar from 'layouts/FooterBar.vue';
import { useQuasar, Cookies, SessionStorage } from 'quasar';
import { api } from '/src/boot/axios';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const $q = useQuasar();
const leftColStyle = computed(() => ({ hidden: $q.screen.lt.sm }));
const router = useRouter();
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const userId = ref(null);
const passWd = ref(null);
const form = ref({
  id: '',
  password: '',
  idSave: false,
});

const onSubmit = () => {
  // if (form.value.id === 'admin') {
  //   form.value.password = '1234';
  // } else {
  //   form.value.password = form.value.id;
  // }
  if (form.value.id !== true) {
    idToStorageSave();
    api
      .post('/api/auth/login', form.value)
      .then(res => {
        if (res.data.data.accessToken && res.data.state === 200) {
          sessionStorage.setItem('accessToken', JSON.stringify(res.data.data.accessToken));
          sessionStorage.setItem('refreshToken', JSON.stringify(res.data.data.refreshToken));
          router.push({ path: '/main' });
          try {
            SessionStorage.set('empCd', form.value.id);
          } catch (e) {
            // data wasn't successfully saved due to
            // a Web Storage API error
          }
          router.push({ path: '/main' });
        } else {
          $q.notify({
            group: false,
            icon: 'report_problem',
            message: t('login_check_message'),
            color: 'negative',
            position: 'bottom-right',
          });
        }

        return res.data.data;
      })
      .catch(res => {
        console.log(res);
        console.log('error1');
      });
  }
};

const idToStorageSave = () => {
  if (form.value.idSave) {
    $q.localStorage.set('idSave', form.value.id);
  } else {
    $q.localStorage.set('idSave', '');
  }
};

onBeforeMount(() => {
  form.value.id = $q.localStorage.getItem('idSave');
  form.value.idSave = !!form.value.id;

  if (form.value.idSave) {
    setTimeout(() => {
      passWd.value.focus();
    }, 100);
  } else if (form.value.idSave) {
    setTimeout(() => {
      compCd.value.focus();
    }, 100);
  }
});

const { locale } = useI18n();
</script>
