<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <!-- contents List (좌측 화면) -->
    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>
      <!--  end of contents list title bar -->
      <q-card-actions class="q-px-md q-pt-md">
        <q-btn icon="refresh" outline color="positive" @click="getData" label="다시불러오기" />
        <q-space />
        <q-btn icon="add" outline color="positive" @click="addRowData" label="신규" />
      </q-card-actions>
      <!--      <div v-for="m in rowData.rows" :key="m" class="col-6 col-md-4">-->
      <q-scroll-area :style="contentLeftZoneStyle" class="q-pa-md">
        <div class="q-gutter-y-xs">
          <q-card square flat bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" v-for="(m, index) in rowData.rows" :key="index">
            <div class="row">
              <q-card-section class="col-xs-2 col-md-1 self-center text-center q-py-none">
                <span class="text-orange text-subtitle1"> {{ index + 1 }}</span>
              </q-card-section>
              <q-card-section class="col-xs-10 col-md-9">
                <div class="row q-col-gutter-x-lg">
                  <q-input
                    stack-label
                    label-color="orange"
                    class="col-xs-9 col-md-4 text-subtitle1"
                    v-model="m.custsNm"
                    label="업체명"
                    :readonly="!m.editable"
                    :borderless="!m.editable"
                  >
                    <template v-slot:append>
                      <q-icon v-if="m.editable" size="0.8em" name="search" @click="openHelpCustDialog(m)" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    label-color="orange"
                    class="col-xs-3 col-md-2 text-subtitle1"
                    v-model="m.custCd"
                    label="코드"
                    :readonly="!m.editable"
                    :borderless="!m.editable"
                    :focus="lastAddedUid === m.uid"
                  />
                  <q-input
                    stack-label
                    label-color="orange"
                    class="col-xs-12 col-md-6"
                    v-model="m.explains"
                    label="참고사항"
                    :readonly="!m.editable"
                    :borderless="!m.editable"
                  />
                </div>
              </q-card-section>
              <q-card-section class="col-xs-12 col-md-2 text-right self-center">
                <div class="inline">
                  <q-btn v-if="!m.editable" flat round padding="xs sm" color="secondary" icon="edit" @click="m.editable = true">
                    <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong> 편집하기 </strong>
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="m.editable" flat round padding="xs sm" color="primary" icon="save" @click="saveDataGroupSection(m)">
                    <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong> 저장하기 </strong>
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="!m.editable" flat round padding="xs sm" color="negative" icon="delete_outline" @click="deleteData(m)">
                    <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong> 삭제하기 </strong>
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="m.editable && m.iuD === 'I'" flat round padding="xs sm" color="negative" icon="clear" @click="remove(m.uid)">
                    <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong> 지우기 </strong>
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="m.editable && m.iuD !== 'I'" flat round padding="xs sm" color="negative" icon="undo" @click="m.editable = false">
                    <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong> 되돌아가기 </strong>
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="!m.editable"
                    flat
                    round
                    padding="xs sm"
                    color="primary"
                    icon="arrow_forward_ios"
                    @click="handleRowClick(m.custCd, m.custsNm)"
                  >
                    <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong> 지점편집하기 </strong>
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </div>
          </q-card>
        </div>
      </q-scroll-area>
    </q-card>
  </q-page>

  <!-- ***************** -->
  <!-- 프로그램 권한주기 화면 -->
  <!-- ***************** -->
  <q-dialog maximized v-model="isDialogVisible" @show="onDialogOpened">
    <q-card flat bordered style="max-width: 60vh; width: 100%">
      <q-bar>
        <q-icon name="list_alt" />
        <div>지점명등록 관리</div>
        <q-space />
        <span class="text-bold text-subtitle1"> [ {{ paramCustCd }} ] {{ paramCustNm }}</span>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip> 닫기 </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-actions>
        <q-toolbar class="q-px-xs-none q-px-sm-md q-py-none q-gutter-x-xs">
          <q-btn outline color="grey" v-close-popup><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
          <q-btn outline color="teal" @:click="getDataSelected()">
            <q-icon name="refresh" size="xs" class="q-pr-sm-sm" />
            <span v-if="$q.screen.gt.sm">다시불러오기</span>
          </q-btn>
          <q-space />
          <q-btn outline color="primary" @click="addDataRowSection"><q-icon class="q-mr-xs" name="add" size="xs" /> 신규 </q-btn>
          <q-btn v-if="saveCount > 0" outline color="primary" @click="saveDataSection"><q-icon class="q-mr-xs" name="save" size="xs" /> 저장 </q-btn>
        </q-toolbar>
      </q-card-actions>
      <q-card-section class="q-px-xs-none q-px-sm-md q-pt-none">
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
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { uid, QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import CompToggle from 'components/CompToggle.vue';
import HelpAgent from 'components/subvue/HelpAgent.vue';
import HelpCust from 'components/subvue/HelpCust.vue';

const $q = useQuasar();

const rowData = reactive({ rows: [], rowsSel: [] });

const isClassActive = ref(true);
const lastAddedUid = ref(null);
const inputRefs = ref(null);
const isDialogVisible = ref(false);

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 160}px`,
}));
const contentLeftZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 210}px`,
}));

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

