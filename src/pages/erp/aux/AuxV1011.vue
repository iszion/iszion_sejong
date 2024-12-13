<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" maximized full-width full-height @before-show="handleBeforeShow">
    <q-card class="my-card q-dialog-plugin">
      <div class="row" :class="$q.dark.isActive ? 'bg-lime-10' : 'bg-lime-6'">
        <div class="row q-py-md col-xs-12 col-sm-6">
          <div class="flex flex-center q-ml-md">
            <q-btn @click.stop="onDialogCancel"> <q-icon name="close" class="q-mr-xs" />닫기</q-btn>
          </div>
          <q-space />
          <span class="text-h6 text-bold q-ml-md flex flex-center">전자결재</span>
          <q-space />
        </div>
      </div>
      <q-card-section class="grid-container q-pa-sm-lg q-pa-xs-sm">
        <div class="row">
          <div class="col-xs-12 col-sm-8 row q-col-gutter-xs-x-md q-col-gutter-sm-x-lg q-pt-sm-lg q-pb-xs-md">
            <div class="col-auto">
              <q-field label="작성일자" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ params.data.stdDay }}</div>
                </template>
              </q-field>
            </div>
            <div class="col-auto">
              <q-field label="기안자" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ params.data.empNm }}</div>
                </template>
              </q-field>
            </div>
            <div class="col-auto">
              <q-field label="문서번호" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1" style="width: 100px">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ params.data.lineNo }}</div>
                </template>
              </q-field>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 row">
            <q-space class="gt-xs" />
            <q-card
              flat
              bordered
              class="q-px-xs flex flex-center"
              style="width: 25px; border-color: grey; border-radius: 0; border-width: 1px 1px 1px 1px"
            >
              <div class="flex flex-center text-bold">
                <span class="q-mb-lg">결</span>
                <span>재</span>
              </div>
            </q-card>
            <q-card
              flat
              bordered
              v-for="(data, index) in rowData.mline"
              :key="index"
              style="border-width: 1px 1px 1px 0; border-color: grey; border-radius: 0"
            >
              <q-card-section style="height: 20px" class="q-pa-none flex flex-center">
                <span v-if="params.data.empCd === data.empCdApp">기안자</span>
                <span v-else>{{ data.pstnNm }}</span>
              </q-card-section>
              <q-separator color="grey" />
              <q-card-section style="min-width: 85px; min-height: 70px" class="q-pa-sm flex flex-center">
                <q-badge v-if="data.passYn === 'Y'" rounded color="orange" label="전결" class="q-px-md q-py-sm" />
                <q-btn
                  v-if="data.passYn !== 'Y' && data.status !== '1' && data.status !== '2' && data.isSelectAccept === '1'"
                  outline
                  size="sm"
                  class="q-pa-xs"
                  @click="onApprovalAccept(data.lineSeq)"
                >
                  <q-icon name="check" size="xs" />결재하기
                </q-btn>

                <!-- 조건에 따라 empNm 또는 q-img 표시 -->
                <span v-if="data.signFileNm === ''">{{ params.data.empNm }}</span>
                <q-img
                  v-else-if="data.passYn !== 'Y' && data.status === '1'"
                  loading="eager"
                  :src="`https://www.iszion.com/images/sign/${data.signFileNm}?${new Date().getTime()}`"
                  style="object-fit: cover; width: 100%; height: 100%"
                />
                <q-badge v-else-if="data.passYn !== 'Y' && data.status === '2'" rounded color="red" label="반려" class="q-px-md q-py-sm" />
              </q-card-section>
              <q-separator />
              <q-card-section style="height: 20px" class="q-pa-none flex flex-center text-subtitle2">
                <span v-if="params.data.empCd === data.empCdApp">{{ params.data.regDateSign }}</span>
                <span v-else>{{ data.signDate }}</span>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <q-field label="업무주제" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="col-12 text-subtitle1">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{ params.data.subject }}</div>
            </template>
          </q-field>
        </div>

        <q-field label="첨부파일" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="col-12 text-caption">
          <template v-slot:control>
            <div class="row q-px-sm" v-for="(data, index) in rowDataFile" :key="index">
              <div
                class="col-auto self-center full-width no-outline"
                :style="{
                  color: data.isDownloaded === '0' ? ($q.dark.isActive ? 'white' : 'black') : $q.dark.isActive ? 'grey' : 'grey',
                }"
              >
                <span class="text-caption">{{ index + 1 }}: {{ data.fileName }}</span>
                <q-badge
                  outline
                  align="middle"
                  :color="data.isDownloaded === '0' ? 'teal' : 'grey'"
                  class="cursor-pointer q-ml-xs"
                  @click="handleFileDownload(data)"
                >
                  {{ commUtil.formatFileSize(data.fileSize) }}
                  <q-icon name="download" class="q-ml-sm" />
                </q-badge>
              </div>
            </div>
          </template>
        </q-field>

        <q-field label="일지내용" :label-color="$q.dark.isActive ? 'green' : 'blue'" stack-label class="text-subtitle1">
          <template v-slot:control>
            <div class="self-center full-width no-outline">
              <q-scroll-area style="height: 70vh">
                <span v-html="params.data.contents" />
              </q-scroll-area>
            </div>
          </template>
        </q-field>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useUserInfoStore } from 'src/store/setUserInfo';
