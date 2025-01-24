<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">권한정보 조정관리</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-select
                dense
                stack-label
                options-dense팀
                class="q-pb-sm q-pl-sm q-mr-lg"
                label-color="orange"
                v-model="selectedDept"
                :options="deptOptions"
                option-value="commCd"
                option-label="commNm"
                options-dense
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 150px; max-width: 150px"
                label="소속팀"
                @update:model-value="getData"
              />
              <q-input
                stack-label
                bottom-slots
                label-color="orange"
                v-model="searchValue"
                label="ID/성명"
                dense
                class="q-pb-sm q-pl-sm q-mr-lg"
                style="max-width: 120px"
                @keyup.enter="getData"
              >
                <template v-slot:append>
                  <q-icon size="xs" v-if="searchValue !== ''" name="close" @click="searchValue = ''" class="cursor-pointer q-mt-sm" />
                  <q-icon name="search" size="xs" class="q-mt-sm cursor-pointer" @click="getData" />
                </template>
              </q-input>
              <q-btn outline color="positive" dense @click="getData"
                ><q-icon class="q-mr-sm" name="refresh" size="xs" /><span v-if="!$q.screen.xs">다시 불러오기</span></q-btn
              >
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="showSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
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
  <!-- ***************** -->
  <!-- 프로그램 권한주기 화면 -->
  <!-- ***************** -->
  <q-dialog persistent v-model="isDialogVisible">
    <q-card flat bordered style="max-width: 1050px; width: 100%">
      <q-bar>
        <q-icon name="list_alt" />
        <div>권한조정 관리</div>
        <q-space />
        <span class="text-bold text-subtitle1"> [ {{ showDialogTitle.userId }} ] {{ showDialogTitle.userNm }}</span>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip> 닫기 </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-actions>
        <q-toolbar class="q-px-sm q-py-none">
          <q-select
            dense
            options-dense
            class="q-pb-sm q-pl-sm q-mr-lg"
            label-color="orange"
            v-model="selectedGroup"
            :options="groupOptions"
            option-value="groupCd"
            option-label="groupNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 150px; max-width: 150px"
            label="그룹선택"
            @update:model-value="getDataDialog"
          />
          <q-btn dense outline class="q-px-md" color="teal" @:click="getDataDialog()"
            ><q-icon name="refresh" size="xs" class="q-pr-sm-sm" /><span v-if="$q.screen.gt.sm">다시불러오기</span></q-btn
          >
          <q-space />
          <q-btn v-if="showSaveDialogBtn" outline dense color="primary" @click="saveDataDialogSection" v-close-popup class="q-px-sm q-mr-sm"
            ><q-icon class="q-mr-xs" name="save" size="xs" /> 권한 적용하기
          </q-btn>
          <q-btn outline dense color="primary" v-close-popup class="q-px-sm"><q-icon class="q-mr-xs" name="close" size="xs" /> 닫기 </q-btn>
        </q-toolbar>
      </q-card-actions>
      <q-card-section class="q-px-md q-pt-none">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            ref="myGrid1"
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :grid-options="gridOptions1"
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
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

import CompToggleMkt from 'components/CompToggleMkt.vue';
import CompToggleAux from 'components/CompToggleAux.vue';
import CompToggleMst from 'components/CompToggleMst.vue';
import CompToggleSys from 'components/CompToggleSys.vue';
import CompButtonUser from 'components/CompButtonUser.vue';
import CompCheckHeader from 'components/CompCheckHeader.vue';
import CompToggleScr from 'components/CompToggleScr.vue';
import CompToggleNew from 'components/CompToggleNew.vue';
import CompToggleDbg from 'components/CompToggleDbg.vue';
import CompToggleDel from 'components/CompToggleDel.vue';
import CompToggleApp from 'components/CompToggleApp.vue';
import CompToggleRpt from 'components/CompToggleRpt.vue';
import CompToggleExc from 'components/CompToggleExc.vue';
import CompToggleLoc from 'components/CompToggleLoc.vue';
import CompSelectComm from 'components/CompSelectTeam.vue';
import { useYearInfoStore } from 'src/store/setYearInfo';
import CompSelectLevel from 'components/CompSelectLevel.vue';
import CompToggleSal from 'components/CompToggleSal.vue';
import CompToggleCos from 'components/CompToggleCos.vue';
import CompToggleFee from 'components/CompToggleFee.vue';
const storeYear = useYearInfoStore();

