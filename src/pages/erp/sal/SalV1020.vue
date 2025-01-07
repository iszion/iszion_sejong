<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents title bar -->
    <div class="row">
      <q-icon name="font_download" size="sm" class="text-orange" />
      <q-toolbar-title class="text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</q-toolbar-title>

      <q-breadcrumbs active-color="grey" style="font-size: 14px" class="self-end">
        <q-breadcrumbs-el label="판매관리" icon="home" />
        <q-breadcrumbs-el label="입고관리" icon="widgets" />
        <q-breadcrumbs-el :label="menuLabel" />
      </q-breadcrumbs>
    </div>
    <!-- end of contents title bar -->
    <q-separator class="q-mb-sm" color="cyan" size="0.2rem" />

    <q-card class="q-pa-sm">
      <q-toolbar class="q-px-sm q-pt-none">
        <div class="row">
          <q-input
            v-model="dateRange"
            label="입고기간"
            label-color="orange"
            readonly
            class="cursor-pointer"
            @click="showDateRangeDialog = true"
            style="min-width: 180px"
          />

          <q-select
            stack-label
            options-dense
            class="q-px-md"
            label-color="orange"
            v-model="searchValue.buyFg"
            :options="searchValue.buyFgOptions"
            option-value="commCd"
            option-label="commNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 100px"
            label="구분"
            @update:model-value="getData"
          />
          <q-input
            stack-label
            label-color="orange"
            bottom-slots
            v-model="searchValue.textValue"
            label="검색"
            class="q-pb-none"
            style="width: 120px"
            @update:model-value="getData"
          >
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="row q-gutter-x-xs q-gutter-y-md">
          <q-btn outline color="grey" @click="getData" class="q-px-sm">
            <q-icon name="search" size="xs" class="q-mr-xs" />
            조회
          </q-btn>

          <q-btn :disable="rowData.rows.length === 0" outline color="teal" @click="isDialogVisible = true" class="q-px-sm">
            <q-icon name="download" size="xs" class="q-mr-xs" />
            엑셀/출력
          </q-btn>
        </div>
      </q-toolbar>
      <q-card class="q-mt-sm">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            style="width: 100%; height: 100%"
            ref="myGrid"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :grid-options="myGridOptions"
          >
          </ag-grid-vue>
        </div>
      </q-card>
    </q-card>

    <q-dialog persistent full-height full-width v-model="isDialogVisible">
      <q-card class="q-pa-none q-ma-none">
        <q-card-section class="q-pa-none q-ma-none">
          <sal-v1020p
            :messages="{ rowData: rowData.rows, buyDayFrom: searchDateRangeModel.from, buyDayTo: searchDateRangeModel.to }"
            @close="handleClose"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDateRangeDialog">
      <q-card>
        <q-card-section class="q-py-xs">
          <div class="text-h6">기간설정</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-date
            v-model="searchDateRangeModel"
            minimal
            range
            mask="YYYY-MM-DD"
            emit-immediately
            :default-year-month="defaultYearMonth"
            @update:model-value="updateDateRange"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-py-xs">
          <q-btn flat label="취소" color="negative" @click="cancelDateRange" />
          <q-btn flat label="적용" color="primary" @click="confirmDateRange" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
