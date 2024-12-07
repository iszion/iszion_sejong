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
        <q-btn
          class="q-pa-xs"
          rounded
          color="grey"
          text-color="black"
          dense
          size="0.4rem"
          @click="isScreenVisibleProcess"
          :icon="isScreenVisible ? 'open_in_full' : 'close_fullscreen'"
        >
          <q-tooltip class="bg-amber text-black shadow-4" anchor="center left" self="center right">
            <q-icon name="open_in_full" size="0.8rem" />
            <strong v-if="isClassActive"> 펼치기 </strong>
            <strong v-else> 축소하기 </strong>
          </q-tooltip>
        </q-btn>
      </q-bar>
      <!--  end of contents list title bar -->
      <q-card-actions align="right" class="q-px-md q-pt-md">
        <q-btn icon="add" outline color="positive" @click="addRowData" label="신규" />
      </q-card-actions>
      <!--      <div v-for="m in rowData.rows" :key="m" class="col-6 col-md-4">-->
      <q-scroll-area :style="contentLeftZoneStyle" class="q-pa-md">
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
                  class="col-xs-9 col-md-3"
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
                  class="col-xs-3 col-md-2"
                  v-model="m.custCd"
                  label="코드"
                  :readonly="!m.editable"
                  :borderless="!m.editable"
                  :focus="lastAddedUid === m.uid"
                />
                <q-input
                  stack-label
                  label-color="orange"
                  class="col-xs-12 col-md-5"
                  v-model="m.explains"
                  label="참고사항"
                  :readonly="!m.editable"
                  :borderless="!m.editable"
                />
              </div>
            </q-card-section>
            <q-card-section class="col-xs-12 col-md-2 text-right self-center">
              <div class="inline">
                <q-btn v-if="!m.editable" flat round padding="xs sm" color="secondary" icon="edit" @click="m.editable = true" />
                <q-btn v-if="m.editable" flat round padding="xs sm" color="primary" icon="save" @click="m.editable = false" />
                <q-btn v-if="!m.editable" flat round padding="xs sm" color="negative" icon="delete_outline" @click="deleteData(m.uid)" />
                <q-btn v-if="m.editable && m.iuD === 'I'" flat round padding="xs sm" color="negative" icon="clear" @click="remove(m.uid)" />
                <q-btn v-if="m.editable && m.iuD !== 'I'" flat round padding="xs sm" color="negative" icon="undo" @click="m.editable = false" />
                <q-btn
                  v-if="!m.editable"
                  flat
                  round
                  padding="xs sm"
                  color="primary"
                  icon="arrow_forward_ios"
                  @click="handleRowClick(m.custCd, m.custsNm)"
                />
              </div>
            </q-card-section>
          </div>
        </q-card>
      </q-scroll-area>
    </q-card>
  </q-page>

  <!-- ***************** -->
  <!-- 프로그램 권한주기 화면 -->
  <!-- ***************** -->
  <q-dialog v-model="isDialogVisible" @show="onDialogOpened">
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
        <q-toolbar class="q-px-sm q-py-none q-gutter-x-xs">
          <q-btn outline color="grey" v-close-popup><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
          <q-btn outline color="primary" @click="addDataRowSection"><q-icon class="q-mr-xs" name="add" size="xs" /> 신규 </q-btn>
          <q-space />
          <q-btn outline color="primary" v-close-popup><q-icon class="q-mr-xs" name="save" size="xs" /> 저장 </q-btn>
          <q-btn outline color="teal" @:click="getDataSelected()">
            <q-icon name="refresh" size="xs" class="q-pr-sm-sm" />
            <span v-if="$q.screen.gt.sm">다시불러오기</span>
          </q-btn>
        </q-toolbar>
      </q-card-actions>
      <q-card-section class="q-px-md q-pt-none">
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

const isScreenVisible = ref(true);
const isClassActive = ref(true);
const lastAddedUid = ref(null);
const inputRefs = ref(null);
const isDialogVisible = ref(false);

const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 280}px`,
}));
const contentLeftZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 200}px`,
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

const deleteData = uid => {
  $q.notify({
    progress: true,
    position: 'center',
    message: '해당 자료를 삭제할까요?',
    color: 'red-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'white',
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

const paramCustCd = ref(null);
const paramCustNm = ref(null);
const handleRowClick = (resCustCd, resCustNm) => {
  paramCustCd.value = resCustCd;
  paramCustNm.value = resCustNm;
  isDialogVisible.value = true;
};

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
          // selectedValue.value = row.value;
          // onCellValueChanged();
        },
      }),
    },
  ],
});

// ** dialog open ***********************//
const onDialogOpened = () => {
  getDataSelected().then(() => {});
  // Perform any action when the dialog opens
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
    console.log('rowData : ', JSON.stringify(rowData.rows));
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
    console.log('rowDataSel : ', JSON.stringify(rowData.rowsSel));
  } catch (error) {
    console.error('Error fetching users:', error);
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
  enableColResize: true,
  enableSorting: false,
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
    selectedRows.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    if (event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
    // event.api.refreshCells({
    //   rowNodes: [event.node],
    //   force: true,
    // });
    console.log('aa : ', JSON.stringify(rowData.rowsSel));
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
        console.log('res ::: ', res.valueCd, res.valueNm);
        resM.custCd = res.valueCd;
        resM.custsNm = res.valueNm;
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
</script>
