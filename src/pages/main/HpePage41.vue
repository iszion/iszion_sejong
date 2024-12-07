<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-xs-12 col-sm-5">
      <q-card bordered class="q-pa-xs">
        <q-bar class="text-subtitle1 text-bold"> 평가대상자 (일반직) </q-bar>
        <q-card-section class="q-pb-none">
          <apexchart v-if="chartOptions1" type="line" :height="$q.screen.xs ? '180' : '280'" :options="chartOptions1" :series="series1"></apexchart>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-7">
      <q-card bordered class="q-pa-xs">
        <q-bar class="text-subtitle1 text-bold"> 평가대상자 (전문직) </q-bar>
        <q-card-section class="q-pb-none">
          <apexchart v-if="chartOptions2" type="line" :height="$q.screen.xs ? '180' : '280'" :options="chartOptions2" :series="series2"></apexchart>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!--  상세인원현황 부분 -->

  <q-dialog v-model="isDialogView1">
    <q-card style="width: 700px; max-width: 100vw">
      <q-card-section>
        <div class="text-h6">평가대상자 목록</div>
      </q-card-section>

      <q-separator />

      <div class="row text-subtitle1 text-bold text-green q-mx-sm q-pt-sm">
        <div class="col-1 flex flex-center">
          <q-item-label>No</q-item-label>
        </div>

        <div class="col-1 flex flex-center"></div>

        <div class="col-2 flex flex-center">
          <q-item-label>성명</q-item-label>
        </div>

        <div class="col-5 flex flex-center">
          <q-item-label>소속</q-item-label>
        </div>

        <div class="col-3 flex flex-center">
          <q-item-label>직급</q-item-label>
        </div>

        <!--              <div class="col-2 flex flex-center">-->
        <!--                <q-item-label>{{ data.catgNm }}</q-item-label>-->
        <!--              </div>-->
      </div>
      <q-card-section style="max-height: 50vh" class="scroll q-pt-xs">
        <q-list bordered class="rounded-borders">
          <div v-for="(data, index) in rowDataEmpList" :key="index" class="">
            <div class="row">
              <div class="col-1 flex flex-center">
                <q-item-label>{{ index + 1 }}</q-item-label>
              </div>

              <div class="col-1 flex flex-center">
                <q-avatar size="35px">
                  <q-img
                    class="cursor-pointer q-pa-none q-ma-none"
                    v-if="data.imageFileNm"
                    :src="`https://www.iszion.com/images/thumb/${data.imageFileNm}`"
                    style="object-fit: cover; width: 100%; height: 100%"
                  />
                  <q-icon v-else name="face" color="teal" size="md" />
                </q-avatar>
              </div>

              <div class="col-2 flex flex-center">
                <q-item-label>{{ data.empNm }}</q-item-label>
              </div>

              <div class="col-5 flex flex-center">
                <q-item-label>{{ data.depgNm }} / {{ data.deptNm }}</q-item-label>
              </div>

              <div class="col-3 flex flex-center">
                <q-item-label>{{ data.titlNm }}</q-item-label>
              </div>

              <!--              <div class="col-2 flex flex-center">-->
              <!--                <q-item-label>{{ data.catgNm }}</q-item-label>-->
              <!--              </div>-->
            </div>
            <q-separator v-if="rowDataEmpList.length - 1 !== index" spaced />
          </div>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="닫기" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--  상세 인원현황 끝-->
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { QBtn, QIcon, useQuasar } from 'quasar';
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
  chartOptions1.value = getChartOptions('일반직', label1.value, isXsScreen.value, isDarkMode);
  chartOptions2.value = getChartOptions('전문직', label2.value, isXsScreen.value, isDarkMode);
  // chartOptions2.value = getChartOptions('전문직 (업무지원직: ' + series3.value.hrCnt + '명)', label2.value, isXsScreen.value, isDarkMode);
};

