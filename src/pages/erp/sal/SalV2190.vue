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
      <q-toolbar class="q-pt-none">
        <div class="row q-gutter-lg">
          <q-input stack-label readonly v-model="searchValue.yymm" label="매출년월" label-color="orange" style="width: 130px" class="text-subtitle1">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer q-pt-md" @click="beforeYymm = null" />
            </template>
            <q-popup-proxy v-model="showDatePopupYymm" transition-show="scale" transition-hide="scale">
              <q-date
                minimal
                v-model="searchValue.yymm"
                mask="YYYY년 MM월"
                type="month"
                color="orange"
                default-view="Years"
                options-override="month"
                @navigation="onNavigation('yymm', $event)"
              />
            </q-popup-proxy>
          </q-input>

          <q-input
            stack-label
            readonly
            v-model="searchValue.billDay"
            label="발행일자"
            label-color="orange"
            style="width: 130px"
            class="text-subtitle1"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer q-pt-md" />
            </template>
            <q-popup-proxy v-model="showDatePopupDay" transition-show="scale" transition-hide="scale">
              <q-date minimal v-model="searchValue.billDay" mask="YYYY-MM-DD" color="orange" @update:model-value="onDateSelectDay" />
            </q-popup-proxy>
          </q-input>

          <q-toggle
            class="q-pt-md"
            v-model="searchValue.billYn"
            checked-icon="check"
            color="red"
            true-value="Y"
            false-value=""
            label="계산서유무"
            left-label
            unchecked-icon="clear"
          />
          <!--        <q-toggle size="sm" color="blue-14" true-value="Y" false-value="N" v-model="searchValue.billYn" @update:model-value="handleUpdate"> </q-toggle>-->
        </div>
        <q-space />
        <div class="q-gutter-xs">
          <q-btn outline color="grey" @click="handelGetData" class="q-px-sm">
            <q-icon name="search" size="xs" class="q-mr-xs" />
            조회
          </q-btn>

          <q-btn v-if="!$q.screen.xs" :disable="rowData.rows.length === 0" outline color="teal" @click="isExcelDownload" class="q-px-sm">
            <q-icon name="download" size="xs" class="q-mr-xs" />
            엑셀
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
import * as XLSX from 'xlsx';
import { date, QBtn, QIcon, QToggle, SessionStorage, useQuasar } from 'quasar';
import commUtil from 'src/js_comm/comm-util';
import HelpCust from 'components/subvue/HelpCust.vue';

const rowData = reactive({ rows: [], rowsSum: [] });
const isDialogVisible = ref(false);

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

const showDatePopupYymm = ref(false);
const showDatePopupDay = ref(false);

const beforeYymm = ref(null);
const onNavigation = (fg, date) => {
  searchValue[fg] = date.year + '년 ' + commUtil.getDataWithZero(date.month, 2) + '월';

  if (!beforeYymm.value) {
    showDatePopupYymm.value = false;
    beforeYymm.value = date;
  } else {
    beforeYymm.value = date;
  }
};

const onDateSelectDay = newValue => {
  const [year, month, day] = newValue.split('-');
  console.log('Selected Year-Month1:', newValue, showDatePopupDay.value);
  showDatePopupDay.value = false;
};

