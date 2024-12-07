<template>
  <q-page :class="$q.screen.xs ? 'q-pa-xs' : 'q-pa-lg'">
    <!-- contents zone -->

    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="text-subtitle2 q-px-sm"
          >알림글 ( <span class="text-bold text-blue-14">{{ $route.query.paramDeptNm }}</span> )</span
        >
      </q-bar>
      <q-card-section class="q-px-lg">
        <div class="row items-center">
          <q-btn outline color="positive" @click="getNoticeBoardData"
            ><q-icon name="refresh" size="xs" /><span class="gt-sm q-ml-sm">다시 불러오기</span></q-btn
          >
          <q-space />
          <q-select
            style="min-width: 80px"
            filled
            dense
            square
            outlined
            :color="$q.dark.isActive ? 'lime-11' : 'dark'"
            :bg-color="$q.dark.isActive ? 'green' : 'grey-5'"
            options-dense
            v-model="searchFg"
            :options="searchFgOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
          />
          <q-input
            square
            outlined
            bottom-slots
            v-model="searchValue"
            dense
            class="q-pa-none"
            :style="{ width: searchValueWidth }"
            @keyup.enter="getNoticeBoardData"
          >
            <template v-slot:append>
              <q-icon size="xs" v-if="searchValue !== ''" name="close" @click="searchValue = ''" class="cursor-pointer" />
              <q-icon name="search" size="xs" class="cursor-pointer" @click="getNoticeBoardData" />
            </template>
          </q-input>
          <q-space />
          <q-btn outline color="positive" @click="addDataSection"><q-icon name="edit" size="xs" /><span class="gt-sm q-ml-sm">글쓰기</span></q-btn>
        </div>
      </q-card-section>
      <q-separator class="q-py-xs" />
      <!--  end of contents list title bar -->
      <q-card-section :class="$q.screen.xs ? 'q-px-none' : 'q-pa-lg'" class="q-py-sm">
        <q-scroll-area style="height: 360px; max-width: 100%">
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

              <q-separator spaced inset />
            </div>
          </q-list>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
  <!--  게시글 등록 조회 부분 -->
  <q-dialog full-width full-height v-model="isDialogView">
    <q-card>
      <q-bar class="q-py-xs text-subtitle1 text-bold">
        게시판 관리
        <q-space />
        <q-btn rounded dense color="dark" icon="close" size="xs" class="q-pa-xs" v-close-popup />
      </q-bar>
      <q-card-section>
        <div class="row q-px-sm items-center">
          <div class="col-12 col-sm-8 col-md-9 col-lg-10">
            <q-item>
              <q-item-label class="self-center q-mr-md">제목</q-item-label>
              <q-item-section>
                <q-input :readonly="readonly" autofocus dense v-model="formData.title"> </q-input>
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
<script>
// export default {
//   name: 'noticeBoard',
// };
</script>
<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { Notify, QBtn, QIcon, useQuasar } from 'quasar';
import moment from 'moment';
import { api } from '/src/boot/axios';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import 'pages/main/NoticeBoard.vue';
import { useRoute } from 'vue-router';
import notifySave from 'src/js_comm/notify-save';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const $q = useQuasar();
const $route = useRoute();

const readonly = ref(true);

const paramDept = ref({
  deptCd: '',
  deptNm: '',
});
onMounted(() => {
  paramDept.value.deptCd = $route.query.paramDeptCd;
  paramDept.value.deptNm = $route.query.paramDeptNm;

  getNoticeBoardData();
});

// const props = defineProps(['noticeBoard']);
// console.log('param: ', JSON.stringify(props.query));

const searchValue = ref('');
const isDialogEdit = ref(false);
const oldFormData = ref(null);
const formData = ref({
  title: '',
  contents: '',
});

const searchValueWidth = computed(() => ($q.screen.lt.sm ? '150px' : '400px'));
// const props = defineProps(['message']);

const isDialogView = ref(false);
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
    formattedDate = parsedDate.format('MMM DD, YYYY');
  }

  // console.log('reg_day: ', formattedDate);
  return formattedDate;
};
const dataId = ref(null);
const onDelayedClick = e => {
  dataId.value = e.currentTarget.querySelector('.data-id').dataset.id;
  // console.log('dataId: ', dataId.value);
  getNoticeBoardSelectData();
  setTimeout(() => {
    readonly.value = true;
    isDialogView.value = true;
  }, 500);
};
onBeforeMount(() => {
  const resDayValue = '2024-02-06 15:30:30';
  const formattedResult = dayFormat(resDayValue);
  // console.log('Formatted Result: ', formattedResult);
});

// Dialog Section =========================================================== //
let isSaveFg = null;
const addDataSection = () => {
  oldFormData.value = {};
  formData.value = {
    deptCd: paramDept.value.deptCd,
    boardNo: 0,
    userId: storeUser.setEmpCd,
    userNm: storeUser.setEmpNm,
    title: '',
    contents: '',
    viewCnt: 0,
    makeDate: new Date().toLocaleDateString(),
  };
  isDialogView.value = true;
  isSaveFg = 'I';
  readonly.value = false;
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
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};

const searchFg = ref('TITLE');
const searchFgOptions = [
  {
    label: '제목',
    value: 'TITLE',
  },
  {
    label: '내용',
    value: 'CONTENTS',
  },
];
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 게시판  목록 자료 가져오기 부분  *****************************//
const boardData = ref(null);

const getNoticeBoardData = async () => {
  // console.log('aa: ', searchFg.value);
  try {
    const response = await api.post('/api/sys/noticeBoard_list', {
      paramSearchFg: searchFg.value,
      paramSearchValue: searchValue.value,
      paramDeptCd: paramDept.value.deptCd,
    });
    if (response.data.data.length === 0) {
      Notify.create({
        type: 'negative',
        position: 'top',
        message: '자료가 없습니다.',
        group: false,
        actions: [
          {
            icon: 'close',
            color: 'white',
            round: true,
            handler: () => {
              /* ... */
            },
          },
        ],
        timeout: 2000,
      });
    }
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