const getChartOptions = (title, label, isXs, isDarkMode) => ({
  chart: {
    height: 280,
    type: 'line',
    toolbar: {
      show: true, // Disable the toolbar to remove zoom and pan buttons
      tools: {
        download: false, // 다운로드 버튼 숨기기
        selection: false, // 선택 버튼 숨기기
        zoom: false, // 줌 버튼 숨기기
        zoomin: false, // 줌인 버튼 숨기기
        zoomout: false, // 줌아웃 버튼 숨기기
        pan: false, // 팬 버튼 숨기기
        reset: true, // 리셋 줌 버튼만 보이도록 설정
        customIcons:
          title === '전문직'
            ? [
                {
                  icon: '<img src="https://www.iszion.com/images/systemImg/s11.png" width="60" />', // Icon HTML
                  index: -1, // Position in the toolbar
                  title: '( S1 업무지원직: ' + series3.value.hrCnt + '명 )',
                  class: 'custom-icon q-mr-xl q-mt-sm',
                  click: function (chart, options, e) {
                    // Action when the custom icon is clicked
                    // alert('Custom icon clicked!');
                    let result = '^(' + empList3.value[0].replace(/,/g, '|').replace(/\s+/g, '') + ')$'; // ,를 |로 대치하고 공백을 제거 하고 ()감싸기
                    getDataPage41EmpList(result).then(() => {
                      isDialogView1.value = true;
                    });
                  },
                },
              ]
            : [],
      },
    },
    events: {
      dataPointSelection: function (event, chartContext, config) {
        // Handle the click event here
        // console.log('Index :  ', config.dataPointIndex);
        // console.log('Data Point Clicked:', config.seriesIndex, config.dataPointIndex);
        // Access the clicked data point value
        // const seriesName = config.w.config.series[config.seriesIndex].name;
        // const dataValue = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];
        // console.log('Series Name:', seriesName, 'Data Value:', dataValue);

        // Perform custom actions like displaying a modal or navigating to another page
        // Example: Show an alert with the data point information
        // alert(`Series: ${seriesName}, Value: ${dataValue}, Value: ${config.seriesIndex}`);
        let result = null;
        if (title === '일반직') {
          result = '^(' + empList1.value[config.dataPointIndex].replace(/,/g, '|').replace(/\s+/g, '') + ')$'; // ,를 |로 대치하고 공백을 제거 하고 ()감싸기
        } else {
          result = '^(' + empList2.value[config.dataPointIndex].replace(/,/g, '|').replace(/\s+/g, '') + ')$'; // ,를 |로 대치하고 공백을 제거 하고 ()감싸기
        }
        getDataPage41EmpList(result).then(() => {
          isDialogView1.value = true;
        });
      },
      click: function (event, chartContext, config) {
        // Custom click event handler for the entire chart
      },
    },
  },

  tooltip: {
    enabled: true, // Disable tooltip
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      // Check if the series is a column type to show the tooltip
      if (w.config.series[seriesIndex].type === 'column') {
        return `<div class="apexcharts-tooltip">
                  <span>${series[seriesIndex][dataPointIndex]}</span>
                </div>`;
      }
      return ''; // Return empty string for other series types
    },
  },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: title,
    align: 'center', // 원하는 위치에 따라 설정 가능
    style: {
      color: isDarkMode ? '#afafaf' : '#2c61ff', // 원하는 텍스트 색상 지정
      fontSize: '20px', // 폰트 크기 설정
      fontFamily: 'Arial, sans-serif', // 폰트 설정
      fontWeight: 'bold', // Make the title bold
      lineHeight: '1.5', // Line height for better spacing
      letterSpacing: '1px', // Adjust letter spacing for aesthetics
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (value) {
      return value; // Display the value
    },
    enabledOnSeries: [1],
    style: {
      colors: ['#ff0000', '#016701'], // Color for data labels
    },
  },
  xaxis: {
    labels: {
      style: {
        colors: isDarkMode ? '#ffffff' : '#000000', // Ensure good contrast
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: isDarkMode ? '#ffffff' : '#000000', // Ensure good contrast
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
    },
  },
  labels: label,
  plotOptions: {
    bar: {
      columnWidth: '40%', // 막대의 너비를 설정하는 부분
    },
  },
  legend: {
    show: false, // This line hides the legend
  },
  colors: isDarkMode ? ['#969696', '#02cb1a'] : ['#0080ff', '#ff8383'],
});

const empList1 = ref([]);
const empList2 = ref([]);
const empList3 = ref([]);
const label1 = ref(['M1', 'M2', 'M3', 'J', 'A1', 'A2']);
const label2 = ref(['SM1(A)', 'SM1(B)', 'M3', 'J', 'A1', 'A2']);
const series1 = ref([
  {
    name: '',
    type: 'column',
    data: [],
  },
  {
    name: '',
    type: 'line',
    data: [],
  },
]);

const series2 = ref([
  {
    name: '',
    type: 'column',
    data: [],
  },
  {
    name: '',
    type: 'line',
    data: [],
  },
]);
const series3 = ref({
  name: '',
  hrCnt: 0,
  data: [],
});
onBeforeMount(async () => {
  try {
    const data = await fetchData('/api/aux/dashboard_page41_list');
    if (data) {
      label1.value = [];
      label2.value = [];
      series1.value[0].data = [];
      series1.value[1].data = [];
      series2.value[0].data = [];
      series2.value[1].data = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].titlCd.substring(0, 1) === '1') {
          series1.value[0].data.push(data[i].hrCnt);
          series1.value[1].data.push(data[i].hrCnt);
          label1.value.push(data[i].titlNm);
          empList1.value.push(data[i].empCdList);
        } else if (data[i].titlCd === '201') {
          series3.value.name = data[i].titlNm;
          series3.value.hrCnt = data[i].hrCnt;
          empList3.value.push(data[i].empCdList);
          // console.log('aa : ', JSON.stringify(data[i]));
        } else {
          series2.value[0].data.push(data[i].hrCnt);
          series2.value[1].data.push(data[i].hrCnt);
          label2.value.push(data[i].titlNm);
          empList2.value.push(data[i].empCdList);
        }
      }
      // console.log('emplist1 : ', empList1.value);
      // console.log('emplist2 : ', empList2.value);
    }
    updateChartOptions();
  } catch (error) {
    console.error('Error initializing data:', error);
  }
});
onMounted(() => {
  updateChartOptions();
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
    const data = response.data.data;
    // console.log('data :: ', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [0]; // Return a default value to prevent the chart from breaking
  }
};

const isDialogView1 = ref(false);
const rowDataEmpList = ref(null);
const getDataPage41EmpList = async resEmpCdList => {
  try {
    const response = await api.post('/api/aux/dashboard_page41_emp_list', {
      paramSetYear: storeYear.setYear,
      paramEmpList: resEmpCdList,
    });

    // console.log('data1 ; ', JSON.stringify(response.data.data));
    rowDataEmpList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>
