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
      <div class="col-12 col-lg-5">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">공통기준코드 Header 리스트</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-btn outline color="positive" dense @click="getGroupData"><q-icon name="refresh" size="xs" /> </q-btn>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="showDeleteBtnGroup" outline color="negative" dense @click="deleteDataGroupSection">
                  <q-icon name="delete" size="xs" /> 삭제</q-btn
                >
                <q-btn v-if="showSaveBtnGroup" outline color="primary" dense @click="saveDataGroupSection"
                  ><q-icon name="save" size="xs" /> 저장
                </q-btn>
                <q-btn outline color="positive" dense @click="addDataGroupSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGridGroup"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefsGroup.columns"
                :rowData="rowDataGroup.rows"
                :defaultColDef="defaultColDefGroup.def"
                :rowSelection="rowSelectionGroup"
                @selection-changed="onSelectionChangedGroup"
                @cell-value-changed="onCellValueChangedGroup"
                @grid-ready="onGridReadyGroup"
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
            <span class="text-subtitle2 q-px-sm">공통기준코드 Detail 리스트</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-btn outline color="positive" dense @click="getSelectData"><q-icon name="refresh" size="xs" /></q-btn>
              <q-space />
              <div class="q-ml-lg text-subtitle1 text-bold">{{ paramComm.commCd1 }} : {{ paramComm.commNm }}</div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="showDeleteBtn" outline color="negative" dense @click="deleteDataSection"> <q-icon name="delete" size="xs" /> 삭제</q-btn>
                <q-btn v-if="showSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                <q-btn v-if="showNewBtn" outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
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
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.def"
                :rowSelection="rowSelection"
                @selection-changed="onSelectionChanged"
                @cell-value-changed="onCellValueChanged"
                @grid-ready="onGridReady"
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
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import CompToggle from 'components/CompToggle.vue';

const $q = useQuasar();

let isSaveFg = null;

const searchParam = reactive({
  deptCd: '',
  word: '',
});

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApiGroup = ref(null);
const gridApi = ref(null);
const rowDataGroup = reactive({ rows: [] });
const rowDataGroupBack = ref([]);
const rowData = reactive({ rows: [] });
const rowDataBack = ref([]);
const selectedValue = ref(null);
const updateData = ref([]);
const showSaveBtnGroup = ref(false);
const showDeleteBtnGroup = ref(false);
const showSaveBtn = ref(false);
const showDeleteBtn = ref(false);
const showNewBtn = ref(false);
const paramComm = ref({
  commCd1: '',
  commNm: '',
});

const onGridReadyGroup = params => {
  gridApiGroup.value = params.api;
};

const defaultColDefGroup = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
});

