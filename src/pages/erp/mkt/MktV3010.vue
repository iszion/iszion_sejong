<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-8': isClassActive }">
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
            <q-toolbar class="row">
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
                <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> 삭제</q-btn
                >
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
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-4">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar class="row">
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <div class="q-pa-md q-gutter-y-lg">
                <div class="row q-col-gutter-x-xl">
                  <q-field :dense="dense" class="col-12 col-md-4" label="코드" label-color="orange" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline text-bold text-subtitle1" tabindex="0">
                        {{ isSaveFg === 'I' ? '자동생성' : formData.projectCd }}
                      </div>
                    </template>
                  </q-field>
                </div>
                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.makeDay"
                    type="date"
                    label="등록일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-select
                    :dense="dense"
                    :disable="!formData.projectCd"
                    class="super-small col-xs-12 col-sm-8"
                    standout="text-white"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    label="진행상태"
                    v-model="formData.stepCd"
                    :options="stepOptions"
                    option-value="stepCd"
                    option-label="stepNmX"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:after>
                      <q-btn padding="20px 5px" flat @click="isStepDialogVisible = true" :disable="!formData.projectCd">
                        <q-icon name="done" class="q-pa-none q-ma-none" size="xs" />
                        <q-tooltip class="bg-orange text-dark" self="center right" :offset="[10, 30]"> 진행상태정보 변경하기 </q-tooltip>
                      </q-btn>
                    </template>
                    <q-tooltip class="bg-blue" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      항상 해당프로젝트의 마지막 진행상태를 표기합니다.
                    </q-tooltip>
                  </q-select>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    ref="startFocus"
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-12"
                    v-model="formData.projectNm"
                    label="프로젝트명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="200"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    :disable="formDisable"
                    v-model="formData.salesCd"
                    :options="salesOptions"
                    label="영업담당"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="salesCd"
                    option-label="salesNm"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.salesNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    :disable="formDisable"
                    v-model="formData.levelCd"
                    :options="levelOptions"
                    label="영업규모"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.commNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    :disable="formDisable"
                    v-model="formData.typeCd"
                    :options="typeOptions"
                    label="발주유형"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.commNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    :disable="formDisable"
                    v-model="formData.consCd"
                    :options="consOptions"
                    label="공사구분"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.commNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-9"
                    v-model="formData.orcu1Nm"
                    label="소속처"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="6"
                    @keyup.enter="openHelpOrcuDialog()"
                  >
                    <template v-slot:append>
                      <q-icon
                        size="0.8em"
                        v-if="formData.orcu1Nm !== ''"
                        name="close"
                        @click="formData.orcu1Nm = ''"
                        class="cursor-pointer q-pt-md"
                      />
                      <q-icon size="0.8em" name="search" @click="openHelpOrcuDialog()" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    ref="orcu1Focus"
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-3"
                    v-model="formData.orcu1Cd"
                    label="코드"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    readonly
                    maxlength="100"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      stack-label
                      :disable="formDisable"
                      type="textarea"
                      v-model="formData.explains"
                      label="참고사항"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      autogrow
                      clearable
                      :hint="`${byteCount.explains} / 200(한글150)자 까지 입력하실 수 있습니다.`"
                      @update:model-value="updateByteCount('explains', formData.explains, 200)"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->
    </div>

    <q-dialog v-model="isStepDialogVisible" persistent backdrop-filter="contrast(40%)" @hide="getDataStepCheck">
      <q-card class="" style="width: 700px; max-width: 100vw">
        <q-card-section class="q-pa-none">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-xs q-py-lg">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">프로젝트 진행상태관리</span>
              <q-space />
              <q-btn v-close-popup class="text-white bg-grey-8"><q-icon name="close" size="xs" class="" /> 닫기</q-btn>
            </q-bar>
            <!--  end of contents list title bar -->
          </q-card>
        </q-card-section>
        <q-card-section> <STEP_EDIT :message="{ projectCd: formData.projectCd }" /> </q-card-section>
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
import STEP_EDIT from 'pages/erp/mst/STEP_EDIT.vue';
import HelpOrcu from 'components/subvue/HelpOrcu.vue';