const $q = useQuasar();

const isDialogVisible = ref(false);

let isSaveFg = null;
const searchValue = ref('');

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataDialog = reactive({ rows: [] });
const rowDataBack = ref([]);
const rowDataDialogBack = ref([]);
const updateData = ref([]);
const showSaveBtn = ref(false);
const showSaveDialogBtn = ref(false);
const selectedRows = ref();
const isSelectedDialog = ref();

const selectedDept = ref('');
const deptOptions = ref([]);
const levelOptions = ref([]);

const showDialogTitle = ref({
  userId: '',
  userNm: '',
});

const columnDefs = ref([]);
const columnDefsSet = () => {
  columnDefs.value = [
    {
      headerName: '#',
      minWidth: 60,
      maxWidth: 60,
      pinned: 'left',
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: '아이디',
      field: 'userId',
      minWidth: 120,
      maxWidth: 200,
      filter: true,
      pinned: 'left',
      cellRenderer: CompButtonUser,
      cellRendererParams: {
        updateSelectedValue: row => {
          showDialogTitle.value.userId = row.value.userId;
          showDialogTitle.value.userNm = row.value.userNm;
          isDialogVisible.value = true;
          selectedGroup.value = null;
          getDataDialog();
        },
      },
    },
    {
      headerName: '성명',
      field: 'userNm',
      minWidth: 80,
      maxWidth: 80,
      filter: true,
      pinned: 'left',
    },
    {
      headerName: '사원번호',
      field: 'empCd',
      filter: true,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '부서',
      field: 'deptNm',
      minWidth: 110,
      maxWidth: 150,
      filter: true,
    },
    {
      headerName: '직위',
      field: 'titlNm',
      minWidth: 90,
      maxWidth: 90,
      filter: true,
    },
    {
      headerName: '권한레벨',
      field: 'levelCd',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      cellRenderer: CompSelectLevel,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
        valueOptions: levelOptions.value,
      },
    },
    {
      headerName: '판매관리',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnSal', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnSal',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleSal,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
      },
    },
    {
      headerName: '인세관리',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnFee', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnFee',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleFee,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
      },
    },
    {
      headerName: '손익관리',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnCos', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnCos',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleCos,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
      },
    },
    {
      headerName: '보조운영',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnAux', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnAux',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleAux,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
      },
    },
    {
      headerName: '기준정보',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnMst', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnMst',
      maxWidth: 110,
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleMst,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
      },
    },
    {
      headerName: '시스템',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: false,
        updateSelectedValue: row => {
          checkAll('gnSys', row.value ? 'Y' : 'N');
        },
      },
      field: 'gnSys',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: CompToggleSys,
      cellRendererParams: {
        updateSelectedValue: row => {
          handleCellValueChanged();
        },
      },
    },
  ];
};

