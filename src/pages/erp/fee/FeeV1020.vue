<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
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

    <div class="q-pa-xs q-gutter-y-md">
      <q-card bordered>
        <!-- contents list title bar -->

        <!--  end of contents list title bar -->
        <q-card-actions>
          <div class="q-gutter-sm q-pt-md">
            <q-radio v-model="searchValue.prodCl" val="2" label="국외" @click="getData" />
            <q-radio v-model="searchValue.prodCl" val="1" label="국내" @click="getData" />
          </div>
          <q-space />
          <q-banner dense :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
            <template v-slot:avatar>
              <q-icon name="signal_wifi_off" color="primary" />
            </template>
            <span class="text-subtitle2 text-bold text-orange"> 도서명이 안보이는 경우</span><br />
            『인세 기준정보』 에서 인세지급자를 신규등록하고 사용하세요
          </q-banner>
          <q-space />
          <q-input
            stack-label
            bottom-slots
            label-color="orange"
            v-model="searchValue.textValue"
            label="검색"
            dense
            class="q-pb-none"
            style="width: 200px"
            @keyup.enter="getData"
          >
            <template v-slot:before>
              <q-icon name="search" @click="getData" class="cursor-pointer" />
            </template>
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
            </template>
          </q-input>
        </q-card-actions>
        <q-card-section class="q-pa-xs">
          <div style="height: 400px">
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
      <q-card bordered>
        <q-bar class="q-px-sm">
          <q-icon name="list_alt" />
          <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
        </q-bar>
        <q-card-actions>
          <q-btn dense outline color="primary" icon="add" label="라인추가" @click="addDataDetailsRowSection('next')" />
          <q-btn dense outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow" />
          <q-space />
          <q-btn dense outline color="primary" icon="save" label="저장" @click="saveDataSection" />
        </q-card-actions>
        <q-card-section class="q-pa-xs">
          <div :style="contentZoneStyle">
            <ag-grid-vue
              ref="myGrid2"
              style="width: 100%; height: 100%"
              :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
              :grid-options="gridOptions2"
            >
            </ag-grid-vue>
          </div>
        </q-card-section>
      </q-card>
    </div>
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
import HelpProd from 'components/subvue/HelpProd.vue';
import CompHelpProdButton from 'components/CompHelpProdButton.vue';
import { createRouter as Vue } from 'vue-router/dist/vue-router.esm-browser.prod';
import JsonUtil from 'src/js_comm/json-util';
import HelpAgent from 'components/subvue/HelpAgent.vue';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);