const columnDefsGroup = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      filter: false,
      pinned: 'left',
    },
    {
      headerName: '코드',
      field: 'commCd1',
      maxWidth: 80,
      minWidth: 80,
      cellEditorParams: {
        maxLength: 3, // 최대 길이
      },
    },
    {
      headerName: '그룹코드명',
      field: 'commNm',
      minWidth: 130,
    },
    {
      headerName: '등록수',
      field: 'cnt',
      minWidth: 90,
      maxWidth: 90,
      editable: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '사용',
      field: 'useYn',
      maxWidth: 80,
      minWidth: 80,
      editable: false,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggle,
      cellRendererParams: {
        // Pass the selectedValue and a callback function to update it
        updateSelectedValue: row => {
          // selectedValue.value = row.value;
          onCellValueChangedGroup();
        },
      },
    },
    {
      headerName: '참고사항',
      field: 'explains',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      filter: false,
      pinned: 'left',
    },
    {
      headerName: '코드',
      field: 'commCd2',
      maxWidth: 100,
      minWidth: 100,
      cellEditorParams: {
        maxLength: 5, // 최대 길이
      },
    },
    {
      headerName: '항목명',
      field: 'commNm',
      minWidth: 150,
      maxWidth: 200,
    },
    {
      headerName: '보조항목',
      field: 'commEtc',
      minWidth: 150,
      maxWidth: 250,
    },
    {
      headerName: '사용',
      field: 'useYn',
      maxWidth: 100,
      minWidth: 100,
      editable: false,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggle,
      cellRendererParams: params => ({
        // Pass the selectedValue and a callback function to update it
        updateSelectedValue: row => {
          // selectedValue.value = row.value;
          onCellValueChanged();
        },
      }),
    },
    {
      headerName: '참고사항',
      field: 'explains',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const selectedRows = ref();

const onSelectionChangedGroup = event => {
  selectedRows.value = event.api.getSelectedRows();

  showSaveBtn.value = false;

  if (selectedRows.value.length === 1) {
    paramComm.value.commCd1 = selectedRows.value[0].commCd1;
    paramComm.value.commNm = selectedRows.value[0].commNm;
    getSelectData();
    isSaveFg = 'U';
    showDeleteBtnGroup.value = true;
    showNewBtn.value = true;
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    showDeleteBtnGroup.value = true;
    showSaveBtnGroup.value = false;
    showNewBtn.value = false;
    paramComm.value.commCd1 = '';
    paramComm.value.commNm = '';
    getSelectData();
  } else {
    isSaveFg = '';
    showDeleteBtnGroup.value = false;
    showNewBtn.value = false;
    paramComm.value.commCd1 = '';
    paramComm.value.commNm = '';
    getSelectData();
  }
};

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();

  if (selectedRows.value.length === 1) {
    showDeleteBtn.value = true;
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    showDeleteBtn.value = true;
    showSaveBtn.value = false;
  } else {
    isSaveFg = '';
    showDeleteBtn.value = false;
  }
};

const onCellValueChangedGroup = () => {
  updateData.value = [];
  for (let i = 0; rowDataGroupBack.value.length > i; i++) {
    if (JSON.stringify(rowDataGroupBack.value[i]) !== JSON.stringify(rowDataGroup.rows[i])) {
      if (rowDataGroup.rows[i].iuD === 'U') {
        updateData.value.push(rowDataGroup.rows[i]);
      }
    }
  }

  if (updateData.value.length > 0) {
    showSaveBtnGroup.value = true;
  }
};

const onCellValueChanged = () => {
  // console.log('rowData.rows : ', JSON.stringify(rowData.rows));
  // console.log('rowData.update : ', JSON.stringify(rowData.update));
  updateData.value = [];
  for (let i = 0; rowDataBack.value.length > i; i++) {
    if (JSON.stringify(rowDataBack.value[i]) !== JSON.stringify(rowData.rows[i])) {
      if (rowData.rows[i].iuD === 'U') {
        updateData.value.push(rowData.rows[i]);
      }
    }
  }

  if (updateData.value.length > 0) {
    showSaveBtn.value = true;
  }
};

const rowSelectionGroup = ref(null);
const rowSelection = ref(null);

onBeforeMount(() => {
  rowSelectionGroup.value = 'multiple';
  rowSelection.value = 'multiple';
  getGroupData();
});

//*******************************************************//
//****  신규 자료 추가부분     ******************************//
const addDataGroupSection = () => {
  updateData.value = [];
  const addIndex = 0;
  const newItems = {
    commCd1: '',
    oldCommCd1: '',
    commNm: '',
    commEtc: '',
    cnt: 0,
    useYn: 'Y',
    explains: '',
    iuD: 'I',
  };
  // gridApiGroup.value.applyTransaction({
  //   add: newItems,
  //   addIndex: addIndex,
  // });
  // Add the new item to the row data at the specified index
  rowDataGroup.rows.splice(addIndex, 0, newItems);
  // Refresh the grid
  gridApiGroup.value.setRowData(rowDataGroup.rows);
  // 첫컬럼에 focus
  gridApiGroup.value.setFocusedCell(addIndex, 'commCd1');
};

