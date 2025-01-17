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

          <q-input
            stack-label
            class=""
            style="width: 300px"
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
                  searchValue.sPrice = '';
                  handelGetData();
                "
                class="cursor-pointer q-pt-md"
              />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="row q-gutter-x-xs q-gutter-y-md self-end">
          <q-btn outline color="grey" @click="handelGetData" class="q-px-sm">
            <q-icon name="search" size="xs" class="q-mr-xs" />
            조회
          </q-btn>

          <q-btn v-if="!$q.screen.xs" :disable="rowData.rows.length === 0" outline color="teal" @click="handlePrint" class="q-px-sm">
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
          <sal-v4210p
            :messages="{
              rowData: rowData,
              titleNm: menuLabel,
              searchValue: searchValue,
            }"
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { QBtn, QIcon, useQuasar } from 'quasar';
import SalV4210p from 'pages/erp/sal/SalV4210p.vue';
import commUtil from 'src/js_comm/comm-util';
import HelpCust from 'components/subvue/HelpCust.vue';
import HelpProd from 'components/subvue/HelpProd.vue';

const rowData = reactive({ rows: [], rowsSum: [] });
const isDialogVisible = ref(false);

const handlePrint = () => {
  isDialogVisible.value = true;
};
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
  textValue: '',
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
  prodNm: '',
  prodCd: '',
  sPrice: '',
});

const columnDefs = ref([
  {
    headerName: '기준일자',
    field: 'stockDay',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    minWidth: 150,
    maxWidth: 150,

    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '입고수량',
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
    headerName: '출고',
    children: [
      {
        headerName: '출고수량',
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
        headerName: '증정수량',
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
        headerName: '폐기수량',
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
    headerName: '출고계',
    field: 'otQty',
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
    headerName: '총재고',
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
    field: '',
    minWidth: 150,
    resizable: true,
  },
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {});

const handelGetData = () => {
  if (searchValue.prodCd === '' || searchValue.prodCd === null) {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '도서명을 선택하세요',
      // persistent: true,
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
    getData();
  }
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
    const response = await api.post('/api/sal/sal4210_list', {
      paramYear: searchValue.year,
      paramMonth: searchValue.month,
      paramProdCd: searchValue.prodCd,
    });
    // rowData.rows = response.data.data;
    rowData.rows = fillMissingDates(response.data.data, searchValue.year + '' + searchValue.month);

    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    // console.log('rowData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// 해당 월의 모든 날짜와 요일 생성
const generateMonthDates = yearMonth => {
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(4, 6), 10) - 1; // 월은 0부터 시작
  const dates = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    const day = date.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const fullDate = `${yearMonth}${day.toString().padStart(2, '0')}`;
    dates.push({ stockDay: fullDate, weekday });
    date.setDate(day + 1);
  }

  return dates;
};
const fillMissingDates = (data, yearMonth) => {
  // console.log('data : ', JSON.stringify(data));
  const allDates = generateMonthDates(yearMonth);
  // console.log('allDates : ', JSON.stringify(allDates));
  allDates.unshift({ stockDay: yearMonth + '' + '00', weekday: '' });

  // 데이터 맵핑
  const dataMap = new Map(data.map(d => [d.stockDay, d]));
  // 누락된 일자 채우기
  return allDates.map(({ stockDay, weekday }) => {
    // console.log(stockDay);
    return {
      stockDay: stockDay.endsWith('00') ? '전월이월' : stockDay,
      weekday: stockDay.endsWith('00') ? '' : weekday,
      ...dataMap.get(stockDay), // 기존 데이터 사용
      iQty: dataMap.get(stockDay)?.iQty || 0,
      oQty: dataMap.get(stockDay)?.oQty || 0,
      ojQty: dataMap.get(stockDay)?.ojQty || 0,
      oxQty: dataMap.get(stockDay)?.oxQty || 0,
      otQty: dataMap.get(stockDay)?.otQty || 0,
      ozQty: dataMap.get(stockDay)?.ozQty || 0,
      obQty: dataMap.get(stockDay)?.obQty || 0,
      jQty: dataMap.get(stockDay)?.jQty || 0,
    };
  });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    stockDay: '합계',
    iQty: 0,
    oQty: 0,
    ojQty: 0,
    oxQty: 0,
    otQty: 0,
    ozQty: 0,
    obQty: 0,
    jQty: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.iQty += row.iQty || 0;
    totalRow.oQty += row.oQty || 0;
    totalRow.ojQty += row.ojQty || 0;
    totalRow.oxQty += row.oxQty || 0;
    totalRow.otQty += row.otQty || 0;
    totalRow.ozQty += row.ozQty || 0;
    totalRow.obQty += row.obQty || 0;

    if (row.jQty !== 0) {
      totalRow.jQty = row.jQty;
    }
  });

  const hasMeaningfulData =
    totalRow.iQty > 0 ||
    totalRow.oQty > 0 ||
    totalRow.ojQty > 0 ||
    totalRow.oxQty > 0 ||
    totalRow.otQty > 0 ||
    totalRow.ozQty > 0 ||
    totalRow.obQty > 0 ||
    totalRow.jQty > 0;

  if (hasMeaningfulData) {
    rowData.rowsSum.push(totalRow);
  }

  return totalRow;
};
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
    if (event.data.weekday === '') {
      event.data.stockDay = '전월이월';
      return { backgroundColor: 'rgba(0,181,117,0.24)', fontWeight: 'bold' }; // 예: 연한 주황색
    } else {
      const _day = `${event.data.stockDay.slice(0, 4)}-${event.data.stockDay.slice(4, 6)}-${event.data.stockDay.slice(6)}`;
      if (event.data.weekday === '토') {
        event.data.stockDay = _day + ' (' + event.data.weekday + ')';
        return { backgroundColor: 'rgba(1,127,194,0.17)', color: 'blue' }; // 예: 연한 주황색
      }
      if (event.data.weekday === '일') {
        event.data.stockDay = _day + ' (' + event.data.weekday + ')';
        return { backgroundColor: 'rgba(147,3,3,0.11)', color: 'red' }; // 예: 연한 파란색
      }
      return (event.data.stockDay = _day + ' (' + event.data.weekday + ')'); // 기본 스타일
    }
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
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  // getRowNodeId: function (event) {
  // console.log('getRowNodeId');
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

const openHelpProdDialog = resNm => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: resNm,
      paramUseYn: 'N',
      paramCloseDay: '00000000',
    },
  })
    .onOk(res => {
      // console.log('help : ', JSON.stringify(res));
      searchValue.prodNm = res.prodNm;
      searchValue.prodCd = res.prodCd;
      searchValue.sPrice = res.sPrice;
      getData();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
</script>
<style></style>
