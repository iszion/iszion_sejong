<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->

    <!-- contents List -->
    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>
      <!--  end of contents list title bar -->
      <q-card-actions align="right" class="q-pa-none">
        <q-toolbar class="row">
          <div class="row q-col-gutter-md">
            <q-input
              stack-label
              bottom-slots
              label-color="orange"
              v-model="searchParam.stdYear"
              label="기준년도"
              type="Number"
              dense
              class="q-pb-none"
              style="width: 70px"
              @keyup.enter="handelGetData"
            />
            <q-select
              dense
              stack-label
              options-dense
              class="q-pb-sm q-mr-lg"
              label-color="orange"
              v-model="searchParam.stdMonth"
              :options="stdMonthOptions"
              option-value="stdMonth"
              option-label="label"
              option-disable="inactive"
              emit-value
              map-options
              style="min-width: 80px"
              label="기준월"
              @update:model-value="handelGetData"
            />
            <q-select
              dense
              stack-label
              options-dense
              class="q-pb-sm q-mr-lg"
              label-color="orange"
              v-model="searchParam.stdStatus"
              :options="stdStatusOptions"
              option-value="stdStatus"
              option-label="label"
              option-disable="inactive"
              emit-value
              map-options
              style="min-width: 100px; max-width: 130px"
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
              style="width: 150px"
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
            <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection"> <q-icon name="delete" size="xs" /> 삭제</q-btn>
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
      </q-card-section>
    </q-card>
    <!--  end of contents list -->

    <q-dialog v-model="isContentsDialogVisible" full-width full-height backdrop-filter="contrast(40%)">
      <q-card class="" style="width: 700px; max-width: 100vw">
        <q-card-section class="q-pa-none">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-xs q-py-lg">
              <q-btn v-close-popup class="text-white bg-grey-8" label="닫기" icon="close" size="md" />
              <q-space />
              <q-icon name="list_alt" />
              <span class="text-subtitle1 q-px-sm">업무보고서 내용</span>
            </q-bar>
            <!--  end of contents list title bar -->
          </q-card>
        </q-card-section>
        <q-card-section> <div v-html="contentsView" /></q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isExplainsDialogVisible" backdrop-filter="contrast(40%)">
      <q-card class="" style="width: 700px; max-width: 100vw">
        <q-card-section class="q-pa-none">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-xs q-py-lg">
              <q-btn v-close-popup class="text-white bg-grey-8" label="닫기" icon="close" size="md" />
              <q-space />
              <q-icon name="list_alt" />
              <span class="text-subtitle1 q-px-sm">반려내용</span>
            </q-bar>
            <!--  end of contents list title bar -->
          </q-card>
        </q-card-section>
        <q-card-section>
          <div v-html="contentsView.replace(/\n/g, '<br>')" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;

const isContentsDialogVisible = ref(false);
const isExplainsDialogVisible = ref(false);

const stdMonthOptions = ref([
  { stdMonth: '', label: '전체' },
  { stdMonth: '01', label: '1월' },
  { stdMonth: '02', label: '2월' },
  { stdMonth: '03', label: '3월' },
  { stdMonth: '04', label: '4월' },
  { stdMonth: '05', label: '5월' },
  { stdMonth: '06', label: '6월' },
  { stdMonth: '07', label: '7월' },
  { stdMonth: '08', label: '8월' },
  { stdMonth: '09', label: '9월' },
  { stdMonth: '10', label: '10월' },
  { stdMonth: '11', label: '11월' },
  { stdMonth: '12', label: '12월' },
]);
const stdStatusOptions = ref([
  { stdStatus: '', label: '전체' },
  { stdStatus: '0', label: '진행' },
  { stdStatus: '1', label: '완료' },
  { stdStatus: '2', label: '반려' },
]);

