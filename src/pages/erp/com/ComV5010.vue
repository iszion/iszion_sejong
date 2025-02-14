<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myScreenBasicHeight">
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

    <q-card bordered>
      <q-card-section class="q-pa-xs">
        <q-toolbar class="row">
          <div class="q-gutter-xs q-mr-md">
            <q-radio v-model="selectedList" val="menu" label="전체" @update:model-value="getDataProg" />
            <q-radio v-model="selectedList" val="group" label="그룹만" @update:model-value="getDataProg" />
          </div>
          <q-select
            v-if="selectedList === 'menu'"
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
            @update:model-value="handleSelectedGroup"
          />
          <q-btn outline class="q-px-md" icon="refresh" color="teal" @:click="reloadDataSection()"
            ><span v-if="$q.screen.gt.sm">다시불러오기</span></q-btn
          >
          <q-space />
          <div class="q-gutter-xs">
            <div class="col-6 text-right">
              <q-btn v-if="!showDeleteBtn" icon="add" outline class="q-px-md" color="teal" @:click="addDataSection()"
                ><span v-if="$q.screen.gt.sm">신규</span></q-btn
              >
              <q-btn v-if="showDeleteBtn && !isDialogVisible" icon="delete" outline class="q-px-md" color="negative" @:click="deleteDataSection()"
                ><span v-if="$q.screen.gt.sm">삭제</span></q-btn
              >
            </div>
          </div>
        </q-toolbar>
      </q-card-section>

      <q-separator size="3px" />

      <!--      :suppressRowClickSelection="true"   >>> row 선택시 selected 되는 것을 방지 -->
      <!--      :dataTypeDefinitions="dataTypeDefinitions"-->
      <!--      @firstDataRendered="onFirstDataRendered"-->
      <q-card-section class="q-pa-xs">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :columnDefs="columnDefs.columns"
            @grid-ready="onGridReady"
            :defaultColDef="defaultColDef.def"
            :rowData="rowData.rows"
            :pagination="false"
            :rowSelection="rowSelection"
            @selection-changed="onSelectionChanged"
            @rowClicked="onRowClicked"
            :suppressRowClickSelection="isSelected"
          >
          </ag-grid-vue>
        </div>
      </q-card-section>

      <q-dialog persistent v-model="isDialogVisible" @hide="handleDialogClose">
        <q-card flat bordered style="max-width: 450px; width: 100%">
          <q-bar>
            <q-icon name="list_alt" />
            <div>프로그램 정보관리</div>

            <q-space />
            <q-chip v-if="isDialogVisible || showDeleteBtn" size="sm" outline :color="statusEdit.color" class="q-px-md">
              <q-icon :name="statusEdit.iconNm" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
            </q-chip>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip> 닫기 </q-tooltip>
            </q-btn>
          </q-bar>

          <q-form class="">
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="row justify-start q-col-gutter-x-md">
                  <div class="col-5">
                    <q-input
                      :autofocus="autoFocus"
                      class="q-pb-md"
                      v-model="formData.progId"
                      :color="$q.dark.isActive ? 'orange' : 'teal'"
                      :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                      label="프로그램ID"
                    />
                  </div>
                  <div class="col-7 q-pt-md q-col-gutter-x-xs">
                    <q-radio v-model="formData.menuFg" val="G" keep-color color="teal" label="그룹" />
                    <q-radio v-model="formData.menuFg" val="M" keep-color color="blue" label="메뉴" />
                    <q-radio v-model="formData.menuFg" val="S" keep-color color="orange" label="서브" />
                    <q-separator color="grey" />
                  </div>
                </div>
                <div class="row justify-start q-col-gutter-x-md">
                  <div class="col-8">
                    <q-input
                      class="q-pb-md"
                      v-model="formData.progNm"
                      :color="$q.dark.isActive ? 'orange' : 'teal'"
                      :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                      label="프로그램 명"
                    />
                  </div>
                  <div class="col-4">
                    <q-input
                      class="q-pb-md"
                      v-model="formData.location"
                      :color="$q.dark.isActive ? 'orange' : 'teal'"
                      :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                      label="Location"
                    />
                  </div>
                </div>
                <div class="row justify-start q-col-gutter-x-md">
                  <div class="col-8">
                    <q-input
                      :readonly="formData.menuFg === 'M'"
                      v-model="formData.iconNm"
                      :color="$q.dark.isActive ? 'orange' : 'teal'"
                      :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                      label="기본 아이콘"
                    />
                  </div>
                  <div class="col-4">
                    <q-input
                      type="number"
                      class="q-pb-md"
                      v-model="formData.menuSeq"
                      :color="$q.dark.isActive ? 'orange' : 'teal'"
                      :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                      label="메인순서"
                    />
                  </div>
                </div>
                <q-radio
                  :disable="formData.menuFg === 'G'"
                  size="45px"
                  keep-color
                  v-model="formData.iconNm"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="fas fa-edit fa-fw"
                  color="primary"
                  ><q-icon name="fas fa-edit fa-fw" /> 입력
                </q-radio>
                <q-radio
                  :disable="formData.menuFg === 'G'"
                  size="45px"
                  keep-color
                  v-model="formData.iconNm"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="fas fa-desktop fa-fw"
                  color="primary"
                  ><q-icon name="fas fa-desktop fa-fw" /> 조회
                </q-radio>
                <q-radio
                  :disable="formData.menuFg === 'G'"
                  size="45px"
                  keep-color
                  v-model="formData.iconNm"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="fas fa-print fa-fw"
                  color="primary"
                  ><q-icon name="fas fa-print fa-fw" /> 출력
                </q-radio>
                <q-radio
                  :disable="formData.menuFg === 'G'"
                  size="45px"
                  keep-color
                  v-model="formData.iconNm"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="fas fa-check fa-fw"
                  color="primary"
                  ><q-icon name="fas fa-check fa-fw" /> 승인
                </q-radio>

                <q-separator spaced="md" color="grey" size="2px" />

                <q-toggle
                  v-model="formData.scrYn"
                  true-value="Y"
                  false-value="N"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="primary"
                  label="조회"
                />
                <q-toggle
                  v-model="formData.newYn"
                  true-value="Y"
                  false-value="N"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="primary"
                  label="신규"
                />
                <q-toggle
                  v-model="formData.dbgYn"
                  true-value="Y"
                  false-value="N"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="primary"
                  label="수정"
                />
                <q-toggle
                  v-model="formData.delYn"
                  true-value="Y"
                  false-value="N"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="primary"
                  label="삭제"
                />
                <q-toggle v-model="formData.rptYn" true-value="Y" false-value="N" checked-icon="check" unchecked-icon="clear" label="출력" />
                <q-toggle v-model="formData.excYn" true-value="Y" false-value="N" checked-icon="check" unchecked-icon="clear" label="엑셀" />
                <q-toggle
                  v-model="formData.locYn"
                  true-value="Y"
                  false-value="N"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="primary"
                  label="마감"
                />
                <q-toggle
                  v-model="formData.appYn"
                  true-value="Y"
                  false-value="N"
                  checked-icon="check"
                  unchecked-icon="clear"
                  color="primary"
                  label="승인"
                />

                <q-separator spaced="md" color="grey" size="2px" />

                <q-input
                  type="textarea"
                  class="q-pt-sm"
                  v-model="formData.explains"
                  :color="$q.dark.isActive ? 'orange' : 'teal'"
                  :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                  label="설명"
                  autogrow
                />
              </q-card-section>
            </q-card>
          </q-form>

          <q-separator size="2px" color="grey" />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn color="primary" @click="isSaveProcess" v-close-popup><q-icon class="q-mr-xs" name="save" size="xs" /> 저장 </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, reactive, readonly, ref, toRef, toRefs, unref, watch } from 'vue';
