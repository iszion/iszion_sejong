<template>
  <q-card style="width: 80vw; max-width: 800px">
    <q-card-section>
      <div class="row">
        <q-btn round flat color="primary" v-close-popup icon="close" />
        <q-space />
        <div class="text-h6">업무 보고서</div>
        <q-space />
        <q-btn label="전송하기" color="primary" icon="send" @click.stop="onDocSend" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 90vh" class="scroll">
      <div ref="htmlContent">
        <div v-for="(data, index) in message" :key="index">
          <q-card-section class="row">
            <div class="text-h6">{{ index + 1 }}. {{ data.subject }}</div>
            <div class="q-ml-lg text-bold text-subtitle2 flex flex-center" v-if="data.projectNm">( {{ data.projectNm }} )</div>
          </q-card-section>

          <q-card-section class="q-pt-none q-ml-lg">
            <div v-html="data.contents" />
          </q-card-section>

          <q-separator inset />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-btn dense flat color="primary" class="q-px-sm" @click="openFileDialog"><q-icon name="attach_file" /> 첨부파일</q-btn>
      <!--      <q-btn dense flat color="primary" class="q-px-sm" @click="uploadProcess"><q-icon name="upload" /> 업로드</q-btn>-->
      <q-uploader
        :bordered="false"
        ref="uploaderRef"
        multiple
        class="full-width"
        :color="$q.dark.isActive ? 'grey-9' : 'grey-4'"
        :text-color="$q.dark.isActive ? 'white' : 'black'"
        no-thumbnails
        :max-file-size="maxFileSize"
      >
        <template v-slot:header>
          <q-space />
          <!-- 헤더에서 다른 부분은 비우거나 숨기기 -->
        </template>
        <template v-slot:list="scope">
          <q-list class="row">
            <q-item v-for="(file, index) in scope.files" :key="file.__key">
              <q-item-section>
                <q-item-label class="">
                  <span class="text-subtitle2"> {{ index + 1 }}: {{ file.name }}</span>
                  <q-badge align="middle" class="q-ml-xs" outline color="teal">
                    {{ commUtil.formatFileSize(file.size) }}
                  </q-badge>
                  <q-btn size="12px" flat dense round icon="delete" color="grey" @click="scope.removeFile(file)" />
                </q-item-label>

                <!--                      <q-item-label caption> Status: {{ file.__status }} </q-item-label>-->

                <!--                      <q-item-label caption> {{ file.__sizeLabel }} </q-item-label>-->
              </q-item-section>

              <!--                        <q-item-section v-if="file.__img" thumbnail class="gt-xs">-->
              <!--                          <img :src="file.__img.src" />-->
              <!--                        </q-item-section>-->

              <!--              <q-item-section side> </q-item-section>-->
            </q-item>
          </q-list>
        </template>
      </q-uploader>
    </q-card-section>
  </q-card>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import HelpProject from 'components/subvue/HelpProject.vue';
import STEP_EDIT from 'pages/erp/mst/STEP_EDIT.vue';

const htmlContent = ref(null);

const props = defineProps({
  message: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['sendData']);
const onDocSend = () => {
  if (!htmlContent.value) return;

  const contents = htmlContent.value.innerHTML; // HTML 추출
  // console.log('contents : ', contents);

  let iu = [];
  let iuD = [];
  let jsonFormData = {
    lineCd: '7011101',
    subject: '영업 업무일지 보고서',
    contents: contents,
    stdDay: props.message[0].stdDay,
    empCd: props.message[0].empCd,
    attachFileCnt: uploaderRef.value.files.length,
  };

  // 전자결재정보 저장
  let tmpJson = '{"mode":"I","data":' + JSON.stringify(jsonFormData) + '}';
  iu.push(tmpJson);

  // console.log('props1 : ', JSON.stringify(jsonFormData));
  // console.log('props2 : ', JSON.stringify(props.message));
  // 업무일지 전자결재 번호 업데이트 용
  for (let i = 0; i < props.message.length; i++) {
    tmpJson = '{"mode":"U","data":' + JSON.stringify(props.message[i]) + '}';
    iu.push(tmpJson);
  }
  let jsonData = jsonUtil.jsonFiller(iu, iuD);
  jsonData.lineCd = '7011101';
  console.log('data : ', JSON.stringify(jsonData));
  saveDataAndHandleResult(jsonData);

  // console.log('emit : ', 'ok');
  // emit('sendData', '0');
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
let saveStatus = {};
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mkt/mkt4011_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        uploaderRef.value.files.map(async file => {
          await uploadFile(file, res.data.lineNo);
        });
      }
      saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      console.log('save');

      console.log('emit start');
      emit('sendData', '0');
      console.log('emit end');
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// **************************************************************//
// *******  첨부파일 처리부분   **************************************//
// **************************************************************//
const maxFileSize = 5 * 1024 * 1024; // 5MB
const uploaderRef = ref(null);

const uploadFile = async (file, resLineNo) => {
  try {
    const param = new FormData();
    param.append('file', file);
    param.append('lineCd', '7011101');
    param.append('lineNo', resLineNo);

    const res = await api.post('/api/mkt/mkt4011_fileSave', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // onUploadProgress: progressCallback, // Pass the progress callback
    });
    // Handle the response as needed
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
const openFileDialog = () => {
  if (uploaderRef.value) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*'; // 모든 파일을 선택 가능
    input.onchange = async event => {
      const file = event.target.files[0]; // 선택한 파일

      if (file) {
        console.log('file : ', file);

        // 파일을 q-uploader에 추가
        // const fileObject = {
        //   name: file.name,
        //   size: file.size,
        //   __key: Date.now(), // 고유 키, 필요에 따라 수정
        //   __status: 'pending', // 초기 상태
        //   __sizeLabel: `${(file.size / 1024).toFixed(2)} KB`, // 파일 크기 표시
        //   __progressLabel: '0%', // 초기 진행률
        // };

        file.__key = Date.now(); // 고유 키, 필요에 따라 수정
        file.__sizeLabel = `${(file.size / 1024).toFixed(2)} KB`; // 파일 크기 표시
        file.__progressLabel = '0%'; // 초기 진행률

        uploaderRef.value.files.push(file); // q-uploader에 파일 추가
      }
    };
    input.click();
  }
};
const uploadProcess = () => {
  console.log('upload : ', uploaderRef.value.files);
};
// **************************************************************//
// *******  첨부파일 처리부분 끝  ************************************//
// **************************************************************//
</script>

<style lang="sass" scoped></style>
