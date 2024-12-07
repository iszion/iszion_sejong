<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12 col-md-4">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">프로그램 리스트</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-select
                dense
                stack-label
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
                @update:model-value="handleSelectedGroup"
              />
              <q-btn outline color="positive" dense @click="reloadDataSection"
                ><q-icon class="q-mr-sm" name="refresh" size="xs" />다시 불러오기</q-btn
              >
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGrid"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefsProg.columns"
                :rowData="rowDataProg.rows"
                :defaultColDef="defaultColDefProg.def"
                :rowSelection="rowSelectionProg"
                @selection-changed="onSelectionChangedProg"
                @grid-ready="onGridReadyProg"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <div class="col-12 col-md-8">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">사용자 권한관리</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-select
                v-if="selectedProg"
                dense
                options-dense
                class="q-pb-sm q-pl-sm q-mr-lg"
                label-color="orange"
                v-model="searchValue.deptCd"
                :options="searchValue.deptOptions"
                option-value="commCd"
                option-label="commNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 150px; max-width: 150px"
                label="소속팀"
                @update:model-value="handleSelectedUser"
              />

              <span v-if="selectedProg" class="text-subtitle1 text-bold q-px-lg q-py-xs text-secondary rounded-borders">
                [ {{ selectedProg.progNm }} ]
              </span>
              <q-space />
              <q-btn v-if="showSaveUserBtn" outline dense color="primary" @click="saveDataUserSection" v-close-popup class="q-px-sm q-mr-sm"
                ><q-icon class="q-mr-xs" name="save" size="xs" /> 권한 적용하기
              </q-btn>
              <q-btn outline dense color="primary" v-close-popup class="q-px-sm"
                ><q-icon name="close" size="xs" /><span v-if="!$q.screen.xs" class="q-pl-xs">닫기</span></q-btn
              >
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGrid1"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefsUser.columns"
                :rowData="rowDataUser.rows"
                :defaultColDef="defaultColDefUser.def"
                :rowSelection="rowSelectionUser"
                @selection-changed="onSelectionChangedUser"
                @cell-value-changed="onCellValueChangedUser"
                @grid-ready="onGridReadyUser"
              >
              </ag-grid-vue>
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
import { computed, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import CompCheckHeader from 'components/CompCheckHeader.vue';
import CompToggleScr from 'components/CompToggleScr.vue';
import CompToggleNew from 'components/CompToggleNew.vue';
import CompToggleDbg from 'components/CompToggleDbg.vue';
import CompToggleDel from 'components/CompToggleDel.vue';
import CompToggleRpt from 'components/CompToggleRpt.vue';
import CompToggleExc from 'components/CompToggleExc.vue';
import CompToggleLoc from 'components/CompToggleLoc.vue';
import CompToggleApp from 'components/CompToggleApp.vue';
import { isEmpty } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();

const $q = useQuasar();

const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApiProg = ref(null);
const gridApiUser = ref(null);
const rowDataProg = reactive({ rows: [] });
const selectedRowsProg = ref();
const selectedProg = ref();
const selectedRowsUser = ref();
const rowSelectionProg = ref(null);
const rowDataUser = reactive({ rows: [] });
const rowDataUserBack = ref([]);
const updateData = ref([]);
const showSaveUserBtn = ref(false);

const searchValue = ref({
  textValue: '',
  deptCd: null,
  deptOptions: [],
});

const onGridReadyProg = params => {
  gridApiProg.value = params.api;
};
const onGridReadyUser = params => {
  gridApiUser.value = params.api;
};

const rendererIconView = {
  setup(props) {
    const { params } = props;
    return () =>
      h(QIcon, {
        name: params.value,
        color: '',
        size: 'xs',
      });
  },
};

const defaultColDefProg = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
});

const columnDefsProg = reactive({
  columns: [
    {
      headerName: '#',
      minWidth: 60,
      maxWidth: 60,
      sortable: false,
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
    },
    {
      headerName: 'Icon',
      field: 'iconNm',
      minWidth: 70,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererIconView,
    },
    {
      headerName: '프로그램명',
      field: 'progNm',
      minWidth: 140,
      filter: true,
    },
  ],
});

const defaultColDefUser = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: false,
    floatingFilter: false,
    editable: false,
  },
});