import { isEqual } from 'lodash';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QIcon, QBtn, QToggle, useQuasar } from 'quasar';
import { api } from '/src/boot/axios';
import notifySave from 'src/js_comm/notify-save';
import jsonUtil from 'src/js_comm/json-util';

import CompButtonProg from 'components/CompButtonProg.vue';

const $q = useQuasar();

const selectedList = ref('menu');
const isSelected = ref(true);
const rowSelection = ref(null);
const autoFocus = ref(false);
const formData = ref(null);
const oldFormData = ref(null);
const showDeleteBtn = ref(false);
const isDialogVisible = ref(false);

const statusEdit = reactive({
  iconNm: '',
  message: '',
  color: '',
});

let isSaveFg = null;

//******* Screen Height resize check 부분 *************************************//
const windowHeight = ref(window.innerHeight);
const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));
const handleResize = () => {
  windowHeight.value = window.innerHeight;
  contentZoneHeight.value = windowHeight.value - screenSizeHeight.value - 140;
};
const screenSizeHeight = ref(0);
const myScreenBasicHeight = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});
////******* Screen Height resize check 부분 끝 *********************************//

//******* 초기 데이타 처리 부분   *************************************************//
onBeforeMount(() => {
  reloadDataSection();
  rowSelection.value = 'multiple';
});
////******* 초기 데이타 처리 부분 끝  **********************************************//

