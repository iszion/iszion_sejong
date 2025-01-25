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
          <q-btn outline color="primary" icon="add" label="라인추가" @click="addDataDetailsRowSection('next')" />
          <q-btn outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow">
            <q-badge v-show="removeRowsCount > 0" color="red" floating>{{ removeRowsCount }}</q-badge>
          </q-btn>
          <q-space />
          <q-btn outline color="primary" icon="save" label="저장" @click="saveDataSection">
            <q-badge v-show="delRowsCount > 0" color="red" floating>{{ delRowsCount }}</q-badge>
          </q-btn>
        </q-card-actions>
        <q-card-section class="q-pa-xs">
          <div :style="contentZoneStyle">
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

import { isEqual } from 'lodash';
import notifySave from 'src/js_comm/notify-save';
import HelpProd from 'components/subvue/HelpProd.vue';
import CompHelpProdButton from 'components/CompHelpProdButton.vue';
import CompHelpAgentButton from 'components/CompHelpAgentButton.vue';
import JsonUtil from 'src/js_comm/json-util';
import HelpAgent from 'components/subvue/HelpAgent.vue';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);

const searchValue = reactive({
  // procYear: commUtil.getTodayYear(),
  // procMonth: commUtil.getTodayMonth(),
  procYear: '2023',
  procMonth: '12',
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
const rowDataRowsBack = ref([]);

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
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 250,
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 100,
    maxWidth: 100,
    editable: false,
    cellRendererSelector: params => {
      // 조건에 따라 cellRenderer 설정
      if (!params.node.rowPinned) {
        return {
          component: CompHelpProdButton,
          params: {
            updateSelectedValue: selectedParams => {
              params.node.setDataValue('prodNm', selectedParams.prodNm); // prodNm 업데이트
              params.node.setDataValue('prodCd', selectedParams.prodCd); // prodCd 업데이트
            },
          },
        };
      }
      // 조건에 맞지 않으면 cellRenderer를 사용하지 않음
      return null;
    },
  },
  {
    headerName: '에이젠트명',
    field: 'agentNm',
    minWidth: 200,
    maxWidth: 200,
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '코드',
    field: 'agentCd',
    minWidth: 100,
    maxWidth: 100,
    editable: false,
    cellRendererSelector: params => {
      // 조건에 따라 cellRenderer 설정
      if (!params.node.rowPinned) {
        return {
          component: CompHelpAgentButton,
          params: {
            updateSelectedValue: selectedParams => {
              params.node.setDataValue('prodNm', selectedParams.agentNm); // prodNm 업데이트
              params.node.setDataValue('prodCd', selectedParams.agentCd); // prodCd 업데이트
            },
          },
        };
      }
      // 조건에 맞지 않으면 cellRenderer를 사용하지 않음
      return null;
    },
  },
  {
    headerName: '인세지급액',
    field: 'jAmt',
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
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
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
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
  },
]);

const saveDataSection = () => {
  if (isEqual(rowData.rows, rowDataRowsBack.value) && selectedRows.rows.length === 0) {
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
      if (rowData.rows[i].procYear || rowData.rows[i].procMonth) {
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
    const res = await api.post('/api/fee/fee1030_save', resFormData);
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
    const response = await api.post('/api/fee/fee1030_list', {
      paramProcYear: searchValue.procYear,
      paramProcMonth: searchValue.procMonth,
    });
    rowData.rows = response.data.data;
    myGrid1.value.api.updateGridOptions({ rowData: rowData.rows });
    myGrid1.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const isReceipt = ref({
  yn: false,
  cnt: 0,
  date: null,
});
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    prodNm: '합계',
    jAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.jAmt += row.jAmt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  prodNm: 'agentNm',
  agentNm: 'jAmt',
  jAmt: 'remarks',
};

const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefs1.value,
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
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd', textAlign: 'center' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 40;
    }
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
  onCellKeyDown: event => {
    // console.log('Event keyDown:', event);
    if (event.column.colId === 'prodNm' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
    if (event.column.colId === 'agentNm' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
    if (event.column.colId === 'remarks' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);
    if (event.column.colId === 'prodNm' && eventKey.value === 'Enter') {
      //     // 중복 이벤트 방지
      if (processedEventKey === eventKey.value) {
        processedEventKey = null;
        return;
      }
      processedEventKey = eventKey.value;
      // 중복 이벤트 방지 끝
      openHelpProdDialog(event);
    }
    if (event.column.colId === 'agentNm' && eventKey.value === 'Enter') {
      //     // 중복 이벤트 방지
      if (processedEventKey === eventKey.value) {
        processedEventKey = null;
        return;
      }
      processedEventKey = eventKey.value;
      // 중복 이벤트 방지 끝
      openHelpAgentDialog(event);
    }

    if (event.column.colId === 'remarks' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      processedEventKey = null;
      addDataDetailsRowSection('next');
    }

    const nextColumn = columnFocusMap[event.column.colId];
    if (nextColumn) {
      myGrid1.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
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
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    const backData = rowDataRowsBack.value.filter(item => item.prodCd === event.data.prodCd && item.agentCd === event.data.agentCd);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
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
    newRowIndex = myGrid1.value.api.getDisplayedRowCount();
  }
  // const addIndex = rowIndex.value;
  const newItems = {
    procYear: searchValue.procYear,
    procMonth: searchValue.procMonth,
    prodNm: '',
    AgentNm: '',
    prodCd: '',
    agentCd: '',
    jAmt: 0,
    remarks: '',
    iuD: 'I',
  };
  rowData.rows.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid1.value.api.setGridOption('rowData', rowData.rows);
  // 첫컬럼에 focus
  myGrid1.value.api.setFocusedCell(newRowIndex, 'prodNm');
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid1.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  // console.log('selectedData : ', JSON.stringify(selectedData));

  // 선택된 행을 제거
  // rowData.rows = rowData.rows.filter(row => !selectedData.includes(row));
  rowData.rows = rowData.rows.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));
  // console.log('rowData : ', JSON.stringify(rowData.rows));

  // 그리드 데이터 갱신
  myGrid1.value.api.setRowData(rowData.rows);
};

/* *** 코드헬프부분 ** */
const openHelpProdDialog = event => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: event.data.prodNm,
      paramUseYn: 'N',
      paramCloseDay: '99991231',
    },
  })
    .onOk(res => {
      event.node.setDataValue('prodNm', res.prodNm);
      event.node.setDataValue('prodCd', res.prodCd);
      myGrid1.value.api.setFocusedCell(event.node.rowIndex, 'agentNm');
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

const openHelpAgentDialog = event => {
  $q.dialog({
    component: HelpAgent,
    componentProps: {
      paramValueNm: event.data.agentNm,
      paramUseYn: 'N',
      paramCloseDay: '99991231',
    },
  })
    .onOk(res => {
      event.node.setDataValue('agentNm', res.agentNm);
      event.node.setDataValue('agentCd', res.agentCd);
      myGrid1.value.api.setFocusedCell(event.node.rowIndex, 'jAmt');
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

/* *** 코드헬프부분 끝 ** */
</script>

<style lang="sass" scoped></style>
