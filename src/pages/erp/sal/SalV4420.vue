<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents title bar -->
    <div class="row">
      <div class="col-auto flex flex-center">
        <q-icon name="font_download" size="sm" class="text-orange" />
        <span class="text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
      </div>
      <q-space />
      <q-breadcrumbs v-if="!$q.screen.xs" active-color="grey" style="font-size: 14px" class="self-end">
        <q-breadcrumbs-el label="판매관리" icon="home" />
        <q-breadcrumbs-el label="출고관리" icon="widgets" />
        <q-breadcrumbs-el :label="menuLabel" />
      </q-breadcrumbs>
    </div>
    <!-- end of contents title bar -->
    <q-separator class="q-mb-sm" color="cyan" size="0.2rem" />

    <q-card class="q-pa-sm">
      <q-toolbar class="q-px-sm q-pt-none">
        <div class="row q-col-gutter-x-md">
          <q-input
            stack-label
            label-color="orange"
            label="기준년"
            class="text-subtitle1"
            v-model="searchValue.year"
            type="number"
            style="width: 100px"
            @update:model-value="getData"
          >
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>

          <q-select
            stack-label
            options-dense
            label-color="orange"
            v-model="searchValue.month"
            :options="searchValue.monthOptions"
            option-value="valueCd"
            option-label="valueNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 90px"
            label="기준월"
            @update:model-value="getData"
          />

          <q-select
            stack-label
            options-dense
            label-color="orange"
            v-model="searchValue.prodDiv"
            :options="searchValue.prodDivOptions"
            option-value="commCd"
            option-label="commNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 150px"
            label="구분"
          />

          <q-input
            v-if="!$q.screen.xs"
            stack-label
            label-color="orange"
            bottom-slots
            v-model="searchValue.textValue"
            label="검색어"
            class="q-pb-none"
            style="width: 120px"
            @update:model-value="handelGetData"
          >
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="row q-gutter-x-xs q-gutter-y-md">
          <q-btn outline color="grey" @click="handelGetData" class="q-px-sm">
            <q-icon name="search" size="xs" class="q-mr-xs" />
            조회
          </q-btn>

          <q-btn v-if="!$q.screen.xs" :disable="rowData.rows.length === 0" outline color="teal" @click="isDialogVisible = true" class="q-px-sm">
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
          <sal-v4420p :messages="{ rowData: rowData, titleNm: menuLabel, searchValue: searchValue }" @close="handleClose" />
        </q-card-section>
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { QBtn, QIcon, useQuasar } from 'quasar';
import SalV4420p from 'pages/erp/sal/SalV4420p.vue';
import commUtil from 'src/js_comm/comm-util';