const columnDefsUser = reactive({
  columns: [
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
      headerName: 'ID',
      field: 'userId',
      minWidth: 120,
      maxWidth: 120,
      filter: true,
      sortable: true,
      resizable: true,
      pinned: 'left',
    },
    {
      headerName: '사용자명',
      field: 'userNm',
      minWidth: 130,
      maxWidth: 130,
      filter: true,
      pinned: 'left',
    },
    {
      headerName: '사번',
      field: 'empCd',
      minWidth: 100,
      maxWidth: 100,
      filter: true,
    },
    {
      headerName: '조회',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '입력',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '수정',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '삭제',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '출력',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '엑셀',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '마감 ',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
    {
      headerName: '승인',
      headerComponent: CompCheckHeader,
      headerComponentParams: {
        headerCheckYn: '',
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
          onCellValueChangedUser();
        },
      },
    },
  ],
});

const onSelectionChangedProg = event => {
  selectedRowsProg.value = event.api.getSelectedRows();
  if (!isEmpty(selectedRowsProg.value)) {
    selectedProg.value = selectedRowsProg.value[0];
    getDataUser();
  }
};
const onSelectionChangedUser = event => {
  selectedRowsUser.value = event.api.getSelectedRows();
};

const onCellValueChangedUser = () => {
  updateData.value = [];
  for (let i = 0; rowDataUserBack.value.length > i; i++) {
    if (JSON.stringify(rowDataUserBack.value[i]) !== JSON.stringify(rowDataUser.rows[i])) {
      updateData.value.push(rowDataUser.rows[i]);
    }
  }

  showSaveUserBtn.value = updateData.value.length > 0;
};

const rowSelectionUser = ref(null);

const checkAllProg = (resId, resCheck) => {
  for (let i = 0; i < rowDataUser.rows.length; i++) {
    if (rowDataUser.rows[i][resId]) {
      rowDataUser.rows[i][resId] = resCheck;
    }
  }
  onCellValueChangedUser();
};

// **************************************************************//
// ***** Screen 초기자료 부분  *************************************//
// **************************************************************//
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
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  rowSelectionProg.value = 'single';
  reloadDataSection();
  getDataCommOption('501');
});

const reloadDataSection = () => {
  getDataGroup().then(() => {
    getDataProg();
  });
};

const saveDataUserSection = () => {
  let iu = [];
  let iuD = [];
  // 신규/수정 부분
  for (let i = 0; i < updateData.value.length; i++) {
    updateData.value[i].progId = selectedProg.value.progId;
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
    saveDataUserAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    setTimeout(() => {
      getDataUser();
    }, 500);
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 검색 선택 처리 부분 ***********************************//
const handleSelectedGroup = resSelectedGroup => {
  getDataProg();
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//
const handleSelectedUser = resDeptCd => {
  getDataUser();
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//

// ***** 프로그램 목록 자료 가져오기 부분  *****************************//
const getDataProg = async () => {
  try {
    const response = await api.post('/api/sys/sys5010_menu_list', { groupCd: selectedGroup.value });
    rowDataProg.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
  selectedProg.value = null;
  // rowDataUser.rows = [];
};

// ***** 프로그램 권한정보 선택된 자료 가져오기 부분  *****************************//
const getDataUser = async () => {
  try {
    const response = await api.post('/api/sys/sys1130_user_list', { paramDeptCd: searchValue.value.deptCd, paramProgId: selectedProg.value.progId });
    rowDataUser.rows = response.data.data;
    rowDataUserBack.value = JSON.parse(JSON.stringify(response.data.data));
    updateData.value = [];
    showSaveUserBtn.value = false;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 프로그램 선택된 자료 가져오기 부분  *****************************//

// ***** 프로그램 권한정보 저장하기 부분  *****************************//
const saveDataUserAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1110_grntp_save', resFormData)
    .then(res => {
      showSaveUserBtn.value = false;
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

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);
const selectedGroup = ref('');
const getDataGroup = async () => {
  try {
    const response = await api.post('/api/sys/prog_group_list', {});
    // 옵션 초기화
    groupOptions.value = response.data.data;
    groupOptions.value.unshift({ groupNm: '전체', groupCd: '' });
    selectedGroup.value = '';
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 소속자료 가져오기 부분 *****************************//

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '501':
        searchValue.value.deptOptions = response.data.data;
        searchValue.value.deptOptions.unshift({ commCd: '', commNm: '전체' });
        searchValue.value.deptCd = '';
        break;
      default:
        searchValue.value.deptOptions = [];
    }
    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style scoped></style>
