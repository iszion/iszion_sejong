<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-section>
            <div>
              <q-splitter v-model="splitterModel" horizontal :style="contentZoneStyle" @update:model-value="handelSplitterResize">
                <template v-slot:before>
                  <div ref="beforeSection">
                    <div class="row">
                      <div class="row q-col-gutter-md">
                        <q-select
                          dense
                          stack-label
                          options-dense
                          class="q-pb-sm q-mr-lg"
                          label-color="orange"
                          v-model="searchParam.salesCd"
                          :options="salesOptionsSearch"
                          option-value="salesCd"
                          option-label="salesNm"
                          option-disable="inactive"
                          emit-value
                          map-options
                          style="min-width: 130px; max-width: 130px"
                          label="영업담당"
                          @update:model-value="handelGetData"
                        />
                        <q-select
                          dense
                          stack-label
                          options-dense
                          class="q-pb-sm q-mr-lg"
                          label-color="orange"
                          v-model="searchParam.consCd"
                          :options="consOptionsSearch"
                          option-value="commCd"
                          option-label="commNm"
                          option-disable="inactive"
                          emit-value
                          map-options
                          style="min-width: 130px; max-width: 130px"
                          label="공사구분"
                          @update:model-value="handelGetData"
                        />
                        <q-select
                          dense
                          stack-label
                          options-dense
                          class="q-pb-sm q-mr-lg"
                          label-color="orange"
                          v-model="searchParam.stepCd"
                          :options="stepOptionsSearch"
                          option-value="commCd"
                          option-label="commNm"
                          option-disable="inactive"
                          emit-value
                          map-options
                          style="min-width: 130px; max-width: 130px"
                          label="진행상태"
                          @update:model-value="handelGetData"
                        />

                        <q-input
                          stack-label
                          bottom-slots
                          label-color="orange"
                          v-model="searchParam.word"
                          label="검색"
                          dense
                          class="q-pb-none"
                          style="width: 120px"
                          @keyup.enter="handelGetData"
                        >
                          <template v-slot:append>
                            <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                          </template>
                        </q-input>
                      </div>
                      <q-space />
                      <div class="q-gutter-sm">
                        <q-btn outline color="positive" dense @click="handelGetData"><q-icon name="search" size="xs" class="" /> 조회 </q-btn>
                      </div>
                    </div>

                    <div :style="contentGridBeforeHeight">
                      <ag-grid-vue
                        ref="myGrid"
                        style="width: 100%; height: 100%"
                        :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                        :grid-options="gridOptions"
                      >
                      </ag-grid-vue>
                    </div>

                    <div class="q-pa-md flex flex-center">
                      <q-select
                        dense
                        borderless
                        v-model="pagination.pageRows"
                        options-dense
                        :options="pagination.pageOption"
                        class="q-mr-md"
                        @update:model-value="handelGetData"
                      />
                      <q-pagination
                        v-model="currentPages"
                        :max="totalPages"
                        :max-pages="currentGroup"
                        direction-links
                        boundary-links
                        icon-first="skip_previous"
                        icon-last="skip_next"
                        icon-prev="fast_rewind"
                        icon-next="fast_forward"
                        @update:model-value="handlePageChange"
                      />
                    </div>
                  </div>
                </template>

                <template v-slot:after>
                  <div class="q-mt-md">
                    <div class="row q-pb-sm flex-center">
                      <span class="text-bold text-subtitle1"
                        ><q-icon name="style" size="sm" color="teal" /> <span class="text-orange"> {{ viewProjectNm }}</span></span
                      >
                      <q-space />
                      <div class="q-gutter-sm">
                        <q-btn v-if="selectedRows.length > 0" outline color="positive" dense @click="addDataSection"
                          ><q-icon name="add" size="xs" /> 신규
                        </q-btn>
                        <q-btn v-if="updateData.length > 0" outline color="primary" dense @click="saveDataSection"
                          ><q-icon name="save" size="xs" /> 저장
                        </q-btn>
                        <q-btn v-if="selectedRowsOrd.length > 0" outline color="negative" dense @click="deleteDataSection">
                          <q-icon name="delete" size="xs" /> 삭제</q-btn
                        >
                      </div>
                    </div>
                    <div :style="contentGridAfterHeight">
                      <ag-grid-vue
                        ref="myGrid1"
                        style="width: 100%; height: 100%"
                        :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                        :grid-options="gridOptions1"
                      >
                      </ag-grid-vue>
                    </div>
                  </div>
                </template>
              </q-splitter>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
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
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;

const splitterModel = ref(60);
const beforeSection = ref(null);
const dualScreenHeight = reactive({
  before: 0,
  after: 0,
});
const handelSplitterResize = () => {
  dualScreenHeight.before = (contentZoneHeight.value * splitterModel.value) / 100;
  dualScreenHeight.after = contentZoneHeight.value - dualScreenHeight.before;
  // console.log('Before : ', dualScreenHeight.before);
  // console.log('after : ', dualScreenHeight.after);
};

