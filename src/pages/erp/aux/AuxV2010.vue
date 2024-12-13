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
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-12 col-lg-5">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">평가자 선택</span>
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
                    class="q-px-md"
                    label-color="orange"
                    v-model="selectedDeptH"
                    :options="deptOptionsX"
                    option-value="deptCd"
                    option-label="deptNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 150px; max-width: 150px"
                    label="소속팀"
                    @update:model-value="getDataEmp"
                  />
                  <q-toggle
                    :label="`${selectedCatgCh}`"
                    color="orange"
                    false-value="전체"
                    true-value="평가자"
                    v-model="selectedCatgCh"
                    @update:model-value="getDataEmp"
                  />
                  <q-input
                    stack-label
                    label-color="orange"
                    bottom-slots
                    v-model="searchValue"
                    label="검색"
                    dense
                    class="q-ml-sm q-pb-none"
                    style="width: 120px"
                  >
                    <template v-slot:append>
                      <q-icon v-if="searchValue !== ''" name="close" @click="searchValue = ''" class="cursor-pointer" />
                    </template>
                  </q-input>
                </div>
                <q-space />
                <q-btn outline color="positive" dense @click="getDataEmp"><q-icon name="search" size="xs" /> 조회 </q-btn>
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
        </div>
        <!--  end of contents list -->
        <!-- contents List -->
        <div class="col-12 col-lg-7">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">평가대상자 선택</span>
            </q-bar>
            <!--  end of contents list title bar -->
            <div class="row q-pa-xs">
              <div v-if="!isEmpty(selectedRows)" class="col-xs-12 col-sm-3 row">
                <span class="text-subtitle1 text-bold q-mx-sm q-pt-sm">평가자 : </span>
                <span class="text-subtitle1 text-bold q-pt-sm"> {{ selectedRows[0].empNm }}</span>
                <q-space />
                <q-btn v-if="$q.screen.xs && isShowSaveBtn1" outline color="primary" dense class="q-ma-xs q-pr-lg" @click="saveDataSection">
                  <q-badge color="orange" floating>{{ selectedRowsTarget.length }}</q-badge>
                  <q-icon name="save" size="xs" class="q-mr-sm" />
                  저장
                </q-btn>
              </div>

              <div class="col-xs-12 col-sm-9 row">
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md"
                  label-color="orange"
                  v-model="selectedEvs"
                  :options="evsOptions"
                  option-value="commCd"
                  option-label="commNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 120px; max-width: 120px"
                  label="평가승인구분"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md q-mr-xs"
                  label-color="orange"
                  v-model="selectedDept"
                  :options="deptOptions"
                  option-value="deptCd"
                  option-label="deptNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 120px; max-width: 120px"
                  label="소속팀"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md"
                  label-color="orange"
                  v-model="selectedTitl"
                  :options="titlOptions"
                  option-value="titlCd"
                  option-label="titlNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 100px; max-width: 100px"
                  label="직급"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-select
                  dense
                  :disable="isDesableEvs"
                  stack-label
                  options-dense
                  class="q-px-md"
                  label-color="orange"
                  v-model="selectedCatg"
                  :options="catgOptions"
                  option-value="catgCd"
                  option-label="catgNm"
                  option-disable="inactive"
                  emit-value
                  map-options
                  style="min-width: 100px; max-width: 100px"
                  label="직분류"
                  @update:model-value="getDataSelectEmpCall"
                />
                <q-space />
                <div class="q-gutter-xs q-pa-xs">
                  <q-btn
                    v-if="oldRowCount > 0 || selectedRowsTarget.length > 0"
                    outline
                    color="primary"
                    dense
                    class="q-ma-xs q-pr-lg"
                    @click="saveDataSection"
                  >
                    <q-badge v-if="selectedRowsTarget.length === 0 && oldRowCount > 0" color="orange" floating>{{ oldRowCount }}</q-badge>
                    <q-badge v-if="selectedRowsTarget.length > 0" color="orange" floating>{{ selectedRowsTarget.length }}</q-badge>
                    <q-icon name="save" size="xs" class="q-mr-sm" />
                    <span v-if="selectedRowsTarget.length === 0 && oldRowCount > 0">삭제</span>
                    <span v-if="selectedRowsTarget.length > 0">저장</span>
                  </q-btn>
                </div>
              </div>
            </div>

            <q-separator size="3px" />

            <q-card-section class="q-pa-xs">
              <div :style="contentZoneStyle">
                <ag-grid-vue
                  ref="myGrid1"
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :grid-options="gridOptionsTarget"
                >
                </ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
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
import { Notify, QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import { isEmpty } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();

const $q = useQuasar();

let isSaveFg = 'I';
const isDesableEvs = ref(true);
const selectedCatgCh = ref('평가자');

const searchValue = ref('');

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataEmp = reactive({ rows: [] });

const updateData = ref([]);
const showSaveBtn = ref(false);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataEmp();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
  getDataDeptOption();
  getDataTitlOption();
  getDataCatgOption();
  getDataCommOption('201');
});

