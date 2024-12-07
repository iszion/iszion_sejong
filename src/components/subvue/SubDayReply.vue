<template>
  <!-- notice dialogRef here -->
  <q-dialog :maximized="$q.screen.lt.md" ref="dialogRef" style="width: 800px; max-width: 90vw">
    <q-card class="my-card q-dialog-plugin">
      <q-toolbar :class="$q.dark.isActive ? 'bg-lime-10' : 'bg-lime-6'">
        <q-btn @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" />닫기</q-btn>
        <q-space />
        <div class="text-subtitle1 text-bold">
          [ <span class="text-blue"> {{ commUtil.formatWeekDate(params.paramStdDay) }} {{ params.paramSalesNm }}</span> ]
          <span class="q-ml-md gt-xs">활동일지 점검 및 피드백</span>
        </div>
        <q-space />
      </q-toolbar>
      <q-card-section class="q-px-none">
        <q-scroll-area style="height: 290px; max-width: 100%">
          <q-list>
            <div v-for="data in rowData" :key="data.no">
              <q-item>
                <q-item-section side>
                  <div class="text-grey q-gutter-xs">
                    <q-btn
                      v-if="data.empCd === storeUser.setEmpCd"
                      class="cursor-pointer"
                      size="12px"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="deleteDataSection(data.no)"
                    />
                    <q-btn
                      v-if="data.empCd === storeUser.setEmpCd"
                      class="cursor-pointer"
                      size="12px"
                      flat
                      dense
                      round
                      icon="edit"
                      @click="onReplyView(data.no)"
                    />
                  </div>
                </q-item-section>
                <q-item-section bottom class="col-2">
                  <q-item-label class="data-id text-bold" lines="1">{{ data.empNm }}</q-item-label>
                </q-item-section>

                <q-item-section bottom>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">{{ data.reply }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{ dayFormat(data.regDate) }}</q-item-label>

                  <q-item-label caption>
                    <q-rating
                      name="quality"
                      :disable="formDisable"
                      v-model="data.rating"
                      max="5"
                      size="1.5em"
                      color="blue"
                      icon="star_border"
                      icon-selected="star"
                      no-dimming
                  /></q-item-label>
                </q-item-section>
              </q-item>
              <q-separator inset />
            </div>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-separator />
      <q-card-section class="">
        <div class="q-gutter-y-sm">
          <q-btn dense color="orange" @click.stop="addDataSection" class="q-px-md"><q-icon name="edit" size="xs" class="q-mr-sm" />신규</q-btn>
          <q-input
            ref="startFocus"
            :disable="formDisable"
            outlined
            type="textarea"
            autogrow
            color="teal"
            label-color="orange"
            v-model="formData.reply"
            label="전달내용"
            clearable
            :hint="`${byteCount.reply} /200(한글100자) 까지 입력하실 수 있습니다.`"
            @update:model-value="updateByteCount('reply', formData.reply, 200)"
          >
          </q-input>
          <div class="text-right">
            <q-rating
              name="quality"
              :disable="formDisable"
              v-model="formData.rating"
              max="5"
              size="2.5em"
              color="deep-orange"
              icon="star_border"
              icon-selected="star"
              no-dimming
            />
          </div>
          <q-separator />
          <div class="text-right">
            <q-btn :disable="!formData.reply" color="primary" @click="saveDataSection"><q-icon name="save" size="xs" class="q-mr-sm" />등록</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';
import commUtil from 'src/js_comm/comm-util';
import { isEqual } from 'lodash';
import notifySave from 'src/js_comm/notify-save';
import moment from 'moment/moment';
import { useUserInfoStore } from 'src/store/setUserInfo';
import jsonUtil from 'src/js_comm/json-util';
const storeUser = useUserInfoStore();

const $q = useQuasar();
const dense = ref(false);
const startFocus = ref(null);
const formDisable = ref(true);

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
    type: Number,
    required: false,
    default: null,
  },
});

const maxNo = ref(0);
const oldFormData = ref(null);
const formData = ref({
  stdDay: '',
  salesCd: '',
  salesNm: '',
  seq: 0,
  no: 0,
  empCd: '',
  empNm: '',
  reply: '',
  rating: 0,
  regDate: '',
});
const resetFormData = () => {
  formData.value.stdDay = params.paramStdDay;
  formData.value.salesCd = params.paramSalesCd;
  formData.value.seq = params.paramSeq;
  formData.value.no = maxNo.value + 1;
  formData.value.empCd = storeUser.setEmpCd;
  formData.value.empNm = '';
  formData.value.reply = '';
  formData.value.rating = 0;
  formData.value.regDate = null;
};

onBeforeMount(() => {
  getData();
  setTimeout(() => {
    startFocus.value && startFocus.value.focus();
  }, 100);
});
const contentZoneStyle = computed(() => ({
  height: `250px`,
}));

let isSaveFg = 'I';
const addDataSection = () => {
  resetFormData();

  oldFormData.value = null;
  formDisable.value = false;
  isSaveFg = 'I';
  setTimeout(() => {
    startFocus.value && startFocus.value.focus();
  }, 100);
};

const deleteDataSection = resNo => {
  $q.dialog({
    dark: true,
    title: '삭제',
    message: '자료를 삭제 하시겠습니까? ',
    // persistent: true,
    ok: {
      label: '삭제',
      push: true,
      color: 'negative',
    },
    cancel: {
      label: '취소',
      push: true,
      color: 'grey-7',
    },
  })
    .onOk(() => {
      isSaveFg = 'D';
      const deleteData = {
        stdDay: params.paramStdDay,
        salesCd: params.paramSalesCd,
        seq: params.paramSeq,
        no: resNo,
      };
      saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, deleteData));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const saveDataSection = () => {
  formData.value.stdDay = commUtil.unFormatDate(formData.value.stdDay);

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

const onReplyView = resNo => {
  getDataSelect(resNo).then(() => {
    startFocus.value && startFocus.value.focus();
  });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//
const rowData = ref([]);
const getData = async () => {
  try {
    const response = await api.post('/api/aux/subDayReply_list', {
      paramStdDay: params.paramStdDay,
      paramSalesCd: params.paramSalesCd,
      paramSeq: params.paramSeq,
    });
    rowData.value = response.data.data;
    if (rowData.value && rowData.value.length > 0) {
      maxNo.value = Math.max(...rowData.value.map(data => Number(data.no)));
    } else {
      maxNo.value = 0;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getDataSelect = async resNo => {
  try {
    const response = await api.post('/api/aux/subDayReply_select', {
      paramStdDay: params.paramStdDay,
      paramSalesCd: params.paramSalesCd,
      paramSeq: params.paramSeq,
      paramNo: resNo,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.stdDay = commUtil.formatDate(response.data.data[0].stdDay);
    if (formData.value) {
      isSaveFg = 'U';
      formDisable.value = false;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const saveDataAndHandleResult = resFormData => {
  // console.log('save :: ', JSON.stringify(resFormData));
  api
    .post('/api/aux/subDayReply_save', resFormData)
    .then(res => {
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

// ************* Byte Check

const byteCount = ref({ reply: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'reply':
        byteCount.value.reply = commUtil.textByteLength(val);
        if (byteCount.value.reply > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      default:
        break;
    }
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px
</style>
