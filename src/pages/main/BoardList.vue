<template>
  <q-card bordered class="">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      게시글 <span class="text-subtitle2 q-px-sm">( {{ message.deptNm }})</span>
      <q-space />
      <RouterLink :to="{ name: 'noticeBoard', query: { paramDeptCd: message.deptCd, paramDeptNm: message.deptNm } }">
        <q-avatar size="sm" color="primary" text-color="white"><q-icon name="edit_note" size="1rem" /></q-avatar>
        <q-tooltip class="bg-amber text-black shadow-4" anchor="center left" self="center right">
          <q-icon name="edit_note" size="0.8rem" />
          <strong> 게시글 관리 (등록/수정/삭제) </strong>
        </q-tooltip>
      </RouterLink>
    </q-bar>
    <q-separator />
    <q-card-section class="q-py-sm q-px-none">
      <q-scroll-area style="height: 290px; max-width: 100%">
        <q-list>
          <div v-for="data in boardData" :key="data.boardNo">
            <q-item clickable v-ripple @click="onDelayedClick">
              <q-item-section>
                <q-item-label :data-id="data.boardNo" class="data-id text-bold" lines="1">{{ data.title }}</q-item-label>
                <q-item-label caption lines="2" v-html="data.contents" />
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ dayFormat(data.makeDate) }}</q-item-label>

                <q-item-label caption><q-icon name="star" color="orange" /> {{ data.userNm }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset />
          </div>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>

  <!--  게시글 조회 부분 -->
  <q-dialog :maximized="$q.screen.lt.md" full-width full-height v-model="isDialogView">
    <q-card>
      <q-bar class="q-py-xs text-subtitle1 text-bold">
        <q-btn rounded dense color="dark" icon="close" size="sm" class="q-pa-xs q-px-md" v-close-popup>닫기</q-btn>
        <q-space />
        게시판 관리
        <q-space />
      </q-bar>
      <q-card-section>
        <div class="row q-px-sm items-center">
          <div class="col-12 col-sm-8 col-md-9 col-lg-10">
            <q-item>
              <q-item-label class="self-center q-mr-md">제목</q-item-label>
              <q-item-section>
                <q-input :readonly="readonly" dense v-model="formData.title"> </q-input>
              </q-item-section>
            </q-item>
          </div>
          <q-space />
          <div class="col-12 col-sm-4 col-md-3 col-lg-2 q-gutter-x-sm text-right">
            <q-btn v-if="readonly" outline color="primary" @click="readonly = false">
              <q-icon name="edit" size="xs" /><span class="q-ml-sm">수정하기</span>
            </q-btn>
            <q-btn v-if="!readonly" outline color="primary" @click="saveDataSection">
              <q-icon name="save" size="xs" /><span class="q-ml-sm">등록하기</span>
            </q-btn>
            <q-btn outline color="positive" v-close-popup><q-icon name="close" size="xs" /><span class="q-ml-sm">닫기</span></q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-card flat class="q-mx-xl" v-if="readonly">
          <span class="q-px-lg" v-html="formData.contents"></span>
        </q-card>
        <q-editor v-if="!readonly" v-model="formData.contents" min-height="20rem" max-height="50em" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <!--  게시글 조회부분 끝-->
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { QBtn, QIcon, useQuasar } from 'quasar';
import moment from 'moment';
import router from 'src/router';
import { api } from '/src/boot/axios';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const props = defineProps(['message']);

const $q = useQuasar();

const isDialogView = ref(false);
const readonly = ref(true);
const boardView = e => {
  isDialogView.value = true;
  const clickedElement = e.currentTarget; // or e.target
  const dataIdValue = clickedElement.getAttribute('data-id');
  // console.log('board view: ', dataIdValue);
};

const dayFormat = resDay => {
  const parsedDate = moment(resDay, 'YYYY-MM-DD HH:mm:ss');

  // Calculate the difference between the current date and the registration date
  const timeDifference = moment().diff(parsedDate, 'minutes');
  // console.log('time: ', parsedDate, timeDifference);
  // Format the date based on the time difference
  let formattedDate;
  if (timeDifference < 1) {
    formattedDate = '방금';
  } else if (timeDifference < 60) {
    formattedDate = `${timeDifference} 분 전`;
  } else if (timeDifference < 24 * 60) {
    formattedDate = `${Math.floor(timeDifference / 60)}시간 전`;
  } else if (timeDifference < 48 * 60) {
    formattedDate = '어제';
  } else if (timeDifference < 62 * 60) {
    formattedDate = '그제';
  } else {
    // formattedDate = parsedDate.format('MMM DD, YYYY');
    formattedDate = parsedDate.format('YYYY-MM-DD');
  }

  // console.log('reg_day: ', formattedDate);
  return formattedDate;
};

const dataId = ref(null);
const onDelayedClick = e => {
  dataId.value = e.currentTarget.querySelector('.data-id').dataset.id;
  getNoticeBoardSelectData();
  setTimeout(() => {
    readonly.value = true;
    isDialogView.value = true;
  }, 500);
};
const useNoticeBoard = () => {
  router.push({ name: 'noticeboard' });
};

onBeforeMount(() => {
  const resDayValue = '2024-02-6 15:30:30';
  const formattedResult = dayFormat(resDayValue);
  // console.log('Formatted Result: ', formattedResult);
  getNoticeBoardData();
});

let isSaveFg = 'U';
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

const boardData = ref(null);
const searchFg = ref('');
const searchValue = ref('');
const paramDept = ref({
  deptCd: props.message.deptCd,
  deptNm: props.message.deptCd,
});
const oldFormData = ref(null);
const formData = ref({
  deptCd: '',
  boardNo: '',
  title: '',
  contents: '',
});

// ***** 게시판  목록 자료 가져오기 부분  *****************************//
const getNoticeBoardData = async () => {
  try {
    const response = await api.post('/api/sys/noticeBoard_list', {
      paramSearchFg: searchFg.value,
      paramSearchValue: searchValue.value,
      paramDeptCd: paramDept.value.deptCd,
    });
    boardData.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 게시판 선택 목록 자료 가져오기 부분  *****************************//
const getNoticeBoardSelectData = async () => {
  try {
    const response = await api.post('/api/sys/noticeBoard_select', { paramDeptCd: paramDept.value.deptCd, paramBoardNo: dataId.value });
    formData.value.boardNo = response.data.data[0].boardNo;
    formData.value.deptCd = response.data.data[0].deptCd;
    formData.value.title = response.data.data[0].title;
    formData.value.contents = response.data.data[0].contents;
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  // console.log('saveData: ', JSON.stringify(resFormData));
  api
    .post('/api/sys/noticeBoard_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

<style scoped lang="sass"></style>