const columnDefsEmp = reactive({
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
      headerName: '',
      field: '',
      maxWidth: 60,
      minWidth: 60,
      initialPinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
    },
    {
      headerName: '사번',
      field: 'empCd',
      minWidth: 95,
    },
    {
      headerName: '성명',
      field: 'empNm',
      minWidth: 80,
    },
    {
      headerName: '직분류',
      field: 'catgNm',
      minWidth: 90,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 75,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 140,
    },
  ],
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      filter: false,
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
      sortable: false,
      filter: false,
      minWidth: 60,
      maxWidth: 60,
      pinned: 'left',
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      headerName: '사번',
      field: 'evtEmpCd',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '성명',
      field: 'evtEmpNm',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: '소속팀',
      field: 'deptGroupNm',
      minWidth: 150,
    },
    {
      headerName: '직급',
      field: 'titlNm',
      minWidth: 90,
      maxWidth: 90,
    },
    {
      headerName: '직분류',
      field: 'catgNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '대상그룹',
      field: 'evtgNm',
      minWidth: 100,
      maxWidth: 150,
    },
    {
      headerName: '평가자',
      field: 'evsEmpNm',
      minWidth: 100,
      maxWidth: 100,
    },
  ],
});

const selectedRows = ref();
const selectedRowsTarget = ref([]);
const isShowSaveBtn1 = ref(false);
const isShowSaveBtn3 = ref(false);
const oldRowCount = ref(0);

const getDataSelectEmpCall = () => {
  getDataSelectEmp().then(resData => {
    selectedRowsTarget.value = [];
    oldRowCount.value = 0;
    myGrid1.value.api.forEachNode(node => {
      // console.log('node : ', node.data.iuD);
      // 타겟 평가자와 선택한 평가자가 같은면 체크
      if (node.data.iuD === 'U') {
        node.setSelected(true);
        oldRowCount.value++;
      }
    });
    if (isEmpty(selectedRowsTarget.value)) {
      isShowSaveBtn1.value = false;
      isShowSaveBtn3.value = false;
    }
    oldRowCount.value = rowData.rows.length;
    // console.log('oldRowCount : ', oldRowCount.value);
  });
};

