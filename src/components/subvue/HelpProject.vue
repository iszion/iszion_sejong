<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="my-card q-dialog-plugin">
      <q-card-section>
        <div class="row">
          <q-input
            ref="searchNmFocus"
            clearable
            clear-icon="close"
            dense
            v-model="searchParams.searchNm"
            label="프로젝트명 검색"
            :style="$q.screen.xs ? 'max-width: 100px' : 'max-width: 120px'"
            @keyup.enter.stop="getData"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click.stop="getData" />
            </template>
          </q-input>
          <q-space />
          <q-toggle v-model="searchParams.searchAll" label="폐기" color="pink" false-value="N" true-value="Y" @click="getData" />
          <q-space />
          <div class="q-gutter-x-xs flex flex-center">
            <q-btn dense outline :color="$q.dark.isActive ? 'orange' : 'primary'" @click="handleSelectedClick">
              <q-icon name="done" size="xs" class="q-mr-xs" /> 선택
            </q-btn>
            <q-btn dense outline @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" /> 닫기 </q-btn>
          </div>
        </div>
        <q-separator spaced />
        <div style="height: 350px">
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
import { QBtn, QIcon, useDialogPluginComponent } from 'quasar';
import { AgGridVue } from 'ag-grid-vue3';
import { onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import commUtil from 'src/js_comm/comm-util';

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const params = defineProps({
  paramValueNm: {
    type: String,
    required: false,
    default: null,
  },
  paramCloseDay: {
    type: String,
    required: false,
    default: null,
  },
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

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
    { headerName: '코드', field: 'projectCd', maxWidth: 100, minWidth: 100, pinned: 'left' },
    { headerName: '성명', field: 'projectNm', minWidth: 400 },
    { headerName: '영업담당', field: 'salesNm', minWidth: 100 },
    { headerName: '발주처', field: 'orcu1Nm', minWidth: 100 },
    { headerName: '수주일', field: 'orderDay', minWidth: 100, valueFormatter: dateFormatter },
    { headerName: '등록일', field: 'makeDay', minWidth: 100, valueFormatter: dateFormatter },
  ],
});

const rowSelection = ref(null);
const rowData = reactive({ rows: [] });
const searchParams = ref({
  searchNm: params.paramValueNm,
  searchCd: '',
  searchAll: 'N',
});

onBeforeMount(() => {
  getData();
});

const selectedRows = ref(null);

// const onCellKeyDown = params => {
//   const key = params.event.key;
//   if (key === 'Enter') {
//     handleSelectedClick();
//   } else {
//     if (key === 'ArrowUp' || key === 'ArrowDown') {
//       // 상하 키를 누를 때 행 이동 로직 추가
//       const currentRowIndex = params.rowIndex;
//       let nextRowIndex = currentRowIndex;
//       console.log('index : ', nextRowIndex);
//       if (key === 'ArrowUp') {
//         nextRowIndex = currentRowIndex - 1;
//       } else if (key === 'ArrowDown') {
//         nextRowIndex = currentRowIndex + 1;
//       }
//       if (nextRowIndex >= 0 && nextRowIndex < gridApi.value.getDisplayedRowCount()) {
//         gridApi.value.forEachNode(node => {
//           if (node.rowIndex === nextRowIndex) {
//             node.setSelected(true);
//           } else {
//             node.setSelected(false);
//           }
//         });
//         gridApi.value.ensureIndexVisible(nextRowIndex);
//       }
//     }
//   }
// };

const handleSelectedClick = () => {
  if (selectedRows.value && selectedRows.value.length > 0) {
    onDialogOK({ valueCd: selectedRows.value[0].projectCd, valueNm: selectedRows.value[0].projectNm });
    onDialogCancel();
  }
};

// const onRowDoubleClicked = params => {
//   if (selectedRows.value && selectedRows.value.length > 0) {
//     onDialogOK({ valueCd: selectedRows.value[0].projectCd, valueNm: selectedRows.value[0].projectNm });
//     // Close the dialog
//     onDialogCancel();
//   }
// };

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 고객정보 검색리스트 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mkt/help_project_list', {
      paramValueNm: searchParams.value.searchNm,
      paramCloseDay: params.paramCloseDay,
      paramAll: searchParams.value.searchAll,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    if (response.data.data.length > 0) {
      setTimeout(() => {
        myGrid.value.api.setFocusedCell(0, 'valueCd');

        const focusedRowIndex = 0; // Assuming it's the first row, you can adjust this index as needed
        const focusedRowNode = myGrid.value.api.getDisplayedRowAtIndex(focusedRowIndex);
        if (focusedRowNode) {
          focusedRowNode.setSelected(true);
        }
      }, 200);
    } else {
      searchNmFocus.value.focus();
    }
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
    // selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  onCellKeyDown: function (event) {
    // selectedRows.value = event.api.getSelectedRows();
    const key = event.event.key;
    if (key === 'Enter') {
      onDialogOK({ valueCd: selectedRows.value[0].projectCd, valueNm: selectedRows.value[0].projectNm });
      onDialogCancel();
    } else {
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        // 상하 키를 누를 때 행 이동 로직 추가
        const currentRowIndex = event.rowIndex;
        let nextRowIndex = currentRowIndex;
        // console.log('index : ', nextRowIndex);
        if (key === 'ArrowUp') {
          nextRowIndex = currentRowIndex - 1;
        } else if (key === 'ArrowDown') {
          nextRowIndex = currentRowIndex + 1;
        }
        if (nextRowIndex >= 0 && nextRowIndex < event.api.getDisplayedRowCount()) {
          event.api.forEachNode(node => {
            if (node.rowIndex === nextRowIndex) {
              node.setSelected(true);
            } else {
              node.setSelected(false);
            }
          });
          event.api.ensureIndexVisible(nextRowIndex);
        }
      }
    }
  },
  onRowDoubleClicked: function (event) {
    if (selectedRows.value && selectedRows.value.length > 0) {
      onDialogOK({ valueCd: selectedRows.value[0].projectCd, valueNm: selectedRows.value[0].projectNm });
      // Close the dialog
      onDialogCancel();
    }
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
</style>