const addDataSection = () => {
  showSaveBtn.value = true;
  updateData.value = [];
  const addIndex = 0;
  const newItems = {
    commCd2: '',
    oldCommCd2: '',
    commNm: '',
    commEtc: '',
    cnt: 0,
    useYn: 'Y',
    explains: '',
    iuD: 'I',
  };
  rowData.rows.splice(addIndex, 0, newItems);
  // Refresh the grid
  gridApi.value.setRowData(rowData.rows);
  // 첫컬럼에 focus
  gridApi.value.setFocusedCell(addIndex, 'commCd2');
};
//****  신규 자료 추가부분 끝    ******************************//

const deleteDataGroupSection = () => {
  $q.dialog({
    dark: true,
    title: '자료삭제(전체)',
    html: true,
    message: '선택된 자료를 삭제하시겠습니까?<br> 삭제시 해당 그룹의 모든 항목이 삭제됩니다.',
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
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResultGroup(jsonUtil.jsonFiller('no1', iu, iuD));

      const selectedData = gridApiGroup.value.getSelectedRows();
      gridApiGroup.value.applyTransaction({ remove: selectedData });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
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
        selectedRows.value[i]['commCd1'] = paramComm.value.commCd1;
        selectedRows.value[i]['oldCommCd1'] = paramComm.value.commCd1;
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));

      const selectedData = gridApi.value.getSelectedRows();
      gridApi.value.applyTransaction({ remove: selectedData });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataGroupSection = () => {
  let iu = [];
  let iuD = [];
  // 신규 추가 부분
  for (let i = 0; i < rowDataGroup.rows.length; i++) {
    if (!isEmpty(rowDataGroup.rows[i].commCd1)) {
      if (rowDataGroup.rows[i].iuD === 'I') {
        let tmpJson = '{"mode": "' + rowDataGroup.rows[i].iuD + '","data":' + JSON.stringify(rowDataGroup.rows[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  // 자료 수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    if (!isEmpty(updateData.value[i].commCd1)) {
      if (updateData.value[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }

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
    saveDataAndHandleResultGroup(jsonUtil.jsonFiller('no1', iu, iuD));
    setTimeout(() => {
      getGroupData();
    }, 500);
  }
};

const saveDataSection = () => {
  let iu = [];
  let iuD = [];
  // 신규 추가 부분
  for (let i = 0; i < rowData.rows.length; i++) {
    if (!isEmpty(rowData.rows[i].commCd2)) {
      if (rowData.rows[i].iuD === 'I') {
        rowData.rows.push('commCd1');
        rowData.rows[i]['commCd1'] = paramComm.value.commCd1;
        rowData.rows[i]['oldCommCd1'] = paramComm.value.commCd1;
        let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }
  // 자료 수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    if (!isEmpty(updateData.value[i].commCd2)) {
      if (updateData.value[i].iuD === 'U') {
        updateData.value[i]['commCd1'] = paramComm.value.commCd1;
        updateData.value[i]['oldCommCd1'] = paramComm.value.commCd1;
        let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }

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
    saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
    setTimeout(() => {
      getSelectData();
    }, 500);
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
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResultGroup = resFormData => {
  // console.log('aaa::: ', JSON.stringify(resFormData));
  api
    .post('/api/com/com7010_group_save', resFormData)
    .then(res => {
      showSaveBtnGroup.value = false;
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/com/com7010_save', resFormData)
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

// ***** 공통코드정보 목록 자료 가져오기 부분  *****************************//
const getGroupData = async () => {
  try {
    const response = await api.post('/api/com/com7010_list', {});
    rowDataGroup.rows = response.data.data;
    rowDataGroupBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 공통코드정보 목록 자료 가져오기 부분  *****************************//

// ***** 공통코드정보 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async () => {
  try {
    const response = await api.post('/api/com/com7010_select', { paramCommCd1: paramComm.value.commCd1 });
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 공통코드정보 선택된 자료 가져오기 부분  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
