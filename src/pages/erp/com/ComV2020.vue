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

    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12 col-lg-6">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">사용정보 리스트</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div class="row q-col-gutter-md">
                <q-select
                  dense
                  stack-label
                  options-dense
                  class="q-px-md q-mr-sm"
                  label-color="orange"
                  v-model="searchValue.compCd"
                  :options="searchValue.compOptions"
                  option-value="compCd"
                  option-label="compNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 150px; max-width: 150px"
                  label="소속회사"
                  @update:model-value="getDataUser"
                />
                <q-input
                  dense
                  stack-label
                  label-color="orange"
                  bottom-slots
                  v-model="searchValue.textValue"
                  label="검색"
                  class="q-pb-none"
                  style="width: 120px"
                >
                  <template v-slot:append>
                    <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" icon="search" label="조회" @click="getDataUser" />
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGrid"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptionsUser"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div class="col-12 col-lg-6">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">권한받는 사용자 리스트</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div v-if="!isEmpty(selectedRows)">
                <span class="text-subtitle1 text-bold">주는쪽 : </span>
                <span class="text-subtitle1 text-bold"> ( {{ selectedRows[0].userId }} ) {{ selectedRows[0].userNm }} </span>
              </div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="rowData.rows.length > 0" outline color="primary" icon="content_copy" label="권한복사 시작" @click="saveDataSection" />
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGrid1"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptions"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
    </div>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { Notify, QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompToggleAuth from 'components/CompToggleAuth.vue';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();

const $q = useQuasar();

let isSaveFg = 'I';

const myGrid = ref(null);
const myGrid1 = ref(null);

const searchValue = reactive({
  compCd: '',
  compOptions: [],
  textValue: '',
});
const selectedSourceUserId = ref('');

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataUser = reactive({ rows: [] });

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataComp().then(() => {
    getDataUser();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
  getDataCommOption('501');
});

const columnDefsUser = ref([
  {
    headerName: '#',
    minWidth: 60,
    maxWidth: 60,
    pinned: 'left',
    cellStyle: { textAlign: 'center' },
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '주는쪽',
    field: '',
    maxWidth: 70,
    minWidth: 70,
    pinned: 'left',
    cellStyle: { textAlign: 'center' },
    checkboxSelection: true,
  },
  {
    headerName: '받는쪽',
    field: 'targetYn',
    maxWidth: 70,
    minWidth: 70,
    pinned: 'left',
    sortable: true,
    cellRenderer: CompToggleAuth,
    cellRendererParams: {
      // paramSourceUserId: sourceUserId.value,
      updateSelectedValue: row => {
        if (isEmpty(selectedSourceUserId.value)) {
          row.value.targetYn = 'N';
          $q.dialog({
            dark: true,
            title: '안내',
            message: '주는쪽을 먼저 선택하세요',
          });
        } else {
          if (row.value.targetYn === 'Y' && selectedSourceUserId.value === row.value.targetUserId) {
            Notify.create({
              type: 'my-notify',
              position: 'top-right',
              color: 'negative',
              message: '주는쪽 ID와 받는쪽 ID가 같으면 안됩니다.',
              group: false,
              actions: [
                {
                  label: '닫기',
                  color: 'dark',
                  handler: () => {
                    /* ... */
                  },
                },
              ],
              timeout: 5000,
            });
            row.value.targetYn = 'N';
          } else {
            targetUpdateChange();
          }
        }
      },
    },
  },
  {
    headerName: '아이디',
    field: 'userId',
    maxWidth: 100,
    minWidth: 100,
    pinned: 'left',
    sortable: true,
  },
  {
    headerName: '성명',
    field: 'userNm',
    minWidth: 100,
    maxWidth: 100,
    pinned: 'left',
    sortable: true,
  },
  {
    headerName: '소속팀',
    field: 'deptNm',
    maxWidth: 100,
    minWidth: 100,
    sortable: true,
  },
  {
    headerName: '직위',
    field: 'pstnNm',
    maxWidth: 100,
    minWidth: 100,
    sortable: true,
  },
  {
    headerName: '사원번호',
    field: 'empCd',
    maxWidth: 100,
    minWidth: 100,
    sortable: true,
    cellStyle: { textAlign: 'center' },
  },
]);

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      minWidth: 60,
      maxWidth: 60,
      cellStyle: { textAlign: 'center' },
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '아이디',
      field: 'targetUserId',
      maxWidth: 100,
      minWidth: 100,
      sortable: true,
    },
    {
      headerName: '성명',
      field: 'userNm',
      minWidth: 100,
      maxWidth: 100,
      sortable: true,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      maxWidth: 100,
      minWidth: 100,
      sortable: true,
    },
    {
      headerName: '직위',
      field: 'pstnNm',
      maxWidth: 100,
      minWidth: 100,
      sortable: true,
    },
    {
      headerName: '사원번호',
      field: 'empCd',
      maxWidth: 100,
      minWidth: 100,
      sortable: true,

      cellStyle: { textAlign: 'center' },
    },
  ],
});

