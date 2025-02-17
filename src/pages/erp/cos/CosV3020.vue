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
        <q-card-section class="q-gutter-y-lg bg-red-4">
          <div class="text-h4 text-center">손익계산 취소작업</div>
          <div class="text-subtitle2 text-right">손익계산 취소 기준년월을 설정하세요</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row q-pt-xl justify-center q-gutter-x-lg">
          <q-input
            stack-label
            borderless
            label-color="orange"
            label="기준년도"
            class="text-h6"
            v-model="searchValue.year"
            type="number"
            style="width: 90px"
          >
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>

          <q-select
            borderless
            options-dense
            class="text-h6 q-pt-sm"
            v-model="searchValue.month"
            :options="searchValue.monthOptions"
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
              color="red"
              @click="startComputing(0)"
              style="width: 300px"
              icon="calculate"
            >
              <span class="q-ml-md"> 손익 취소작업 진행</span>
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
                손익산출자료 취소 작업중...
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
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();

const searchValue = reactive({
  year: commUtil.getTodayYear(),
  month: commUtil.getTodayMonth(),
  monthOptions: [
    { valueNm: '01월', valueCd: '01' },
    { valueNm: '02월', valueCd: '02' },
    { valueNm: '03월', valueCd: '03' },
    { valueNm: '04월', valueCd: '04' },
    { valueNm: '05월', valueCd: '05' },
    { valueNm: '06월', valueCd: '06' },
    { valueNm: '07월', valueCd: '07' },
    { valueNm: '08월', valueCd: '08' },
    { valueNm: '09월', valueCd: '09' },
    { valueNm: '10월', valueCd: '10' },
    { valueNm: '11월', valueCd: '11' },
    { valueNm: '12월', valueCd: '12' },
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
onBeforeMount(() => {});
onMounted(() => {
  menuLabel.value = window.history.state.label;
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// DB 프로시저 호출 함수
const getProcedure = async () => {
  try {
    const res = await api.post('/api/cos/cos3020_procedure', {
      paramYear: searchValue.year.toString(),
      paramMonth: searchValue.month.toString(),
    });

    let saveStatus = {};
    saveStatus.rtn = res.data.rtn;
    saveStatus.rtnMsg = res.data.rtnMsg;
    notifySave.notifyView(saveStatus);
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
