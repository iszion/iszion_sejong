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

    <q-card bordered>
      <q-card-actions class="q-py-sm">
        <q-btn outline color="primary" icon="refresh" label="다시불러오기" @click="getData" />
        <q-space />
        <q-input
          stack-label
          bottom-slots
          label-color="orange"
          v-model="searchValue.textValue"
          label="검색"
          dense
          class="q-pb-none"
          style="width: 120px"
          @keyup.enter="getData"
        >
          <template v-slot:append>
            <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
          </template>
        </q-input>

        <q-space />
        <div class="inline q-gutter-x-xs">
          <q-btn outline color="primary" icon="add" label="라인추가" @click="addDataDetailsRowSection('next')" />
          <q-btn outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow">
            <q-badge v-show="removeRowsCount > 0" color="red" floating>{{ removeRowsCount }}</q-badge>
          </q-btn>
          <q-btn outline color="primary" icon="save" label="저장" @click="saveDataSection">
            <q-badge v-show="delRowsCount > 0" color="red" floating>{{ delRowsCount }}</q-badge>
          </q-btn>
        </div>
      </q-card-actions>
      <q-separator />
      <q-card-section class="q-pa-xs">
        <div :style="contentZoneStyle">
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
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import JsonUtil from 'src/js_comm/json-util';

const $q = useQuasar();

const searchValue = reactive({
  textValue: '',
});

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 260}px`,
}));

const selectedRows = reactive({ rows: [] });
const rowData = reactive({ rows: [] });
const rowDataDetailsBack = ref([]);

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

const columnDefs = ref([
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
    headerName: '코드',
    field: 'agentCd',
    minWidth: 100,
    maxWidth: 100,
  },
  {
    headerName: '에이젠트명',
    field: 'agentNm',
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: '등록일',
    field: 'makeDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'makeDay'),
    valueSetter: params => dateSetter(params, 'makeDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '사용중지일',
    field: 'outDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'outDay'),
    valueSetter: params => dateSetter(params, 'outDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '기타사항',
    field: 'explains',
    minWidth: 200,
  },
]);

const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const firstFocus = ref(null);
const secondFocus = ref(null);
const addDataSection = () => {
  oldFormData.value = null;
  isSaveFg.value = 'I';
  isShowSaveBtn.value = true;
  isShowDeleteBtn.value = false;
  formDisable.value = false;
  formData.value.stopYn = 'N';
  formData.value.condFg = '1';
  formData.value.calcFg = '1';

  myGrid.value.api.setRowData([]);
  myGrid.value.api.hideOverlay(); // 로딩 오버레이 제거

  setTimeout(() => {
    firstFocus.value.focus();
  }, 100);
};

const saveDataSection = () => {
  if (isEqual(rowData.rows, rowDataDetailsBack.value) && selectedRows.rows.length === 0) {
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
    console.log('data : ', JSON.stringify(rowData.rows));
    // 신규 수정 자료정리
    for (let i = 0; i < rowData.rows.length; i++) {
      if (rowData.rows[i].agentNm !== '') {
        if (rowData.rows[i].iuD === 'I' || rowData.rows[i].iuD === 'U') {
          let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
          iu.push(tmpJson);
        }
      }
    }

    // 삭제 자료정리
    for (let i = 0; i < selectedRows.rows.length; i++) {
      if (selectedRows.rows[i].iuD === 'R' || selectedRows.rows[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.rows[i]) + '}';
        iuD.push(tmpJson);
      }
    }

    // Detail 자료 정리
    const saveData = JSON.stringify(JsonUtil.jsonFiller('no1', iu, iuD));

    console.log('save : ', JSON.stringify(saveData));
    saveDataAndHandleResult(saveData).then(val => {
      getData();
    });
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/mst/mst2040_save', resFormData);
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
let maxAgentCd = '1001';
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst2040_list', {
      paramValue: '',
    });
    rowData.rows = response.data.data;
    rowDataDetailsBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid.value.api.setGridOption('rowData', rowData.rows);

    maxAgentCd = rowData.rows
      .map(row => parseInt(row.agentCd, 10)) // Convert agentCd to numbers
      .filter(agentCd => agentCd < 9000) // Keep only values below 9000
      .reduce((max, agentCd) => Math.max(max, agentCd), -Infinity);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  agentCd: 'agentNm',
  agentNm: 'makeDay',
  makeDay: 'outDay',
  outDay: 'explains',
};

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
    if (event.column.colId === 'explains' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);
    if (event.column.colId === 'explains' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      processedEventKey = null;
      addDataDetailsRowSection('next');
    } else {
      const nextColumn = columnFocusMap[event.column.colId];
      console.log('next : ', nextColumn);
      if (nextColumn) {
        myGrid.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
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
    selectedRows.rows = event.api.getSelectedRows();
    removeRowsCount.value = selectedRows.rows.filter(row => row.iuD === 'I').length;
    delRowsCount.value = selectedRows.rows.filter(row => row.iuD !== 'I').length;
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    const backData = rowDataDetailsBack.value.filter(item => item.seq === event.data.seq);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
  },

  debug: false,
};

/** **** 그리드 Detail 편집부분 ****/
const addDataDetailsRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGrid.value.api.getDisplayedRowCount();
  }
  // const addIndex = rowIndex.value;
  const newItems = {
    agentCd: maxAgentCd + 1,
    agentNm: '',
    makeDay: commUtil.unFormatDate(commUtil.getToday()),
    outDay: '99991231',
    explains: '',
    iuD: 'I',
  };
  rowData.rows.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setRowData(rowData.rows);
  // 포커스를 해당 라인 위치에 적용
  myGrid.value.api.ensureIndexVisible(newRowIndex);
  // 첫컬럼에 focus
  myGrid.value.api.setFocusedCell(newRowIndex, 'agentNm');
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  // console.log('selectedData : ', JSON.stringify(selectedData));

  // 선택된 행을 제거
  // rowData.rows = rowData.rows.filter(row => !selectedData.includes(row));
  rowData.rows = rowData.rows.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));
  // console.log('rowData : ', JSON.stringify(rowData.rows));

  // 그리드 데이터 갱신
  myGrid.value.api.setRowData(rowData.rows);
};
</script>

<style lang="sass" scoped></style>