const selectedRows = ref();

const targetUpdateChange = () => {
  updateData.value = [];
  for (let i = 0; rowDataUser.rows.length > i; i++) {
    if (rowDataUser.rows[i].targetYn === 'Y') {
      updateData.value.push(rowDataUser.rows[i]);
    }
  }
  rowData.rows = updateData.value;
  if (myGrid1.value && myGrid1.value.api) {
    myGrid1.value.api.setRowData(rowData.rows); // this should trigger the grid to reload data
  }

  console.log(JSON.stringify(rowData.rows));
  let messageV = null;
  if (updateData.value.length > 0) {
    messageV = updateData.value.length + ' 명이 선택 되었습니다.';

    $q.notify({
      type: 'my-notify',
      position: 'bottom',
      color: 'primary',
      message: messageV,
      actions: [
        {
          label: '닫기',
          color: 'dark',
          handler: () => {
            /* ... */
          },
        },
      ],
      timeout: 500,
    });
  }
};

const updateData = ref([]);
const showSaveBtn = ref(false);

const saveDataSection = () => {
  for (let i = 0; i < updateData.value.length; i++) {
    updateData.value[i].sourceUserId = selectedSourceUserId.value;
  }

  let iu = [];
  let iuD = [];
  // 신규/수정 부분

  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson;
    tmpJson = '{"mode": "I","data":' + JSON.stringify(updateData.value[i]) + '}';
    iu.push(tmpJson);
    tmpJson = '{"mode": "D","data":' + JSON.stringify(updateData.value[i]) + '}';
    iuD.push(tmpJson);
  }

  if (updateData.value.length <= 0) {
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
    saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
  }
};

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

async function getDataComp() {
  try {
    const response = await api.post('/api/com/com1010_list', {});
    searchValue.compOptions = response.data.data;
    searchValue.compCd = response.data.data[0].compCd;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getDataUser = async () => {
  try {
    const response = await api.post('/api/com/com2020_list', {
      paramCompCd: searchValue.compCd,
      paramValue: searchValue.textValue,
    });
    rowDataUser.rows = response.data.data;
    if (myGrid.value && myGrid.value.api) {
      myGrid.value.api.setRowData(rowDataUser.rows); // this should trigger the grid to reload data
    }
    rowData.rows = [];
    if (myGrid1.value && myGrid1.value.api) {
      myGrid1.value.api.setRowData(rowData.rows); // this should trigger the grid to reload data
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/com/com2020_save', resFormData)
    .then(res => {
      showSaveBtn.value = false;
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** DataBase 소속자료 가져오기 부분 *****************************//
const deptOptions = ref([]);
const selectedDept = ref('');
// ***** 공통코드정보 가져오기 부분  *****************************//
async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '501':
        deptOptions.value = JSON.parse(JSON.stringify(response.data.data));
        deptOptions.value.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        deptOptions.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const gridOptionsUser = {
  columnDefs: columnDefsUser.value,
  rowData: rowDataUser.rows,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
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
    console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    console.log('onSelectionChanged1');
    selectedRows.value = event.api.getSelectedRows();
    if (!isEmpty(selectedRows.value)) {
      selectedSourceUserId.value = selectedRows.value[0].sourceUserId;
      for (let i = 0; updateData.value.length > i; i++) {
        if (selectedSourceUserId.value === updateData.value[i].targetUserId) {
          rowData.rows[i].targetYn = 'N';
        }
      }
      targetUpdateChange();
    }
  },
  onSortChanged: function (event) {
    console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    console.log('onCellValueChanged');
  },

  debug: false,
};

const gridOptions = {
  columnDefs: columnDefs.columns,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
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
    console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    console.log('onSelectionChanged1');
  },
  onSortChanged: function (event) {
    console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    console.log('onCellValueChanged');
  },

  debug: false,
};
</script>