const salesOptionsSearch = ref(null);
const stepOptionsSearch = ref(null);
const consOptionsSearch = ref(null);
const viewProjectNm = ref(null);

const searchParam = reactive({
  salesCd: '',
  consCd: '',
  stepCd: '',
  word: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);
const isScreenVisible = ref(true);

const contentZoneHeight = ref(500);
const handleResize = () => {
  // console.log('windows height : ', window.innerHeight);
  contentZoneHeight.value = window.innerHeight - 180;
  if (window.innerHeight <= 800) {
    splitterModel.value = 55;
  } else if (window.innerHeight <= 900) {
    splitterModel.value = 60;
  } else if (window.innerHeight <= 1090) {
    splitterModel.value = 68;
  } else if (window.innerHeight <= 1240) {
    splitterModel.value = 70;
  } else if (window.innerHeight <= 1440) {
    splitterModel.value = 72;
  } else if (window.innerHeight <= 1920) {
    splitterModel.value = 70;
  } else {
    splitterModel.value = 80;
  }
};

const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));
const contentGridBeforeHeight = computed(() => ({
  height: `${dualScreenHeight.before - 110}px`,
}));
const contentGridAfterHeight = computed(() => ({
  height: `${dualScreenHeight.after - 65}px`,
}));

const rowData = reactive({ rows: [], rowsOrd: [] });
const rowDataOrdBack = ref([]);

