<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
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
    <q-separator class="q-mb-sm" color="cyan" size="0.2rem" />

    <q-card class="">
      <q-toolbar class="">
        <div class="row q-gutter-lg">
          <q-input
            stack-label
            label-color="orange"
            label="입금년도"
            class="text-subtitle1"
            v-model="searchValue.year"
            type="number"
            style="width: 80px"
            @update:model-value="getData"
          >
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>

          <q-input
            stack-label
            bottom-slots
            label-color="orange"
            v-model="searchValue.textValue"
            label="검색"
            class="q-pb-none"
            style="width: 150px"
            @keyup.enter="getData"
          >
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" class="cursor-pointer" />
            </template>
          </q-input>
          <q-btn outline class="self-end" color="grey" icon="refresh" label="다시불러오기" @click="getData" />
        </div>
        <q-space />
        <div class="row q-gutter-sm self-end">
          <div class="q-gutter-xs">
            <!--            <q-btn outline color="primary" icon="add" label="라인추가" @click="addDataDetailsRowSection('first')" />-->
            <!--            <q-btn outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow">-->
            <!--              <q-badge v-show="removeRowsCount > 0" color="red" floating>{{ removeRowsCount }}</q-badge>-->
            <!--            </q-btn>-->
          </div>
          <div class="q-gutter-xs">
            <q-btn outline color="primary" icon="save" label="저장" @click="saveDataSection">
              <q-badge v-show="saveRowsCount + delRowsCount > 0" color="red" floating>{{ saveRowsCount + delRowsCount }}</q-badge>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
      <!--  end of contents list title bar -->
      <q-card-section class="q-pa-sm">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            ref="myGrid"
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :grid-options="gridOptions"
            @compositionstart="handleComposition"
            @compositionend="handleComposition"
            @compositionupdate="handleComposition"
          >
          </ag-grid-vue>
        </div>
      </q-card-section>
    </q-card>
    <!--  end of contents list  (좌측 화면) -->
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import HelpCust from 'components/subvue/HelpCust.vue';
import CompHelpCustButton from 'components/CompHelpCustButton.vue';
import JsonUtil from 'src/js_comm/json-util';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);
const billUse = ref(false);

const showDatePopupYymm = ref(false);
const maxSeq = ref(0);
const onDateSelectYymm = newValue => {
  const [year, month] = newValue.split('-');
  showDatePopupYymm.value = false;
};

const searchValue = reactive({
  year: commUtil.getTodayYear(),
  month: commUtil.getTodayMonth(),
  yymm: commUtil.getTodayYear() + '년 ' + commUtil.getTodayMonth() + '월',
  textValue: '',
  divCdOptions: [],
});

const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 230}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataOrdBack = ref([]);
const selectedRows = reactive({ rows: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  getDataCommOption('311').then(() => {
    getData();
  });
});

