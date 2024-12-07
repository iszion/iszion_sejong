<template>
  <q-card bordered class="q-pa-xs">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      평가순위표 ( 상위10위 )
      <q-space />
      <span v-if="!isShowMessage">평가마감이 <span :class="$q.dark.isActive ? 'text-warning' : 'text-accent'"> 진행중</span> 입니다.</span>
      <span v-if="isShowMessage">평가마감이 <span :class="$q.dark.isActive ? 'text-positive' : 'text-primary'"> 완료</span> 되었습니다.</span>
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <apexchart type="bar" height="280" :options="chartOptions" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();

const isShowMessage = ref(false);

const empNmData = ref([]);
const evalP1Data = ref([]);
const evalP2Data = ref([]);
const evalAttData = ref([]);

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      borderRadiusApplication: 'end', // 'around', 'end'
      borderRadiusWhenStacked: 'last', // 'all', 'last'
      dataLabels: {
        // position: '', // Ensure data labels are always at the top
        total: {
          enabled: true,
          style: {
            fontSize: '14px',
            fontWeight: 900,
          },
          formatter: function (val) {
            return val.toFixed(1); // format to one decimal place
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    position: 'top',
    formatter: function (val) {
      return val.toFixed(2); // format to one decimal place
    },
    style: {
      fontSize: '12px',
    },
  },
  xaxis: {
    // type: 'datetime',
    categories: empNmData.value, // Use empNmData.value
  },
  legend: {
    position: 'right',
    offsetY: 40,
  },
  fill: {
    opacity: 1,
  },
  colors: ['#f37a02', '#3357FF', '#03931d'], // Custom colors for each series
});

const series = ref([
  {
    name: '근태평가',
    data: evalAttData.value,
  },
  {
    name: '성과평가',
    data: evalP1Data.value,
  },
  {
    name: '역량점수',
    data: evalP2Data.value,
  },
]);

onBeforeMount(async () => {
  try {
    const data = await fetchData('/api/aux/dashboard_301_list');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (i < 10) {
          empNmData.value.push(data[i].empNm);
          evalP1Data.value.push(data[i].evaP1X);
          evalP2Data.value.push(data[i].evaP2Xx);
          evalAttData.value.push(parseInt(0 - data[i].evaAtt));
        }
        isShowMessage.value = true;
      }
    }
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
    });
    console.log('data:: ', JSON.stringify(response));
    return response.data.data;
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
