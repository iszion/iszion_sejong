<template>
  <!-- notice dialogRef here -->
  <q-dialog :maximized="$q.screen.lt.md" full-width full-height ref="dialogRef">
    <q-card class="my-card q-dialog-plugin">
      <q-toolbar :class="$q.dark.isActive ? params.paramDarkBC : params.paramLightBC">
        <q-btn @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" />닫기</q-btn>
        <q-space />
        <span class="text-h6 text-bold"> {{ params.paramTitle }} </span>
        <q-space />
      </q-toolbar>
      <q-card-section class="grid-container q-pa-xs-xs q-pa-sm-sm">
        <div class="row">
          <q-input
            ref="searchNmFocus"
            clearable
            clear-icon="close"
            dense
            v-model="searchValue"
            label="프로젝트명 검색"
            :style="$q.screen.xs ? 'min-width: 100px' : 'max-width: 150px'"
            @keyup.enter.stop="handelGetData"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click.stop="handelGetData" />
            </template>
          </q-input>
          <q-space />
        </div>
        <q-separator spaced />
        <div class="ag-grid-wrapper">
          <ag-grid-vue
            ref="myGrid"
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :suppressCellSelection="true"
            :grid-options="gridOptions"
          >
          </ag-grid-vue>
        </div>
        <div class="q-pa-md flex flex-center">
          <q-select
            dense
            borderless
            v-model="pagination.pageRows"
            options-dense
            :options="pagination.pageOption"
            class="q-mr-md"
            @update:model-value="handelGetData"
          />
          <q-pagination
            v-model="currentPages"
            :max="totalPages"
            :max-pages="currentGroup"
            direction-links
            boundary-links
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
            @update:model-value="handlePageChange"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { AgGridVue } from 'ag-grid-vue3';
import { onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import commUtil from 'src/js_comm/comm-util';
import SubHistory from 'components/subvue/SubHistory.vue';

const $q = useQuasar();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const params = defineProps({
  paramTitle: {
    type: String,
    required: false,
    default: null,
  },
  paramFg: {
    type: String,
    required: false,
    default: null,
  },
  paramStepCd: {
    type: String,
    required: false,
    default: null,
  },
  paramStdDay: {
    type: String,
    required: false,
    default: null,
  },
  paramDarkBC: {
    type: String,
    required: false,
    default: null,
  },
  paramDarkTC: {
    type: String,
    required: false,
    default: null,
  },
  paramLightBC: {
    type: String,
    required: false,
    default: null,
  },
  paramLightTC: {
    type: String,
    required: false,
    default: null,
  },
});

const searchNmFocus = ref(null);

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

const columnDefs = reactive({
  columns: [
    {
      headerName: 'No',
      field: 'rowNum',
      minWidth: 70,
      maxWidth: 70,
      filter: true,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    { headerName: '코드', field: 'projectCd', maxWidth: 100, minWidth: 100, pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null },
    { headerName: '프로젝트명', field: 'projectNm', minWidth: 400, pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null },
    { headerName: '영업담당', field: 'salesNm', minWidth: 100, maxWidth: 100 },
    {
      headerName: '활동수',
      field: 'dayDocCnt',
      minWidth: 90,
      maxWidth: 90,
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
          fontWeight: 'bold',
          textAlign: 'center', // 중앙 정렬
        };
      },
    },
    { headerName: '진행상태', field: 'stepNm', minWidth: 100 },
    { headerName: '발주처', field: 'orcu1Nm', minWidth: 100 },
    { headerName: '등록일', field: 'makeDay', minWidth: 120, maxWidth: 120, valueFormatter: dateFormatter },
    {
      headerName: '수주(예상)물량',
      field: 'totEstQty',
      minWidth: 100,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '수주(예상)금액',
      field: 'totEstAmt',
      minWidth: 150,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '수주(계약)물량',
      field: 'totOrdQty',
      minWidth: 100,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '수주(계약)금액',
      field: 'totEstAmt',
      minWidth: 150,
      valueFormatter: params => {
        if (params.value != null) {
          return new Intl.NumberFormat('ko-KR', {
            // style: 'currency',
            // currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value);
        }
        return '';
      },
      cellClass: 'ag-right-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
  ],
});

const rowSelection = ref(null);
const rowData = reactive({ rows: [] });
const searchValue = ref(null);

onBeforeMount(() => {
  handelGetData();
});

const handelGetData = () => {
  getDataMaxPages().then(() => {
    getData();
  });
};

const selectedRows = ref(null);

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const getDataMaxPages = async () => {
  totalPages.value = 0;
  currentPages.value = 0;
  pagination.startRowNum = 0;
  try {
    const response = await api.post('/api/aux/countView_maxPages', {
      paramStdDay: params.paramStdDay,
      paramFg: params.paramFg,
      paramStepCd: params.paramStepCd,
      paramSearchValue: searchValue.value,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    let maxRows = response.data.data[0].maxPages;

    totalPages.value = Math.ceil(maxRows / pagination.pageRows);
    // console.log('totalPage : ', totalPages.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 고객정보 검색리스트 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/aux/countView_list', {
      paramStdDay: params.paramStdDay,
      paramFg: params.paramFg,
      paramStepCd: params.paramStepCd,
      paramSearchValue: searchValue.value,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    // console.log('rowData : ', JSON.stringify(rowData.rows));
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매정보(일전체 고객별) 목록 자료 가져오기 부분 끝  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    projectNm: '합계',
    totEstQty: 0,
    totEstAmt: 0,
    totOrdQty: 0,
    totOrdAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.totEstQty += row.totEstQty || 0;
    totalRow.totEstAmt += row.totEstAmt || 0;
    totalRow.totOrdQty += row.totOrdQty || 0;
    totalRow.totOrdAmt += row.totOrdAmt || 0;
  });
  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.columns,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
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
    if (param.data.closeDay) {
      if (param.data.closeDay <= params.paramCloseDay) {
        param.data.closeDay = commUtil.formatDate(param.data.closeDay);
        return { color: '#ff0505' };
      } else {
        param.data.closeDay = '';
      }
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
  onCellKeyDown: function (event) {
    // selectedRows.value = event.api.getSelectedRows();
  },
  onRowDoubleClicked: function (event) {},
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
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

// ******* 그리드 페이지 처리
const totalPages = ref(0); // 총 페이지 수
const currentPages = ref(1); // 현재 처리하는 페이지
const currentGroup = ref(5); // 화면에 보여줄 최대 페이지 수

const pagination = reactive({
  pageRows: 50,
  startRowNum: 0,
  pageOption: [10, 50, 100, 300, 500, 1000],
});

const handlePageChange = newPage => {
  // console.log(`Current Page: ${newPage}`);
  pagination.startRowNum = (newPage - 1) * pagination.pageRows;
  currentPages.value = newPage;
  // myGrid.value.api.paginationGoToPage(newPage - 1);
  getData();
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px

.grid-container
  display: flex
  flex-direction: column
  height: 96%

.ag-grid-wrapper
  flex-grow: 1
  height: 96%
</style>