const columnDefsDialog = ref([
  {
    headerName: '#',
    width: 60,
    pinned: 'left',
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '코드',
    field: 'progId',
    minWidth: 100,
    maxWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
    pinned: 'left',
  },
  {
    headerName: '프로그램명',
    field: 'progNm',
    minWidth: 170,
    filter: true,
    pinned: 'left',
  },
  {
    headerName: '조회',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('scrYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'scrYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleScr,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '입력',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('newYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'newYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleNew,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '수정',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('dbgYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'dbgYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleDbg,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '삭제',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('delYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'delYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleDel,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '출력',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('rptYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'rptYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleRpt,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '엑셀',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('excYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'excYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleExc,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '마감 ',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('locYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'locYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleLoc,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
  {
    headerName: '승인',
    headerComponent: CompCheckHeader,
    headerComponentParams: {
      headerCheckYn: false,
      updateSelectedValue: row => {
        checkAllProg('appYn', row.value ? 'Y' : 'N');
      },
    },
    field: 'appYn',
    maxWidth: 100,
    minWidth: 100,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CompToggleApp,
    cellRendererParams: {
      updateSelectedValue: row => {
        handleCellValueChangedDialog();
      },
    },
  },
]);

const handleCellValueChanged = () => {
  updateData.value = [];
  for (let i = 0; rowDataBack.value.length > i; i++) {
    if (JSON.stringify(rowDataBack.value[i]) !== JSON.stringify(rowData.rows[i])) {
      updateData.value.push(rowData.rows[i]);
    }
  }
  showSaveBtn.value = updateData.value.length > 0;
};
const handleCellValueChangedDialog = () => {
  updateData.value = [];
  for (let i = 0; rowDataDialogBack.value.length > i; i++) {
    if (JSON.stringify(rowDataDialogBack.value[i]) !== JSON.stringify(rowDataDialog.rows[i])) {
      updateData.value.push(rowDataDialog.rows[i]);
    }
  }
  showSaveDialogBtn.value = updateData.value.length > 0;
};

const saveDataSection = () => {
  let iu = [];
  let iuD = [];
  // 신규/수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
    iu.push(tmpJson);
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
      getData();
    }, 500);
  }
};

const saveDataDialogSection = () => {
  let iu = [];
  let iuD = [];
  // 신규/수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    let tmpJson = '{"mode": "' + updateData.value[i].iuD + '","data":' + JSON.stringify(updateData.value[i]) + '}';
    iu.push(tmpJson);
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
    saveDataDialogAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
    setTimeout(() => {
      getData();
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
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(async () => {
  getDataCommOption('501').then(() => {
    getDataCommOption('901').then(() => {
      columnDefsSet();
      myGrid.value.api.setColumnDefs(columnDefs.value);
      getGroupData().then(() => {
        getData();
      });
    });
  });
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const checkAll = (resId, resCheck) => {
  for (let i = 0; i < rowData.rows.length; i++) {
    rowData.rows[i][resId] = resCheck;
  }
  handleCellValueChanged();
};

const checkAllProg = (resId, resCheck) => {
  for (let i = 0; i < rowDataDialog.rows.length; i++) {
    if (rowDataDialog.rows[i][resId]) {
      rowDataDialog.rows[i][resId] = resCheck;
    }
  }
  handleCellValueChangedDialog();
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 사용자 권한정보 저장하기 부분  *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1110_grntg_save', resFormData)
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
// ***** 사용자 권한정보 저장하기 부분 끝 *****************************//

// ***** 사용자 권한정보 선택된 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/sys/sys1110_grntg_list', {
      paramSetYear: storeYear.setYear,
      paramDeptCd: selectedDept.value,
      paramSearchValue: searchValue.value,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자 권한정보 선택된 자료 가져오기 부분  *****************************//

// ***** 프로그램 권한정보 저장하기 부분  *****************************//
const saveDataDialogAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1110_grntp_save', resFormData)
    .then(res => {
      showSaveDialogBtn.value = false;
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 프로그램 권한정보 저장하기 부분 끝 *****************************//

// ***** 프로그램 권한정보 선택된 자료 가져오기 부분  *****************************//
const getDataDialog = async () => {
  try {
    const response = await api.post('/api/sys/sys1110_grntp_list', { paramUserId: showDialogTitle.value.userId, paramGroupCd: selectedGroup.value });
    rowDataDialog.rows = response.data.data;
    myGrid1.value.api.setGridOption('rowData', rowDataDialog.rows);
    rowDataDialogBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
    showSaveDialogBtn.value = false;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 프로그램 선택된 자료 가져오기 부분  *****************************//

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '501':
        deptOptions.value = JSON.parse(JSON.stringify(response.data.data));
        deptOptions.value.unshift({ commCd: '', commNm: '전체' });
        break;
      case '901':
        levelOptions.value = response.data.data;
        // console.log('level : ', JSON.stringify(levelOptions.value));
        break;
      default:
        deptOptions.value = [];
        levelOptions.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);
const selectedGroup = ref(null);
const getGroupData = async () => {
  try {
    const response = await api.post('/api/sys/prog_group_list', {});
    // 옵션 초기화
    groupOptions.value = [];
    groupOptions.value.push({ groupNm: '전체', groupCd: '' });

    response.data.data.forEach(group => {
      groupOptions.value.push(group);
    });
    selectedGroup.value = null;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
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
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    handleCellValueChanged();
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

const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefsDialog.value,
  rowData: rowDataDialog.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
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
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    handleCellValueChangedDialog();
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
<style scoped>
.ag-body-viewport [col-id='userNm'] {
  background-color: #2244cc44;
}
</style>
