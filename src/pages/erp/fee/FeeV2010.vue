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
        <q-card-section class="q-gutter-y-lg" :class="$q.dark.isActive ? 'bg-teal-4' : 'bg-deep-orange-4'">
          <div class="text-h4 text-center">인세계산</div>
          <div class="text-subtitle2 text-right">계산작업 기간을 설정하세요</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row justify-center q-gutter-y-xl">
            <span class="text-subtitle1 flex flex-center q-pr-lg">적용기간 : </span>
            <div class="row">
              <q-input
                borderless
                label-color="orange"
                class="text-subtitle1"
                v-model="searchValue.periodFrom.year"
                type="number"
                style="width: 105px"
              >
                <template v-slot:append>
                  <span class="text-subtitle1 q-pr-lg">년</span>
                </template>
              </q-input>

              <q-select
                borderless
                options-dense
                class="text-subtitle1"
                v-model="searchValue.periodFrom.month"
                :options="searchValue.monthOptions"
                option-value="valueCd"
                option-label="valueNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 50px"
              />
            </div>
            <div class="q-px-lg text-h5 flex-center flex">~</div>
            <div class="row">
              <q-input borderless class="text-subtitle1" v-model="searchValue.periodTo.year" type="number" style="width: 105px">
                <template v-slot:append>
                  <span class="text-subtitle1 q-pr-lg">년</span>
                </template>
              </q-input>

              <q-select
                borderless
                options-dense
                class="text-subtitle1"
                v-model="searchValue.periodTo.month"
                :options="searchValue.monthOptions"
                option-value="valueCd"
                option-label="valueNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 50px"
              />
            </div>

            <q-btn
              :loading="progress[0].loading"
              :percentage="progress[0].percentage"
              size="lg"
              :color="$q.dark.isActive ? 'teal' : 'deep-orange'"
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
import { onMounted, reactive, ref } from 'vue';
import { QBtn, QIcon, useQuasar } from 'quasar';
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();
const searchValue = reactive({
  periodFrom: { year: commUtil.getTodayYear(), month: '01' },
  periodTo: { year: commUtil.getTodayYear(), month: commUtil.getTodayMonth() },
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

  intervals[id] = setInterval(() => {
    progress.value[id].percentage += Math.floor(Math.random() * 8 + 10);
    if (progress.value[id].percentage >= 100) {
      clearInterval(intervals[id]);
      progress.value[id].loading = false;
    }
  }, 700);
}

const menuLabel = ref('');
onMounted(() => {
  menuLabel.value = window.history.state.label;
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style></style>
