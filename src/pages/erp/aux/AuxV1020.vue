<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar>
                <q-btn outline color="positive" dense @click="getData"><q-icon name="refresh" size="xs" class="q-mr-xs" /> 다시 불러오기 </q-btn>
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                  <q-btn v-if="formData.stdYear" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn v-if="selectedRows.length > 0" outline color="negative" dense @click="deleteDataSection">
                    <q-icon name="delete" size="xs" /> 삭제
                  </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <q-card flat bordered class="q-ma-xs q-pa-md">
                <div class="row">
                  <div class="col-2">
                    <div style="max-width: 100px">
                      <q-input
                        ref="stdYearFocus"
                        stack-label
                        v-model="formData.stdYear"
                        type="text"
                        label="기준년도"
                        label-color="orange"
                        :disable="formDisable"
                        :rules="[val => (val >= '2000' && val <= '2100') || '2000년 ~ 2100년']"
                        class="custom-font-size"
                      >
                        <template v-slot:append>
                          <q-avatar class="q-mt-md"> 년 </q-avatar>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-gutter-x-md">
                    <div class="q-pt-md">
                      <q-toggle
                        size="lg"
                        v-model="formData.eva1aYn"
                        true-value="Y"
                        false-value="N"
                        checked-icon="check"
                        unchecked-icon="clear"
                        color="primary"
                        label="1차역량평가 팀원기준 전체선택"
                        left-label
                      />
                    </div>

                    <div class="q-pt-md">
                      <q-toggle
                        size="lg"
                        v-model="formData.eva1bYn"
                        true-value="Y"
                        false-value="N"
                        checked-icon="check"
                        unchecked-icon="clear"
                        color="primary"
                        label="1차역량평가 항목기준 전체선택"
                        left-label
                      />
                    </div>

                    <div class="q-pt-md">
                      <q-toggle
                        size="lg"
                        v-model="formData.eva2aYn"
                        true-value="Y"
                        false-value="N"
                        checked-icon="check"
                        unchecked-icon="clear"
                        color="primary"
                        label="2차역량평가 팀원기준 전체선택"
                        left-label
                      />
                    </div>

                    <div class="q-pt-md">
                      <q-toggle
                        size="lg"
                        v-model="formData.eva2bYn"
                        true-value="Y"
                        false-value="N"
                        checked-icon="check"
                        unchecked-icon="clear"
                        color="primary"
                        label="2차역량평가 항목기준 전체선택"
                        left-label
                      />
                    </div>
                  </div>
                </div>
                <q-separator spaced size="3px" />
                <div class="row">
                  <div class="col-6">
                    <div class="row justify-between">
                      <div class="col-2 text-subtitle1 text-bold">
                        팀장 (
                        {{
                          parseInt(formData.team1PerPointS) +
                          parseInt(formData.team1PerPointA) +
                          parseInt(formData.team1PerPointB) +
                          parseInt(formData.team1PerPointC) +
                          parseInt(formData.team1PerPointD)
                        }}% )
                      </div>
                      <div class="row q-gutter-x-xl">
                        <q-input v-model="formData.team1PerPointS" label="S 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team1PerPointA" label="A 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team1PerPointB" label="B 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team1PerPointC" label="C 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team1PerPointD" label="D 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                      </div>
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="row justify-between">
                      <div class="col-2 text-subtitle1 text-bold">
                        팀원 (
                        {{
                          parseInt(formData.team2PerPointS) +
                          parseInt(formData.team2PerPointA) +
                          parseInt(formData.team2PerPointB) +
                          parseInt(formData.team2PerPointC) +
                          parseInt(formData.team2PerPointD)
                        }}% )
                      </div>
                      <div class="row q-gutter-x-xl">
                        <q-input v-model="formData.team2PerPointS" label="S 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team2PerPointA" label="A 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team2PerPointB" label="B 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team2PerPointC" label="C 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                        <q-input v-model="formData.team2PerPointD" label="D 인원" label-color="orange" style="width: 60px">
                          <template v-slot:append><span class="text-subtitle2 q-pt-md">%</span> </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->

      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">품목정보 리스트</span>
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
          <q-card-section class="q-pa-xs">
            <div :key="gridKey" :style="contentZoneStyle">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.def"
                :rowSelection="rowSelection"
                @selection-changed="onSelectionChanged"
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
import { Notify, QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();

let isSaveFg = null;

const gridKey = ref(0);

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
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [] });

