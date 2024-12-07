<template>
  <q-card bordered class="q-pa-xs" style="height: 100%">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      성과평가 진행율
      <q-space />

      <q-btn
        :disable="storeYear.setLocCh !== '3'"
        rounded
        dense
        color="primary"
        icon="flag"
        size="0.7rem"
        class="q-py-none q-px-md text-bold"
        @click="isDialogView = true"
      >
        <span class="q-ml-sm text-subtitle1"> 인사평과 결과조회</span>
        <q-tooltip v-if="storeYear.setLocCh === '3'" class="bg-amber text-black shadow-4" anchor="center left" self="center right">
          <q-icon name="flag" size="0.8rem" />
          <strong> 결과자료 조회가능 </strong>
        </q-tooltip>
        <q-tooltip v-else class="bg-amber text-black shadow-4" anchor="center left" self="center right">
          <q-icon name="flag" size="0.8rem" />
          <strong> 마감완료 후 조회가능 (상단 평가년도 컬러가 오랜지색일 경우)</strong>
        </q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="">
      <div class="row justify-between">
        <GChart type="Gauge" :data="chartData1" :options="chartOptions" :width="'100%'" :height="$q.screen.xs ? '100' : '200'" />
        <GChart type="Gauge" :data="chartData2" :options="chartOptions" :width="'100%'" :height="$q.screen.xs ? '100' : '200'" />
        <GChart type="Gauge" :data="chartData3" :options="chartOptions" :width="'100%'" :height="$q.screen.xs ? '100' : '200'" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { QIcon, useQuasar } from 'quasar';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { api } from 'boot/axios';
import EvaFinal from 'src/pages/main/EvalFinal.vue';
import { GChart } from 'vue-google-charts';
import chartData from 'lodash/seq';

const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const $q = useQuasar();
const isXsScreen = ref($q.screen.lt.sm);

watch(
  () => $q.screen.lt.sm,
  newVal => {
    isXsScreen.value = newVal;
  },
);

const chartData1 = ref([
  ['Label', 'Value'],
  ['목표진행', 50],
]);
const chartData2 = ref([
  ['Label', 'Value'],
  ['성과진행', 70],
]);
const chartData3 = ref([
  ['Label', 'Value'],
  ['성과평가', 30],
]);
const chartOptions = ref({
  width: 0,
  height: isXsScreen.value ? 100 : 200,
  redFrom: 0,
  redTo: 0,
  yellowFrom: 0,
  yellowTo: 0,
  minorTicks: 5,
  gauge: {
    label: {
      fontSize: 16,
      color: '#FF0000',
    },
    value: {
      fontSize: 30,
      color: '#00FF00',
    },
  },
});
onBeforeMount(async () => {
  await new Promise(resolve => {
    google.charts.load('current', { packages: ['gauge'] });
    google.charts.setOnLoadCallback(resolve);
  });
  try {
    // const response = await api.get('/your-api-endpoint');
    const data1 = await fetchData('/api/aux/dashboard_101_list');
    const data2 = await fetchData('/api/aux/dashboard_102_list');
    const data3 = await fetchData('/api/aux/dashboard_103_list');
    // console.log('data : ', data1, data2, data3);

    chartData1.value = [
      ['Label', 'Value'],
      ['목표진행', data1],
    ];
    chartData2.value = [
      ['Label', 'Value'],
      ['성과진행', data2],
    ];
    chartData3.value = [
      ['Label', 'Value'],
      ['성과평가', data3],
    ];
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const fetchData = async endpoint => {
  try {
    const response = await api.post(endpoint, {
      paramSetYear: storeYear.setYear,
      paramEmpCd: storeUser.setEmpCd,
    });
    const data = response.data.data[0].maxPer;
    // console.log(`Data from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [0]; // Return a default value to prevent the chart from breaking
  }
};
// ***** 목표진행율 가져오기 부분  *****************************//
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>