const searchValue = reactive({
  textValue: '',
  prodCl: '2',
  useYn: 'Y',
  stopYn: 'N',
});

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 760}px`,
}));

const selectedRows = reactive({ rows: [], rowsList: [] });
const rowData = reactive({ rows: [], rowsList: [] });
const rowDataRowsListBack = ref([]);

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs1 = ref([
  {
    headerName: '#',
    minWidth: 70,
    maxWidth: 70,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },

  {
    headerName: '구분',
    field: 'prodClNm',
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 80,
    maxWidth: 80,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 200,
  },
  {
    headerName: 'SEQ',
    field: 'agentSeq',
    minWidth: 80,
    maxWidth: 80,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '등록수',
    field: 'fwCnt',
    minWidth: 90,
    maxWidth: 90,
    cellStyle: () => {
      return {
        textAlign: 'center',
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '에이젠트명',
    field: 'agentNm',
    minWidth: 120,
    maxWidth: 120,
  },
  {
    headerName: '코드',
    field: 'agentCd',
    minWidth: 80,
    maxWidth: 80,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '계약기간',
    field: 'feesPeriod',
    minWidth: 220,
    maxWidth: 220,
  },
  {
    headerName: '비고',
    field: 'remarks',
    minWidth: 220,
  },
]);

const columnDefs2 = ref([
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
    headerName: 'No',
    field: '',
    minWidth: 70,
    maxWidth: 70,
    editable: false,
    filter: false,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '년도',
    field: 'procYear',
    minWidth: 100,
    maxWidth: 100,
  },
  {
    headerName: '월',
    field: 'procMonth',
    minWidth: 70,
    maxWidth: 70,
  },
  {
    headerName: '선인세',
    field: 'wAmt',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '소멸액(선인세)',
    field: 'dAmt',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '상반기정산액',
    field: 'pAmt',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '전자책정산액',
    field: 'eAmt',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '누적정산수량',
    field: 'wQty',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '이월미정산수량',
    field: 'woQty',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '홍보수량',
    field: 'pmQty',
    minWidth: 150,
    maxWidth: 150,
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
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
  },
]);

const saveDataSection = () => {
  if (isEqual(rowData.rowsList, rowDataRowsListBack.value) && selectedRows.rowsList.length === 0) {
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
    for (let i = 0; i < rowData.rowsList.length; i++) {
      if (rowData.rowsList[i].procYear || rowData.rowsList[i].procMonth) {
        if (rowData.rowsList[i].iuD === 'I' || rowData.rowsList[i].iuD === 'U') {
          let tmpJson = '{"mode": "' + rowData.rowsList[i].iuD + '","data":' + JSON.stringify(rowData.rowsList[i]) + '}';
          iu.push(tmpJson);
        }
      }
    }

    // 삭제 자료정리
    for (let i = 0; i < selectedRows.rowsList.length; i++) {
      if (selectedRows.rowsList[i].iuD === 'R' || selectedRows.rowsList[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.rowsList[i]) + '}';
        iuD.push(tmpJson);
      }
    }

    // Detail 자료 정리
    const saveData = JSON.stringify(JsonUtil.jsonFiller('no1', iu, iuD));
    saveDataAndHandleResult(saveData).then(val => {
      getDataSelect(selectedRows.rows[0]);
    });
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/fee/fee1020_save', resFormData);
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
    const response = await api.post('/api/fee/fee1020_list', {
      paramProdCl: searchValue.prodCl,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid1.value.api.updateGridOptions({ rowData: rowData.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

const getDataSelect = async resData => {
  try {
    const response = await api.post('/api/fee/fee1020_select_list', {
      paramProdCd: resData.prodCd,
      paramAgentCd: resData.agentCd,
    });
    rowData.rowsList = response.data.data;
    rowDataRowsListBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid2.value.api.updateGridOptions({ rowData: rowData.rowsList });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefs1.value,
  rowData: rowData.list,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (event) {
    if (event.data.stopYn === 'Y') {
      return { color: 'red' };
      // return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    // if (param.node.rowPinned) {
    //   return 40;
    // }
    return 35;
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
    getDataSelect(event.data);
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
    selectedRows.rows = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};

// *********************************
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  procYear: 'procMonth',
  procMonth: 'wAmt',
  wAmt: 'dAmt',
  dAmt: 'pAmt',
  pAmt: 'eAmt',
  eAmt: 'wQty',
  wQty: 'woQty',
  woQty: 'pmQty',
  pmQty: 'remarks',
};

const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGrid2 = ref(null);
const gridOptions2 = {
  columnDefs: columnDefs2.value,
  rowData: rowData.rowsList,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: true,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    // if (param.node.rowPinned) {
    //   return { 'font-weight': 'bold', background: '#dddddd' };
    // }
    // return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    // if (param.node.rowPinned) {
    //   return 40;
    // }
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
    if (event.column.colId === 'remarks' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);
    if (event.column.colId === 'remarks' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      processedEventKey = null;
      addDataDetailsRowSection('next');
    } else {
      const nextColumn = columnFocusMap[event.column.colId];
      if (nextColumn) {
        myGrid2.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
      }
    }
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  // isRowSelectable: node => !node.footer,
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.rowsList = event.api.getSelectedRows();
    removeRowsCount.value = selectedRows.rowsList.filter(row => row.iuD === 'I').length;
    delRowsCount.value = selectedRows.rowsList.filter(row => row.iuD !== 'I').length;
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    const backData = rowDataRowsListBack.value.filter(item => item.seq === event.data.seq);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
  },

  debug: false,
};

/** **** 그리드 Detail 편집부분 ****/
const rowIndex = ref(0);
const addDataDetailsRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGrid2.value.api.getDisplayedRowCount();
  }
  // const addIndex = rowIndex.value;
  const newItems = {
    prodCd: selectedRows.rows[0].prodCd,
    agentCd: selectedRows.rows[0].agentCd,
    procYear: '',
    procMonth: '',
    wAmt: 0,
    dAmt: 0,
    pAmt: 0,
    eAmt: 0,
    wQty: 0,
    woQty: 0,
    pmQty: 0,
    remarks: '',
    iuD: 'I',
  };
  rowData.rowsList.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid2.value.api.setGridOption('rowData', rowData.rowsList);
  // 첫컬럼에 focus
  myGrid2.value.api.setFocusedCell(newRowIndex, 'procYear');
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid2.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  // console.log('selectedData : ', JSON.stringify(selectedData));

  // 선택된 행을 제거
  // rowData.rowsList = rowData.rowsList.filter(row => !selectedData.includes(row));
  rowData.rowsList = rowData.rowsList.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));
  // console.log('rowData : ', JSON.stringify(rowData.rowsList));

  // 그리드 데이터 갱신
  myGrid2.value.api.setRowData(rowData.rowsList);
};
</script>

<style lang="sass" scoped></style>
