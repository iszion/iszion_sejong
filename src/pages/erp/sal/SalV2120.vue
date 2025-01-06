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

          <q-input
            stack-label
            class=""
            v-model="searchValue.prodNm"
            label="도서명"
            label-color="orange"
            @keyup.enter.prevent="openHelpProdDialog(searchValue.prodNm)"
          >
            <template v-slot:prepend>
              <q-btn dense flat class="q-mt-md text-bold" icon="search" size="md" :label="searchValue.prodCd" @click="openHelpProdDialog('')" />
            </template>
            <template v-slot:append>
              <q-icon
                size="0.8em"
                v-if="searchValue.prodNm !== ''"
                name="close"
                @click="
                  searchValue.prodNm = '';
                  searchValue.prodCd = '';
                  handelGetData();
                "
                class="cursor-pointer q-pt-md"
              />
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
          <sal-v2120p
            :messages="{ rowData: rowData.rows, titleNm: menuLabel, dealDayFrom: searchValue.period.from, dealDayTo: searchValue.period.to }"
            @close="handleClose"
          />
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
import { date, QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import { useYearInfoStore } from 'src/store/setYearInfo';
import SalV2120p from 'pages/erp/sal/SalV2120p.vue';
import commUtil from 'src/js_comm/comm-util';
import HelpCust from 'components/subvue/HelpCust.vue';
import HelpProd from 'components/subvue/HelpProd.vue';

const storeYear = useYearInfoStore();

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

const searchPeriod = ref({ from: commUtil.getToday(), to: commUtil.getToday() });
const searchValue = reactive({
  period: { from: commUtil.getToday(), to: commUtil.getToday() },
  textValue: '',
  dealFgOptions: [],
  prodNm: '',
  prodCd: '',
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
  // {
  //   headerName: '#',
  //   field: 'rowNum',
  //   minWidth: 70,
  //   maxWidth: 80,
  //   pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  //   sortable: true,
  //   filter: false,
  //   // valueGetter: function (params) {
  //   // return params.node.rowIndex + 1;
  //   // if (params.data.cnt === undefined) {
  //   //   return '';
  //   // } else {
  //   // return params.data.rowNum;
  //   // }
  //   // },
  //   cellStyle: params => {
  //     return { textAlign: 'center' };
  //   },
  // },
  {
    headerName: '거래일자',
    field: 'saleDay',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    minWidth: 130,
    maxWidth: 130,
    valueGetter: params => {
      if (params.data.saleDay === '00000000') {
        return '이월재고'; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleYm === '총계') {
        return '총계'; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleDay === '월계') {
        return '월계'; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.custNm === '일계') {
        return '일계'; // dealDay가 undefined일 경우 '합계'로 설정
      }
      if (params.data.saleDay && params.data.saleDay.length === 8) {
        return `${params.data.saleDay.slice(0, 4)}-${params.data.saleDay.slice(4, 6)}-${params.data.saleDay.slice(6)}`;
      }
      return params.data.saleDay;
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
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      if (params.data.saleDay === '00000000') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleYm === '총계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleDay === '월계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.custNm === '일계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
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
      if (params.data.saleDay === '00000000') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleYm === '총계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleDay === '월계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.custNm === '일계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      }
      return params.data.custCd;
    },
  },
  {
    headerName: '구분',
    field: 'fgNm',
    minWidth: 80,
    maxWidth: 80,
    valueGetter: function (params) {
      if (params.data.saleDay === '00000000') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleYm === '총계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleDay === '월계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.custNm === '일계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      }
      return params.data.fgNm;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },

  {
    headerName: '입고',
    children: [
      {
        headerName: '입고',
        field: 'iQty',
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
        headerName: '재생',
        field: 'ibQty',
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
    ],
  },
  {
    headerName: '출고',
    children: [
      {
        headerName: '출고',
        field: 'oQty',
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
        headerName: '증정',
        field: 'ojQty',
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
        headerName: '반품',
        field: 'obQty',
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
        headerName: '폐기',
        field: 'oxQty',
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
    ],
  },
  {
    headerName: '재고조정',
    field: 'ozQty',
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
    headerName: '재고',
    field: 'jQty',
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
    headerName: '비고',
    field: 'remarks',
    minWidth: 150,
    resizable: true,
    valueGetter: function (params) {
      if (params.data.saleDay === '00000000') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleYm === '총계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.saleDay === '월계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      } else if (params.data.custNm === '일계') {
        return ''; // dealDay가 undefined일 경우 '합계'로 설정
      }
      return params.data.remarks;
    },
  },
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataCommOption('402').then(() => {
    handelGetData();
  });
});

const handelGetData = () => {
  // getDataMaxPages().then(() => {
  getData();
  // });
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
    const response = await api.post('/api/sal/sal2120_list', {
      paramPeriodFrom: commUtil.unFormatDate(searchValue.period.from),
      paramPeriodTo: commUtil.unFormatDate(searchValue.period.to),
      paramProdCd: searchValue.prodCd,
      // paramPeriodFrom: '20241101',
      // paramPeriodTo: '20241231',
      // paramProdCd: '4457',
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    // myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    console.log('data : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 공통코드정보 가져오기 부분  *****************************//
const getDataCommOption = async resCommCd1 => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });

    switch (resCommCd1) {
      case '402':
        searchValue.dealFgOptions = JSON.parse(JSON.stringify(response.data.data));
        searchValue.dealFgOptions.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        searchValue.dealFgOptions = [];
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
    if (event.data.saleDay === '00000000') {
      return { backgroundColor: 'rgba(0,181,117,0.24)', fontWeight: 'bold' }; // 예: 연한 주황색
    }
    if (event.data.custNm === '일계') {
      return { backgroundColor: 'rgba(1,127,194,0.17)' }; // 예: 연한 파란색
    }
    if (event.data.custNm === '총계') {
      return { backgroundColor: 'rgba(3,147,5,0.22)' }; // 예: 연한 파란색
    }
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
  headerHeight: 30, // 헤더 행 높이를 50px로 설정
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
  // pinnedBottomRowData: [calculateTotal()],
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

/* *** 코드헬프부분 ** */
const openHelpProdDialog = resNm => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: searchValue.prodNm,
      paramUseYn: 'N',
      paramCloseDay: '99991231',
    },
  })
    .onOk(res => {
      searchValue.prodNm = res.prodNm;
      searchValue.prodCd = res.prodCd;
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
</script>
<style></style>
