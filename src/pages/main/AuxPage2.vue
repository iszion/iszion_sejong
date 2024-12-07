<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-sm-6 col-md-6">
      <q-card bordered class="">
        <q-bar class="text-subtitle1 text-bold">
          최근 1주일 프로젝트 활동정보
          <q-space />
          <span class="text-subtitle2 text-teal"></span>
        </q-bar>
        <q-card-section class="q-pa-xs">
          <div :style="{ height: 300 + 'px' }">
            <ag-grid-vue
              ref="myGrid"
              style="width: 100%; height: 100%"
              :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
              :grid-options="gridOptions"
            >
            </ag-grid-vue>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6">
      <q-card bordered class="">
        <q-bar class="text-subtitle1 text-bold">
          최근 1주일 활동일지 등록정보
          <q-space />
          <span class="text-subtitle2 text-teal"></span>
        </q-bar>
        <q-card-section class="q-pa-xs">
          <div :style="{ height: 300 + 'px' }">
            <ag-grid-vue
              ref="myGrid1"
              style="width: 100%; height: 100%"
              :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
              :grid-options="gridOptions1"
            >
            </ag-grid-vue>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { useQuasar } from 'quasar';
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import SubHistory from 'components/subvue/SubHistory.vue';
import SubDayDocList from 'components/subvue/SubDayDocList.vue';
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();

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
    getDataProject();
    getDataSales();
  },
  { immediate: false }, // 컴포넌트가 마운트될 때도 실행안함
);

onBeforeMount(() => {
  getDataProject();
  getDataSales();
});

onMounted(() => {});

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `300px`,
}));

const rowData = reactive({ projects: [], sales: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

const columnDefs = ref([
  {
    headerName: '#',
    minWidth: 50,
    maxWidth: 50,
    pinned: 'left',
    filter: false,
    editable: false,
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: '왈동일자',
    field: 'stdDay',
    valueFormatter: dateFormatter,
    minWidth: 120,
    maxWidth: 120,
    filter: false,
    editable: false,
  },
  {
    headerName: '프로젝트명',
    field: 'projectNm',
    minWidth: 200,
    filter: false,
    editable: false,
  },
  {
    headerName: '관리코드',
    field: 'projectCd',
    minWidth: 90,
    maxWidth: 90,
    filter: false,
    editable: false,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: '활동건수',
    field: 'dayDocCnt',
    minWidth: 90,
    maxWidth: 90,
    filter: false,
    editable: false,
    cellStyle: { textAlign: 'center' },
  },
]);

const columnDefs1 = ref([
  {
    headerName: '#',
    minWidth: 50,
    maxWidth: 50,
    pinned: 'left',
    filter: false,
    editable: false,
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: '왈동일자',
    field: 'stdDay',
    valueFormatter: dateFormatter,
    minWidth: 120,
    maxWidth: 120,
    filter: false,
    editable: false,
  },
  {
    headerName: '영업담당',
    field: 'salesNm',
    minWidth: 90,
    maxWidth: 90,
    filter: false,
    editable: false,
  },
  {
    headerName: '관리코드',
    field: 'salesCd',
    minWidth: 90,
    maxWidth: 90,
    filter: false,
    editable: false,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: '일지주제',
    field: 'subject',
    minWidth: 150,
    filter: false,
    editable: false,
  },
  {
    headerName: '활동건수',
    field: 'dayDocCnt',
    minWidth: 90,
    maxWidth: 90,
    filter: false,
    editable: false,
    cellStyle: { textAlign: 'center' },
  },
]);

const selectedRows = ref([]);

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const getDataProject = async () => {
  try {
    const response = await api.post('/api/aux/auxPage2_project_list', {
      paramStdDay: params.currentDay,
    });

    rowData.projects = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.projects);
    // console.log('rowData : ', JSON.stringify(rowData.projects));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSales = async () => {
  try {
    const response = await api.post('/api/aux/auxPage2_sales_list', {
      paramStdDay: params.currentDay,
    });
    rowData.sales = response.data.data;
    myGrid1.value.api.setGridOption('rowData', rowData.sales);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.projects,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 40;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    selectedRows.value = event.api.getSelectedRows();
    if (selectedRows.value[0].dayDocCnt > 0) {
      $q.dialog({
        component: SubHistory,
        componentProps: {
          paramProjectCd: selectedRows.value[0].projectCd,
          paramProjectNm: selectedRows.value[0].projectNm,
        },
      })
        .onOk(res => {
          // console.log('res ::: ', res.valueCd, res.valueNm);
        })
        .onCancel(() => {
          // console.log('Cancel');
        })
        .onDismiss(() => {
          // console.log('Called on OK or Cancel');
        });
    } else {
      $q.dialog({
        dark: true,
        title: '안내',
        message: '등록된 활동일지가 없습니다.',
      })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {
          // 확인/취소 모두 실행되었을때
        });
    }
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  getRowNodeId: function (data) {
    return null;
  },
  // 리드 상단 고정
  setPinnedTopRowData: function (data) {
    return null;
  },
  // 그리드 하단 고정
  setPinnedBottomRowData: function (data) {
    return null;
  },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};

const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefs1.value,
  rowData: rowData.sales,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 40;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    selectedRows.value = event.api.getSelectedRows();
    if (selectedRows.value[0].dayDocCnt > 0) {
      $q.dialog({
        component: SubDayDocList,
        componentProps: {
          paramSalesCd: selectedRows.value[0].salesCd,
          paramSalesNm: selectedRows.value[0].salesNm,
          paramStdDay: commUtil.unFormatDate(selectedRows.value[0].stdDay),
        },
      })
        .onOk(res => {
          // console.log('res ::: ', res.valueCd, res.valueNm);
        })
        .onCancel(() => {
          // console.log('Cancel');
        })
        .onDismiss(() => {
          // console.log('Called on OK or Cancel');
        });
    } else {
      $q.dialog({
        dark: true,
        title: '안내',
        message: '등록된 활동일지가 없습니다.',
      })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {
          // 확인/취소 모두 실행되었을때
        });
    }
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  getRowNodeId: function (data) {
    return null;
  },
  // 리드 상단 고정
  setPinnedTopRowData: function (data) {
    return null;
  },
  // 그리드 하단 고정
  setPinnedBottomRowData: function (data) {
    return null;
  },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>
