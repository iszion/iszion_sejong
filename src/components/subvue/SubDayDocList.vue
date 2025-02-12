<template>
  <!-- notice dialogRef here -->
  <q-dialog :maximized="$q.screen.lt.md" full-width full-height ref="dialogRef">
    <q-card class="my-card q-dialog-plugin">
      <q-toolbar :class="$q.dark.isActive ? 'bg-lime-10' : 'bg-lime-6'">
        <q-btn @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" />닫기</q-btn>
        <q-space />
        <div class="text-h6 text-bold">
          [ <span class="text-blue"> {{ params.paramSalesNm }} </span> ] <span class="q-ml-md">업무활동일지 리스트</span>
        </div>
        <q-space />
      </q-toolbar>
      <q-card-section class="grid-container q-pa-xs-xs q-pa-sm-sm">
        <q-separator spaced />
        <div class="ag-grid-wrapper">
          <ag-grid-vue
            ref="myGrid"
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :suppressCellSelection="true"
            :grid-options="gridOptions"
          >
          </ag-grid-vue>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { AgGridVue } from 'ag-grid-vue3';
import { onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import commUtil from 'src/js_comm/comm-util';
import SubHistory from 'components/subvue/SubHistory.vue';
import SubDayDoc from 'components/subvue/SubDayDoc.vue';
import jsonUtil from 'src/js_comm/json-util';

const $q = useQuasar();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const params = defineProps({
  paramSalesCd: {
    type: String,
    required: false,
    default: null,
  },
  paramSalesNm: {
    type: String,
    required: false,
    default: null,
  },
  paramStdDay: {
    type: String,
    required: false,
    default: null,
  },
});

const searchNmFocus = ref(null);

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      minWidth: 50,
      maxWidth: 50,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
      filter: false,
      editable: false,
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '등록일',
      field: 'stdDay',
      minWidth: 120,
      maxWidth: 120,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
      valueFormatter: dateFormatter,
    },
    { headerName: '영업담당', field: 'salesNm', minWidth: 100, maxWidth: 100, pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null },
    { headerName: '일지유형', field: 'typeNm', minWidth: 120, maxWidth: 120 },
    { headerName: '활동일지 주제', field: 'subject', minWidth: 200 },
    { headerName: '프로젝트명', field: 'projectNm', minWidth: 200 },
  ],
});

const rowSelection = ref(null);
const rowData = reactive({ rows: [] });
const searchValue = ref(null);

onBeforeMount(() => {
  getData();
});

const selectedRows = ref(null);

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/auxPage2_dayDoc_list', {
      paramStdDay: params.paramStdDay,
      paramSalesCd: params.paramSalesCd,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    // console.log('rowData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매정보(일전체 고객별) 목록 자료 가져오기 부분 끝  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.columns,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    if (param.data.closeDay) {
      if (param.data.closeDay <= params.paramCloseDay) {
        param.data.closeDay = commUtil.formatDate(param.data.closeDay);
        return { color: '#ff0505' };
      } else {
        param.data.closeDay = '';
      }
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
  },
  onCellClicked: function (event) {
    console.log('onCellClicked : ', event.colDef.field);
    selectedRows.value = event.api.getSelectedRows();
    if (event.colDef.field === 'projectNm') {
      if (selectedRows.value[0].projectCd) {
        $q.dialog({
          component: SubHistory,
          componentProps: {
            paramProjectCd: selectedRows.value[0].projectCd,
            paramProjectNm: selectedRows.value[0].projectNm,
          },
        })
          .onOk(res => {
            // console.log('res ::: ', res.valueCd, res.valueNm);
          })
          .onCancel(() => {
            // console.log('Cancel');
          })
          .onDismiss(() => {
            // console.log('Called on OK or Cancel');
          });
      } else {
        $q.dialog({
          dark: true,
          title: '안내',
          message: '프로젝트가 등록되어 있지 않습니다.',
        }).onOk(() => {});
      }
    } else if (event.colDef.field === 'typeNm') {
      $q.dialog({
        component: SubDayDoc,
        componentProps: {
          paramStdDay: commUtil.unFormatDate(selectedRows.value[0].stdDay),
          paramSalesCd: selectedRows.value[0].salesCd,
          paramSalesNm: selectedRows.value[0].salesNm,
          paramSeq: selectedRows.value[0].seq,
        },
      })
        .onOk(res => {
          // console.log('res ::: ', res.valueCd, res.valueNm);
        })
        .onCancel(() => {
          // console.log('Cancel');
        })
        .onDismiss(() => {
          // console.log('Called on OK or Cancel');
        });
    }
  },
  onCellKeyDown: function (event) {
    // selectedRows.value = event.api.getSelectedRows();
  },
  onRowDoubleClicked: function (event) {},
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
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px

.grid-container
  display: flex
  flex-direction: column
  height: 96%

.ag-grid-wrapper
  flex-grow: 1
  height: 96%
</style>
