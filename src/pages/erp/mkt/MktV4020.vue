<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-4': isClassActive }">
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
                  @update:model-value="handleGetDataEvent"
                />
              </div>
              <q-space />
              <q-btn
                v-if="storeUser.setSalesCd === searchParam.salesCd && storeUser.setLevelCd > '2'"
                outline
                color="positive"
                dense
                @click="addDataSection"
                ><q-icon name="add" size="xs" /> 신규
              </q-btn>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div class="q-pa-sm">
              <q-date
                minimal
                style="width: 100%"
                color="orange"
                mask="YYYY-MM-DD"
                v-model="currentDate"
                :events="eventDays"
                :event-color="date => ($q.dark.isActive ? 'blue' : 'orange')"
                @update:model-value="onDateClick"
                @navigation="onNavigation"
                :default-year-month="currentYearMonth"
              />
            </div>
          </q-card-section>
          <q-card-section class="q-pa-xs">
            <div class="q-pa-sm">
              <div :style="contentZoneStyle">
                <ag-grid-vue
                  ref="myGrid"
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :grid-options="gridOptions"
                >
                </ag-grid-vue>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-8">
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
                영업담당 : {{ selectedSalesNm }}
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection"
                    ><q-icon name="delete" size="xs" /> 삭제
                  </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <div class="q-pa-md q-gutter-y-sm">
                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-4 text-subtitle1"
                    v-model="formData.stdDay"
                    type="date"
                    label="작성일자"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-select
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    :disable="formDisable"
                    v-model="formData.typeCd"
                    :options="typeOptions"
                    label="일지유형"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                  />

                  <q-select
                    :dense="dense"
                    :disable="!formData.projectCd"
                    class="super-small col-xs-12 col-sm-4"
                    standout="text-white"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    label="프로젝트진행상태"
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
                  <div class="col-xs-12 col-sm-10">
                    <q-input
                      ref="startFocus"
                      class="text-subtitle1"
                      :dense="dense"
                      v-model="formData.projectNm"
                      label="프로젝트명"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="5"
                      @keyup.enter="openHelpProjectDialog()"
                    >
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.projectNm !== ''"
                          name="close"
                          @click="formData.projectNm = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openHelpProjectDialog()" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-2">
                    <q-input
                      :dense="dense"
                      v-model="formData.projectCd"
                      label="관리코드"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      readonly
                      maxlength="100"
                    />
                  </div>
                </div>
                <div class="row">
                  <q-input
                    ref="subjectFocus"
                    :dense="dense"
                    class="col-12 text-subtitle1"
                    v-model="formData.subject"
                    label="제목"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>
                <q-separator class="q-mb-md" />
                <div class="">
                  <q-editor
                    :disable="formDisable"
                    class="q-editor"
                    :style="contentEditZoneStyle"
                    ref="contentsFocus"
                    v-model="formData.contents"
                    :dense="$q.screen.lt.md"
                    :definitions="definitions"
                    :toolbar="[
                      [
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify'],
                        },
                      ],

                      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                      ['insert_img'],
                      ['hr', 'link'],
                      ['fullscreen'],
                      ['unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource'],
                    ]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->
    </div>

    <q-dialog v-model="isDialogVisible" maximized persistent full-width full-height backdrop-filter="contrast(40%)">
      <q-card class="">
        <q-card-section class="q-pa-none">
          <q-form class="q-pa-none">
            <q-card bordered>
              <!-- contents list title bar -->
              <q-bar class="q-px-xs q-py-lg">
                <q-icon name="list_alt" />
                <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
                <q-space />
                <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                  <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
                </q-chip>
                <q-btn v-close-popup class="text-white bg-grey-8"><q-icon name="close" size="xs" class="" /> 닫기</q-btn>
              </q-bar>
              <!--  end of contents list title bar -->
              <q-card-actions align="right" class="q-pa-none">
                <q-toolbar class="row">
                  {{ selectedSalesNm }}
                  <q-space />
                  <div class="q-gutter-xs">
                    <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                    <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection"
                      ><q-icon name="delete" size="xs" /> 삭제
                    </q-btn>
                  </div>
                </q-toolbar>
              </q-card-actions>

              <q-separator size="3px" />

              <q-card-section class="q-pa-none">
                <div class="q-pa-md q-gutter-y-sm">
                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      :dense="dense"
                      class="col-xs-6 col-sm-6 text-subtitle1"
                      v-model="formData.stdDay"
                      type="date"
                      label="작성일자"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                    />

                    <q-select
                      :dense="dense"
                      class="col-xs-6 col-sm-6"
                      :disable="formDisable"
                      v-model="formData.typeCd"
                      :options="typeOptions"
                      label="일지유형"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      option-value="commCd"
                      option-label="commNm"
                      options-dense
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="row q-col-gutter-x-md">
                    <div class="col-xs-10 col-sm-10">
                      <q-input
                        ref="startFocus"
                        class="text-subtitle1"
                        :dense="dense"
                        v-model="formData.projectNm"
                        label="프로젝트명"
                        :label-color="$q.dark.isActive ? 'green' : 'blue'"
                        :disable="formDisable"
                        maxlength="5"
                        @keyup.enter="openHelpProjectDialog()"
                      >
                        <template v-slot:append>
                          <q-icon
                            size="0.8em"
                            v-if="formData.projectNm !== ''"
                            name="close"
                            @click="formData.projectNm = ''"
                            class="cursor-pointer q-pt-md"
                          />
                          <q-icon size="0.8em" name="search" @click="openHelpProjectDialog()" class="cursor-pointer q-pt-md" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                      <q-input
                        :dense="dense"
                        v-model="formData.projectCd"
                        label="관리코드"
                        :label-color="$q.dark.isActive ? 'green' : 'blue'"
                        readonly
                        maxlength="100"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <q-input
                      ref="subjectFocus"
                      :dense="dense"
                      class="col-12 text-subtitle1"
                      v-model="formData.subject"
                      label="제목"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="50"
                    >
                      <template v-slot:append>
                        <q-btn dense icon="mic" @click="startVoiceRecognition_subject" />
                        <q-btn dense icon="stop" @click="stopVoiceRecognition_subject" />
                      </template>
                    </q-input>
                  </div>
                  <q-separator class="q-mb-md" />
                  <div class="">
                    <q-editor
                      ref="qInput"
                      :disable="formDisable"
                      class="q-editor"
                      :style="contentEditZoneStyleDialog"
                      v-model="formData.contents"
                      :dense="$q.screen.lt.md"
                      :definitions="definitions"
                      :toolbar="toolbar"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

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
import { useUserInfoStore } from 'src/store/setUserInfo';
import HelpProject from 'components/subvue/HelpProject.vue';
import STEP_EDIT from 'pages/erp/mst/STEP_EDIT.vue';