ㅌ
<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { date, QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';
import SalV1020p from 'pages/erp/sal/SalV1020p.vue';
import commUtil from 'src/js_comm/comm-util';

const storeYear = useYearInfoStore();

const rowData = reactive({ rows: [] });
const isDialogVisible = ref(false);

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

function handleClose() {
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 160}px`,
}));

const searchValue = ref({
  textValue: '',
  buyFg: '',
  buyFgOptions: [],
});

const columnDefs = ref([
  {
    headerName: '#',
    field: 'rowNum',
    minWidth: 70,
    maxWidth: 80,
    pinned: 'left',
    sortable: true,
    filter: false,
    valueGetter: function (params) {
      // return params.node.rowIndex + 1;
      if (params.data.cnt === undefined) {
        return '';
      } else {
        return params.data.rowNum;
      }
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '입고일자',
    field: 'buyDay',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    minWidth: 120,
    maxWidth: 120,
    valueGetter: params => {
      if (params.data.buyDay === undefined) {
        return '합계'; // buyDay가 undefined일 경우 '합계'로 설정
      }
      if (params.data.seq === undefined || params.data.cnt === undefined) {
        return ''; // buyDay가 undefined일 경우 '합계'로 설정
      }
      if (params.data.buyDay && params.data.buyDay.length === 8) {
        return `${params.data.buyDay.slice(0, 4)}-${params.data.buyDay.slice(4, 6)}-${params.data.buyDay.slice(6)}`;
      }
      return params.data.buyDay;
    },
  },
  {
    headerName: '전표번호',
    field: 'seq',
    minWidth: 100,
    maxWidth: 100,
    valueGetter: function (params) {
      // seq나 buyDay가 undefined일 경우 '소계'나 '합계'를 설정
      if (params.data.seq === undefined && params.data.buyDay === undefined) {
        return ''; // buyDay가 undefined일 경우 '합계'로 설정
      }
      if (params.data.seq === undefined) {
        return '일계';
      }
      if (params.data.cnt === undefined) {
        return '소계';
      }
      return `${params.data.seq}-${params.data.cnt}`;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '업체명',
    field: 'custNm',
    minWidth: 150,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.cnt === undefined) {
        return '';
      }
      return params.data.custNm;
    },
  },
  {
    headerName: '코드',
    field: 'custCd',
    minWidth: 85,
    maxWidth: 85,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.cnt === undefined) {
        return '';
      }
      return params.data.custCd;
    },
  },
  {
    headerName: '구분',
    field: 'buyFgNm',
    minWidth: 80,
    maxWidth: 80,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.cnt === undefined) {
        return '';
      }
      return params.data.buyFgNm;
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 150,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.cnt === undefined) {
        return '';
      }
      return params.data.prodNm;
    },
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 80,
    maxWidth: 80,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.cnt === undefined) {
        return '';
      }
      return params.data.prodCd;
    },
  },
  {
    headerName: '수량',
    field: 'qty',
    minWidth: 110,
    maxWidth: 110,
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
  },
  {
    headerName: '단가',
    field: 'price',
    minWidth: 110,
    maxWidth: 110,
    valueFormatter: params => {
      if (params.data.cnt === undefined) {
        return '';
      }
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
  },
  {
    headerName: '금액',
    field: 'amt',
    minWidth: 110,
    maxWidth: 110,
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
  },
  {
    headerName: '비율',
    field: 'buyYul',
    minWidth: 80,
    maxWidth: 80,
    valueFormatter: params => {
      if (params.data.cnt === undefined) {
        return '';
      }
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 150,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.cnt === undefined) {
        return '';
      }
      return params.data.remarks;
    },
  },
]);

const getStatusMessageStyle = val => {
  // console.log(val);
  // if (data.statusMessage === '평가마감') {
  //   return $q.dark.isActive ? { color: 'red' } : { color: 'red' };
  // } else if (data.statusMessage === '평가중') {
  //   return $q.dark.isActive ? { color: 'teal' } : { color: 'teal' };
  // } else if (data.statusMessage === '평가완료') {
  //   return $q.dark.isActive ? { color: 'orange' } : { color: 'blue' };
  // } else {
  return { color: 'dark' };
  // return { textAlign: 'center' };
  // }
};

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataCommOption('302').then(() => {
    getData();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const selectedRows = ref([]);

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;

  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/sal/sal1020_list', {
      paramBuyDayFrom: commUtil.unFormatDate(searchDateRangeModel.value.from),
      paramBuyDayTo: commUtil.unFormatDate(searchDateRangeModel.value.to),
      paramBuyFg: searchValue.value.buyFg,
      paramValue: searchValue.value.textValue,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    // if (rowData.rows.length === 0) {
    //   //gridHeight.value = 90;
    // } else {
    //   gridHeight.value = minHeight.value + rowData.rows.length * rowHeight;
    //   const maxHeight = contentZoneHeight.value - 160;
    //   if (gridHeight.value > maxHeight) {
    //     gridHeight.value = maxHeight;
    //   }
    // }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 공통코드정보 가져오기 부분  *****************************//
const getDataCommOption = async resCommCd1 => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });

    switch (resCommCd1) {
      case '302':
        searchValue.value.buyFgOptions = JSON.parse(JSON.stringify(response.data.data));
        searchValue.value.buyFgOptions.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        searchValue.value.buyFgOptions = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
const myGrid = ref(null);
const myGridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  enableColResize: true,
  enableSorting: true,
  enableFilter: true,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (event) {
    // if (param.node.rowPinned) {
    //   return { 'font-weight': 'bold', background: '#dddddd' };
    // }
    // return { 'text-align': 'left' };
    // seq가 undefined이면 행 배경색 변경 및 "소계" 삽입
    if (!event.data.buyDay) {
      return { backgroundColor: 'rgba(246,181,117,0.67)', fontWeight: 'bold' }; // 예: 연한 주황색
    }
    if (!event.data.seq) {
      return { backgroundColor: 'rgba(3,147,5,0.22)' }; // 예: 연한 파란색
    }
    if (!event.data.cnt) {
      return { backgroundColor: 'rgba(1,127,194,0.17)' }; // 예: 연한 파란색
    }
    // buyDay가 undefined이면 행 배경색 변경 및 "합계" 삽입
    return null; // 기본 스타일
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (event) {
    // 고정된 행의 높이
    if (event.node.rowPinned) {
      return 45;
    }
    return 30;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
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
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged');
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  getRowNodeId: function (event) {
    // console.log('getRowNodeId');
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

/* ****** 기간설정 처리부분 ********* */

// 기본 날짜 설정
const defaultFrom = commUtil.getToday();
const defaultTo = commUtil.getToday();

const showDateRangeDialog = ref(false);
const format = 'YYYY-MM-DD';

// 기본 날짜 모델 값 초기화
const searchDateRangeModel = ref({
  from: defaultFrom,
  to: defaultTo,
});

// 기본 날짜 범위를 읽기 전용 입력에 초기화
const dateRange = ref(`${defaultFrom} ~ ${defaultTo}`);

// 기본 년/월 설정
const defaultYearMonth = '2024/12';

function updateDateRange(value) {
  const { from, to } = value;

  if (from && to) {
    // 날짜를 원하는 형식으로 포맷
    const formattedFrom = date.formatDate(from, format);
    const formattedTo = date.formatDate(to, format);
    dateRange.value = `${formattedFrom} ~ ${formattedTo}`;
  }
}

function cancelDateRange() {
  // 날짜 선택 취소 시 기본 값으로 초기화
  searchDateRangeModel.value = { from: defaultFrom, to: defaultTo };
  dateRange.value = `${defaultFrom} ~ ${defaultTo}`;
  showDateRangeDialog.value = false;
}

function confirmDateRange() {
  showDateRangeDialog.value = false;
  getData();
}
/* ****** 기간설정 처리부분 끝 ******* */
</script>
<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
