<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents title bar -->
    <div class="row">
      <div class="col-auto flex flex-center">
        <q-icon name="font_download" size="sm" class="text-orange" />
        <span class="text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
      </div>
      <q-space />
      <q-breadcrumbs v-if="!$q.screen.xs" active-color="grey" style="font-size: 14px" class="self-end">
        <q-breadcrumbs-el label="판매관리" icon="home" />
        <q-breadcrumbs-el label="출고관리" icon="widgets" />
        <q-breadcrumbs-el :label="menuLabel" />
      </q-breadcrumbs>
    </div>
    <!-- end of contents title bar -->
    <q-separator class="q-mb-sm" color="cyan" size="0.2rem" />

    <div style="display: flex; justify-content: center; align-items: center; height: 50vh">
      <q-card class="q-pb-xl" style="width: 100%; max-width: 50vh">
        <q-card-section class="q-gutter-y-lg bg-blue-4">
          <div class="text-h4 text-center">전체 자료 재정리 작업</div>
          <div class="text-subtitle2 text-right">자료정리 기간을 설정하세요</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="row q-py-xl justify-center">
          <q-input
            outlined
            class="text-h6"
            color="grey-3"
            label-color="orange"
            mask="####-##-##"
            v-model="searchValue.dayFrom"
            label="시작일"
            style="width: 180px"
            @update:model-value="checkPeriodDay"
          >
            <template v-slot:append>
              <q-icon name="event" color="orange" class="cursor-pointer">
                <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchValue.dayFrom" minimal mask="YYYY-MM-DD" @update:model-value="closePopup('from')">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="닫기" color="primary" flat v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="flex flex-center text-h5 q-px-sm">~</div>
          <q-input
            outlined
            class="text-h6"
            color="grey-3"
            label-color="orange"
            mask="####-##-##"
            v-model="searchValue.dayTo"
            label="종료일"
            style="width: 180px"
            @update:model-value="checkPeriodDay"
          >
            <template v-slot:append>
              <q-icon name="event" color="orange" class="cursor-pointer">
                <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchValue.dayTo" minimal mask="YYYY-MM-DD" @update:model-value="closePopup('to')">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="닫기" color="primary" flat v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-pt-lg justify-center">
            <q-btn
              :loading="progress[0].loading"
              :percentage="progress[0].percentage"
              size="lg"
              color="blue"
              @click="startComputing(0)"
              style="width: 300px"
              icon="sync"
            >
              <span class="q-ml-md">자료정리작업</span>
              <template v-slot:loading>
                <q-spinner-orbit class="on-left" />
                자료 재정리 작업중...
              </template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { QBtn, QIcon, useQuasar } from 'quasar';
import commUtil from 'src/js_comm/comm-util';
import { api } from 'boot/axios';
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();

const menuLabel = ref('');
onMounted(() => {
  menuLabel.value = window.history.state.label;
});

const searchValue = reactive({
  dayFrom: commUtil.unFormatDate(commUtil.getToday()),
  dayTo: commUtil.unFormatDate(commUtil.getToday()),
});

const checkPeriodDay = () => {
  const startYear = searchValue.dayFrom.slice(0, 4);
  const endYear = searchValue.dayTo.slice(0, 4);
  if (startYear !== endYear) {
    searchValue.dayTo = `${startYear}-${searchValue.dayTo.slice(5)}`; // sYear의 년도로 통일
    $q.notify({
      position: 'top',
      message: '년도가 같지않게 선택해서 시작년도와 통일 시켰습니다.',
      color: 'purple',
      timeout: 5000,
    });
  }
  if (searchValue.dayTo < searchValue.dayFrom) {
    if (fg === 'from') {
      searchValue.dayTo = searchValue.dayFrom;
    } else {
      searchValue.dayFrom = searchValue.dayTo;
    }
  }
};

const datePopup = ref(null);
const closePopup = fg => {
  checkPeriodDay();
  if (datePopup.value) {
    datePopup.value.hide();
  }
};

const progress = ref([
  { loading: false, percentage: 0 },
  { loading: false, percentage: 0 },
  { loading: false, percentage: 0 },
]);

const intervals = [null, null, null];

// DB 프로시저 호출 함수
const getProcedure = async () => {
  try {
    const res = await api.post('/api/aux/aux1010_procedure', {
      paramDayFrom: commUtil.unFormatDate(searchValue.dayFrom),
      paramDayTo: commUtil.unFormatDate(searchValue.dayTo),
    });

    let saveStatus = {};
    saveStatus.rtn = res.data.rtn;
    saveStatus.rtnMsg = res.data.rtnMsg;
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

function startComputing(id) {
  progress.value[id].loading = true;
  progress.value[id].percentage = 0;

  // 1. DB 프로시저 호출
  getProcedure(id)
    .then(() => {
      // 2. 프로시저 호출 성공 시 진행 상황 표시
      intervals[id] = setInterval(() => {
        progress.value[id].percentage += Math.floor(Math.random() * 8 + 10);
        if (progress.value[id].percentage >= 100) {
          clearInterval(intervals[id]);
          progress.value[id].loading = false;
        }
      }, 200);
    })
    .catch(() => {
      // 에러 발생 시 로딩 중지
      progress.value[id].loading = false;
    });
}
</script>

<style scoped></style>
