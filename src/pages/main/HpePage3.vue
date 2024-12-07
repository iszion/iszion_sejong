<template>
  <q-card bordered class="q-pa-xs" style="height: 100%">
    <q-bar class="text-subtitle1 text-bold">
      역량평가 진행율
      <q-space />
    </q-bar>
    <q-card-section class="q-px-none" :class="storeUser.setTitlCd === '101' ? 'q-pt-xl' : 'q-py-sm'">
      <div class="row q-pa-xs">
        <apexchart
          v-if="chartOptions1"
          class="col-6"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '220'"
          :options="chartOptions1"
          :series="series1"
        ></apexchart>
        <apexchart
          v-if="chartOptions2"
          class="col-6"
          type="radialBar"
          :height="$q.screen.xs ? '180' : '220'"
          :options="chartOptions2"
          :series="series2"
        ></apexchart>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
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

watch(
  () => $q.dark.isActive,
  () => {
    updateChartOptions(); // 다크모드 변경 시 차트 옵션 업데이트
  },
);

const chartOptions1 = ref(null);
const chartOptions2 = ref(null);
const updateChartOptions = () => {
  const isDarkMode = $q.dark.isActive;
  chartOptions1.value = getChartOptions('1차역량 진행율', isXsScreen.value, isDarkMode);
  chartOptions2.value = getChartOptions('2차역량 진행율', isXsScreen.value, isDarkMode);
};

const getChartOptions = (label, isXs, isDarkMode) => ({
  chart: {
    height: isXs ? 180 : 220,
    type: 'radialBar',
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -130,
      endAngle: 130,
      hollow: {
        size: '40%', // Customize the size of the hollow area if needed
      },
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
      shade: 'dark',
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

const series1 = ref([0]);
const series2 = ref([0]);

onBeforeMount(async () => {
  try {
    const data1 = await fetchData('/api/aux/dashboard_201_list');
    if (data1) {
      series1.value = [data1]; // Ensure it's an array
    }

    const data2 = await fetchData('/api/aux/dashboard_202_list');
    if (data2) {
      series2.value = [data2]; // Ensure it's an array
    }
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
    // console.log(`Data2 from ${endpoint}:`, data);
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
