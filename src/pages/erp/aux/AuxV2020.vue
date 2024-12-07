<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>
      <!-- contents List -->
      <q-card bordered>
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
                v-model="selectedDept"
                :options="deptOptions"
                option-value="deptCd"
                option-label="deptNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 150px; max-width: 150px"
                label="소속팀"
                @update:model-value="getData"
              />
              <q-select
                dense
                stack-label
                options-dense
                class="q-px-md q-mr-sm"
                label-color="orange"
                v-model="selectedCatg"
                :options="catgOptions"
                option-value="catgCd"
                option-label="catgNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 150px; max-width: 150px"
                label="직분류"
                @update:model-value="getData"
              />
              <q-input stack-label label-color="orange" bottom-slots v-model="searchValue" label="검색" dense class="q-pb-none" style="width: 120px">
                <template v-slot:append>
                  <q-icon v-if="searchValue !== ''" name="close" @click="searchValue = ''" class="cursor-pointer" />
                </template>
              </q-input>
            </div>
            <q-space />
            <q-btn outline color="positive" dense @click="getData"><q-icon name="search" size="xs" /> 조회 </q-btn>
          </q-toolbar>
        </q-card-actions>

        <q-separator size="3px" />

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
      <!--  end of contents list -->
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
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { isEmpty } from 'lodash';
const storeYear = useYearInfoStore();

const $q = useQuasar();

let isSaveFg = 'I';

const searchValue = ref('');

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });

const updateData = ref([]);
const showSaveBtn = ref(false);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
  getDataDeptOption();
  getDataCatgOption();
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      minWidth: 60,
      maxWidth: 60,
      initialPinned: 'left',
      cellStyle: { textAlign: 'center' },
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '사번',
      field: 'empCd',
      minWidth: 95,
      maxWidth: 100,
      initialPinned: 'left',
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 80,
      maxWidth: 80,
      initialPinned: 'left',
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 120,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 75,
    },
    {
      headerName: '성과 평가자',
      field: 'evsEmpNm1',
      minWidth: 130,
    },
    {
      headerName: '1차역량 평가자',
      field: 'evsEmpNm2',
      minWidth: 130,
    },
    {
      headerName: '2차역량 평가자',
      field: 'evsEmpNm3',
      minWidth: 130,
    },
  ],
});

const selectedRows = ref([]);

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
const myGrid = ref(null);

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/aux/aux2020_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: selectedDept.value,
      paramCatgCd: selectedCatg.value,
      paramSearchValue: searchValue.value,
    });
    rowData.rows = response.data.data;
    if (myGrid.value && myGrid.value.api) {
      myGrid.value.api.setRowData(rowData.rows); // this should trigger the grid to reload data
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//

// ***** DataBase 소속자료 가져오기 부분 *****************************//
const deptOptions = ref([]);
const catgOptions = ref([]);

const selectedDept = ref('');
const selectedCatg = ref('');
async function getDataDeptOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });

    deptOptions.value = response.data.data;
    deptOptions.value.unshift({ deptCd: '', deptNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function getDataCatgOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/catg_option_list', { paramSetYear: storeYear.setYear });

    catgOptions.value = response.data.data;
    catgOptions.value.unshift({ catgCd: '', catgNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const gridOptions = {
  columnDefs: columnDefs.columns,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: true,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }

    // 여기서 evsEmpNm1과 evsEmpNm2가 다른 경우 배경을 빨간색으로 설정
    if (param.data.evsEmpCd1 === null || param.data.evsEmpCd2 === null || param.data.evsEmpCd1 !== param.data.evsEmpCd2) {
      return { backgroundColor: 'red' };
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
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged');
    selectedRows.value = event.api.getSelectedRows();
    // console.log('onSelectionChanged : ', JSON.stringify(selectedRows.value));
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
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
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};
</script>
