<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" style="width: 800px; max-width: 90vw">
    <q-card class="my-card q-dialog-plugin">
      <q-toolbar :class="$q.dark.isActive ? 'bg-lime-10' : 'bg-lime-6'">
        <q-btn @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" />닫기</q-btn>
        <q-space />
        <div class="text-h6 text-bold">
          [ <span class="text-blue"> {{ params.paramSalesNm }} </span> ] <span class="q-ml-md">업무활동일지</span>
        </div>
        <q-space />
      </q-toolbar>
      <q-card-section class="grid-container q-pa-xs-xs q-pa-sm-sm">
        <q-separator spaced />
        <div>
          <div class="q-pa-md q-gutter-y-sm">
            <div class="row q-col-gutter-x-xl">
              <q-field label="작성일자" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="col-xs-12 col-sm-4 text-subtitle1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ commUtil.formatWeekDate(formData.stdDay) }}</div>
                </template>
              </q-field>

              <q-field label="일지유형" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="col-xs-12 col-sm-3 text-subtitle1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.typeNm }}</div>
                </template>
              </q-field>

              <q-select
                :dense="dense"
                class="super-small col-xs-12 col-sm-5"
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
              </q-select>
            </div>
            <div class="row q-col-gutter-x-xl">
              <div class="col-xs-12 col-sm-10">
                <q-field label="프로젝트명" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ formData.projectNm }}</div>
                  </template>
                </q-field>
              </div>
              <div class="col-xs-12 col-sm-2">
                <q-field label="관리코드" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ formData.projectCd }}</div>
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row">
              <q-field label="일지주제" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="col-12 text-subtitle1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.subject }}</div>
                </template>
              </q-field>
            </div>
            <div class="">
              <q-field label="일지내용" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0"><span v-html="formData.contents" /></div>
                </template>
              </q-field>
            </div>
          </div>
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
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { AgGridVue } from 'ag-grid-vue3';
import { onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import commUtil from 'src/js_comm/comm-util';
import SubHistory from 'components/subvue/SubHistory.vue';

const $q = useQuasar();
const dense = ref(false);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const params = defineProps({
  paramStdDay: {
    type: String,
    required: false,
    default: null,
  },
  paramSalesCd: {
    type: String,
    required: false,
    default: null,
  },
  paramSalesNm: {
    type: String,
    required: false,
    default: null,
  },
  paramSeq: {
    type: String,
    required: false,
    default: null,
  },
});

const formData = ref({
  stdDay: '',
  salesCd: '',
  projectCd: '',
  projectNm: '',
  typeCd: '',
  subject: '',
  contents: '',
  useYn: '',
  stepCd: '',
});

onBeforeMount(() => {
  console.log('params : ', JSON.stringify(params));
  getDataSelect().then(() => {
    getDataStepCheck().then(() => {
      getDataStepOption();
    });
  });
});

const selectedRows = ref(null);

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getDataSelect = async () => {
  try {
    const response = await api.post('/api/mkt/mkt4010_select', {
      paramStdDay: params.paramStdDay,
      paramSalesCd: params.paramSalesCd,
      paramSeq: params.paramSeq,
    });
    formData.value = response.data.data[0];
    // console.log('formData : ', JSON.stringify(formData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataStepCheck = async () => {
  if (!formData.value.projectCd) {
  } else {
    try {
      const response = await api.post('/api/mkt/step_check', { paramProjectCd: formData.value.projectCd });
      if (response.data.data[0]) {
        formData.value.stepCd = response.data.data[0].stepCd;
        formData.value.stepNm = response.data.data[0].stepNm;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
};

const stepOptions = ref(null);
async function getDataStepOption() {
  try {
    const response = await api.post('/api/mkt/step_list', { paramProjectCd: formData.value.projectCd });
    stepOptions.value = response.data.data;

    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px

.grid-container
  display: flex
  flex-direction: column
  height: 96%

.ag-grid-wrapper
  flex-grow: 1
  height: 96%
</style>
