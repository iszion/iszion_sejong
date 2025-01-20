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
          <q-field label="출고기간" stack-label label-color="orange">
            <template v-slot:control>
              <div class="self-end full-width no-outline text-bold" tabindex="0">{{ searchValue.period.from }} ~ {{ searchValue.period.to }}</div>
            </template>

            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer self-end">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" anchor="bottom left" self="top left" fit>
                  <q-date minimal range v-model="searchPeriod" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn :disable="searchValue.period.from === null" v-close-popup label="선택하기" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-field>

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
          <sal-v4410p :messages="{ rowData: rowData, titleNm: menuLabel, searchValue: searchValue }" @close="handleClose" />
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
import SalV4410p from 'pages/erp/sal/SalV4410p.vue';
import commUtil from 'src/js_comm/comm-util';

const rowData = reactive({ rows: [], rowsSum: [] });
const isDialogVisible = ref(false);

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

const showDatePopupDay = ref(false);
const onDateSelectDay = () => {
  showDatePopupDay.value = false;
  searchValue.stdDayM6 = commUtil.getPreviousMonthDate(commUtil.unFormatDate(searchValue.period.to), 6);
  searchValue.stdDayM12 = commUtil.getPreviousMonthDate(commUtil.unFormatDate(searchValue.period.to), 12);
  searchValue.titleM1 = commUtil.unFormatDate(searchValue.period.from).substring(2) + '~' + commUtil.unFormatDate(searchValue.period.to).substring(2);
  searchValue.titleM6 = searchValue.stdDayM6.toString().substring(2) + '~' + commUtil.unFormatDate(searchValue.period.to).substring(2);
  searchValue.titleM12 = searchValue.stdDayM12.toString().substring(2) + '~' + commUtil.unFormatDate(searchValue.period.to.substring(2));
  searchValue.titleTot = '발간일~' + commUtil.unFormatDate(searchValue.period.to.substring(2));
  // console.log('m1 : ', searchValue.titleM1);
  // console.log('m6 : ', searchValue.titleM6);
  // console.log('m12 : ', searchValue.titleM12);
  // console.log('tot: ', searchValue.titleTot);
};

function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 160}px`,
}));

const searchPeriod = ref({ from: commUtil.getToday(), to: commUtil.getToday() });
const searchValue = reactive({
  period: { from: commUtil.getToday(), to: commUtil.getToday() },
  stdDayM6: '',
  stdDayM12: '',
  textValue: '',
  prodDivOptions: [],
  prodDiv: '1011101',
  titleM1: '',
  titleM6: '',
  titleM12: '',
  titleTot: '',
});
// 모델 값 감시
watch(searchPeriod, newVal => {
  if (typeof newVal === 'object' && newVal !== null && !Array.isArray(newVal)) {
    // console.log('기간 선택됨:', newVal.from, '부터', newVal.to, '까지');
    searchValue.period.from = newVal.from;
    searchValue.period.to = newVal.to;
  } else {
    // console.log('하루만 선택됨:', newVal);
    searchValue.period.from = newVal;
    searchValue.period.to = newVal;
  }
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
    headerName: '저자',
    field: 'authorNm',
    minWidth: 200,
    resizable: true,
    valueGetter: function (params) {
      return params.data.authorNm;
    },
  },
  {
    headerName: '쪽수',
    field: 'p1Page',
    minWidth: 100,
    resizable: true,
    valueGetter: function (params) {
      return params.data.p1Page;
    },
  },
  {
    headerName: '선인세',
    field: 'sAmt',
    minWidth: 100,
    maxWidth: 100,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 1, // 최소 소수점 자리수
          maximumFractionDigits: 1, // 최대 소수점 자리수
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
    headerName: '선서자',
    field: 'sunNm',
    minWidth: 100,
    resizable: true,
    valueGetter: function (params) {
      return params.data.sunNm;
    },
  },
  {
    headerName: '총제작누계',
    field: 'itotQty',
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
    headerName: '재고',
    field: 'stockQty',
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
    headerName: '순 출고부수 (배본수량 포함)',
    children: [
      {
        headerName: '기간누계',
        children: [
          {
            headerName: searchValue.period.from + '~' + searchValue.period.to,
            field: 'm1Qty',
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
        headerName: '6개월누계',
        children: [
          {
            headerName: searchValue.stdDayM12 + '~' + searchValue.period.to,
            field: 'm6Qty',
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
        headerName: '12개월누계',
        children: [
          {
            headerName: searchValue.stdDayM12 + '~' + searchValue.period.to,
            field: 'm12Qty',
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
        headerName: '총순출고누계',
        children: [
          {
            headerName: '발간일~' + searchValue.period.to,
            field: 'totQty',
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
    ],
  },

  {
    headerName: '저작권사',
    field: 'copyrightNm',
    minWidth: 150,
    resizable: true,
    valueGetter: function (params) {
      return params.data.copyrightNm;
    },
  },

  {
    headerName: '에이젠트',
    field: 'agentNm',
    minWidth: 150,
    resizable: true,
    valueGetter: function (params) {
      return params.data.agentNm;
    },
  },
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  onDateSelectDay();
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

const changeHeaderName = () => {
  onDateSelectDay();
  const updateHeaderName = columns => {
    return columns.map(colDef => {
      if (colDef.field === 'm1Qty') {
        return { ...colDef, headerName: searchValue.titleM1 };
      }
      if (colDef.field === 'm6Qty') {
        return { ...colDef, headerName: searchValue.titleM6 };
      }
      if (colDef.field === 'm12Qty') {
        return { ...colDef, headerName: searchValue.titleM12 };
      }
      if (colDef.field === 'totQty') {
        return { ...colDef, headerName: searchValue.titleTot };
      }
      if (colDef.children) {
        // children 속성을 재귀적으로 업데이트
        return { ...colDef, children: updateHeaderName(colDef.children) };
      }
      return colDef;
    });
  };

  columnDefs.value = updateHeaderName(columnDefs.value);

  if (myGrid.value) {
    myGrid.value.api.setColumnDefs(columnDefs.value);
  }
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  changeHeaderName();
  try {
    const response = await api.post('/api/sal/sal4410_list', {
      paramPeriodFrom: commUtil.unFormatDate(searchValue.period.from),
      paramPeriodTo: commUtil.unFormatDate(searchValue.period.to),
      paramStdDayM6: searchValue.stdDayM6,
      paramStdDayM12: searchValue.stdDayM12,
      paramProdDiv: searchValue.prodDiv,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setColumnDefs(columnDefs.value);
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    // console.log('data : ', JSON.stringify(rowData.rows));
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
    itotQty: 0,
    stockQty: 0,
    m1Qty: 0,
    m6Qty: 0,
    m12Qty: 0,
    totQty: 0,
    sAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.itotQty += row.itotQty || 0;
    totalRow.stockQty += row.stockQty || 0;
    totalRow.m1Qty += row.m1Qty || 0;
    totalRow.m6Qty += row.m6Qty || 0;
    totalRow.m12Qty += row.m12Qty || 0;
    totalRow.totQty += row.totQty || 0;
    totalRow.sAmt += row.sAmt || 0;
  });

  const hasMeaningfulData =
    totalRow.itotQty !== 0 ||
    totalRow.stockQty !== 0 ||
    totalRow.m1Qty !== 0 ||
    totalRow.m6Qty !== 0 ||
    totalRow.m12Qty !== 0 ||
    totalRow.totQty !== 0 ||
    totalRow.sAmt !== 0;

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