const rowData = reactive({ rows: [], rowsSum: [] });
const isDialogVisible = ref(false);

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 160}px`,
}));

const searchValue = reactive({
  year: commUtil.getTodayYear(),
  month: commUtil.getTodayMonth(),
  monthOptions: [
    { valueNm: '01월', valueCd: '01' },
    { valueNm: '02월', valueCd: '02' },
    { valueNm: '03월', valueCd: '03' },
    { valueNm: '04월', valueCd: '04' },
    { valueNm: '05월', valueCd: '05' },
    { valueNm: '06월', valueCd: '06' },
    { valueNm: '07월', valueCd: '07' },
    { valueNm: '08월', valueCd: '08' },
    { valueNm: '09월', valueCd: '09' },
    { valueNm: '10월', valueCd: '10' },
    { valueNm: '11월', valueCd: '11' },
    { valueNm: '12월', valueCd: '12' },
  ],
  textValue: '',
  prodDivOptions: [],
  prodDiv: '1011101',
});

const columnDefs = ref([
  {
    headerName: '#',
    field: 'rowNum',
    minWidth: 80,
    maxWidth: 80,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    sortable: true,
    filter: false,
    valueGetter: function (params) {
      if (params.node.rowPinned) {
        return null; // Do not display a number for pinned rows
      }
      return params.node.rowIndex + 1;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    minWidth: 200,
    valueGetter: params => {
      return params.data.prodNm;
    },
    cellStyle: params => {
      return { textAlign: 'left' };
    },
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 100,
    resizable: true,
    valueGetter: function (params) {
      return params.data.prodCd;
    },
  },
  {
    headerName: '정가',
    field: 'sPrice',
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
    headerName: '전월재고량',
    field: 'wjQty',
    minWidth: 120,
    maxWidth: 120,
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
    headerName: '당월입고량',
    field: 'iQty',
    minWidth: 120,
    maxWidth: 120,
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
    headerName: '총재고',
    field: 'tjQty',
    minWidth: 120,
    maxWidth: 120,
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
    headerName: '총출고수량',
    field: 'qtQty',
    minWidth: 120,
    maxWidth: 120,
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
    headerName: '당월출고액(입고액)',
    children: [
      {
        headerName: '출고수량',
        field: 'oQty',
        minWidth: 160,
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
        headerName: '출고금액',
        field: 'oAmt',
        minWidth: 160,
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
        headerName: '반품금액',
        field: 'obAmt',
        minWidth: 160,
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
    ],
  },
  {
    headerName: '실매출액(SB개산서발행)',
    field: 'odAmt',
    minWidth: 160,
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
    headerName: '당월반품액',
    children: [
      {
        headerName: '반품수량',
        field: 'obQty',
        minWidth: 160,
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
        headerName: '증정수량',
        field: 'ojQty',
        minWidth: 160,
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
        headerName: '순출고수량',
        field: 'odQty',
        minWidth: 160,
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
    ],
  },
  {
    headerName: '당월폐기',
    field: 'oxQty',
    minWidth: 160,
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
    headerName: '재고조정',
    field: 'ozQty',
    minWidth: 160,
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
    headerName: '당월재고',
    field: 'jQty',
    minWidth: 160,
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
    headerName: '실매입금액(DB계산서수취)',
    field: 'idAmt',
    minWidth: 160,
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
    headerName: '당월미수금(미지급금)',
    field: 'jdAmt',
    minWidth: 160,
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
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataCommOption('101').then(() => {
    handelGetData();
  });
});

const handelGetData = () => {
  getData();
};

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
    const response = await api.post('/api/sal/sal4420_list', {
      paramYear: searchValue.year,
      paramMonth: searchValue.month,
      paramProdDiv: searchValue.prodDiv,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setColumnDefs(columnDefs.value);
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    // console.log('data : ', JSON.stringify(rowData.rowsSum));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 공통코드정보 가져오기 부분  *****************************//
const getDataCommOption = async resCommCd1 => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });

    switch (resCommCd1) {
      case '101':
        searchValue.prodDivOptions = JSON.parse(JSON.stringify(response.data.data));
        searchValue.prodDivOptions.push({ commCd: '', commNm: '전체' });
        break;
      default:
        searchValue.prodDivOptions = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  rowData.rowsSum = [];

  let totalRow = {
    prodNm: '합계',
    wjQty: 0,
    iQty: 0,
    tjQty: 0,
    otQty: 0,
    oQty: 0,
    oAmt: 0,
    obAmt: 0,
    odAmt: 0,
    obQty: 0,
    ojQty: 0,
    odQty: 0,
    oxQty: 0,
    ozQty: 0,
    jQty: 0,
    idAmt: 0,
    jdAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.wjQty += row.wjQty || 0;
    totalRow.iQty += row.iQty || 0;
    totalRow.tjQty += row.tjQty || 0;
    totalRow.otQty += row.otQty || 0;
    totalRow.oQty += row.oQty || 0;
    totalRow.oAmt += row.oAmt || 0;
    totalRow.obAmt += row.obAmt || 0;
    totalRow.odAmt += row.odAmt || 0;
    totalRow.obQty += row.obQty || 0;
    totalRow.ojQty += row.ojQty || 0;
    totalRow.odQty += row.odQty || 0;
    totalRow.oxQty += row.oxQty || 0;
    totalRow.ozQty += row.ozQty || 0;
    totalRow.jQty += row.jQty || 0;
    totalRow.idAmt += row.idAmt || 0;
    totalRow.jdAmt += row.jdAmt || 0;
  });

  const hasMeaningfulData =
    totalRow.wjQty !== 0 ||
    totalRow.iQty !== 0 ||
    totalRow.tjQty !== 0 ||
    totalRow.otQty !== 0 ||
    totalRow.oQty !== 0 ||
    totalRow.oAmt !== 0 ||
    totalRow.obAmt !== 0 ||
    totalRow.odAmt !== 0 ||
    totalRow.obQty !== 0 ||
    totalRow.ojQty !== 0 ||
    totalRow.odQty !== 0 ||
    totalRow.oxQty !== 0 ||
    totalRow.ozQty !== 0 ||
    totalRow.jQty !== 0 ||
    totalRow.idAmt !== 0 ||
    totalRow.jdAmt !== 0;

  if (hasMeaningfulData) {
    rowData.rowsSum.push(totalRow);
  }

  return totalRow;
};
// rows 전체 합 구하는 부분 끝

// *********************************
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
  // enableColResize: true,
  // enableSorting: true,
  // enableFilter: true,
  // enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (event) {
    if (event.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    // return { 'text-align': 'left' };
    // seq가 undefined이면 행 배경색 변경 및 "소계" 삽입
    // if (event.data.saleDay === '00000000') {
    //   return { backgroundColor: 'rgba(0,181,117,0.24)', fontWeight: 'bold' }; // 예: 연한 주황색
    // }
    // if (event.data.custNm === '일계') {
    //   return { backgroundColor: 'rgba(1,127,194,0.17)' }; // 예: 연한 파란색
    // }
    // if (event.data.custNm === '총계') {
    //   return { backgroundColor: 'rgba(3,147,5,0.22)' }; // 예: 연한 파란색
    // }
    // dealDay가 undefined이면 행 배경색 변경 및 "합계" 삽입
    return null; // 기본 스타일
  },
  getRowHeight: function (event) {
    // 고정된 행의 높이
    if (event.node.rowPinned) {
      return 35;
    }
    return 30;
  },
  headerHeight: 25, // 헤더 행 높이를 50px로 설정
  // 또는 동적으로 헤더 높이를 계산
  // getHeaderHeight: function () {
  //   return 60; // 동적으로 60px 설정
  // },
  // // GRID READY 이벤트, 사이즈 자동조정
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
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  // getRowNodeId: function (event) {
  //   console.log('getRowNodeId');
  // return null;
  // },
  // 리드 상단 고정
  // setPinnedTopRowData: function (data) {
  //   return null;
  // },
  // 그리드 하단 고정
  // setPinnedBottomRowData: function (data) {
  //   return null;
  // },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};

/* *** 코드헬프부분 ** */
</script>
<style></style>
