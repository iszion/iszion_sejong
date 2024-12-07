<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
      <q-card bordered class="">
        <q-bar class="text-subtitle1 text-bold">
          <span class="q-mr-sm" :class="$q.dark.isActive ? 'text-orange' : 'text-deep-orange'"> ( 관급 )</span>목표/수주실적
          <q-space />
          <span class="text-subtitle2 text-teal">[ 단위: 백만원 ]</span>
        </q-bar>
        <q-card-section class="q-pa-xs">
          <apexchart type="bar" height="250" :options="chartOptions" :series="series1"></apexchart>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
      <q-card bordered class="">
        <q-bar class="text-subtitle1 text-bold">
          <span class="q-mr-sm" :class="$q.dark.isActive ? 'text-orange' : 'text-deep-orange'"> ( 사급 )</span>목표/수주실적
          <q-space />
          <span class="text-subtitle2 text-teal">[ 단위: 백만원 ]</span>
        </q-bar>
        <q-card-section class="q-pa-xs">
          <apexchart type="bar" height="250" :options="chartOptions" :series="series2"></apexchart>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
      <q-card bordered class="">
        <q-bar class="text-subtitle1 text-bold">
          <span class="q-mr-sm" :class="$q.dark.isActive ? 'text-orange' : 'text-deep-orange'"> ( 자재판매 )</span>목표/수주실적
          <q-space />
          <span class="text-subtitle2 text-teal">[ 단위: 백만원 ]</span>
        </q-bar>

        <q-card-section class="q-pa-xs">
          <apexchart type="bar" height="250" :options="chartOptions" :series="series3"></apexchart>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
      <q-card bordered class="">
        <q-bar class="text-subtitle1 text-bold">
          <span class="q-mr-sm" :class="$q.dark.isActive ? 'text-orange' : 'text-deep-orange'"> ( 누수보수 )</span>목표/수주실적
          <q-space />
          <span class="text-subtitle2 text-teal">[ 단위: 백만원 ]</span>
        </q-bar>

        <q-card-section class="q-pa-xs">
          <apexchart type="bar" height="250" :options="chartOptions" :series="series4"></apexchart>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();
const isXsScreen = ref($q.screen.lt.sm);

const params = defineProps({
  currentDay: {
    type: String,
    required: false,
    default: null,
  },
});

watch(
  () => params.currentDay,
  newDay => {
    getData();
  },
  { immediate: false }, // 컴포넌트가 마운트될 때도 실행안함
);

const labelNm = ref({
  year4: Number(params.currentDay.substring(0, 4)) - 4,
  year3: Number(params.currentDay.substring(0, 4)) - 3,
  year2: Number(params.currentDay.substring(0, 4)) - 2,
  year1: Number(params.currentDay.substring(0, 4)) - 1,
  year0: Number(params.currentDay.substring(0, 4)),
});
const labelNmUpdate = () => {
  labelNm.value.year4 = Number(params.currentDay.substring(0, 4)) - 4;
  labelNm.value.year3 = Number(params.currentDay.substring(0, 4)) - 3;
  labelNm.value.year2 = Number(params.currentDay.substring(0, 4)) - 2;
  labelNm.value.year1 = Number(params.currentDay.substring(0, 4)) - 1;
  labelNm.value.year0 = Number(params.currentDay.substring(0, 4));
};

const rowData = ref([]);
const data = reactive({
  data1: {
    targetAmt4: 0,
    targetAmt3: 0,
    targetAmt2: 0,
    targetAmt1: 0,
    targetAmt0: 0,
    ordAmt4: 0,
    ordAmt3: 0,
    ordAmt2: 0,
    ordAmt1: 0,
    ordAmt0: 0,
  },
  data2: {
    targetAmt4: 0,
    targetAmt3: 0,
    targetAmt2: 0,
    targetAmt1: 0,
    targetAmt0: 0,
    ordAmt4: 0,
    ordAmt3: 0,
    ordAmt2: 0,
    ordAmt1: 0,
    ordAmt0: 0,
  },
  data3: {
    targetAmt4: 0,
    targetAmt3: 0,
    targetAmt2: 0,
    targetAmt1: 0,
    targetAmt0: 0,
    ordAmt4: 0,
    ordAmt3: 0,
    ordAmt2: 0,
    ordAmt1: 0,
    ordAmt0: 0,
  },
  data4: {
    targetAmt4: 0,
    targetAmt3: 0,
    targetAmt2: 0,
    targetAmt1: 0,
    targetAmt0: 0,
    ordAmt4: 0,
    ordAmt3: 0,
    ordAmt2: 0,
    ordAmt1: 0,
    ordAmt0: 0,
  },
});
const series1 = ref([]);
const series2 = ref([]);
const series3 = ref([]);
const series4 = ref([]);
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      columnWidth: '60%',
    },
  },
  colors: ['#775DD0'],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['실적', '목표'],
    markers: {
      fillColors: ['#775DD0', '#00E396'],
    },
  },
});

