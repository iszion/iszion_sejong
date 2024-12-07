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
            label="품목검색"
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
            :label="`${searchParams.searchAll === 'Y' ? '전체' : '사용품목만'}`"
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
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :columnDefs="columnDefs.columns"
            :rowData="rowData.rows"
            @selection-changed="onSelectionChanged"
            @grid-ready="onGridReady"
            :suppressCellSelection="true"
            @cellKeyDown="onCellKeyDown"
            @rowDoubleClicked="onRowDoubleClicked"
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
  paramProdNm: {
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
const rowSelection = ref(null);
const rowData = reactive({ rows: [] });
const searchParams = ref({
  searchNm: params.paramProdNm,
  searchCd: '',
  searchAll: 'N',
});

const gridOptions = {
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  },
  localeText: { noRowsToShow: '자료가 없습니다.' },
  getRowStyle: function (param) {
    console.log('param: ', param.data.closeDay);
    if (param.data.closeDay) {
      if (param.data.closeDay <= params.paramCloseDay) {
        param.data.closeDay = commUtil.formatDate(param.data.closeDay);
        return { color: '#ff0505' };
      } else {
        param.data.closeDay = '';
      }
    }
    return {};
  },
};

const columnDefs = reactive({
  columns: [
    { headerName: '코드', field: 'prodCd', maxWidth: 80, minWidth: 80, pinned: 'left' },
    { headerName: '품명', field: 'prodNm', minWidth: 100 },
    { headerName: '규격', field: 'prodSize', minWidth: 100 },
    { headerName: '단위', field: 'prodUnit', minWidth: 80 },
    { headerName: '정지일자', field: 'closeDay', minWidth: 100 },
  ],
});

onBeforeMount(() => {
  getData();
});

const selectedRows = ref(null);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  // alert(selectedRows.value[0].prodCd);
};
const gridApi = ref(null);
const gridColumnApi = ref(null);
const onGridReady = params => {
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;
  gridApi.value.setGridOption('headerHeight', 30);
  gridApi.value.setGridOption('rowHeight', 30);
};

const onCellKeyDown = params => {
  const key = params.event.key;
  if (key === 'Enter') {
    handleSelectedClick();
  } else {
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      // 상하 키를 누를 때 행 이동 로직 추가
      const currentRowIndex = params.rowIndex;
      let nextRowIndex = currentRowIndex;
      console.log('index : ', nextRowIndex);
      if (key === 'ArrowUp') {
        nextRowIndex = currentRowIndex - 1;
      } else if (key === 'ArrowDown') {
        nextRowIndex = currentRowIndex + 1;
      }
      if (nextRowIndex >= 0 && nextRowIndex < gridApi.value.getDisplayedRowCount()) {
        gridApi.value.forEachNode(node => {
          if (node.rowIndex === nextRowIndex) {
            node.setSelected(true);
          } else {
            node.setSelected(false);
          }
        });
        gridApi.value.ensureIndexVisible(nextRowIndex);
      }
    }
  }
};

const handleSelectedClick = () => {
  if (selectedRows.value && selectedRows.value.length > 0) {
    const selectedProdCd = selectedRows.value[0].prodCd;
    const selectedProdNm = selectedRows.value[0].prodNm;

    // Emit the selected values through onDismiss event
    onDialogOK({ prodCd: selectedProdCd, prodNm: selectedProdNm });
    onDialogCancel();
  }
};

const onRowDoubleClicked = params => {
  if (selectedRows.value && selectedRows.value.length > 0) {
    const selectedProdCd = selectedRows.value[0].prodCd;
    const selectedProdNm = selectedRows.value[0].prodNm;

    // Emit the selected values through onDismiss event
    onDialogOK({ prodCd: selectedProdCd, prodNm: selectedProdNm });
    onDialogCancel();
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 품목정보 검색리스트 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/helpProd_list', {
      paramProdNm: searchParams.value.searchNm,
      paramCloseDay: params.paramCloseDay,
      paramAll: searchParams.value.searchAll,
    });
    rowData.rows = response.data.data;
    if (response.data.data.length > 0) {
      setTimeout(() => {
        if (gridApi.value) {
          gridApi.value.setFocusedCell(0, 'prodCd');
          const focusedRowIndex = 0; // Assuming it's the first row, you can adjust this index as needed
          const focusedRowNode = gridApi.value.getDisplayedRowAtIndex(focusedRowIndex);
          if (focusedRowNode) {
            focusedRowNode.setSelected(true);
          }
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
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px
</style>