const searchParam = reactive({
  stdYear: commUtil.getTodayYear(),
  stdMonth: commUtil.getTodayMonth(),
  stdStatus: '',
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
const isClassActive = ref(true);

const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 280;
};
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

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  // 영업담당
  handelGetData();
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
      maxWidth: 70,
      filter: true,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '문서번호',
      field: 'lineNo',
      minWidth: 100,
      maxWidth: 100,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '업무활동일자',
      field: 'stdDay',
      minWidth: 160,
      maxWidth: 160,
    },
    {
      headerName: '업무보고일',
      field: 'regDate',
      minWidth: 180,
      maxWidth: 180,
    },
    {
      headerName: '진행상태',
      field: 'statusNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '제목',
      field: 'subject',
      minWidth: 200,
    },
    {
      headerName: '반려승인자',
      field: 'empNmApp',
      minWidth: 110,
      maxWidth: 110,
    },
    {
      headerName: '반려내용',
      field: 'explains',
      minWidth: 200,
    },
    {
      headerName: '영업담당',
      field: 'empNm',
      minWidth: 100,
      maxWidth: 100,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  projectCd: '',
  projectNm: '',
  makeDay: '',
  orderDay: '',
  salesCd: '',
  orcu1Cd: '',
  orcu1Nm: '',
  levelCd: '',
  typeCd: '',
  consCd: '',
  stepCd: '',
  zoneCd: '',
  outDay: '',
  explains: '',
});

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const addDataSection = () => {
  formData.value = {};
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.useYn = 'N';
  formData.value.makeDay = commUtil.getToday();
  setTimeout(() => {
    startFocus.value.focus();
  }, 100);
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
      isSaveFg = 'D';

      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRows.value.length; i++) {
        let tmpJson = '{"mode":"U","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  if (formData.value.orcu1Nm.length > 0 && formData.value.orcu1Cd.length === 0) {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '발주처 코드가 정의 되어있지 않습니다.',
      ok: {
        label: '무시',
        push: true,
        color: 'negative',
      },
      cancel: {
        label: '수정',
        push: true,
        color: 'grey-7',
      },
    })
      .onOk(() => {
        saveOkDataSection();
      })
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
    saveOkDataSection();
  }
};

const saveOkDataSection = () => {
  formData.value.makeDay = commUtil.unFormatDate(formData.value.makeDay);

  if (isEqual(formData.value, oldFormData.value)) {
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
    saveDataAndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg, formData.value));
  }
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mkt/mkt3010_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'D') {
          const selectedData = myGrid.value.api.getSelectedRows();
          myGrid.value.api.applyTransaction({ remove: selectedData });
        } else {
          handelGetData();
        }
      }
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
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
    const response = await api.post('/api/mkt/mkt4030_maxPages', {
      paramSalesCd: storeUser.setSalesCd,
      paramStdYear: searchParam.stdYear,
      paramStdMonth: searchParam.stdMonth,
      paramStdStatus: searchParam.stdStatus,
      paramSearchValue: searchParam.word,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    let maxRows = response.data.data[0].maxPages;
    totalPages.value = Math.ceil(maxRows / pagination.pageRows);
    console.log('totalPage : ', totalPages.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getData = async () => {
  try {
    const response = await api.post('/api/mkt/mkt4030_list', {
      paramSalesCd: storeUser.setSalesCd,
      paramStdYear: searchParam.stdYear,
      paramStdMonth: searchParam.stdMonth,
      paramStdStatus: searchParam.stdStatus,
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

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
const contentsView = ref(null);
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
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
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
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
    isContentsDialogVisible.value = false;
    isExplainsDialogVisible.value = false;
    if (event.colDef.field === 'explains') {
      isExplainsDialogVisible.value = true;
      contentsView.value = event.data.explains;
    } else {
      isContentsDialogVisible.value = true;
      contentsView.value = event.data.contents;
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

// ********** 우편번호 처리
const orcu1Focus = ref(null);

const useDialog = ref(false);
const openHelpOrcuDialog = () => {
  useDialog.value = true;
  openHelpOrcuDialog1();
};

const openHelpOrcuDialog1 = () => {
  if (useDialog.value) {
    $q.dialog({
      component: HelpOrcu,
      componentProps: {
        paramValueNm: formData.value.orcu1Nm,
        paramCloseDay: commUtil.unFormatDate(formData.value.makeDay),
      },
    })
      .onOk(res => {
        // console.log('res ::: ', res.valueCd, res.valueNm);
        formData.value.orcu1Cd = res.valueCd;
        formData.value.orcu1Nm = res.valueNm;
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        // console.log('Called on OK or Cancel');
        useDialog.value = false;
      });
  }
};

const byteCount = ref({ nacdNm: 0, explains: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'nacdNm':
        byteCount.value.rocuNm = commUtil.textByteLength(val);
        if (byteCount.value.nacdNm > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'explains':
        byteCount.value.explains = commUtil.textByteLength(val);
        if (byteCount.value.explains > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      default:
        break;
    }
  }
};

// ******* 그리드 페이지 처리
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
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