const dateGetter = (params, field) => {
  const dateStr = params.data[field];
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

// 편집 후 데이터를 저장할 때
const dateSetter = (params, field) => {
  const dateStr = params.newValue.replace(/-/g, '');
  if (dateStr.length === 8) {
    params.data[field] = dateStr;
    return true;
  }
  return false;
};

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs = ref([
  {
    headerName: 'No',
    field: '',
    minWidth: 70,
    maxWidth: 70,
    editable: false,
    filter: false,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      // Customize row numbers as needed
      if (params.node.rowPinned) {
        return null; // Do not display a number for pinned rows
      }
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '',
    field: '',
    maxWidth: 50,
    minWidth: 50,
    editable: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '입금일',
    field: 'accDay',
    minWidth: 130,
    maxWidth: 130,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'accDay'),
    valueSetter: params => dateSetter(params, 'accDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '전표번호',
    field: 'seq',
    minWidth: 90,
    maxWidth: 90,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '어음번호',
    field: 'billNo',
    minWidth: 180,
    maxWidth: 180,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
  },
  {
    headerName: '유형',
    field: 'divCd',
    cellEditor: 'agSelectCellEditor',
    maxWidth: 80,
    minWidth: 80,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
    cellEditorParams: () => {
      return {
        values: searchValue.divCdOptions.map(option => option.commCd), // 최신 값을 동적으로 반영
      };
    },
    cellRenderer: params => {
      const option = searchValue.divCdOptions.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
    valueFormatter: params => {
      const option = searchValue.divCdOptions.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
  },
  {
    headerName: '발행처',
    field: 'pubComp',
    minWidth: 120,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '발행인',
    field: 'pubNm',
    minWidth: 120,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '발행일',
    field: 'pubDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'pubDay'),
    valueSetter: params => dateSetter(params, 'pubDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '만기일',
    field: 'endDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'endDay'),
    valueSetter: params => dateSetter(params, 'endDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '발행금액',
    field: 'billAmt',
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
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },

  {
    headerName: '받은일',
    field: 'recDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'recDay'),
    valueSetter: params => dateSetter(params, 'recDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '지급일',
    field: 'payDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'payDay'),
    valueSetter: params => dateSetter(params, 'payDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '발행은행',
    field: 'payBank',
    minWidth: 150,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    // cellStyle: params => {
    //   return { textAlign: 'center' };
    // },
  },
  {
    headerName: '지급지점',
    field: 'payPoint',
    minWidth: 150,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    // cellStyle: params => {
    //   return { textAlign: 'center' };
    // },
  },
  {
    headerName: '지급처',
    field: 'payComp',
    minWidth: 150,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    // cellStyle: params => {
    //   return { textAlign: 'center' };
    // },
  },
  {
    headerName: '할인율',
    field: 'yul',
    minWidth: 100,
    maxWidth: 100,
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
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
        textAlign: 'center',
      };
    },
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '할인금액',
    field: 'yulAmt',
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
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },

  {
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
]);

const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const secondFocus = ref(null);

const saveDataSection = () => {
  if (isEqual(rowData.rows, rowDataOrdBack.value) && selectedRows.rows.length === 0) {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '변경된 자료가 없습니다. ',
      // persistent: true,
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
    // Detail 자료 분류작업
    let iu = [];
    let iuD = [];

    // 신규 수정 자료정리
    for (let i = 0; i < rowData.rows.length; i++) {
      if (rowData.rows[i].iuD === 'I' || rowData.rows[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
        iu.push(tmpJson);
      }
    }

    // 삭제 자료정리
    for (let i = 0; i < selectedRows.rows.length; i++) {
      if (selectedRows.rows[i].iuD === 'R' || selectedRows.rows[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.rows[i]) + '}';
        iuD.push(tmpJson);
      }
    }
    saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
      if (val.rtn === '0') {
        getData();
      }
    });
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/sal/sal3010_save_bill', resFormData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus;
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/sal/sal3020_list', {
      paramYear: searchValue.year,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    rowDataOrdBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);

    maxSeq.value = 0;
    if (rowData.rows.length > 0) {
      // 제일 큰 일렴번호 추출
      const maxSeqRow = rowData.rows.reduce((maxRow, row) => (row.seq > maxRow.seq ? row : maxRow), rowData.rows[0]);
      maxSeq.value = maxSeqRow.seq;
    }

    saveRowsCount.value = 0;
    removeRowsCount.value = 0;
    delRowsCount.value = 0;
    isSaveFg.value = null;
    billUse.value = false;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '311':
        searchValue.divCdOptions = response.data.data;
        break;
      default:
        searchValue.divCdOptions = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    custNm: '합계',
    billAmt: 0,
    yulAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.billAmt += row.billAmt || 0;
    totalRow.yulAmt += row.yulAmt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************
const composing = ref(false);
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  accDay: 'seq',
  seq: 'billNo',
  billNo: 'divCd',
  divCd: 'pubComp',
  pubComp: 'pubNm',
  pubNm: 'pubDay',
  pubDay: 'recDay',
  recDay: 'payDay',
  payDay: 'payBank',
  payBank: 'payPoint',
  payPoint: 'payComp',
  payComp: 'endDay',
  endDay: 'billAmt',
  billAmt: 'yul',
  yul: 'yulAmt',
  yulAmt: 'remarks',
};

const saveRowsCount = ref(0);
const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  // dateComponentParams: {
  //   dateFormat: 'YYYY-MM-DD', // 달력에서 사용하는 날짜 형식
  // },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  // enableColResize: false,
  // enableSorting: true,
  // enableFilter: false,
  // enableRangeSelection: true,
  suppressRowClickSelection: true,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 40;
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
  onCellKeyDown: event => {
    // console.log('Event keyDown:', event);
    if (composing.value && event.key === 'Enter') {
      event.preventDefault();
    }
    // if (event.column.colId === 'custNm' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
    //   eventKey.value = event.event.key;
    // }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);

    const nextColumn = columnFocusMap[event.column.colId];
    if (nextColumn) {
      myGrid.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
    }

    // console.log('rowData : ', JSON.stringify(rowData.rows));
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    saveRowsCount.value = rowData.rows.filter(row => row.iuD === 'I' || row.iuD === 'U').length;
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
    // event.api.startEditingCell({
    //   rowIndex: event.rowIndex,
    //   colKey: event.column.getId(),
    // });
    // if (event.column.colId === 'accFg' && event.data.accFg === '2') {
    //   console.log('data: ', JSON.stringify(event.data));
    //   getDataBill(event.data).then(() => {
    //     formDisable.value = false;
    //     isDialogVisible.value = true;
    //   });
    // }
  },
  // isRowSelectable: node => !node.footer,
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.rows = event.api.getSelectedRows();
    // isShowSaveBtn.value = selectedRows.details.length > 0;
    removeRowsCount.value = selectedRows.rows.filter(row => row.iuD === 'I').length;
    delRowsCount.value = selectedRows.rows.filter(row => row.iuD !== 'I').length;
    // console.log('count : ', removeRowsCount.value, delRowsCount.value);
    // const selRow = selectedRows.details.filter(row => row.iuD !== 'I');
    // rowData.rows = rowData.rows.filter(row => !delRow.some(del => del.iuD === row.iuD));

    // 그리드에 변경된 데이터 적용
    // event.api.setRowData(rowData.rows);
    // selectedRows.details = selRow;
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged : ', event.column.colId, event.data.accFg);

    const backData = rowDataOrdBack.value.filter(item => item.accDay === event.data.accDay && item.seq === event.data.seq);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }

    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
  },
  // getRowNodeId: function (data) {
  //   return null;
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
const handleComposition = event => {
  if (event.type === 'compositionstart') {
    composing.value = true;
    // console.log('Korean IME composition started');
  } else if (event.type === 'compositionend') {
    composing.value = false;
    // console.log('Korean IME composition ended');
  }
};

/** **** 그리드 Detail 편집부분 ****/
const rowIndex = ref(0);
const addDataDetailsRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGrid.value.api.getDisplayedRowCount();
  }
  maxSeq.value++;
  const newItems = {
    accDay: '',
    seq: 0,
    oldSeq: 0,
    accFg: '',
    custCd: '',
    custNm: '',
    amt: 0,
    remarks: '',
    iuD: 'I',
  };
  // console.log('newItems : ', newRowIndex, maxSeq.value, JSON.stringify(newItems));
  rowData.rows.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setGridOption('rowData', rowData.rows);
  // myGrid.value.api.updateGridOptions({ rowData: rowData.rows });
  // 첫컬럼에 focus
  setTimeout(() => {
    myGrid.value.api.setFocusedCell(newRowIndex, 'accDay');
  }, 200);
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  // 선택된 행을 제거
  // rowData.rows = rowData.rows.filter(row => !selectedData.includes(row));
  rowData.rows = rowData.rows.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));

  // 그리드 데이터 갱신
  myGrid.value.api.setGridOption('rowData', rowData.rows);
};
</script>

<style lang="sass" scoped></style>
