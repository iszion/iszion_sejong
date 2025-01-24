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
            label="검색"
            :style="$q.screen.xs ? 'max-width: 100px' : 'max-width: 120px'"
            @keyup.enter.stop="getData"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click.stop="getData" />
            </template>
          </q-input>
          <q-space />
          <q-toggle
            v-model="searchParams.searchAll"
            :label="`${searchParams.searchAll === 'Y' ? '전체' : '출고정지'}`"
            color="pink"
            false-value="N"
            true-value="Y"
            @click="getData"
          />
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
            style="width: 100%; height: 100%"
            ref="myGrid"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
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

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const $q = useQuasar();

const params = defineProps({
  paramValueNm: {
    type: String,
    required: true,
    default: null,
  },
  paramUseYn: {
    type: String,
    required: true,
    default: null,
  },
  paramCloseDay: {
    type: String,
    required: true,
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

const columnDefs = ref([
  {
    headerName: 'No',
    field: '',
    maxWidth: 100,
    minWidth: 100,
    valueGetter: function (params) {
      // Prodomize row numbers as needed
      return params.node.rowIndex + 1;
    },
  },
  { headerName: '코드', field: 'prodCd', maxWidth: 100, minWidth: 100 },
  { headerName: '도서명', field: 'prodNm', minWidth: 250 },
  { headerName: '저자명', field: 'authorNm', minWidth: 150 },
  {
    headerName: '정가',
    field: 'sPrice',
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
  },
  {
    headerName: '발행일',
    field: 'pubDay',
    valueFormatter: dateFormatter,
    minWidth: 120,
    maxWidth: 120,
  },
  { headerName: '출고정지', field: 'useYn', minWidth: 100 },
]);

const rowSelection = ref(null);
const rowData = reactive({ rows: [] });
const searchParams = ref({
  searchNm: params.paramValueNm,
  searchAll: params.paramUseYn,
});

onBeforeMount(() => {
  getData().then(() => {
    if (rowData.rows.length === 1) {
      onDialogOK(rowData.rows[0]);
      onDialogCancel();
    } else {
      if (rowData.rows.length > 0) {
        setTimeout(() => {
          const focusedRowIndex = 0; // Assuming it's the first row, you can adjust this index as needed
          // 첫 번째 행을 선택
          myGrid.value.api.getDisplayedRowAtIndex(focusedRowIndex)?.setSelected(true);

          // 첫 번째 행이 보이도록 스크롤 이동
          myGrid.value.api.ensureIndexVisible(focusedRowIndex);

          // 첫 번째 셀에 포커스 설정
          myGrid.value.api.setFocusedCell(focusedRowIndex, 'prodNm'); // colId는 포커스를 줄 열의 ID
        }, 500);
      } else {
        setTimeout(() => {
          searchNmFocus().focus();
        }, 200);
      }
    }
  });
});

const selectedRows = ref(null);

const handleSelectedClick = () => {
  // console.log('sel :: ', JSON.stringify(selectedRows.value));
  if (selectedRows.value && selectedRows.value.length > 0) {
    // Emit the selected values through onDismiss event
    onDialogOK(selectedRows.value[0]);
    onDialogCancel();
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 고객정보 검색리스트 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/helpProd_list', {
      paramValueNm: searchParams.value.searchNm,
      paramCloseDay: params.paramCloseDay,
      paramAll: searchParams.value.searchAll,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
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
  columnDefs: columnDefs.value,
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
  // enableColResize: false,
  // enableSorting: true,
  // enableFilter: false,
  // enableRangeSelection: true,
  suppressRowClickSelection: false,
  // suppressCellSelection: true,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    // if (param.node.rowPinned) {
    //   return { 'font-weight': 'bold', background: '#dddddd' };
    // }
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
  onCellKeyDown: event => {
    // console.log('Event keyDown:', event);
    const key = event.event.key;
    if (key === 'Enter') {
      handleSelectedClick();
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
        if (nextRowIndex >= 0 && nextRowIndex < myGrid.value.api.getDisplayedRowCount()) {
          myGrid.value.api.forEachNode(node => {
            if (node.rowIndex === nextRowIndex) {
              node.setSelected(true);
            } else {
              node.setSelected(false);
            }
          });
          myGrid.value.api.ensureIndexVisible(nextRowIndex);
        }
      }
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);
  },
  onRowDoubleClicked: function (event) {
    if (event.data) {
      // Emit the selected values through onDismiss event
      onDialogOK(event.data);
      // Close the dialog
      onDialogCancel();
    }
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
    // event.api.startEditingCell({
    //   rowIndex: event.rowIndex,
    //   colKey: event.column.getId(),
    // });
  },
  // isRowSelectable: node => !node.footer,
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
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px
</style>