const storeUser = useUserInfoStore();
const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;

const selectedSalesNm = ref(null);
// 오늘날자 setting
const today = new Date();
const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
const currentDate = ref(formattedDate);
// 오늘날자 setting 끝

const eventDays = ref([]);
const selectedDate = reactive({
  date: '',
  year: '',
  month: '',
  day: '',
});

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

const handleGetDataEvent = () => {
  // console.log('date : ', viewDateYYMM.year, viewDateYYMM.month);
  getEventData(viewDateYYMM.year, viewDateYYMM.month).then(() => {
    onDateClick(currentDate.value);
  });
};
const selectedLabel = computed(() => {
  if (searchParam.salesCd !== '') {
    const selectedOption = salesOptionsSearch.value.find(option => option.salesCd === searchParam.salesCd);
    return selectedOption ? selectedOption.salesNm.replace(/\s+/g, '') : '선택된 영업담당이 없습니다.';
  } else {
    return '';
  }
});

const currentYearMonth = ref(null);
const viewDateYYMM = reactive({
  year: currentDate.value.substring(0, 4),
  month: currentDate.value.substring(5, 7),
});
function onNavigation(event) {
  viewDateYYMM.year = event.year;
  viewDateYYMM.month = event.month;
  getEventData(event.year, event.month).then(() => {
    rowData.rows = [];
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    formDisable.value = true;
    isShowSaveBtn.value = false;
    isShowDeleteBtn.value = false;
    resetFormData();
  });
}