//******* row checkbox 선택 데이타 삭제 처리 부분  **********************************//
const selectedRows = ref([]);

const onRowClicked = () => {
  isSelected.value = true;
  if (!isDialogVisible.value) gridApi.value.deselectAll();
};
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  if (selectedRows.value.length > 0) {
    showDeleteBtn.value = true;

    if (!isDialogVisible.value) {
      statusEdit.iconNm = 'edit_note';
      statusEdit.message = '삭제모드 입니다';
      statusEdit.color = 'negative';
    }
  } else {
    showDeleteBtn.value = false;

    statusEdit.iconNm = '';
    statusEdit.message = '';
    statusEdit.color = '';
  }
};
////******* row checkbox 선택 데이타 삭제 처리 부분 끝 ******************************//

//******* cell 렌더링 처리 부분 (필드 정의 전에 설정) *********************************//
const rendererCheckView = {
  setup(props) {
    const { params } = props;
    if (params.value === 'Y') {
      return () =>
        h(QIcon, {
          name: 'check',
          color: '',
          size: 'sm',
        });
    } else {
      return () => {};
    }
  },
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
////******* cell 렌더링 처리 부분 끝 **********************************************//

//******* grid field 기본 설정 부분  *********************************************//
const defaultColDef = reactive({
  def: {
    flex: 1,
    minWidth: 180,
    sortable: true,
    filter: true,
    floatingFilter: false,
  },
});

//******* grid field 상세 설정 부분  ********************************************//
const columnDefs = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      minWidth: 50,
      maxWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      filter: false,
      sortable: false,
      pinned: 'left',
    },
    {
      headerName: '관리코드',
      field: 'progId',
      minWidth: 140,
      maxWidth: 140,
      editable: false,
      filter: true,
      sortable: true,
      resizable: false,
      pinned: 'left',
      cellRenderer: CompButtonProg,
      cellRendererParams: {
        // Pass the selectedValue and a callback function to update it
        updateSelectedValue: row => {
          autoFocus.value = false;
          isDialogVisible.value = true;
          isSelected.value = false;
          isSaveFg = 'U';

          statusEdit.iconNm = 'edit_note';
          statusEdit.message = '수정모드 입니다';
          statusEdit.color = 'orange';

          formData.value = { ...row.value };
          oldFormData.value = JSON.parse(JSON.stringify(row.value)); // 초기자료 저장
        },
      },
    },
    {
      headerName: '프로그램명',
      field: 'progNm',
      minWidth: 180,
      pinned: 'left',

      // cellRenderer: MyComp.components.testButtonVue,
      // cellRendererParams: { btnText: 'button' },
    },
    {
      headerName: 'Location',
      field: 'location',
      minWidth: 110,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '유형',
      field: 'menuFg',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '순서',
      field: 'menuSeq',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      valueFormatter: params => {
        // Check if the value is a valid number
        const parsedValue = parseFloat(params.value);
        return isNaN(parsedValue) ? '' : parsedValue.toFixed(0); // 소숫점 처리부분
      },
    },
    {
      headerName: 'Icon',
      field: 'iconNm',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererIconView,
    },
    {
      headerName: '조회',
      field: 'scrYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '신규',
      field: 'newYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '수정',
      field: 'dbgYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '삭제',
      field: 'delYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '출력',
      field: 'rptYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '엑셀',
      field: 'excYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '마감',
      field: 'locYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '승인',
      field: 'appYn',
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: rendererCheckView,
    },
    {
      headerName: '설명',
      field: 'explains',
    },
  ],
});
////******* grid field 설정 부분 끝 *********************************************//

