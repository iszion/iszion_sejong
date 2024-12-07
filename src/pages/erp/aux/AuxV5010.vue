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
              <span class="text-subtitle2 q-px-sm">초기화 직원 선택</span>
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
                  <q-input
                    stack-label
                    label-color="orange"
                    bottom-slots
                    v-model="searchValue"
                    label="검색"
                    dense
                    class="q-pb-none"
                    style="width: 120px"
                  >
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
        </div>
        <!--  end of contents list -->
        <!-- contents List -->
        <div class="col-12 col-lg-7">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">초기화내용 선택</span>
            </q-bar>
            <!--  end of contents list title bar -->
            <div class="row q-pa-md q-col-gutter-sm-x-md q-gutter-xs-y-md">
              <div class="col-xs-12 col-sm-4">
                <q-card bordered :class="$q.dark.isActive ? 'bg-grey-7 text-yellow-5' : 'bg-grey-3 text-dark'">
                  <q-card-section>
                    <div class="text-h6 text-center">성과평가</div>
                    <q-separator class="q-my-md" />
                    <div class="text-subtitle2 text-bold text-center">
                      총 처리인원 :
                      <span class="text-subtitle1 text-bold q-ml-sm" :class="$q.dark.isActive ? 'text-deep-orange-6' : 'text-deep-orange'">
                        {{ selectedRows.length }}</span
                      >
                      명
                    </div>
                  </q-card-section>

                  <q-separator />
                  <q-card-section> 상기 인원의 성과평가 마감완료 상태를 평가마감 이전상태로 모두 초기화 됩니다. </q-card-section>

                  <q-separator size="3px" />

                  <q-card-actions>
                    {{ selectedRows.length }}
                    <q-space />
                    <q-btn
                      flat
                      :disable="selectedRows.length === 0"
                      class="text-bold"
                      :class="$q.dark.isActive ? 'text-deep-orange-6' : 'text-deep-orange'"
                      @click="handleEvaReset('성과평가', '2011101')"
                      >초기화 진행</q-btn
                    >
                  </q-card-actions>
                </q-card>
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-card bordered :class="$q.dark.isActive ? 'bg-grey-8 text-yellow-5' : 'bg-grey-5 text-dark'">
                  <q-card-section>
                    <div class="text-h6 text-center">역량평가 (1차)</div>
                    <q-separator class="q-my-md" />
                    <div class="text-subtitle2 text-bold text-center">
                      총 처리인원 :
                      <span class="text-subtitle1 text-bold q-ml-sm" :class="$q.dark.isActive ? 'text-deep-orange-6' : 'text-deep-orange'">
                        {{ selectedRows.length }}</span
                      >
                      명
                    </div>
                  </q-card-section>

                  <q-separator />
                  <q-card-section> 상기 인원의 1차 역량평가 마감완료 상태를 평가마감 이전상태로 모두 초기화 됩니다. </q-card-section>

                  <q-separator size="3px" />

                  <q-card-actions>
                    <q-space />
                    <q-btn
                      flat
                      :disable="selectedRows.length === 0"
                      class="text-bold"
                      :class="$q.dark.isActive ? 'text-deep-orange-5' : 'text-deep-orange-9'"
                      @click="handleEvaReset('1차역량평가', '2011201')"
                      >초기화 진행</q-btn
                    >
                  </q-card-actions>
                </q-card>
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-card bordered :class="$q.dark.isActive ? 'bg-grey-9 text-yellow-5' : 'bg-grey-6 text-dark'">
                  <q-card-section>
                    <div class="text-h6 text-center">역량평가 (2차)</div>
                    <q-separator class="q-my-md" />
                    <div class="text-subtitle2 text-bold text-center">
                      총 처리인원 :
                      <span class="text-subtitle1 text-bold q-ml-sm" :class="$q.dark.isActive ? 'text-deep-orange-6' : 'text-deep-orange'">
                        {{ selectedRows.length }}</span
                      >
                      명
                    </div>
                  </q-card-section>

                  <q-separator />
                  <q-card-section> 상기 인원의 2차 역량평가 마감완료 상태를 평가마감 이전상태로 모두 초기화 됩니다. </q-card-section>

                  <q-separator size="3px" />

                  <q-card-actions>
                    <q-space />
                    <q-btn
                      flat
                      :disable="selectedRows.length === 0"
                      class="text-bold"
                      :class="$q.dark.isActive ? 'text-deep-orange-4' : 'text-deep-orange-10'"
                      @click="handleEvaReset('2차역량평가', '2011202')"
                      >초기화 진행</q-btn
                    >
                  </q-card-actions>
                </q-card>
              </div>
            </div>
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
      headerName: '',
      field: '',
      maxWidth: 60,
      minWidth: 60,
      initialPinned: 'left',
      headerCheckboxSelection: true,
      cellStyle: { textAlign: 'center' },
      checkboxSelection: true,
    },
    {
      headerName: '사번',
      field: 'evsEmpCd',
      minWidth: 95,
    },
    {
      headerName: '성명',
      field: 'evsEmpNm',
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

const selectedRows = ref([]);

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

const handleEvaReset = (resText, resEvs) => {
  $q.dialog({
    dark: true,
    title: '[ ' + resText + ' ] 초기화',
    message: '초기화 작업을 진행 하시겠습니까? ',
    // persistent: true,
    ok: {
      label: '초기화진행',
      push: true,
      color: 'deep-orange',
    },
    cancel: {
      label: '취소',
      push: true,
      color: 'grey-7',
    },
  })
    .onOk(() => {
      evaResetProcess(resEvs);
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const evaResetProcess = resEvs => {
  let iu = [];
  let iuD = [];
  // 신규 추가 부분
  for (let i = 0; i < selectedRows.value.length; i++) {
    selectedRows.value[i].evsCd = resEvs;
    let tmpJson = '{"mode": "U", "data":' + JSON.stringify(selectedRows.value[i]) + '}';
    iu.push(tmpJson);
  }
  // console.log('iu ::: ', JSON.stringify(iu));
  // console.log('iuD ::: ', JSON.stringify(iuD));
  if (isEmpty(iu) && isEmpty(iuD)) {
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
    if (resEvs === '2011101') {
      saveDataAndHandleResult_2011101(jsonUtil.jsonFiller(iu, iuD));
    } else {
      saveDataAndHandleResult_2011201(jsonUtil.jsonFiller(iu, iuD));
    }
    setTimeout(() => {
      getData();
    }, 500);
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const myGrid = ref(null);

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/aux/aux5010_list', {
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
const saveDataAndHandleResult_2011101 = resFormData => {
  api
    .post('/api/aux/aux5010_save_2011101', resFormData)
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

const saveDataAndHandleResult_2011201 = resFormData => {
  api
    .post('/api/aux/aux5010_save_2011201', resFormData)
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