const saveDataSection = () => {
  let iu = [];
  let iuD = [];

  for (let i = 0; i < rowData.rows.length; i++) {
    if (rowData.rows[i].iuD === 'U') {
      let tmpJson = '{"mode": "D","data":' + JSON.stringify(rowData.rows[i]) + '}';
      // console.log('row Del : ', JSON.stringify(rowData.rows[i]));
      iuD.push(tmpJson);
    }
  }

  for (let i = 0; i < selectedRowsTarget.value.length; i++) {
    let tmpJson = '{"mode": "I","data":' + JSON.stringify(selectedRowsTarget.value[i]) + '}';
    // console.log('row Ins : ', JSON.stringify(selectedRowsTarget.value[i]));
    iu.push(tmpJson);
  }

  // console.log('row Del : ', JSON.stringify(iuD));
  // console.log('row Ins : ', JSON.stringify(iu));
  saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
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
const myGrid = ref(null);
const myGrid1 = ref(null);

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getDataEmp = async () => {
  try {
    const response = await api.post('/api/aux/aux2010_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: selectedDeptH.value,
      paramCatgCh: selectedCatgCh.value,
      paramSearchValue: searchValue.value,
    });
    rowDataEmp.rows = response.data.data;
    if (myGrid.value && myGrid.value.api) {
      myGrid.value.api.setRowData(rowDataEmp.rows); // this should trigger the grid to reload data
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 인사정보 소속사원 자료 가져오기 부분  *****************************//
const getDataSelectEmp = async () => {
  try {
    const response = await api.post('/api/aux/aux2010_select', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: selectedDept.value,
      paramTitlCd: selectedTitl.value,
      paramCatgCd: selectedCatg.value,
      paramEvsEmpCd: selectedRows.value[0].empCd,
      paramEvsCd: selectedEvs.value,
    });
    rowData.rows = response.data.data;
    if (myGrid1.value && myGrid1.value.api) {
      myGrid1.value.api.setRowData(rowData.rows); // this should trigger the grid to reload data
    }

    // console.log('seleData : ', JSON.stringify(rowData.rows));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/aux/aux2010_save', resFormData)
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
const deptOptionsX = ref([]);
const catgOptions = ref([]);
const catgOptionsX = ref([]);

const selectedDept = ref('');
const selectedDeptH = ref('');
const selectedCatg = ref('');
const selectedCatgH = ref('');
async function getDataDeptOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });

    deptOptions.value = response.data.data;
    deptOptionsX.value = JSON.parse(JSON.stringify(deptOptions.value));
    deptOptions.value.unshift({ deptCd: '', deptNm: '전체' });
    deptOptionsX.value.unshift({ deptCd: '', deptNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function getDataCatgOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/catg_option_list', { paramSetYear: storeYear.setYear });

    catgOptions.value = response.data.data;
    catgOptionsX.value = JSON.parse(JSON.stringify(catgOptions.value));
    catgOptions.value.unshift({ catgCd: '', catgNm: '전체' });
    catgOptionsX.value.unshift({ catgCd: '', catgNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 직급자료 가져오기 부분 *****************************//
const titlOptions = ref([]);
const selectedTitl = ref('');
async function getDataTitlOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/titl_option_list', { paramSetYear: storeYear.setYear });

    titlOptions.value = response.data.data;
    titlOptions.value.unshift({ titlCd: '', titlNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 공통코드 가져오기 부분 *****************************//
const evsOptions = ref([]);
const selectedEvs = ref(null);
// ***** 공통코드정보 가져오기 부분  *****************************//
async function getDataCommOption(resParamCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resParamCommCd1 });
    evsOptions.value = response.data.data;
    selectedEvs.value = evsOptions.value[0].commCd;
    // deptOptions.value.push({ commCd: '', commNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const gridOptions = {
  columnDefs: columnDefsEmp.columns,
  rowData: rowDataEmp.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
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
    if (!isEmpty(selectedRows.value)) {
      // console.log('year : ', selectedRows.value[0].stdYear);
      getDataSelectEmpCall();
      isDesableEvs.value = false;
    } else {
      isDesableEvs.value = true;
      oldRowCount.value = 0;
      rowData.rows = [];
      myGrid1.value.api.setRowData(rowData.rows);
    }
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

const gridOptionsTarget = {
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
    selectedRowsTarget.value = event.api.getSelectedRows();
    if (isEmpty(selectedRowsTarget.value)) {
      isShowSaveBtn1.value = false;
      isShowSaveBtn3.value = true;
    } else {
      isShowSaveBtn3.value = false;
      isShowSaveBtn1.value = true;
    }
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
