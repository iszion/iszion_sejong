<template>
  <!--  <q-card bordered class="q-pa-xs" :style-fn="myTweak">-->
  <q-card bordered class="q-pa-xs">
    <!-- contents List -->
    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="q-py-xs text-subtitle1 text-bold">
        인사평가 최종 집계내역
        <q-space />
      </q-bar>
      <!--  end of contents list title bar -->

      <q-card-section class="q-pa-xs">
        <div class="row q-col-gutter-x-xs">
          <div class="col-xs-12 col-md-4">
            <q-card bordered class="q-pa-xs">
              <apexchart type="radar" :height="chartHeight_radar" :options="chartOptions_radar" :series="series_radar"></apexchart>
            </q-card>
          </div>
          <div class="col-xs-12 col-md-8">
            <div :style="{ height: chartHeight_radar + 25 + 'px' }">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.def"
                :rowSelection="rowSelection"
                @selection-changed="onSelectionChanged"
                @grid-ready="onGridReady"
              >
              </ag-grid-vue>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!--  end of contents list -->
  </q-card>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';

import commUtil from 'src/js_comm/comm-util';

import { useUserInfoStore } from 'src/store/setUserInfo';
import { useYearInfoStore } from 'src/store/setYearInfo';
import ImageView from 'components/ImageView.vue';

const storeYear = useYearInfoStore();
const storeUser = useUserInfoStore();

const $q = useQuasar();

let isSaveFg = null;