onBeforeMount(() => {
  getData();
});

onMounted(() => {});
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/auxPage1_list', {
      paramSyear: params.currentDay.substring(0, 4) - 4,
      paramEyear: params.currentDay.substring(0, 4),
    });
    if (response) {
      rowData.value = response.data.data;
      // console.log('rowData : ', JSON.stringify(rowData));
      // 차트 시리즈 업데이트 (관급)
      data.data1.targetAmt0 = Math.round(response.data.data[0].targetAmt0 / 1000000);
      data.data1.targetAmt1 = Math.round(response.data.data[0].targetAmt1 / 1000000);
      data.data1.targetAmt2 = Math.round(response.data.data[0].targetAmt2 / 1000000);
      data.data1.targetAmt3 = Math.round(response.data.data[0].targetAmt3 / 1000000);
      data.data1.targetAmt4 = Math.round(response.data.data[0].targetAmt4 / 1000000);

      data.data1.ordAmt0 = Math.round(response.data.data[0].ordAmt0 / 1000000);
      data.data1.ordAmt1 = Math.round(response.data.data[0].ordAmt1 / 1000000);
      data.data1.ordAmt2 = Math.round(response.data.data[0].ordAmt2 / 1000000);
      data.data1.ordAmt3 = Math.round(response.data.data[0].ordAmt3 / 1000000);
      data.data1.ordAmt4 = Math.round(response.data.data[0].ordAmt4 / 1000000);

      // 차트 시리즈 업데이트 (사급)
      data.data2.targetAmt0 = Math.round(response.data.data[1].targetAmt0 / 1000000);
      data.data2.targetAmt1 = Math.round(response.data.data[1].targetAmt1 / 1000000);
      data.data2.targetAmt2 = Math.round(response.data.data[1].targetAmt2 / 1000000);
      data.data2.targetAmt3 = Math.round(response.data.data[1].targetAmt3 / 1000000);
      data.data2.targetAmt4 = Math.round(response.data.data[1].targetAmt4 / 1000000);

      data.data2.ordAmt0 = Math.round(response.data.data[1].ordAmt0 / 1000000);
      data.data2.ordAmt1 = Math.round(response.data.data[1].ordAmt1 / 1000000);
      data.data2.ordAmt2 = Math.round(response.data.data[1].ordAmt2 / 1000000);
      data.data2.ordAmt3 = Math.round(response.data.data[1].ordAmt3 / 1000000);
      data.data2.ordAmt4 = Math.round(response.data.data[1].ordAmt4 / 1000000);

      // 차트 시리즈 업데이트 (자재판매)
      data.data3.targetAmt0 = Math.round(response.data.data[2].targetAmt0 / 1000000);
      data.data3.targetAmt1 = Math.round(response.data.data[2].targetAmt1 / 1000000);
      data.data3.targetAmt2 = Math.round(response.data.data[2].targetAmt2 / 1000000);
      data.data3.targetAmt3 = Math.round(response.data.data[2].targetAmt3 / 1000000);
      data.data3.targetAmt4 = Math.round(response.data.data[2].targetAmt4 / 1000000);

      data.data3.ordAmt0 = Math.round(response.data.data[2].ordAmt0 / 1000000);
      data.data3.ordAmt1 = Math.round(response.data.data[2].ordAmt1 / 1000000);
      data.data3.ordAmt2 = Math.round(response.data.data[2].ordAmt2 / 1000000);
      data.data3.ordAmt3 = Math.round(response.data.data[2].ordAmt3 / 1000000);
      data.data3.ordAmt4 = Math.round(response.data.data[2].ordAmt4 / 1000000);

      // 차트 시리즈 업데이트 (누수보수)
      data.data4.targetAmt0 = Math.round(response.data.data[3].targetAmt0 / 1000000);
      data.data4.targetAmt1 = Math.round(response.data.data[3].targetAmt1 / 1000000);
      data.data4.targetAmt2 = Math.round(response.data.data[3].targetAmt2 / 1000000);
      data.data4.targetAmt3 = Math.round(response.data.data[3].targetAmt3 / 1000000);
      data.data4.targetAmt4 = Math.round(response.data.data[3].targetAmt4 / 1000000);

      data.data4.ordAmt0 = Math.round(response.data.data[3].ordAmt0 / 1000000);
      data.data4.ordAmt1 = Math.round(response.data.data[3].ordAmt1 / 1000000);
      data.data4.ordAmt2 = Math.round(response.data.data[3].ordAmt2 / 1000000);
      data.data4.ordAmt3 = Math.round(response.data.data[3].ordAmt3 / 1000000);
      data.data4.ordAmt4 = Math.round(response.data.data[3].ordAmt4 / 1000000);

      labelNmUpdate();
      // 차트 시리즈 업데이트
      series1.value = [
        {
          name: '실적',
          data: [
            {
              x: String(labelNm.value.year4),
              y: data.data1.ordAmt4,
              goals: [
                {
                  name: '목표',
                  value: data.data1.targetAmt4,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year3),
              y: data.data1.ordAmt3,
              goals: [
                {
                  name: '목표',
                  value: data.data1.targetAmt3,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year2),
              y: data.data1.ordAmt2,
              goals: [
                {
                  name: '목표',
                  value: data.data1.targetAmt2,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year1),
              y: data.data1.ordAmt1,
              goals: [
                {
                  name: '목표',
                  value: data.data1.targetAmt1,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year0),
              y: data.data1.ordAmt0,
              goals: [
                {
                  name: '목표',
                  value: data.data1.targetAmt0,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
          ],
        },
      ];
      // 차트 시리즈 업데이트
      series2.value = [
        {
          name: '실적',
          data: [
            {
              x: String(labelNm.value.year4),
              y: data.data2.ordAmt4,
              goals: [
                {
                  name: '목표',
                  value: data.data2.targetAmt4,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year3),
              y: data.data2.ordAmt3,
              goals: [
                {
                  name: '목표',
                  value: data.data2.targetAmt3,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year2),
              y: data.data2.ordAmt2,
              goals: [
                {
                  name: '목표',
                  value: data.data2.targetAmt2,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year1),
              y: data.data2.ordAmt1,
              goals: [
                {
                  name: '목표',
                  value: data.data2.targetAmt1,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year0),
              y: data.data2.ordAmt0,
              goals: [
                {
                  name: '목표',
                  value: data.data2.targetAmt0,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
          ],
        },
      ];
      // 차트 시리즈 업데이트
      series3.value = [
        {
          name: '실적',
          data: [
            {
              x: String(labelNm.value.year4),
              y: data.data3.ordAmt4,
              goals: [
                {
                  name: '목표',
                  value: data.data3.targetAmt4,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year3),
              y: data.data3.ordAmt3,
              goals: [
                {
                  name: '목표',
                  value: data.data3.targetAmt3,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year2),
              y: data.data3.ordAmt2,
              goals: [
                {
                  name: '목표',
                  value: data.data3.targetAmt2,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year1),
              y: data.data3.ordAmt1,
              goals: [
                {
                  name: '목표',
                  value: data.data3.targetAmt1,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year0),
              y: data.data3.ordAmt0,
              goals: [
                {
                  name: '목표',
                  value: data.data3.targetAmt0,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
          ],
        },
      ];
      // 차트 시리즈 업데이트
      series4.value = [
        {
          name: '실적',
          data: [
            {
              x: String(labelNm.value.year4),
              y: data.data4.ordAmt4,
              goals: [
                {
                  name: '목표',
                  value: data.data4.targetAmt4,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year3),
              y: data.data4.ordAmt3,
              goals: [
                {
                  name: '목표',
                  value: data.data4.targetAmt3,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year2),
              y: data.data4.ordAmt2,
              goals: [
                {
                  name: '목표',
                  value: data.data4.targetAmt2,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year1),
              y: data.data4.ordAmt1,
              goals: [
                {
                  name: '목표',
                  value: data.data4.targetAmt1,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
            {
              x: String(labelNm.value.year0),
              y: data.data4.ordAmt0,
              goals: [
                {
                  name: '목표',
                  value: data.data4.targetAmt0,
                  strokeHeight: 5,
                  strokeColor: '#00E396',
                },
              ],
            },
          ],
        },
      ];
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>
