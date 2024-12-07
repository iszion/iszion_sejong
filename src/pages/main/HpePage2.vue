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
    <q-card-section class="q-pt-xs q-pb-none q-px-none">
      <div class="row q-pa-xs">
        <apexchart
          v-if="chartOptions1"
          class="col-4"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '220'"
          :options="chartOptions1"
          :series="series1"
        >
        </apexchart>
        <apexchart
          v-if="chartOptions2"
          class="col-4"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '220'"
          :options="chartOptions2"
          :series="series2"
        >
        </apexchart>
        <apexchart
          v-if="chartOptions3"
          class="col-4"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '220'"
          :options="chartOptions3"
          :series="series3"
        >
        </apexchart>
      </div>
    </q-card-section>
  </q-card>

  <!--  게시글 등록 조회 부분 -->
  <q-dialog v-model="isDialogView">
    <q-card style="width: 700px; max-width: 90vw" class="shadow-24">
      <q-card-section>
        <eva-final :message="{ setYear: storeYear.setYear, setEmpCd: storeUser.setEmpCd }" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <!--  게시글 조회부분 끝-->
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { QIcon, useQuasar } from 'quasar';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { api } from 'boot/axios';
import EvaFinal from 'src/pages/main/EvalFinal.vue';

const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const $q = useQuasar();
const isXsScreen = ref($q.screen.lt.sm);
const isDialogView = ref(false);

watch(
  () => $q.dark.isActive,
  () => {
    updateChartOptions(); // 다크모드 변경 시 차트 옵션 업데이트
  },
);

watch(
  () => $q.screen.lt.sm,
  newVal => {
    isXsScreen.value = newVal;
  },
);
const chartOptions1 = ref(null);
const chartOptions2 = ref(null);
const chartOptions3 = ref(null);
const getChartOptions = (label, isXs, isDarkMode) => ({
  chart: {
    height: isXs ? 280 : 220,
    type: 'radialBar',
    offsetY: 10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -130,
      endAngle: 130,
      hollow: {
        size: isXs ? '30%' : '40%', // Customize the size of the hollow area if needed
      },
      strokeWidth: '50%', // 원형 바의 두께
      dataLabels: {
        name: {
          fontSize: isXs ? '15px' : '20px',
          color: isDarkMode ? '#00bcc2' : '#00bcc2',
          offsetY: 100,
        },
        value: {
          offsetY: 55,
          fontSize: isXs ? '20px' : '25px',
          color: isDarkMode ? '#f37a02' : '#017fc2',
          formatter: function (val) {
            return val + '%';
          },
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: isDarkMode ? 'dark' : 'light',
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
    colors: isDarkMode ? ['rgb(0,43,248)'] : ['rgba(3,147,5,0.99)'],
  },
  stroke: {
    dashArray: 4,
    colors: isDarkMode ? ['#FFFFFF'] : ['#000000'],
  },
  labels: [label],
});

const updateChartOptions = () => {
  const isDarkMode = $q.dark.isActive;
  chartOptions1.value = getChartOptions('목표진행율', isXsScreen.value, isDarkMode);
  chartOptions2.value = getChartOptions('성과진행율', isXsScreen.value, isDarkMode);
  chartOptions3.value = getChartOptions('성과평가진행율', isXsScreen.value, isDarkMode);
};

const series1 = ref([0]);
const series2 = ref([0]);
const series3 = ref([0]);

onBeforeMount(async () => {
  try {
    const data1 = await fetchData('/api/aux/dashboard_101_list');
    const data2 = await fetchData('/api/aux/dashboard_102_list');
    const data3 = await fetchData('/api/aux/dashboard_103_list');
    if (data1) series1.value = [data1]; // Ensure it's an array
    if (data2) series2.value = [data2]; // Ensure it's an array
    if (data3) series3.value = [data3]; // Ensure it's an array
    updateChartOptions();
  } catch (error) {
    console.error('Error initializing data:', error);
  }
});
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 목표진행율 가져오기 부분  *****************************//
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
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>
