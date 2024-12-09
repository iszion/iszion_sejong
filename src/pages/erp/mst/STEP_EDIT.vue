<template>
  <div class="row q-pb-sm">
    <span class="text-subtitle1 text-bold text-orange"><q-icon name="edit" /> 적용일자와 참고사항을 등록 하실 수 있습니다.</span>
    <q-space />
    <div class="q-gutter-sm">
      <q-btn v-if="updateData.length > 0" class="q-px-sm" outline color="primary" dense @click="saveDataSection"
        ><q-icon name="save" size="xs" /> 저장
      </q-btn>
      <q-btn v-if="selectedRows.length > 0" class="q-px-sm" outline color="negative" dense @click="deleteDataSection">
        <q-icon name="delete" size="xs" /> 삭제</q-btn
      >
    </div>
  </div>
  <div :style="contentZoneStyle">
    <ag-grid-vue
      ref="myGrid"
      style="width: 100%; height: 100%"
      :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
      :grid-options="gridOptions"
    >
    </ag-grid-vue>
  </div>
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

import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const $q = useQuasar();
const dense = ref(false);

const contentZoneHeight = ref(500);

const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};
const dateValueGetter = params => {
  const dateStr = params.data.makeDay;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

// 편집 후 데이터를 저장할 때
const dateValueSetter = params => {
  const dateStr = params.newValue.replace(/-/g, '');
  if (dateStr.length === 8) {
    params.data.makeDay = dateStr;
    return true;
  }
  return false;
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData(props.message.projectCd);
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 270;
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
    pinned: 'left',
  },
  {
    headerName: 'No',
    field: 'rowNum',
    minWidth: 55,
    maxWidth: 55,
    editable: false,
    pinned: 'left',
  },
  {
    headerName: '코드',
    field: 'stepCd',
    minWidth: 100,
    maxWidth: 100,
    editable: false,
    pinned: 'left',
  },
  {
    headerName: '진행유형',
    field: 'stepNm',
    minWidth: 120,
    maxWidth: 120,
    editable: false,
    pinned: 'left',
  },
  {
    headerName: '적용일자',
    field: 'makeDay',
    minWidth: 120,
    maxWidth: 120,
    cellEditor: 'agDateStringCellEditor',
    valueFormatter: dateFormatter,
    valueGetter: dateValueGetter,
    valueSetter: dateValueSetter,
  },
  {
    headerName: '참고사항',
    field: 'explains',
    minWidth: 100,
  },
]);

const selectedRows = ref([]);
const updateData = ref([]);

const handleCellValueChanged = event => {
  const rowDataItem = event.data;

  let ch = true;
  for (let i = 0; updateData.value.length > i; i++) {
    if (updateData.value[i].projectCd === rowDataItem.projectCd && updateData.value[i].stepCd === rowDataItem.stepCd) {
      updateData.value[i] = rowDataItem;
      ch = false;
    }
  }
  if (ch) {
    updateData.value.push(rowDataItem);
  }
  console.log('update :: ', JSON.stringify(updateData.value));
};

const deleteDataSection = () => {
  $q.dialog({
    dark: true,
    title: '자료삭제',
    message: '선택된 자료를 삭제하시겠습니까? ',
    ok: {
      push: true,
      color: 'negative',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRows.value.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  let iu = [];
  let iuD = [];
  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson = '';
    if (updateData.value[0].iuD === 'U') {
      tmpJson = '{"mode":"U","data":' + JSON.stringify(updateData.value[i]) + '}';
    } else {
      tmpJson = '{"mode":"I","data":' + JSON.stringify(updateData.value[i]) + '}';
    }
    iu.push(tmpJson);
  }
  console.log('save : ', JSON.stringify(iu));
  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mkt/step_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      updateData.value = [];
      selectedRows.value = [];

      getData(props.message.projectCd);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getData = async resProjectCd => {
  try {
    const response = await api.post('/api/mkt/step_list', {
      paramProjectCd: resProjectCd,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    updateData.value = [];
    selectedRows.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
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

  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: false,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: true, // row 선택해도 check박스 체크안되게 하려면 true
  animateRows: true,
  suppressHorizontalScroll: true,

  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: $q.dark.isActive ? '#464646' : '#e6e6e6' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
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
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
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
    // console.log('onSelectionChanged1');
    selectedRows.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: null,
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    handleCellValueChanged(event);
  },
  getRowNodeId: function (data) {
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

  debug: false,
};
</script>

<style lang="sass" scoped></style>