const onDateClick = resSelectedDate => {
  if (resSelectedDate) {
    const [year, month, day] = resSelectedDate.split('-');
    selectedDate.year = `${year}`;
    selectedDate.month = `${month}`;
    selectedDate.day = `${day}`;
    selectedDate.date = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    // console.log('Selected Date:', selectedDate.date, JSON.stringify(selectedDate));

    getData();
  }
};

const formDisable = ref(true);
const isScreenVisible = ref(true);
const isDialogVisible = ref(false);
const isStepDialogVisible = ref(false);
const isClassActive = ref(true);

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 550;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));
const contentEditZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value + 100}px`,
}));
const contentEditZoneStyleDialog = computed(() => ({
  height: `${contentZoneHeight.value + 200}px`,
}));

const rowData = reactive({ rows: [] });

const isVoiceRecognitionSupported = () => {
  return 'webkitSpeechRecognition' in window;
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  isDialogVisible.value = false;
  isScreenVisible.value = $q.screen.gt.md;

  currentYearMonth.value = commUtil.getTodayYear() + '/' + commUtil.getTodayMonth();

  if (isVoiceRecognitionSupported()) {
    console.log('음성인식 지원');
    // alert('음성인식 지원');
    // You can initialize the speech recognition here
  } else {
    // alert('해당 브라우저에서 음성인식이 진원되지않습니다.');
    console.log('해당 브라우저에서 음성인식이 진원되지않습니다.');
  }

  // 영업담당
  getDataSalesEventOption().then(() => {
    getDataCommOption('302').then(() => {
      getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
        handleGetDataEvent();
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

const columnDefs = ref([
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
    headerName: '담당자',
    field: 'salesNm',
    minWidth: 90,
    maxWidth: 90,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '활동일지내용',
    field: 'subject',
    minWidth: 150,
  },
  {
    headerName: '일지유형',
    field: 'typeNm',
    minWidth: 100,
  },
]);

const oldFormData = ref(null);
const formData = ref({
  stdDay: commUtil.getTodayDay(),
  salesCd: storeUser.setSalesCd,
  projectCd: '',
  projectNm: '',
  typeCd: '',
  subject: '',
  contents: '',
  useYn: '',
  stepCd: '',
});
const resetFormData = () => {
  formData.value.stdDay = commUtil.getTodayDay();
  formData.value.salesCd = storeUser.setSalesCd;
  formData.value.projectCd = '';
  formData.value.projectNm = '';
  formData.value.typeCd = '3021990';
  formData.value.subject = '';
  formData.value.contents = '';
  formData.value.useYn = 'Y';
  formData.value.stepCd = '';
};

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const subjectFocus = ref(null);
const addDataSection = () => {
  isDialogVisible.value = !$q.screen.gt.md;
  isScreenVisible.value = $q.screen.gt.md;

  resetFormData();
  selectedSalesNm.value = selectedLabel;

  oldFormData.value = null;
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.useYn = 'N';
  formData.value.stdDay = currentDate.value;
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
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  formData.value.stdDay = commUtil.unFormatDate(formData.value.stdDay);
  // console.log('da1 : ', JSON.stringify(formData.value));
  // console.log('da2 : ', JSON.stringify(oldFormData.value));

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
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 이벤트  목록 자료 가져오기 부분  *****************************//
const getEventData = async (resYear, resMonth) => {
  let paramLevel = null;
  if (storeUser.setLevelCd < 3 && storeUser.setSalesCd !== searchParam.salesCd) {
    paramLevel = '1';
  }
  if (storeUser.setLevelCd > 2 && storeUser.setSalesCd === searchParam.salesCd) {
    paramLevel = '1';
  }
  try {
    const response = await api.post('/api/mkt/mkt4010_list_event', {
      paramYear: resYear,
      paramMonth: resMonth,
      paramSalesCd: searchParam.salesCd,
      paramLevel: paramLevel,
    });
    eventDays.value.splice(0);
    for (let i = 0; i < response.data.data.length; i++) {
      let tmpDay = response.data.data[i].stdDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
      eventDays.value.push(tmpDay);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  // console.log('save :: ', JSON.stringify(resFormData));
  api
    .post('/api/mkt/mkt4010_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'D') {
          const selectedData = myGrid.value.api.getSelectedRows();
          myGrid.value.api.applyTransaction({ remove: selectedData });
        } else {
          getData();
        }
      }
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      handleGetDataEvent();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

const getData = async () => {
  try {
    const response = await api.post('/api/mkt/mkt4010_list', {
      paramStdDay: commUtil.unFormatDate(currentDate.value),
      paramSalesCd: searchParam.salesCd,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resValue => {
  try {
    const response = await api.post('/api/mkt/mkt4010_select', {
      paramStdDay: resValue.stdDay,
      paramSalesCd: resValue.salesCd,
      paramSeq: resValue.seq,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.stdDay = commUtil.formatDate(response.data.data[0].stdDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const salesOptionsSearch = ref(null);

async function getDataSalesEventOption() {
  // console.log('aa : ', storeUser.setEmpCd, storeUser.setLevelCd);
  try {
    const response = await api.post('/api/mst/sales_event_option_list', { paramEmpCd: storeUser.setEmpCd, paramLevel: storeUser.setLevelCd });

    // console.log('getData1: ', JSON.stringify(response.data.data));
    salesOptionsSearch.value = response.data.data;
    if (storeUser.setLevelCd > '2') {
      searchParam.salesCd = salesOptionsSearch.value[0].salesCd;
    } else {
      salesOptionsSearch.value.unshift({ salesCd: '', salesNm: '전체' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

const typeOptions = ref(null);
async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '302': // 일wl유형
        typeOptions.value = response.data.data;
        break;
      default:
        typeOptions.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
const stepOptions = ref(null);
async function getDataStepOption(resProjectCd) {
  try {
    const response = await api.post('/api/mkt/step_list', { paramProjectCd: resProjectCd });
    stepOptions.value = response.data.data;

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
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
    isDialogVisible.value = !$q.screen.gt.md;
    isScreenVisible.value = $q.screen.gt.md;
    // console.log('onRowClicked');
    selectedRows.value = event.api.getSelectedRows();
    isShowStatusEdit.value = false;
    isShowDeleteBtn.value = selectedRows.value.length > 0 && storeUser.setSalesCd === searchParam.salesCd && storeUser.setLevelCd > '2';
    isShowSaveBtn.value = false;

    if (selectedRows.value.length === 1) {
      getDataSelect(selectedRows.value[0]).then(() => {
        getDataStepCheck().then(() => {
          if (formData.value.stepCd) {
            oldFormData.value.stepCd = formData.value.stepCd;
          }
          getDataStepOption(selectedRows.value[0].projectCd).then(() => {
            if (storeUser.setSalesCd === searchParam.salesCd && storeUser.setLevelCd > '2') {
              isShowSaveBtn.value = true;
              isShowDeleteBtn.value = true;

              isShowStatusEdit.value = true;
              statusEdit.icon = 'edit_note';
              statusEdit.message = '수정/삭제모드 입니다';
              statusEdit.color = 'accent';
              isSaveFg = 'U';
              formDisable.value = false;
            } else {
              isShowStatusEdit.value = true;
              statusEdit.icon = 'edit_note';
              statusEdit.message = '수정하실 수 없습니다.';
              statusEdit.color = 'accent';
              isSaveFg = 'U';
              formDisable.value = true;
            }
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
      resetFormData();
    } else {
      resetFormData();
      isShowStatusEdit.value = false;
      isSaveFg = '';
      formDisable.value = true;
    }
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
    isShowDeleteBtn.value = selectedRows.value.length > 0 && storeUser.setSalesCd === searchParam.salesCd && storeUser.setLevelCd > '2';
    isShowSaveBtn.value = false;

    isSaveFg = 'D';
    isShowStatusEdit.value = true;
    statusEdit.icon = 'delete';
    statusEdit.message = '삭제모드 입니다';
    statusEdit.color = 'negative';
    formDisable.value = true;
    resetFormData();
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

function insertImg() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.png, .jpg, .jpeg';
  let file;
  input.onchange = _ => {
    const files = Array.from(input.files);
    file = files[0];

    const reader = new FileReader();
    let dataUrl = '';
    reader.onloadend = () => {
      dataUrl = reader.result;
      formData.value.contents += '<div><img style="max-width: 250px;" src="' + dataUrl + '" /></div>';
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// **************************************************************//
// ***** Dialog Help 연결부분  ************************************//
// **************************************************************//
const useDialog = ref(false);
const openHelpProjectDialog = () => {
  useDialog.value = true;
  openHelpProjectDialog1();
};
const openHelpProjectDialog1 = () => {
  if (useDialog.value) {
    $q.dialog({
      component: HelpProject,
      componentProps: {
        paramValueNm: formData.value.projectNm,
        paramCloseDay: commUtil.unFormatDate(formData.value.stdDay),
      },
    })
      .onOk(res => {
        // console.log('res ::: ', res.valueCd, res.valueNm);
        formData.value.projectCd = res.valueCd;
        formData.value.projectNm = res.valueNm;
        setTimeout(() => {
          subjectFocus.value.focus();
        }, 500);
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        // console.log('Called on OK or Cancel');
        useDialog.value = false;
        getDataStepCheck();
      });
  } else {
  }
  setTimeout(() => {
    subjectFocus.value.focus();
  }, 500);
};

// ***** DataBase 설정기간자료 가져오기 부분 *****************************//

const getDataStepCheck = async () => {
  if (!formData.value.projectCd) {
  } else {
    try {
      const response = await api.post('/api/mkt/step_check', { paramProjectCd: formData.value.projectCd });
      if (response.data.data[0]) {
        formData.value.stepCd = response.data.data[0].stepCd;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//

// ***** Voice입력 처리부분 *****************************//
const listening = ref(false);
let recognition;

const toolbar = [
  ['voice_start', 'voice_stop'],
  [
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
    },
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify'],
    },
  ],

  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
  ['insert_img'],
  ['hr', 'link'],
  ['fullscreen'],
  ['unordered', 'ordered', 'outdent', 'indent'],

  ['undo', 'redo'],
  ['viewsource'],
];

const startVoiceRecognition_subject = () => {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ko-KR'; // Set to Korean, change to 'en-US' or other languages if needed
  recognition.interimResults = true; // Display interim results (sentences as you speak)
  recognition.continuous = true; // Continue listening until manually stopped

  recognition.onstart = () => {
    listening.value = true;
  };

  recognition.onend = () => {
    listening.value = false;
  };

  recognition.onresult = event => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + ' ';
    }
    formData.value.subject = transcript.trim(); // Append sentences and trim any extra spaces
  };

  recognition.onerror = event => {
    console.error('음성 인식 오류:', event.error);
  };

  recognition.start();
};

const stopVoiceRecognition_subject = () => {
  if (recognition) {
    recognition.stop();
  }
};

const startRecording = () => {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('이 브라우저에서는 음성 인식이 지원되지 않습니다.');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true; // Keep listening
  recognition.interimResults = false; // Only final results

  recognition.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ')
      .trim();
    // formData.value.contents += transcript + '\n'; // Add transcript with a new line
    formData.value.contents += transcript; // Add transcript with a new line
  };

  recognition.onerror = event => {
    console.error('음성 인식 오류', event.error);
  };

  recognition.onend = () => {
    console.log('음성 인식 서비스 연결 끊김');
  };

  recognition.start();
};
const stopRecording = () => {
  if (recognition) {
    recognition.stop();
  }
};
// ***** Voice입력 처리부분 끝 *****************************//

// *** HTML Editor 부분 **************
const definitions = ref({
  insert_img: {
    tip: '사진 첨부',
    label: '사진넣기',
    icon: 'photo',
    handler: insertImg,
  },
  voice_start: {
    label: '음성입력', // 마이크 아이콘
    icon: 'mic', // 원하는 아이콘 이름 (예: 'mic' or custom)
    handler: startRecording, // 클릭 시 호출될 함수
  },
  voice_stop: {
    label: '종료', // 스톱 아이콘
    icon: 'stop', // 원하는 아이콘 이름 (예: 'stop' or custom)
    handler: stopRecording, // 클릭 시 호출될 함수
  },
});
const handleEnter = () => {
  formData.value.contents += '\n'; // Add a new line when Enter is pressed
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
