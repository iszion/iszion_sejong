<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents title bar -->
    <div class="row">
      <div class="col-auto flex flex-center">
        <q-icon name="font_download" size="sm" class="text-orange" />
        <span class="text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
      </div>
      <q-space />
      <q-breadcrumbs v-if="!$q.screen.xs" active-color="grey" style="font-size: 14px" class="self-end">
        <q-breadcrumbs-el label="판매관리" icon="home" />
        <q-breadcrumbs-el label="출고관리" icon="widgets" />
        <q-breadcrumbs-el :label="menuLabel" />
      </q-breadcrumbs>
    </div>
    <!-- end of contents title bar -->
    <q-separator class="q-mb-sm" color="cyan" size="0.2rem" />

    <div style="display: flex; justify-content: center; align-items: center; height: 50vh">
      <q-card class="q-pb-xl" style="width: 100%; max-width: 50vh">
        <q-card-section class="q-gutter-y-lg bg-blue-4">
          <div class="text-h4 text-center">인세계산</div>
          <div class="text-subtitle2 text-right">계산작업 기간을 설정하세요</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row q-pt-xl justify-center">
          <q-input stack-label label-color="orange" label="기준년도" class="text-h6" v-model="searchValue.year" type="number" style="width: 90px">
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="row q-pt-md justify-center">
          <div class="q-gutter-sm">
            <q-radio keep-color v-model="searchValue.cn" val="1" label="년" color="teal" @click="handleSelectedMonth" />
            <q-radio keep-color v-model="searchValue.cn" val="2" label="상반기" color="orange" @click="handleSelectedMonth" />
            <q-radio keep-color v-model="searchValue.cn" val="3" label="하반기" color="red" @click="handleSelectedMonth" />
            <q-radio keep-color v-model="searchValue.cn" val="4" label="선택" color="cyan" @click="handleSelectedMonth" />
          </div>
        </q-card-section>
        <q-card-section class="row q-pt-none justify-center q-gutter-x-lg">
          <q-select
            borderless
            options-dense
            class="text-h6"
            v-model="searchValue.periodFromMonth"
            :options="searchValue.monthOptionsFrom"
            option-value="valueCd"
            option-label="valueNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 50px"
          />
          <!--          <span class="text-h6 q-pt-sm q-mr-md">~</span>-->
          <q-select
            borderless
            options-dense
            class="text-h6"
            v-model="searchValue.periodToMonth"
            :options="searchValue.monthOptionsTo"
            option-value="valueCd"
            option-label="valueNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 50px"
          />
        </q-card-section>
        <q-separator class="q-mb-xl" />
        <q-card-section>
          <div class="row justify-center q-gutter-y-xl">
            <q-btn
              :loading="progress[0].loading"
              :percentage="progress[0].percentage"
              size="lg"
              color="blue"
              @click="startComputing(0)"
              style="width: 300px"
              icon="calculate"
            >
              <span class="q-ml-md"> 인세 계산 진행</span>
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
                인세산출 계산작업중...
              </template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { QBtn, QIcon, useQuasar } from 'quasar';
import commUtil from 'src/js_comm/comm-util';
import { api } from 'boot/axios';

const $q = useQuasar();

const showDatePopup1 = ref(false);
const showDatePopup2 = ref(false);
const beforeYymm = ref(null);
const onNavigation = (fg, date) => {
  searchValue[fg] = date.year + '년 ' + commUtil.getDataWithZero(date.month, 2) + '월';

  if (!beforeYymm.value) {
    showDatePopup1.value = false;
    showDatePopup2.value = false;
    beforeYymm.value = date;
  } else {
    beforeYymm.value = date;
  }
};

const dateValue = ref(''); // YYYY/MM 형식
const searchValue = reactive({
  year: commUtil.getTodayYear(),
  periodFromMonth: commUtil.getTodayMonth(),
  periodToMonth: commUtil.getTodayMonth(),
  cn: '1',
  monthOptionsFrom: [
    { valueNm: '01월 부터', valueCd: '01' },
    { valueNm: '02월 부터', valueCd: '02' },
    { valueNm: '03월 부터', valueCd: '03' },
    { valueNm: '04월 부터', valueCd: '04' },
    { valueNm: '05월 부터', valueCd: '05' },
    { valueNm: '06월 부터', valueCd: '06' },
    { valueNm: '07월 부터', valueCd: '07' },
    { valueNm: '08월 부터', valueCd: '08' },
    { valueNm: '09월 부터', valueCd: '09' },
    { valueNm: '10월 부터', valueCd: '10' },
    { valueNm: '11월 부터', valueCd: '11' },
    { valueNm: '12월 부터', valueCd: '12' },
  ],
  monthOptionsTo: [
    { valueNm: '01월 까지', valueCd: '01' },
    { valueNm: '02월 까지', valueCd: '02' },
    { valueNm: '03월 까지', valueCd: '03' },
    { valueNm: '04월 까지', valueCd: '04' },
    { valueNm: '05월 까지', valueCd: '05' },
    { valueNm: '06월 까지', valueCd: '06' },
    { valueNm: '07월 까지', valueCd: '07' },
    { valueNm: '08월 까지', valueCd: '08' },
    { valueNm: '09월 까지', valueCd: '09' },
    { valueNm: '10월 까지', valueCd: '10' },
    { valueNm: '11월 까지', valueCd: '11' },
    { valueNm: '12월 까지', valueCd: '12' },
  ],
  textValue: '',
});

const progress = ref([
  { loading: false, percentage: 0 },
  { loading: false, percentage: 0 },
  { loading: false, percentage: 0 },
]);

const intervals = [null, null, null];

function startComputing(id) {
  progress.value[id].loading = true;
  progress.value[id].percentage = 0;

  // 1. DB 프로시저 호출
  getProcedure(id)
    .then(() => {
      // 2. 프로시저 호출 성공 시 진행 상황 표시
      intervals[id] = setInterval(() => {
        progress.value[id].percentage += Math.floor(Math.random() * 8 + 10);
        if (progress.value[id].percentage >= 100) {
          clearInterval(intervals[id]);
          progress.value[id].loading = false;
        }
      }, 200);
    })
    .catch(() => {
      // 에러 발생 시 로딩 중지
      progress.value[id].loading = false;
    });
}

const menuLabel = ref('');
onBeforeMount(() => {
  if (commUtil.getTodayMonth() > 2) {
    searchValue.year = commUtil.getTodayYear().toString();
  } else {
    searchValue.year = (commUtil.getTodayYear() - 1).toString();
  }
  handleSelectedMonth();
});
onMounted(() => {
  menuLabel.value = window.history.state.label;
});

const handleSelectedMonth = () => {
  if (searchValue.cn === '1') {
    searchValue.periodFromMonth = '01';
    searchValue.periodToMonth = '12';
  } else if (searchValue.cn === '2') {
    searchValue.periodFromMonth = '01';
    searchValue.periodToMonth = '06';
  } else if (searchValue.cn === '3') {
    searchValue.periodFromMonth = '07';
    searchValue.periodToMonth = '12';
  } else {
    searchValue.periodFromMonth = '01';
    searchValue.periodToMonth = commUtil.getTodayMonth();
  }
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// DB 프로시저 호출 함수
const getProcedure = async () => {
  try {
    const response = await api.post('/api/fee/fee2010_procedure', {
      paramYear: searchValue.year,
      paramMonthFrom: searchValue.periodFromMonth,
      paramMonthTo: searchValue.periodToMonth,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style scoped>
/* Quasar 내부 스타일을 강제 적용하는 방법 */
.custom-input :deep(.q-field__native) {
  color: blue !important;
}
</style>