const onGridReady = params => {
  gridApi.value = params.api;
  let firstNodeSet = false;
  params.api.forEachNode(node => {
    console.log('node: ', JSON.stringify(node.data));
    if (!firstNodeSet) {
      node.setSelected(true);
      firstNodeSet = true;
    }
  });
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
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
      headerName: '평가기준년도',
      field: 'stdYear',
      minWidth: 120,
    },
    {
      headerName: '1차역량평가(팀원)',
      field: 'eva1aYn',
      minWidth: 120,
    },
    {
      headerName: '1차역량평가(항목)',
      field: 'eva1bYn',
      minWidth: 120,
    },
    {
      headerName: '2차역량평가(팀원)',
      field: 'eva2aYn',
      minWidth: 120,
    },
    {
      headerName: '2차역량평가(항목)',
      field: 'eva2bYn',
      minWidth: 120,
    },
    {
      headerName: '팀장S',
      field: 'team1PerPointS',
      minWidth: 120,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  stdYear: '',
  eva1aYn: '',
  eva1bYn: '',
  eva2aYn: '',
  eva2bYn: '',
  team1PerPointS: 0,
  team1PerPointA: 0,
  team1PerPointB: 0,
  team1PerPointC: 0,
  team1PerPointD: 0,
  team2PerPointS: 0,
  team2PerPointA: 0,
  team2PerPointB: 0,
  team2PerPointC: 0,
  team2PerPointD: 0,
});

const formDataInitialize = () => {
  formData.value.stdYear = '';
  formData.value.eva1aYn = '';
  formData.value.eva1bYn = '';
  formData.value.eva2aYn = '';
  formData.value.eva2bYn = '';
  formData.value.team1PerPointS = 0;
  formData.value.team1PerPointA = 0;
  formData.value.team1PerPointB = 0;
  formData.value.team1PerPointC = 0;
  formData.value.team1PerPointD = 0;
  formData.value.team2PerPointS = 0;
  formData.value.team2PerPointA = 0;
  formData.value.team2PerPointB = 0;
  formData.value.team2PerPointC = 0;
  formData.value.team2PerPointD = 0;
};

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;

  if (selectedRows.value.length === 1) {
    getDataSelect(selectedRows.value[0].stdYear, selectedRows.value[0].stdFg);
    isShowStatusEdit.value = true;
    statusEdit.icon = 'edit_note';
    statusEdit.message = '수정/삭제모드 입니다';
    statusEdit.color = 'accent';
    isSaveFg = 'U';
    formDisable.value = false;
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    isShowStatusEdit.value = true;
    statusEdit.icon = 'delete';
    statusEdit.message = '삭제모드 입니다';
    statusEdit.color = 'negative';
    formDisable.value = true;
    formDataInitialize();
  } else {
    formData.value = {};
    isShowStatusEdit.value = false;
    isSaveFg = '';
    formDisable.value = true;
  }
};

const rowSelection = ref(null);

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 490;
};
onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getData();
});
const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const stdYearFocus = ref(null);
const addDataSection = () => {
  gridApi.value.deselectAll();
  setTimeout(() => {
    formDataInitialize();
    oldFormData.value = formData;
    isShowStatusEdit.value = true;
    statusEdit.icon = 'edit';
    statusEdit.message = '신규입력모드 입니다';
    statusEdit.color = 'primary';
    isSaveFg = 'I';
    formDisable.value = false;

    formData.value.stdYear = String(commUtil.getTodayYear());
    formData.value.stdFg = '0';
    formData.value.sDay = String(commUtil.getTodayYear()) + '-01-01';
    formData.value.eDay = String(commUtil.getTodayYear()) + '-12-31';
    setTimeout(() => {
      stdYearFocus.value.focus();
    }, 100);
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
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        console.log('delete : ', JSON.stringify(selectedRows.value[i]));
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

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/aux/aux1020_list', {});
    rowData.rows = response.data.data;
    gridKey.value += 1;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async (resStdYear, resStdFg) => {
  try {
    const response = await api.post('/api/aux/aux1020_select', { paramStdYear: resStdYear, paramStdFg: resStdFg });
    formData.value = response.data.data[0];
    // oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  console.log('del ::: ', JSON.stringify(resFormData));
  api
    .post('/api/aux/aux1020_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.oldStdYear = formData.value.stdYear;

          let newData = [formData.value];
          gridApi.value.applyTransaction({
            add: newData,
            addIndex: 0,
          });
        } else if (isSaveFg === 'U') {
          const selectedData = gridApi.value.getSelectedRows();

          // selectedData[0] = { ...formData.value };
          selectedData[0].stdYear = formData.value.stdYear;
          selectedData[0].oldStdYear = formData.value.stdYear;
          gridApi.value.applyTransaction({
            update: selectedData,
          });
        } else if (isSaveFg === 'D') {
          const selectedData = gridApi.value.getSelectedRows();
          gridApi.value.applyTransaction({ remove: selectedData });
        }
      }
      gridApi.value.deselectAll();
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;

      notifySave.notifyView(saveStatus);
      getData();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
<style scoped></style>