// rowData를 추가하는 메서드
const addRowData = async () => {
  const newUid = uid();
  rowData.rows.unshift({
    uid: newUid,
    custCd: '',
    custSCd: '00000000',
    custsNm: '',
    explains: '',
    editable: true,
    iuD: 'I',
  });
  lastAddedUid.value = newUid;

  // Wait for the DOM to render the new row and then focus
  await nextTick();
  const inputElement = document.querySelector(`[ref="${newUid}"]`);
  inputElement && inputElement.focus();

  console.log('upData :: ', JSON.stringify(rowData.rows));
};
const remove = uid => {
  $q.notify({
    progress: true,
    position: 'center',
    message: '해당 자료를 지울까요?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: () => {
          const findIndex = rowData.rows.findIndex(m => m.uid === uid);

          if (findIndex !== -1) {
            rowData.rows.splice(findIndex, 1);
          }
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const deleteData = resM => {
  $q.notify({
    progress: true,
    position: 'center',
    message: '해당 자료를 삭제할까요?<br> (해당 코드에 연결된 지점이 모두 지워집니다)',
    color: 'red-5',
    multiLine: true,
    html: true,
    actions: [
      {
        label: '확인',
        color: 'white',
        handler: () => {
          saveDataGroupAndHandleResult(jsonUtil.dataJsonParse('no1', 'D', resM)).then(val => {
            if (val.rtn === '0') {
              const findIndex = rowData.rows.findIndex(m => m.uid === resM.uid);
              if (findIndex !== -1) {
                rowData.rows.splice(findIndex, 1);
              }
            }
          });
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const paramCustCd = ref(null);
const paramCustNm = ref(null);
const handleRowClick = (resCustCd, resCustNm) => {
  paramCustCd.value = resCustCd;
  paramCustNm.value = resCustNm;
  isDialogVisible.value = true;
};

const saveDataGroupSection = resData => {
  resData.editable = false;
  saveDataGroupAndHandleResult(jsonUtil.dataJsonParse('no1', resData.iuD, resData)).then(val => {
    if (val.rtn === '0' && resData.iuD === 'I') {
      resData.iuD = 'U';
    }
  });
};

// ** dialog open ***********************//
const saveCount = ref(0);
const onDialogOpened = () => {
  getDataSelected().then(() => {});
  // Perform any action when the dialog opens
};

const cellValueChange = data => {
  if (data.iuD === 'R') {
    data.iuD = 'U';
  }
  saveCount.value = rowData.rowsSel.filter(row => row.iuD === 'I' || row.iuD === 'U' || row.iuD === 'D').length;
};

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
      editable: false,
    },
    {
      headerName: '코드',
      field: 'custsCd',
      maxWidth: 100,
      minWidth: 100,
      cellEditorParams: {
        maxLength: 8, // 최대 길이
      },
    },
    {
      headerName: '지점명',
      field: 'custsNm',
      minWidth: 150,
    },
    {
      headerName: '참조사항',
      field: 'explains',
      minWidth: 250,
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
          // const event.data = row.value;
          cellValueChange(row.value);
        },
      }),
    },
  ],
});

const addDataRowSection = () => {
  const addIndex = 0;
  const newItems = {
    custCd: paramCustCd,
    custsCd: '',
    custsNm: '',
    explains: '',
    useYn: 'Y',
    iuD: 'I',
  };
  rowData.rowsSel.splice(addIndex, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setRowData(rowData.rowsSel);
  // 첫컬럼에 focus
  myGrid.value.api.setFocusedCell(addIndex, 'custsCd');
};
//****  신규 자료 추가부분 끝    ******************************//

const saveDataSection = () => {
  const jsonData_I = rowData.rowsSel.filter(row => row.iuD === 'I');
  const jsonData_U = rowData.rowsSel.filter(row => row.iuD === 'U');
  const jsonData_D = rowData.rowsSel.filter(row => row.iuD === 'D');

  $q.dialog({
    dark: true,
    title: '자료저장',
    message:
      '자료를 저장하시겠습니까? <br > <span class="text-orange">신규자료</span>: ' +
      jsonData_I.length +
      '<br > <span class="text-blue">수정자료</span>: ' +
      jsonData_U.length +
      '<br ><span class="text-red">삭제자료</span> : ' +
      jsonData_D.length,
    html: true,
    ok: {
      push: true,
      color: 'primary',
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

      for (let i = 0; i < jsonData_I.length; i++) {
        let tmpJson = '{"mode":"I","data":' + JSON.stringify(jsonData_I[i]) + '}';
        iu.push(tmpJson);
      }

      for (let i = 0; i < jsonData_U.length; i++) {
        let tmpJson = '{"mode":"U","data":' + JSON.stringify(jsonData_U[i]) + '}';
        iu.push(tmpJson);
      }

      for (let i = 0; i < jsonData_D.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(jsonData_D[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
        if (val.rtn === '0') {
          getDataSelected();
        }
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst2030_list', {});
    rowData.rows = response.data.data.map(row => ({
      ...row,
      uid: uid(), // Quasar의 uid() 함수로 고유 ID 추가
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSelected = async () => {
  try {
    const response = await api.post('/api/mst/mst2030_select', {
      paramCustCd: paramCustCd.value,
    });
    rowData.rowsSel = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rowsSel);
    saveCount.value = 0;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataGroupAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/mst/mst2030_group_save', resFormData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus; // saveStatus 객체를 반환
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/mst/mst2030_save', resFormData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus; // saveStatus 객체를 반환
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
const selectedRows = ref();
const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.columns,
  rowData: rowData.rowsSel,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
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
    selectedRows.value = event.api.getSelectedRows();
    for (let i = 0; i < selectedRows.value.length; i++) {
      for (let j = 0; j < rowData.rowsSel.length; j++) {
        if (selectedRows.value[i].oldCustsCd === rowData.rowsSel[j].oldCustsCd) {
          rowData.rowsSel[j].iuD = 'D';
        }
      }
    }
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    cellValueChange(event.data);
  },

  debug: false,
};

/* *** 코드헬프부분 ** */
const useDialog = ref(false);
const openHelpCustDialog = resM => {
  useDialog.value = true;
  openHelpCustDialog1(resM);
};

const openHelpCustDialog1 = resM => {
  if (useDialog.value) {
    $q.dialog({
      component: HelpCust,
      componentProps: {
        paramValueNm: resM.custsNm,
        paramCloseDay: commUtil.unFormatDate('00000000'),
      },
    })
      .onOk(res => {
        resM.custCd = res.valueCd;
        resM.custsNm = res.valueNm;
      })
      .onCancel(() => {})
      .onDismiss(() => {
        // console.log('Called on OK or Cancel');
        useDialog.value = false;
      });
  }
};
</script>