window.extractKeys = function extractKeys(mappings) {
  return mappings.map(mapping => mapping.id);
};

const gridApi = ref();

// const dataTypeDefinitions = ref(null);
const rowData = reactive({ rows: [] });

const onGridReady = params => {
  gridApi.value = params.api;
};

const reloadDataSection = () => {
  getDataGroup();
  getDataProg();
};

const addDataSection = () => {
  isSaveFg = 'I';
  autoFocus.value = true;
  isDialogVisible.value = true;

  statusEdit.color = 'primary';
  statusEdit.message = '신규모드입니다';
  statusEdit.iconNm = 'edit';

  const newRow = {
    progId: '',
    progNm: '',
    location: '',
    menuFg: 'M',
    menuSeq: 0,
    iconNm: 'fas fa-desktop fa-fw',
    scrYn: 'N',
    newYn: 'N',
    dbgYn: 'N',
    delYn: 'N',
    rptYn: 'N',
    excYn: 'N',
    locYn: 'N',
    appYn: 'N',
    explains: '',
    oldProgId: '',
  };

  formData.value = newRow;
  oldFormData.value = {};
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
const isSaveProcess = () => {
  isDialogVisible.value = false;
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
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/com/com5010_save', resFormData)
    .then(res => {
      let saveStatus = {};
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          saveStatus.rtn = res.data.rtn;
          saveStatus.rtnMsg = res.data.rtnMsg;

          formData.value.oldProgId = formData.value.progId;

          let newData = [formData.value];
          gridApi.value.applyTransaction({
            add: newData,
            addIndex: 0,
          });
        } else if (isSaveFg === 'U') {
          saveStatus.rtn = res.data.rtn;
          saveStatus.rtnMsg = res.data.rtnMsg;

          const selectedData = gridApi.value.getSelectedRows();

          // selectedData[0] = { ...formData.value };
          selectedData[0].progId = formData.value.progId;
          selectedData[0].oldProgId = formData.value.progId;
          selectedData[0].progNm = formData.value.progNm;
          selectedData[0].location = formData.value.location;
          selectedData[0].menuFg = formData.value.menuFg;
          selectedData[0].iconNm = formData.value.iconNm;
          selectedData[0].scrYn = formData.value.scrYn;
          selectedData[0].newYn = formData.value.newYn;
          selectedData[0].dbgYn = formData.value.dbgYn;
          selectedData[0].delYn = formData.value.delYn;
          selectedData[0].rptYn = formData.value.rptYn;
          selectedData[0].locYn = formData.value.locYn;
          selectedData[0].appYn = formData.value.appYn;
          selectedData[0].excYn = formData.value.excYn;
          selectedData[0].explains = formData.value.explains;
          selectedData[0].menuSeq = formData.value.menuSeq;
          gridApi.value.applyTransaction({
            update: selectedData,
          });
        } else if (isSaveFg === 'D') {
          saveStatus.rtn = res.data.rtn;
          saveStatus.rtnMsg = res.data.rtnMsg;

          const selectedData = gridApi.value.getSelectedRows();
          gridApi.value.applyTransaction({ remove: selectedData });
        }
      } else {
        saveStatus.rtn = res.data.rtn;
        saveStatus.rtnMsg = res.data.rtnMsg;
      }
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** 프로그램 목록 자료 가져오기 부분  *****************************//
const getDataProg = async () => {
  try {
    let response = null;
    if (selectedList.value === 'group') {
      response = await api.post('/api/com/com5010_group_list', { groupCd: selectedGroup.value });
    } else {
      response = await api.post('/api/com/com5010_menu_list', { groupCd: selectedGroup.value });
    }
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);
const selectedGroup = ref(null);
const getDataGroup = async () => {
  try {
    const response = await api.post('/api/com/prog_group_list', { paramUserId: '' });
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

// ***** 검색 선택 처리 부분 ***********************************//
const handleSelectedGroup = resSelectedGroup => {
  getDataProg();
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//

const handleDialogClose = () => {
  onRowClicked();
};
</script>
<style lang="sass" scoped>
.make_cell
  background-color: #99999944

.ag-theme-alpine,
.ag-theme-alpine-dark
  /* bright green, 10% opacity */
  --ag-selected-row-background-color: rgb(0, 255, 0, 0.1)
</style>