const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;

const isStepDialogVisible = ref(false);
const salesOptionsSearch = ref(null);
const stepOptionsSearch = ref(null);
const consOptionsSearch = ref(null);
const salesOptions = ref(null);
const consOptions = ref(null);
const stepOptions = ref(null);
const levelOptions = ref(null);
const typeOptions = ref(null);
const zoneOptions = ref(null);

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
const isClassActive = ref(true);

const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 270;
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
  getDataSalesOption().then(() => {
    getDataCommOption('102').then(() => {
      getDataCommOption('103').then(() => {
        getDataCommOption('203').then(() => {
          getDataCommOption('301').then(() => {
            getDataCommOption('890').then(() => {
              handelGetData();
            });
          });
        });
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
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      filter: false,
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
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '수주일',
      field: 'orderDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '폐기',
      field: 'outDay',
      valueFormatter: dateFormatter,
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
    console.log('totalPage : ', totalPages.value);
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
const getDataSelect = async resProjectCd => {
  try {
    const response = await api.post('/api/mkt/mkt3010_select', {
      paramProjectCd: resProjectCd,
    });
    formData.value = response.data.data[0];
    // console.log('select data ::: ', JSON.stringify(formData.value));
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.makeDay = commUtil.formatDate(response.data.data[0].makeDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

async function getDataSalesOption() {
  try {
    const response = await api.post('/api/mst/sales_option_list', {});

    // console.log('getData1: ', JSON.stringify(response.data.data));
    salesOptions.value = response.data.data;
    salesOptionsSearch.value = JSON.parse(JSON.stringify(response.data.data));
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
        consOptions.value = response.data.data;
        consOptionsSearch.value = JSON.parse(JSON.stringify(response.data.data));
        consOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      case '103': // 발주유형
        typeOptions.value = response.data.data;
        break;
      case '203': // 영업규모
        levelOptions.value = response.data.data;
        break;
      case '301': // 진행상태
        stepOptionsSearch.value = response.data.data;
        stepOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      case '890': // 지역구분
        zoneOptions.value = response.data.data;
        break;
      default:
        consOptionsSearch.value = [];
        consOptions.value = [];
        stepOptionsSearch.value = [];
        typeOptions.value = [];
        levelOptions.value = [];
        zoneOptions.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function getDataStepOption(resProjectCd) {
  try {
    const response = await api.post('/api/mkt/step_list', { paramProjectCd: resProjectCd });
    stepOptions.value = response.data.data;

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
const getDataStepCheck = async () => {
  if (!formData.value.projectCd) {
  } else {
    try {
      const response = await api.post('/api/mkt/step_check', { paramProjectCd: formData.value.projectCd });
      formData.value.stepCd = response.data.data[0].stepCd;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

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
    isShowStatusEdit.value = false;
    isShowDeleteBtn.value = selectedRows.value.length > 0;
    isShowSaveBtn.value = false;

    if (selectedRows.value.length === 1) {
      getDataSelect(selectedRows.value[0].projectCd).then(() => {
        getDataStepCheck().then(() => {
          getDataStepOption(selectedRows.value[0].projectCd).then(() => {
            isShowSaveBtn.value = true;
            isShowStatusEdit.value = true;
            statusEdit.icon = 'edit_note';
            statusEdit.message = '수정/삭제모드 입니다';
            statusEdit.color = 'accent';
            isSaveFg = 'U';
            formDisable.value = false;
          });
        });
      });
    } else if (selectedRows.value.length > 1) {
      isSaveFg = 'D';
      isShowStatusEdit.value = true;
      statusEdit.icon = 'delete';
      statusEdit.message = '삭제모드 입니다';
      statusEdit.color = 'negative';
      formDisable.value = true;
      formData.value = {};
    } else {
      formData.value = {};
      isShowStatusEdit.value = false;
      isSaveFg = '';
      formDisable.value = true;
    }
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    onCellValueChanged();
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