const searchParam = reactive({
  pYear: storeYear.setYear,
  word: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  rowSelection.value = 'multiple';

  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `300px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [], rowsSel: [] });

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      width: 60,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
      editable: false,
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '',
      field: 'imageFileNm',
      minWidth: 70,
      maxWidth: 70,
      filter: false,
      cellRenderer: ImageView,
      cellRendererParams: params => {
        // console.log('param: ', JSON.stringify(params.data));
        return {
          // imageData: params.data.imageFileNm, // imageFileNm 필드 데이터 전달
          rowData: {
            empCd: params.data.empCd,
            empNm: params.data.empNm,
            deptNm: params.data.deptNm,
            titlNm: params.data.titlNm,
            imageFileNm: params.data.imageFileNm,
          }, // 전체 row 데이터 전달 (필요 시)
        };
      },
    },

    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 100,
      editable: false,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '성과점수',
      field: 'evaP1',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '역량점수',
      field: 'evaP2',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '성과환산',
      field: 'evaP1X',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '역량환산',
      field: 'evaP2Xx',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '종합점수',
      field: 'evaFinalPoint',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '등급',
      field: 'evaGrade',
      minWidth: 80,
      filter: true,
      editable: false,
    },
    {
      headerName: '1차평가자',
      field: 'evsEmpNm1',
      minWidth: 100,
      filter: true,
      editable: false,
    },
    {
      headerName: '2차평가자',
      field: 'evsEmpNm2',
      minWidth: 100,
      filter: true,
      editable: false,
    },
  ],
});

const selectedRows = ref([]);
const evalTitle = ref(['', '', '', '', '']);
const evalData = ref([0, 0, 0, 0, 0]);
const evalTitleLine = ref([
  searchParam.pYear - 4 + '년',
  searchParam.pYear - 3 + '년',
  searchParam.pYear - 2 + '년',
  searchParam.pYear - 1 + '년',
  searchParam.pYear + '년',
]);
const evalDataLine = ref([0, 0, 0, 0, 0]);

const selectedData = ref({
  imageFileNm: null,
  empNm: null,
  titlNm: null,
  deptCd: null,
  deptNm: null,
  depgCd: null,
  depgNm: null,
  pstnCd: null,
  pstnNm: null,
});
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  selectedData.value.imageFileNm = selectedRows.value[0].imageFileNm;
  selectedData.value.empNm = selectedRows.value[0].empNm;
  selectedData.value.titlNm = selectedRows.value[0].titlNm;
  selectedData.value.deptCd = selectedRows.value[0].deptCd;
  selectedData.value.deptNm = selectedRows.value[0].deptNm;
  selectedData.value.depgCd = selectedRows.value[0].depgCd;
  selectedData.value.depgNm = selectedRows.value[0].depgNm;
  selectedData.value.pstnCd = selectedRows.value[0].pstnCd;
  selectedData.value.pstnNm = selectedRows.value[0].pstnNm;

  evalTitle.value = [];
  evalData.value = [];
  evalDataLine.value = [];
  if (selectedRows.value.length === 1) {
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].empCd).then(data => {
      if (data) {
        rowData.rowsSel = data;

        for (let i = 0; i < data.length; i++) {
          evalTitle.value.push(data[i].divNm);
          evalData.value.push(data[i].resultMarkPoint);
        }

        // 차트 데이터 업데이트 radar
        series_radar.value = [
          {
            name: '평가 점수',
            data: evalData.value,
          },
        ];

        // 차트 옵션 업데이트 (필요 시)
        chartOptions_radar.value = {
          ...chartOptions_radar.value,
          xaxis: {
            categories: evalTitle.value,
          },
        };

        // 차트 데이터 업데이트 radialBar
        series_radialBar.value = evalData.value;

        // 차트 옵션 업데이트 (필요 시)
        chartOptions_radialBar.value = {
          ...chartOptions_radialBar.value,
          labels: evalTitle.value,
        };
      }
    });
  }
};

const rowSelection = ref(null);

const empCdFocus = ref(null);
const empNmFocus = ref(null);

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

const chartHeight_radar = ref(290);
const chartOptions_radar = ref({
  chart: {
    height: chartHeight_radar.value,
    type: 'radar',
  },
  title: {
    text: '역량평가 분포도',
    align: 'center',
  },
  yaxis: {
    min: 0, // Y축의 최소값 설정
    max: 100, // Y축의 최대값 설정
    tickAmount: 5, // 눈금 개수 설정
    // stepSize: 30,
    labels: {
      formatter: value => `${value}%`, // Y축 값 포맷팅
    },
  },
  xaxis: {
    categories: evalTitle.value,
  },
});

const series_radar = ref([
  {
    name: 'Series 1',
    data: evalData.value,
  },
]);

const chartHeight_radialBar = ref(330);
const chartOptions_radialBar = ref({
  chart: {
    height: chartHeight_radialBar.value,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent',
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
      barLabels: {
        enabled: true,
        useSeriesColors: true,
        offsetX: -8,
        fontSize: '16px',
        formatter: function (seriesName, opts) {
          return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
        },
      },
    },
  },
  colors: [],
  labels: evalTitle.value,
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          show: false,
        },
      },
    },
  ],
});

const series_radialBar = ref(evalData.value);

const chartHeight_line = ref(290);
const chartOptions_line = ref({
  chart: {
    height: chartHeight_line.value,
    type: 'line',
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },
  title: {
    text: '최근 5년 종합 평가점수',
    align: 'left',
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  yaxis: {
    min: 60, // Y축의 최소값 설정
    max: 100, // Y축의 최대값 설정
    tickAmount: 10, // 눈금 개수 설정
  },
  xaxis: {
    categories: evalTitleLine.value,
  },
});

const series_line = ref([
  {
    name: '평가점수',
    data: evalDataLine.value,
  },
]);
// **************************************************************//
const tableCols = [
  {
    name: 'name',
    required: true,
    label: '역량구분',
    align: 'center',
    field: row => row.divNm,
    format: val => `${val}`,
    sortable: false,
  },
  { name: 'calories', align: 'center', label: '평가점수', field: 'resultMarkPoint', sortable: false },
];

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const getData = async () => {
  try {
    const response = await api.post('/api/hrt/hrt6020_list', {
      paramStdYear: storeYear.setYear,
      paramDeptCd: storeUser.setDeptCd,
      paramSearchWord: '',
    });

    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSelect = async (resYear, resEmpCd) => {
  try {
    const response = await api.post('/api/hrt/hrt6020_select_list', {
      paramStdYear: resYear,
      paramEmpCd: resEmpCd,
      paramSearchWord: resEmpCd,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>
