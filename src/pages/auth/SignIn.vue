<template>
  <q-page>
    <div class="row">
      <div class="col-sm-6 col-md-8 col-lg-9" :class="leftColStyle">
        <div style="padding: 50px; height: 97vh" class="flex flex-center">
          <q-img src="~assets/images/sejong_bg_001.png"></q-img>
        </div>
      </div>

      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3 flex flex-center q-pt-xs-xl q-px-xl"
        :class="$q.dark.isActive ? ($q.screen.gt.xs ? 'bg-dark' : '') : $q.screen.gt.xs ? 'bg-grey-3' : 'bg-white'"
      >
        <div :class="$q.dark.isActive ? ($q.screen.gt.xs ? 'bg-dark' : '') : $q.screen.gt.xs ? 'bg-grey-3' : 'bg-white'" class="q-px-sm-xl">
          <div v-if="$q.screen.xs" class="q-pb-md q-pt-xl q-mt-xl text-center">
            <q-img v-if="$q.dark.mode" src="~assets/images/sejong_logo_light.png" style="width: 50vw" />
            <q-img v-else src="~assets/images/sejong_logo_dark.png" style="width: 50vw" />
          </div>
          <div class="q-mb-lg flex flex-center">
            <div v-if="!$q.screen.xs">
              <q-img v-if="$q.dark.mode" src="~assets/images/sejong_logo_light.png" style="width: 220px" />
              <q-img v-else src="~assets/images/sejong_logo_dark.png" style="width: 220px" />
            </div>
            <q-item-label>
              <div class="text-bold q-mt-lg text-deep-orange" style="font-size: 1.65em">{{ $t('project_name') }}</div>
            </q-item-label>
          </div>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-y-lg q-pb-xl">
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
              <q-toggle v-model="form.idSave" :label="$t('login_id_save')" class="q-mt-xl" />
              <q-btn type="submit" class="full-width q-mt-xl" unelevated color="primary" size="lg" :label="$t('login_button')" />
            </q-form>
          </q-card-section>
        </div>
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

const imageStyle = computed(() => {
  return window.innerWidth > 1900
    ? { height: '910px', width: '900px' }
    : window.innerWidth > 1700
    ? { height: '810px', width: '800px' }
    : window.innerWidth > 1500
    ? { height: '710px', width: '700px' } // Style for width <= 1700
    : window.innerWidth > 1400
    ? { height: '610px', width: '600px' } // Style for width <= 1700
    : window.innerWidth > 1300
    ? { height: '510px', width: '500px' } // Style for width <= 1700
    : window.innerWidth > 1200
    ? { height: '405px', width: '400px' } // Style for width <= 1700
    : window.innerWidth > 1100
    ? { height: '310px', width: '300px' } // Style for width <= 1700
    : { height: '295x', width: '290px' }; // Style for width <= 1700
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
            SessionStorage.set('userId', form.value.id);
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