// 편집기에서 날짜 값을 가져올 때
// 날짜 형식 변환기
const dateGetter = (params, field) => {
  const dateStr = params.data[field];
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

// 편집 후 데이터를 저장할 때
const dateSetter = (params, field) => {
  const dateStr = params.newValue.replace(/-/g, '');
  if (dateStr.length === 8) {
    params.data[field] = dateStr;
    return true;
  }
  return false;
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  handleResize();
  handelSplitterResize();

  // 영업담당
  getDataSalesOption().then(() => {
    getDataCommOption('102').then(() => {
      getDataCommOption('301').then(() => {
        handelGetData();
      });
    });
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs = reactive({
  columns: [
    {
      headerName: 'No',
      field: 'rowNum',
      minWidth: 70,
      filter: true,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '관리번호',
      field: 'projectCd',
      minWidth: 100,
      maxWidth: 100,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '프로젝트명',
      field: 'projectNm',
      minWidth: 250,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '계약',
      field: 'ordCnt',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: '진행상태',
      field: 'stepNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '영업규모',
      field: 'levelNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '발주처',
      field: 'orcu1Nm',
      minWidth: 150,
    },
    {
      headerName: '공사구분',
      field: 'consNm',
      minWidth: 100,
    },
    {
      headerName: '유형',
      field: 'typeNm',
      minWidth: 100,
    },
    {
      headerName: '영업담당',
      field: 'salesNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '등록일',
      field: 'makeDay',
      valueFormatter: params => dateGetter(params, 'makeDay'),
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '수주일',
      field: 'orderDay',
      valueFormatter: params => dateGetter(params, 'orderDay'),
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '폐기',
      field: 'outDay',
      valueFormatter: params => dateGetter(params, 'outDay'),
      maxWidth: 120,
      minWidth: 120,
    },
    {
      headerName: '참고사항',
      field: 'explains',
      maxWidth: 100,
      minWidth: 100,
    },
  ],
  columnsOrd: [
    {
      headerName: '#',
      maxWidth: 50,
      minWidth: 50,
      editable: false,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      editable: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,

      filter: false,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '계약(변경)일',
      field: 'ordDay',
      maxWidth: 130,
      minWidth: 130,
      cellEditor: 'agDateStringCellEditor',
      // valueFormatter: params => dateGetter(params, 'ordDay'),
      valueGetter: params => dateGetter(params, 'ordDay'),
      valueSetter: params => dateSetter(params, 'ordDay'),
    },
    {
      headerName: '공법명',
      field: 'methodNm',
      maxWidth: 130,
      minWidth: 130,
      editable: true,
    },
    {
      headerName: '예상물량',
      field: 'estQty',
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
      headerName: '예상금액',
      field: 'estAmt',
      minWidth: 130,
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
    },
    {
      headerName: '수주(계약)물량',
      field: 'ordQty',
      minWidth: 130,
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
    },
    {
      headerName: '수주(계약)금액',
      field: 'ordAmt',
      minWidth: 130,
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
    },
    {
      headerName: '시공사',
      field: 'orcu2Nm',
      maxWidth: 130,
      minWidth: 130,
      editable: true,
    },
    {
      headerName: '설계사',
      field: 'orcu3Nm',
      maxWidth: 130,
      minWidth: 130,
      editable: true,
    },
    {
      headerName: '참조',
      field: 'explains',
      maxWidth: 130,
      minWidth: 130,
      editable: true,
    },
  ],
});

const selectedRows = ref([]);
const selectedRowsOrd = ref([]);
const updateData = ref([]);

const handleCellValueChanged = event => {
  const rowDataItem = event.data;

  let ch = true;
  for (let i = 0; updateData.value.length > i; i++) {
    if (updateData.value[i].seq === rowDataItem.seq) {
      updateData.value[i] = rowDataItem;
      ch = false;
    }
  }
  if (ch) {
    updateData.value.push(rowDataItem);
  }
  console.log('update :: ', JSON.stringify(updateData.value));
};

const addDataSection = () => {
  const addIndex = 0;
  const newItems = {
    projectCd: selectedRows.value[0].projectCd,
    seq: rowData.rowsOrd.reduce((max, obj) => (obj.seq > max ? obj.seq : max), 0) + 1,
    ordDay: '',
    methodNm: '',
    estQty: '0',
    estAmt: '0',
    ordQty: '0',
    ordAmt: '0',
    orcu2Nm: '',
    orcu3Nm: '',
    explains: '',
    iuD: 'I',
  };
  rowData.rowsOrd.splice(addIndex, 0, newItems);
  // Refresh the grid
  myGrid1.value.api.setGridOption('rowData', rowData.rowsOrd);
  // 첫컬럼에 focus
  myGrid1.value.api.setFocusedCell(addIndex, 'ordDay');
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
      for (let i = 0; i < selectedRowsOrd.value.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRowsOrd.value[i]) + '}';
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
  saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mkt/mkt3020_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      updateData.value = [];
      selectedRowsOrd.value = [];
      getDataSelectList(selectedRows.value[0].projectCd).then(() => {
        const selectedData = myGrid.value.api.getSelectedRows();
        selectedData[0].ordCnt = rowData.rowsOrd.length;
        myGrid.value.api.applyTransaction({
          update: selectedData,
        });
      });
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const handelGetData = () => {
  getDataMaxPages().then(() => {
    getData();
  });
};

const getDataMaxPages = async () => {
  totalPages.value = 0;
  currentPages.value = 0;
  pagination.startRowNum = 0;
  try {
    const response = await api.post('/api/mkt/mkt3010_maxPages', {
      paramSalesCd: searchParam.salesCd,
      paramConsCd: searchParam.consCd,
      paramStepCd: searchParam.stepCd,
      paramSearchValue: searchParam.word,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    let maxRows = response.data.data[0].maxPages;
    totalPages.value = Math.ceil(maxRows / pagination.pageRows);
    // console.log('totalPage : ', totalPages.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getData = async () => {
  try {
    const response = await api.post('/api/mkt/mkt3010_list', {
      paramSalesCd: searchParam.salesCd,
      paramConsCd: searchParam.consCd,
      paramStepCd: searchParam.stepCd,
      paramSearchValue: searchParam.word,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelectList = async resProjectCd => {
  try {
    const response = await api.post('/api/mkt/mkt3020_select_list', {
      paramProjectCd: resProjectCd,
    });
    rowData.rowsOrd = response.data.data;
    rowDataOrdBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid1.value.api.setGridOption('rowData', rowData.rowsOrd);
    myGrid1.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    updateData.value = [];
    selectedRowsOrd.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

async function getDataSalesOption() {
  try {
    const response = await api.post('/api/mst/sales_option_list', {});

    // console.log('getData1: ', JSON.stringify(response.data.data));
    salesOptionsSearch.value = response.data.data;
    salesOptionsSearch.value.unshift({ salesCd: '', salesNm: '전체' });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '102': // 공사구분
        consOptionsSearch.value = response.data.data;
        consOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      case '301': // 진행상태
        stepOptionsSearch.value = response.data.data;
        stepOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        consOptionsSearch.value = [];
        stepOptionsSearch.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// ******* 그리드 페이지 처리 **
const totalPages = ref(0); // 총 페이지 수
const currentPages = ref(1); // 현재 처리하는 페이지
const currentGroup = ref(5); // 화면에 보여줄 최대 페이지 수

const pagination = reactive({
  pageRows: 50,
  startRowNum: 0,
  pageOption: [10, 50, 100, 300, 500, 1000],
});

const handlePageChange = newPage => {
  // console.log(`Current Page: ${newPage}`);
  pagination.startRowNum = (newPage - 1) * pagination.pageRows;
  currentPages.value = newPage;
  // myGrid.value.api.paginationGoToPage(newPage - 1);
  getData();
};

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
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
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
    selectedRows.value = event.api.getSelectedRows();
    if (selectedRows.value.length === 1) {
      getDataSelectList(selectedRows.value[0].projectCd);
      viewProjectNm.value = selectedRows.value[0].projectNm;
    }
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
    // selectedRows.value = event.api.getSelectedRows();
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

// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    ordDay: '합계',
    estQty: 0,
    estAmt: 0,
    ordQty: 0,
    ordAmt: 0,
  };

  rowData.rowsOrd.forEach(row => {
    totalRow.estQty += row.estQty || 0;
    totalRow.estAmt += row.estAmt || 0;
    totalRow.ordQty += row.ordQty || 0;
    totalRow.ordAmt += row.ordAmt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************

const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefs.columnsOrd,
  rowData: rowData.rowsOrd,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: true,
  },

  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
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
    selectedRowsOrd.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    handleCellValueChanged(event);
    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