import commUtil from 'src/js_comm/comm-util';
const storeUser = useUserInfoStore();

const $q = useQuasar();
const dense = ref(false);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const params = defineProps({
  data: {
    type: Object,
    required: false,
    default: null,
  },
});

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 270;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  // console.log('params : ', JSON.stringify(params));
  // console.log('params1 : ', params.data.lineCd);
  // console.log('params2 : ', params.data.lineNo);
  // console.log('params3 : ', params.data.empCd);
  uploadFileList().then(() => {});
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

const selectedRows = ref(null);

const handleBeforeShow = () => {
  // console.log('params11 : ', params.data.lineCd);
  // console.log('params12 : ', params.data.lineNo);
  // console.log('params13 : ', params.data.empCd);
  getDataMline();
};

const onApprovalAccept = resLineSeq => {
  $q.dialog({
    dark: true,
    title: '결재처리',
    message: '해당 문서를 결재 하시겠습니까?',
    options: {
      type: 'radio',
      model: '1',
      inline: true,
      items: [
        { label: '결재승인', value: '1', color: 'secondary' },
        { label: '결재반려', value: '2' },
      ],
    },

    ok: {
      label: '결재진행',
      push: true,
      color: 'primary',
    },
    cancel: {
      label: '취소',
      push: true,
      color: 'grey-7',
    },
  })
    .onOk(data => {
      // console.log('>>>> OK, received', data);
      if (data === '2') {
        $q.dialog({
          title: '반려 사유 입력',
          prompt: {
            model: '',
            type: 'textarea',
            isValid: val => val.length > 0 || '반려 사유를 입력해 주세요.',
          },
          cancel: true,
          persistent: true,
        }).onOk(message => {
          // Handle the entered message
          console.log('message : ', message);
          handleApprovalAccept(resLineSeq, data, message);
        });
      } else {
        handleApprovalAccept(resLineSeq, data, '');
      }
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

const handleApprovalAccept = (resLineSeq, resDataStatus, resMessage) => {
  const jsonData = {
    lineCd: params.data.lineCd,
    lineNo: params.data.lineNo,
    empCdApp: storeUser.setEmpCd,
    status: resDataStatus,
    explains: resMessage,
  };
  console.log('data : ', JSON.stringify(jsonData));
  let iu = [];
  let iuD = [];
  let tmpJson = '{"mode":"I","data":' + JSON.stringify(jsonData) + '}';
  iu.push(tmpJson);
  let saveJsonData = jsonUtil.jsonFiller('no1', iu, iuD);
  saveJsonData.lineSeq = String(resLineSeq);
  saveJsonData.status = resDataStatus;
  console.log('saveData : ', JSON.stringify(saveJsonData));
  saveDataAndHandleResult(saveJsonData);
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const rowData = reactive({ mline: [] });
const getDataMline = async () => {
  try {
    const response = await api.post('/api/aux/auxMline_list', {
      paramLineCd: params.data.lineCd,
      paramLineNo: params.data.lineNo,
      paramEmpCd: params.data.empCd,
      paramEmpCdApp: storeUser.setEmpCd,
    });
    rowData.mline = response.data.data;
    console.log('mline : ', JSON.stringify(rowData.mline));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  // console.log('save :: ', JSON.stringify(resFormData));
  api
    .post('/api/aux/aux1011_save', resFormData)
    .then(res => {
      console.log('res : ', res.data.rtn);
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      getDataMline();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const rowDataFile = ref([]);
const uploadFileList = async () => {
  try {
    const param = new FormData();
    param.append('lineCd', params.data.lineCd);
    param.append('lineNo', params.data.lineNo);

    const response = await api.post('/api/aux/aux1011_fileList', param, {});
    rowDataFile.value = response.data;
    // console.log('response : ', JSON.stringify(rowDataFile.value));
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const handleFileDownload = data => {
  // 파일 다운로드 요청
  api({
    url: `/api/aux/aux1011_fileDownload?fileNameFull=${data.fileNameFull}&lineCd=${params.data.lineCd}`,
    method: 'GET',
    responseType: 'blob', // 파일 다운로드를 위해 blob 응답 형식 설정
  })
    .then(response => {
      // 다운로드한 파일을 처리하는 코드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', data.fileName); // 다운로드할 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      data.isDownloaded = '1';
    })
    .catch(error => {
      console.error('Download failed:', error);
    });
};
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