function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 175}px`,
}));

const searchPeriod = ref({ from: commUtil.getToday(), to: commUtil.getToday() });
const searchValue = reactive({
  period: { from: commUtil.getToday(), to: commUtil.getToday() },
  year: commUtil.getTodayYear(),
  month: commUtil.getTodayMonth(),
  yymm: commUtil.getTodayYear() + '년 ' + commUtil.getTodayMonth() + '월',
  // yymm: '2024' + '년 ' + '11' + '월',
  billDay: commUtil.getToday(),
  textValue: '',
  billYn: 'Y',
  dealFgOptions: [],
  custCd: '',
  custNm: '',
  prodCd: '',
});
// 모델 값 감시
watch(searchPeriod, newVal => {
  if (typeof newVal === 'object' && newVal !== null && !Array.isArray(newVal)) {
    console.log('기간 선택됨:', newVal.from, '부터', newVal.to, '까지');
    searchValue.period.from = newVal.from;
    searchValue.period.to = newVal.to;
  } else {
    console.log('하루만 선택됨:', newVal);
    searchValue.period.from = newVal;
    searchValue.period.to = newVal;
  }
});

const columnDefs = ref([
  {
    headerName: '#',
    field: '',
    minWidth: 70,
    maxWidth: 80,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    sortable: true,
    filter: false,
    valueGetter: function (params) {
      if (params.data.custCd === undefined) {
        return '합계';
      } else {
        return params.node.rowIndex + 1;
      }
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '계산서종류',
    field: 'billDiv',
    minWidth: 110,
  },
  {
    headerName: '작성일자',
    field: 'billDay',
    minWidth: 120,
    valueGetter: params => {
      if (params.data.billDay && params.data.billDay.length === 8) {
        return `${params.data.billDay.slice(0, 4)}-${params.data.billDay.slice(4, 6)}-${params.data.billDay.slice(6)}`;
      }
      return params.data.billDay;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '공급자등록번호',
    field: 'compBusinNo',
    minWidth: 140,
    valueGetter: params => {
      if (params.data.compBusinNo && params.data.compBusinNo.length === 10) {
        return `${params.data.compBusinNo.slice(0, 3)}-${params.data.compBusinNo.slice(3, 5)}-${params.data.compBusinNo.slice(5)}`;
      }
      return params.data.compBusinNo;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '종사업장번호',
    field: 'compJongNo',
    minWidth: 120,
  },
  {
    headerName: '공급자상호',
    field: 'compBusinNm',
    minWidth: 130,
  },
  {
    headerName: '공급자성명',
    field: 'compBusinOwner',
    minWidth: 110,
  },
  {
    headerName: '사업장주소',
    field: 'compBusinAddr',
    minWidth: 200,
  },
  {
    headerName: '업태',
    field: 'compBusinCond',
    minWidth: 100,
  },
  {
    headerName: '종목',
    field: 'compBusinKind',
    minWidth: 100,
  },
  {
    headerName: '이메일',
    field: 'compBusinEmail',
    minWidth: 120,
  },
  {
    headerName: '공급받는자등록번호',
    field: 'custBusinNo',
    minWidth: 160,
    valueGetter: params => {
      if (params.data.custBusinNo && params.data.custBusinNo.length === 10) {
        return `${params.data.custBusinNo.slice(0, 3)}-${params.data.custBusinNo.slice(3, 5)}-${params.data.custBusinNo.slice(5)}`;
      }
      return params.data.custBusinNo;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '종사업장번호',
    field: 'custJongNo',
    minWidth: 120,
  },
  {
    headerName: '공급받는자상호',
    field: 'custBusinNm',
    minWidth: 140,
  },
  {
    headerName: '공급받는자성명',
    field: 'custOwner',
    minWidth: 140,
  },
  {
    headerName: '사업장주소',
    field: 'custAddr',
    minWidth: 200,
  },
  {
    headerName: '업태',
    field: 'custCond',
    minWidth: 100,
  },
  {
    headerName: '종목',
    field: 'custKind',
    minWidth: 100,
  },
  {
    headerName: '이메일1',
    field: 'custEmail1',
    minWidth: 120,
  },
  {
    headerName: '이메일2',
    field: 'custEmail2',
    minWidth: 100,
  },
  {
    headerName: '공급가액',
    field: 'sAmt',
    minWidth: 130,
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
    minWidth: 100,
  },

  {
    headerName: '일자1',
    field: 'billDD',
    minWidth: 90,
  },
  {
    headerName: '품목1',
    field: 'compBillProdNm',
    minWidth: 120,
  },
  {
    headerName: '규격1',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '수량1',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '단가1',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '공급가액1',
    field: 'sAmt',
    minWidth: 130,
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
    headerName: '품목비고1',
    field: '',
    minWidth: 110,
  },

  {
    headerName: '일자2',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '품목2',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '규격2',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '수량2',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '단가2',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '공급가액2',
    field: '',
    minWidth: 110,
  },
  {
    headerName: '품목비고2',
    field: '',
    minWidth: 110,
  },

  {
    headerName: '일자3',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '품목3',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '규격3',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '수량3',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '단가3',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '공급가액3',
    field: '',
    minWidth: 110,
  },
  {
    headerName: '품목비고3',
    field: '',
    minWidth: 110,
  },

  {
    headerName: '일자4',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '품목4',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '규격4',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '수량4',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '단가4',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '공급가액4',
    field: '',
    minWidth: 110,
  },
  {
    headerName: '품목비고4',
    field: '',
    minWidth: 110,
  },
  {
    headerName: '현금',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '수표',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '어금',
    field: '',
    minWidth: 90,
  },
  {
    headerName: '외상미수금',
    field: '',
    minWidth: 110,
  },
  {
    headerName: '영수/청구',
    field: 'billFg',
    minWidth: 110,
  },
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData();
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

const setCompZone = ref({
  businNm: '(주)이즈지온', // 공급자 상호
  businNo: '1112233333', // 공급자 사업자등록번호
  businOwner: '홍길동', // 공급자 대표
  businEmail: 'aaaa@iscom.com', // 공급자 이메일
  businAddr: '경기도 고양시 일산동구', // 사업장
  businCond: '도소매', // 업태
  businKind: '도서', // 종목
  billDiv: '05', // 계산서종류
  billJongNo: '', // 종사업장번호
  billDay: commUtil.unFormatDate(searchValue.billDay), // 발행일자
  billFg: '02', // 영수,청구
  billProdNm: '도서대', //적요
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const getData = async () => {
  const match = searchValue.yymm.match(/^(\d{4})년 (\d{1,2})월$/);
  if (match) {
    searchValue.year = match[1]; // 추출된 년도
    searchValue.month = String(match[2]).padStart(2, '0'); // 추출된 월 및 2자리로 패딩
    try {
      const response = await api.post('/api/sal/sal2190_list', {
        paramYear: searchValue.year,
        paramMonth: searchValue.month,
        paramBillYn: searchValue.billYn,
        paramCompZone: setCompZone.value,
      });
      rowData.rows = response.data.data;
      myGrid.value.api.setGridOption('rowData', rowData.rows);
      myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  } else {
    console.log('Invalid date format');
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
// *********************************
// rows 전체 합 구하는 부분
const totalRow = ref({
  custNm: '합계',
  oQty: 0,
  oAmt: 0,
  jQty: 0,
  bQty: 0,
  bAmt: 0,
  sAmt: 0,
});

const calculateTotal = () => {
  let totRow = {
    custNm: '합계',
    oQty: 0,
    oAmt: 0,
    jQty: 0,
    bQty: 0,
    bAmt: 0,
    sAmt: 0,
  };

  rowData.rows.forEach(row => {
    totRow.oQty += row.oQty || 0;
    totRow.oAmt += row.oAmt || 0;
    totRow.jQty += row.jQty || 0;
    totRow.bQty += row.bQty || 0;
    totRow.bAmt += row.bAmt || 0;
    totRow.sAmt += row.sAmt || 0;
  });

  totalRow.value.oQty = totRow.oQty;
  totalRow.value.oAmt = totRow.oAmt;
  totalRow.value.jQty = totRow.jQty;
  totalRow.value.bQty = totRow.bQty;
  totalRow.value.bAmt = totRow.bAmt;
  totalRow.value.sAmt = totRow.sAmt;

  return totRow;
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
    // if (event.data.custsCd === '총계') {
    //   return { backgroundColor: 'rgba(0,181,117,0.24)', fontWeight: 'bold' }; // 예: 연한 주황색
    // }
    // if (event.data.prodCd === '지점계') {
    //   return { backgroundColor: 'rgba(3,147,5,0.22)' }; // 예: 연한 파란색
    // }
    // dealDay가 undefined이면 행 배경색 변경 및 "합계" 삽입
    return null; // 기본 스타일
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (event) {
    // 고정된 행의 높이
    if (event.node.rowPinned) {
      return 35;
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
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};

/* *** 코드헬프부분 ** */
const openHelpCustDialog = resNm => {
  $q.dialog({
    component: HelpCust,
    componentProps: {
      paramValueNm: resNm,
      paramUseYn: 'N',
      paramCloseDay: '99991231',
    },
  })
    .onOk(res => {
      searchValue.custCd = res.custCd;
      searchValue.custNm = res.custNm;
      getData();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

// ******* 그리드 페이지 처리
const totalPages = ref(0); // 총 페이지 수
const currentPages = ref(1); // 현재 처리하는 페이지
const currentGroup = ref(5); // 화면에 보여줄 최대 페이지 수

const pagination = reactive({
  pageRows: 30,
  startRowNum: 0,
  pageOption: [10, 20, 30, 50, 100, 300, 500, 1000],
});

const handlePageChange = newPage => {
  // console.log(`Current Page: ${newPage}`);
  pagination.startRowNum = (newPage - 1) * pagination.pageRows;
  currentPages.value = newPage;
  // myGrid.value.api.paginationGoToPage(newPage - 1);
  getData();
};

/* ************************************************************************* *
 ** Excel저장  처리부분
 ** ************************************************************************* */
const isExcelDownload = () => {
  $q.dialog({
    dark: true,
    title: 'Excel 저장',
    html: true,
    message: '엑셀 파일로 저장 하시겠습니까?',
    // persistent: true,
    ok: {
      label: '저장',
      color: 'primary',
    },
    cancel: {
      label: '닫기',
      color: 'secondary',
    },
  })
    .onOk(() => {
      excelDownload();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
const headerGroup = reactive({
  header: [],
  headProps: [
    'billDiv',
    'billDay',
    'compBusinNo',
    'compJongNo',
    'compBusinNm',
    'compBusinOwner',
    'compBusinAddr',
    'compBusinCond',
    'compBusinKind',
    'compBusinEmail',
    'custBusinNo',
    'custJongNo',
    'custBusinNm',
    'custOwner',
    'custAddr',
    'custCond',
    'custKind',
    'custEmail1',
    'custEmail2',
    'sAmt',
    'custRemarks',

    'DD1',
    'prodNm1',
    'prodSz1',
    'qty1',
    'price1',
    'amt1',
    'remarks1',

    'DD2',
    'prodNm2',
    'prodSz2',
    'qty2',
    'price2',
    'amt2',
    'remarks2',

    'DD3',
    'prodNm3',
    'prodSz3',
    'qty3',
    'price3',
    'amt3',
    'remarks3',

    'DD4',
    'prodNm4',
    'prodSz4',
    'qty4',
    'price4',
    'amt4',
    'remarks4',

    'xAmt1',
    'xAmt2',
    'xAmt3',
    'xAmt4',

    'billFg',
  ],
  headRow1: [
    { name: '계산서종류', rowspan: 1, colspan: 1, key: 'billDiv' },
    { name: '작성일자', rowspan: 1, colspan: 1, key: 'billDay' },
    { name: '공급자등록번호', rowspan: 1, colspan: 1, key: 'compBusinNo' },
    { name: '종사업장번호', rowspan: 1, colspan: 1, key: 'compJongNo' },
    { name: '공급자상호', rowspan: 1, colspan: 1, key: 'compBusinNm' },
    { name: '공급자성명', rowspan: 1, colspan: 1, key: 'compBusinOwner' },
    { name: '사업장주소', rowspan: 1, colspan: 1, key: 'compBusinAddr' },
    { name: '업태', rowspan: 1, colspan: 1, key: 'compBusinCond' },
    { name: '종목', rowspan: 1, colspan: 1, key: 'compBusinKind' },
    { name: '이메일', rowspan: 1, colspan: 1, key: 'compBusinEmail' },
    { name: '공급받는자등록번호', rowspan: 1, colspan: 1, key: 'custBusinNo' },
    { name: '종사업장번호', rowspan: 1, colspan: 1, key: 'custJongNo' },
    { name: '공급받는자상호', rowspan: 1, colspan: 1, key: 'custBusinNm' },
    { name: '공급받는자성명', rowspan: 1, colspan: 1, key: 'custOwner' },
    { name: '사업장주소', rowspan: 1, colspan: 1, key: 'custAddr' },
    { name: '업태', rowspan: 1, colspan: 1, key: 'custCond' },
    { name: '종목', rowspan: 1, colspan: 1, key: 'custKind' },
    { name: '이메일1', rowspan: 1, colspan: 1, key: 'custEmail1' },
    { name: '이메일2', rowspan: 1, colspan: 1, key: 'custEmail2' },
    { name: '공급가액', rowspan: 1, colspan: 1, key: 'sAmt' },
    { name: '비고', rowspan: 1, colspan: 1, key: 'custRemarks' },

    { name: '일자1', rowspan: 1, colspan: 1, key: 'DD1' },
    { name: '품목1', rowspan: 1, colspan: 1, key: 'prodNm1' },
    { name: '규격1', rowspan: 1, colspan: 1, key: 'prodSz1' },
    { name: '수량1', rowspan: 1, colspan: 1, key: 'qty1' },
    { name: '단가1', rowspan: 1, colspan: 1, key: 'price1' },
    { name: '공급가액1', rowspan: 1, colspan: 1, key: 'amt1' },
    { name: '품목비고1', rowspan: 1, colspan: 1, key: 'remarks1' },

    { name: '일자2', rowspan: 1, colspan: 1, key: 'DD2' },
    { name: '품목2', rowspan: 1, colspan: 1, key: 'prodNm2' },
    { name: '규격2', rowspan: 1, colspan: 1, key: 'prodSz2' },
    { name: '수량2', rowspan: 1, colspan: 1, key: 'qty2' },
    { name: '단가2', rowspan: 1, colspan: 1, key: 'price2' },
    { name: '공급가액2', rowspan: 1, colspan: 1, key: 'amt2' },
    { name: '품목비고2', rowspan: 1, colspan: 1, key: 'remarks2' },

    { name: '일자3', rowspan: 1, colspan: 1, key: 'DD3' },
    { name: '품목3', rowspan: 1, colspan: 1, key: 'prodNm3' },
    { name: '규격3', rowspan: 1, colspan: 1, key: 'prodSz3' },
    { name: '수량3', rowspan: 1, colspan: 1, key: 'qty3' },
    { name: '단가3', rowspan: 1, colspan: 1, key: 'price3' },
    { name: '공급가액3', rowspan: 1, colspan: 1, key: 'amt3' },
    { name: '품목비고3', rowspan: 1, colspan: 1, key: 'remarks3' },

    { name: '일자4', rowspan: 1, colspan: 1, key: 'DD4' },
    { name: '품목4', rowspan: 1, colspan: 1, key: 'prodNm4' },
    { name: '규격4', rowspan: 1, colspan: 1, key: 'prodSz4' },
    { name: '수량4', rowspan: 1, colspan: 1, key: 'qty4' },
    { name: '단가4', rowspan: 1, colspan: 1, key: 'price4' },
    { name: '공급가액4', rowspan: 1, colspan: 1, key: 'amt4' },
    { name: '품목비고4', rowspan: 1, colspan: 1, key: 'remarks4' },

    { name: '현금', rowspan: 1, colspan: 1, key: 'xAmt1' },
    { name: '수표', rowspan: 1, colspan: 1, key: 'xAmt2' },
    { name: '어음', rowspan: 1, colspan: 1, key: 'xAmt3' },
    { name: '외상미수금', rowspan: 1, colspan: 1, key: 'xAmt4' },
    { name: '영수/청구', rowspan: 1, colspan: 1, key: 'billFg' },
  ],
  // headRow2: [
  //   { name: '소속', rowspan: 1, colspan: 1, key: 'deptNm' },
  //   { name: '직급', rowspan: 1, colspan: 1, key: 'titlNm' },
  //   { name: '목표내용', rowspan: 1, colspan: 1, key: 'targetDoc' },
  //   { name: '성과내용', rowspan: 1, colspan: 1, key: 'workDoc' },
  //   { name: '평가점수', rowspan: 1, colspan: 1, key: 'selfPoint' },
  //   { name: '환산점수', rowspan: 1, colspan: 1, key: 'selfPointX' },
  //   { name: '평가점수', rowspan: 1, colspan: 1, key: 'markPoint' },
  //   { name: '환산점수', rowspan: 1, colspan: 1, key: 'markPointX' },
  // ],
});

const excelDownload = () => {
  headerGroup.header = [];
  headerGroup.header.push(headerGroup.headRow1);
  // headerGroup.header.push(headerGroup.headRow2);

  let options = {
    header: headerGroup.header,
    headProps: headerGroup.headProps,
  };
  excelExport(rowData.rows, options);
};

const visibleHeadProps = ref([]);
const instance = ref(undefined);
const excelExport = (data, options) => {
  let headProps = [];
  if (Array.isArray(options.headProps)) {
    headProps = options.headProps;
  } else if (options.headProps === 'header') {
    for (let h of headerGroup.header) {
      headProps.push(h.key);
    }
  } else {
    headProps = Object.keys(data[0]);
  }
  visibleHeadProps.value = headerGroup.headProps;

  instance.value = document.createElement('table');

  // Header 세팅
  let headerRows = [];
  if (!Array.isArray(headerGroup.header[0])) {
    headerRows.push(headerGroup.header);
  } else {
    headerRows = headerGroup.header;
  }
  let thead = document.createElement('thead');
  for (let row of headerRows) {
    let tr = document.createElement('tr');
    for (let h of row) {
      let rowspan = h.rowspan || '1';
      let colspan = h.colspan || '1';
      let th = document.createElement('th');
      th.setAttribute('rowspan', rowspan);
      th.setAttribute('colspan', colspan);
      th.innerText = h.name;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  }
  instance.value.appendChild(thead);

  // Body 세팅
  let tbody = document.createElement('tbody');
  for (let row of data) {
    let tr = document.createElement('tr');
    let isExcelWrite = true;
    for (let cellkey of visibleHeadProps.value) {
      // 조건에 맞는 자료는 제외하는 부분
      // if (cellkey === 'custsCd' && row[cellkey] === '총계') {
      //   isExcelWrite = false;
      //   break; // CNT가 undefined인 경우 해당 row를 건너뜀
      // }
      // if (cellkey === 'prodCd' && row[cellkey] === '지점계') {
      //   isExcelWrite = false;
      //   break; // CNT가 undefined인 경우 해당 row를 건너뜀
      // }
      // 조건에 맞는 자료는 제외하는 부분 끝

      let td = document.createElement('td');
      td.innerText = row[cellkey];
      tr.appendChild(td);
    }
    if (isExcelWrite) {
      tbody.appendChild(tr);
    }
  }
  instance.value.appendChild(tbody);

  // instance에 만들어진 table을 엑셀파일로 저장
  const config = { raw: true, type: 'string' };
  const ws = XLSX.utils.table_to_sheet(instance.value, config);

  // Set red color to A1 cell
  ws['A1'].s = {
    font: {
      color: { rgb: 'FF0000' }, // Red color
      bold: true,
    },
  };

  // Add borders to all cells
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        border: {
          // top: { style: 'thin', color: { auto: 1 } },
          // bottom: { style: 'thin', color: { auto: 1 } },
          // left: { style: 'thin', color: { auto: 1 } },
          // right: { style: 'thin', color: { auto: 1 } },
          top: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          bottom: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          left: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          right: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
        },
      };
    }
  }

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, menuLabel.value);
  XLSX.writeFile(wb, menuLabel.value + '.xlsx');
};
</script>
<style></style>
