<template>
  <q-card bordered class="">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      나의일정 <span class="text-subtitle2 q-px-sm"></span>
      <q-space />
      <q-btn rounded dense color="primary" icon="edit_note" size="0.6rem" class="q-pa-xs" @click="isEventInsert(date)">
        <q-tooltip class="bg-amber text-black shadow-4" anchor="center left" self="center right">
          <q-icon name="edit_note" size="0.8rem" />
          <strong> 이벤트 등록/수정/삭제 </strong>
        </q-tooltip>
      </q-btn>
    </q-bar>
    <q-splitter>
      <template v-slot:before>
        <div class="q-pa-sm">
          <q-date minimal color="orange" v-model="date" :events="eventDays" :event-color="date => (date[9] % 2 === 0 ? 'teal' : 'blue')" />
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="date" animated style="max-height: 370px" v-scroll>
          <q-tab-panel v-for="event in eventData" :key="event.regDay" :name="event.regDay">
            <div class="text-subtitle2 text-bold">{{ formatRegDay(event.regDay) }}</div>
            <q-separator class="q-my-sm" />
            <div class="contents" v-html="event.contents"></div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-card>

  <!--  게시글 등록 조회 부분 -->
  <q-dialog v-model="isDialogView">
    <q-card style="width: 700px; max-width: 80vw">
      <q-bar class="q-py-xs text-subtitle1 text-bold">
        이벤트 등록
        <q-space />
        <q-btn rounded dense color="dark" icon="close" size="xs" class="q-pa-xs" v-close-popup />
      </q-bar>
      <q-card-section>
        <q-field color="purple-12" label="이벤트일" stack-label label-color="purple-12">
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
          <template v-slot:control>
            <div class="self-center text-bold text-subtitle1 full-width no-outline" tabindex="0">{{ formatRegDay(formData.regDay) }}</div>
          </template>
        </q-field>
      </q-card-section>

      <q-card-section>
        <q-editor v-model="formData.contents" min-height="10rem" max-height="10rem" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn outline dense icon="save" label=" 저장 " color="primary" v-close-popup @click="saveDataSection" />
        <q-btn v-if="isSaveFg === 'U'" outline dense icon="delete" label=" 삭제 " color="negative" v-close-popup @click="deleteDataSection" />
        <q-btn outline dense icon="close" label=" 닫기 " color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!--  게시글 조회부분 끝-->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { QIcon, useQuasar } from 'quasar';
import { api } from '/src/boot/axios';
import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import commUtil from 'src/js_comm/comm-util';
import notifySave from 'src/js_comm/notify-save';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const $q = useQuasar();
const isDialogView = ref(false);

// 오늘날자 setting
const today = new Date();
const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
const date = ref(formattedDate);
let isSaveFg = '';
// 오늘날자 setting 끝

const eventDays = ref([]);

const formatRegDay = resDay => {
  const dayWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const day = resDay.replace(/\//g, '-');
  const _day = new Date(day);
  const _week = _day.getDay();
  const week = dayWeek[_week];

  return day + ' (' + week + ')';
};
const isEventInsert = tabName => {
  formData.value.userId = storeUser.setEmpCd;
  formData.value.regDay = date.value;
  formData.value.oldRegDay = date.value;
  formData.value.contents = '';
  formData.value.type = '1';

  const tabIndex = eventDays.value.indexOf(tabName);

  if (tabIndex >= 0) {
    isSaveFg = 'U';
    const tabPanels = document.querySelectorAll('.q-tab-panel');
    const selectedTabPanel = tabPanels[0];
    const contents = selectedTabPanel.querySelector('.contents');
    formData.value.contents = contents.innerHTML;
  } else {
    isSaveFg = 'I';
    formData.value.contents = '';
  }
  isDialogView.value = true;
};

const saveDataSection = () => {
  if (isEmpty(formData.value.contents)) {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '등록된 내용이 없습니다. ',
      // persistent: true,
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
    // console.log('form: ', JSON.stringify(formData.value));
    formData.value.regDay = formData.value.regDay.replace(/\//g, '');
    formData.value.oldRegDay = formData.value.oldRegDay.replace(/\//g, '');
    saveEventDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};
onMounted(() => {
  getEventData();
});

const deleteDataSection = () => {
  $q.dialog({
    dark: true,
    title: '자료삭제',
    message: '해당 이벤트 자료를 삭제하시겠습니까? ',
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
      // console.log('>>>> OK')
      isSaveFg = 'D';
      // console.log('oldRegDay1: ', formData.value.oldRegDay);
      formData.value.oldRegDay = formData.value.oldRegDay.replace(/\//g, '');
      // console.log('oldRegDay2: ', formData.value.oldRegDay);
      saveEventDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const formData = ref({
  userId: '',
  regDay: '',
  oldRegDay: '',
  contents: '',
  type: '',
});

const eventData = ref(null);
// ***** 이벤트  목록 자료 가져오기 부분  *****************************//
const getEventData = async () => {
  const today_month = commUtil.getTodayMonth();
  try {
    const response = await api.post('/api/sys/event_list', { paramUserId: storeUser.setEmpCd, paramMonth: today_month });
    eventData.value = response.data.data;
    eventDays.value = [];
    for (let i = 0; i < eventData.value.length; i++) {
      eventData.value[i].regDay = eventData.value[i].regDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
      eventDays.value.push(eventData.value[i].regDay);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveEventDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/event_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      getEventData();
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
