<template>
  <q-card class="">
    <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-grey-9 text-white ' : 'bg-grey-5 text-dark '">
      <div class="row flex-center q-px-xs-xs q-px-sm-sm">
        <div class="q-ml-sm">
          <q-badge color="teal" class="text-subtitle1 text-bold"> {{ currentDay }} </q-badge>
        </div>
        <q-btn dense flat :color="$q.dark.isActive ? 'white' : 'grey-8'"
          ><q-icon name="calendar_month" size="md" />
          <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
            <q-date minimal v-model="proxyDate" mask="YYYY-MM-DD">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <q-space />
        <div class="text-h6">프로젝트 진행</div>
        <q-space />
        <div class="text-subtitle1 text-bold">
          <q-btn
            flat
            class="text-subtitle1 text-bold text-deep-orange q-px-none"
            @click="handleCountView('전체', '0', '', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
            >{{ rowData.totCnt }}
          </q-btn>
        </div>
        <div class="text-subtitle1 text-bold q-ml-xs">
          (
          <q-btn
            flat
            class="text-subtitle1 text-bold text-deep-orange q-px-none"
            @click="handleCountView('당년 전체', '1', '', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
            >{{ rowData.totCntY }}
          </q-btn>
          )
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-md">
      <div class="row q-gutter-y-sm justify-between">
        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-lime-10 text-white ' : 'bg-lime-6 text-dark '">
            <div class="text-h6">인입문의</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('인입문의', '0', '3011101', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1101 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('인입문의', '1', '3011101', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1101Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-light-green-10 text-white ' : 'bg-light-green-5 text-dark '">
            <div class="text-h6">정보파악</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('정보파악', '0', '3011110', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1110 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('정보파악', '1', '3011110', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1110Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-light-green-10 text-white ' : 'bg-light-green-5 text-dark '">
            <div class="text-h6">설계진행</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('설계진행', '0', '3011120', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1120 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('설계진행', '1', '3011120', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1120Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-grey-9 text-white ' : 'bg-grey-5 text-dark '">
            <div class="text-h6">과업중지</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('과업중지', '0', '3011130', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1130 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('과업중지', '1', '3011130', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1130Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-orange-10 text-white ' : 'bg-orange-5 text-dark '">
            <div class="text-h6">설계완료</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('설계완료', '0', '3011140', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1140 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('설계완료', '1', '3011140', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1140Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-orange-10 text-white ' : 'bg-orange-5 text-dark '">
            <div class="text-h6">설계변경</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('설계변경', '0', '3011150', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1150 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('설계변경', '1', '3011150', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1150Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-deep-orange-10 text-white ' : 'bg-deep-orange-4 text-dark '">
            <div class="text-h6">계약완료</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('계약완료', '0', '3011190', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1190 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('계약완료', '1', '3011190', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC1190Y }}</q-btn
            >
          </q-card-actions>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="q-pa-xs text-center" :class="$q.dark.isActive ? 'bg-grey-9 text-white ' : 'bg-grey-5 text-dark '">
            <div class="text-h6">패전</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-xs justify-between">
            <div class="text-subtitle1">전체 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('패전', '0', '3019900', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC9900 }}
            </q-btn>
            <div class="text-subtitle1">당년 :</div>
            <q-btn
              flat
              class="text-subtitle1 text-bold text-blue"
              @click="handleCountView('패전', '1', '3019900', 'bg-lime-10', 'text-white', 'bg-lime-6', 'text-dark')"
              >{{ rowData.totC9900Y }}</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>

      <div class="">
        <!-- 목표대비 수주달성율 -->
        <aux-page1 :currentDay="commUtil.unFormatDate(currentDay)" />
      </div>
      <div class="row q-col-gutter-sm-x-md">
        <div v-if="isLineViewVisible" class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
          <!-- 전자결재정보 -->
          <aux-page3 />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12" :class="isLineViewVisible ? 'col-lg-8' : ' col-lg-12'">
          <!-- 최근1주일 활동기록 -->
          <aux-page2 :currentDay="commUtil.unFormatDate(currentDay)" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { api } from 'boot/axios';
import SubCountList from 'components/subvue/SubCountList.vue';
import AuxPage1 from 'pages/main/AuxPage1.vue';
import AuxPage2 from 'pages/main/AuxPage2.vue';
import AuxPage3 from 'pages/main/AuxPage3.vue';
import commUtil from 'src/js_comm/comm-util';
import { useQuasar } from 'quasar';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const $q = useQuasar();

const currentDay = ref(commUtil.getToday());
const proxyDate = ref(commUtil.getToday());
const updateProxy = () => {
  proxyDate.value = currentDay.value;
};

watch(currentDay, newVal => {
  // currentDay 값이 변경될 때마다 데이터를 다시 가져옵니다.
  getData();
});

const save = () => {
  currentDay.value = proxyDate.value;
};

const rowData = ref([
  {
    totCnt: '0',
    totC1101: '0',
    totC1110: '0',
    totC1120: '0',
    totC1130: '0',
    totC1140: '0',
    totC1150: '0',
    totC1190: '0',
    totC9900: '0',
    totC1101Y: '0',
    totC1110Y: '0',
    totC1120Y: '0',
    totC1130Y: '0',
    totC1140Y: '0',
    totC1150Y: '0',
    totC1190Y: '0',
    totC9900Y: '0',
  },
]);

onMounted(() => {
  getData();
  getDataLineCheck();
});

const handleCountView = (resTitle, resFg, resStepCd, darkBC, darkTC, lightBC, lightTC) => {
  $q.dialog({
    component: SubCountList,
    componentProps: {
      paramTitle: resTitle,
      paramFg: resFg,
      paramStepCd: resStepCd,
      paramStdDay: commUtil.unFormatDate(currentDay.value),
      paramDarkBC: darkBC,
      paramDarkTC: darkTC,
      paramLightBC: lightBC,
      paramLightTC: lightTC,
    },
  })
    .onOk(res => {
      // console.log('res ::: ', res.valueCd, res.valueNm);
    })
    .onCancel(() => {
      // console.log('Cancel');
    })
    .onDismiss(() => {
      // console.log('Called on OK or Cancel');
    });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const isLineViewVisible = ref(false);
const getDataLineCheck = async () => {
  try {
    const response = await api.post('/api/aux/auxMline_check', {
      paramEmpCd: storeUser.setEmpCd,
    });
    if (response.data.data) {
      isLineViewVisible.value = response.data.data[0].useYn === 'Y';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getData = async () => {
  try {
    const response = await api.post('/api/aux/countAll_list', {
      paramStdDay: commUtil.unFormatDate(currentDay.value),
    });
    if (response.data.data) {
      rowData.value = response.data.data[0];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
</script>

<style scoped>
.my-card {
  width: 170px; /* 원하는 카드 너비로 설정 */
}
</style>
