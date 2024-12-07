<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List (좌측 화면) -->
      <div class="col-12" :class="{ 'col-md-6': isClassActive }">
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
          <q-card-actions align="right" class="q-pa-none">
            <div class="row justify-end q-pa-sm">
              <q-btn icon="add" outline color="positive" @click="addRowData" label="신규" />
            </div>
          </q-card-actions>
          <!--      <div v-for="m in rowData.rows" :key="m" class="col-6 col-md-4">-->
          <q-scroll-area :style="contentLeftZoneStyle">
            <q-card square flat bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" v-for="(m, index) in rowData.rows" :key="index">
              <div class="row">
                <q-card-section class="col-1 self-center text-center q-py-none">
                  {{ index }}
                </q-card-section>
                <q-card-section class="col-11 q-py-none">
                  <div class="row q-col-gutter-x-lg">
                    <q-input
                      stack-label
                      class="col-2"
                      v-model="m.custCd"
                      label="코드"
                      :readonly="!m.editable"
                      :borderless="!m.editable"
                      :focus="lastAddedUid === m.uid"
                    />
                    <q-input stack-label class="col-3" v-model="m.custsNm" label="업체명" :readonly="!m.editable" :borderless="!m.editable" />
                    <q-input stack-label class="col-5" v-model="m.explains" label="참고사항" :readonly="!m.editable" :borderless="!m.editable" />
                  </div>
                </q-card-section>
              </div>
              <q-card-actions class="row q-py-none">
                <div class="col-11 text-right">
                  <q-btn v-if="!m.editable" flat round padding="xs sm" color="secondary" icon="edit" @click="m.editable = true" />
                  <q-btn v-if="m.editable" flat round padding="xs sm" color="primary" icon="save" @click="m.editable = false" />
                  <q-btn v-if="!m.editable" flat round padding="xs sm" color="negative" icon="delete_outline" @click="remove(m.uid)" />
                </div>
                <div class="col-1 text-right">
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
              </q-card-actions>
            </q-card>
          </q-scroll-area>
        </q-card>
      </div>

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
              <div class="q-ml-lg text-subtitle1 text-bold">{{ paramCustCd }} : {{ paramCustsNm }}</div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="negative" dense @click="deleteDataSection"> <q-icon name="delete" size="xs" /> 삭제</q-btn>
                <q-btn outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
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
import { uid, QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import CompToggle from 'components/CompToggle.vue';

const $q = useQuasar();

const rowData = reactive({ rows: [], selRows: [] });

const isScreenVisible = ref(true);
const isClassActive = ref(true);
const lastAddedUid = ref(null);
const inputRefs = ref(null);

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
  });
  lastAddedUid.value = newUid;

  // Wait for the DOM to render the new row and then focus
  await nextTick();
  const inputElement = document.querySelector(`[ref="${newUid}"]`);
  inputElement && inputElement.focus();
};
const remove = uid => {
  const findIndex = rowData.rows.findIndex(m => m.uid === uid);

  if (findIndex !== -1) {
    rowData.rows.splice(findIndex, 1);
  }
};

const paramCustCd = ref(null);
const paramCustNm = ref(null);
const handleRowClick = (resCustCd, resCustNm) => {
  paramCustCd.value = resCustCd;
  paramCustNm.value = resCustNm;
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

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst2030_list', {});
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.columns,
  rowData: rowData.selRows,
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

    showSaveBtn.value = false;

    // if (selectedRows.value.length === 1) {
    //   paramComm.value.commCd1 = selectedRows.value[0].commCd1;
    //   paramComm.value.commNm = selectedRows.value[0].commNm;
    //   getSelectData();
    //   isSaveFg = 'U';
    //   showDeleteBtnGroup.value = true;
    //   showNewBtn.value = true;
    // } else if (selectedRows.value.length > 1) {
    //   isSaveFg = 'D';
    //   showDeleteBtnGroup.value = true;
    //   showSaveBtnGroup.value = false;
    //   showNewBtn.value = false;
    //   paramComm.value.commCd1 = '';
    //   paramComm.value.commNm = '';
    //   getSelectData();
    // } else {
    //   isSaveFg = '';
    //   showDeleteBtnGroup.value = false;
    //   showNewBtn.value = false;
    //   paramComm.value.commCd1 = '';
    //   paramComm.value.commNm = '';
    //   getSelectData();
    // }
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

const byteCount = ref({ itemNm: 0, remarks: 0, remarks2: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'itemNm':
        byteCount.value.itemNm = commUtil.textByteLength(val);
        if (byteCount.value.itemNm > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'remarks':
        byteCount.value.remarks = commUtil.textByteLength(val);
        if (byteCount.value.remarks > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'remarks2':
        byteCount.value.remarks2 = commUtil.textByteLength(val);
        if (byteCount.value.remarks2 > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      default:
        break;
    }
  }
};
</script>
