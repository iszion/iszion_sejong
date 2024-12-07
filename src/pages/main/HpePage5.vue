<template>
  <q-card bordered class="q-pa-xs" style="height: 100%">
    <q-bar class="q-py-xs text-subtitle1 text-bold">
      성과평가 사유내역 리스트
      <q-space />
      <q-avatar size="sm" color="primary" text-color="white"><q-icon name="refresh" size="1rem" class="cursor-pointer" @click="getData" /></q-avatar>
    </q-bar>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm-x-xs">
        <div class="col-xs-12">
          <q-scroll-area style="height: 320px; max-width: 100%">
            <q-list bordered separator>
              <q-item v-for="(data, index) in rowData" :key="index">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="md" class="cursor-pointer" @click="callWorkDocView(data)">
                    {{ data.workSeq }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold" lines="1">
                    <span class="text-grey"> 자기평가</span>: {{ data.selfCh }} <span class="text-blue q-ml-md">평가</span>:
                    {{ data.markCh }}</q-item-label
                  >
                  <q-item-label caption lines="2" v-html="data.sExplains" />
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{ dayFormat(data.updateDate) }}</q-item-label>

                  <q-item-label caption><q-icon name="star" color="orange" /> {{ data.evtEmpNm }} / {{ data.evsEmpNm }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!--  성과평과 상세자료 조회 부분 -->

  <q-dialog v-model="isDialogView">
    <q-card style="width: 500px; max-width: 100vw">
      <q-card-section class="row">
        <div class="text-h6">
          목표 및 성과
          <q-badge align="middle">No : {{ formData.seq }}</q-badge>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />
      <q-card class="q-ma-sm" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'">
        <div class="row justify-between q-pa-sm">
          <div class="auto">
            성명 : <span class="text-subtitle1 text-bold"> {{ formData.evtEmpNm }}</span>
          </div>
          <div class="auto">
            소속 : <span class="text-subtitle1 text-bold">{{ formData.depgNm }}/{{ formData.deptNm }}</span>
          </div>
          <div class="auto">
            직급 : <span class="text-subtitle1 text-bold">{{ formData.titlNm }}</span>
          </div>
          <div class="auto">
            평가자 : <span class="text-subtitle1 text-bold">{{ formData.evsEmpNm }}</span>
          </div>
        </div>
      </q-card>
      <q-separator />

      <q-card class="q-pa-sm q-mb-md">
        <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" class="q-pa-sm q-mb-xs">
          <template v-slot:avatar>
            <q-icon name="drag_indicator" style="width: 20px" size="sm" />
          </template>
          <span class="text-bold text-subtitle1">{{ formData.eidcNm }}</span>
          <template v-slot:action>
            <span class="text-bold text-subtitle1 text-teal"> 평가지표 </span>
          </template>
        </q-banner>

        <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" class="q-pa-sm q-mb-xs">
          <template v-slot:avatar>
            <q-icon name="ads_click" style="width: 20px" size="sm" />
          </template>
          <span v-html="formData.targetDoc" />
          <template v-slot:action>
            <span class="text-bold text-subtitle1 text-teal"> 설정목표 </span>
          </template>
        </q-banner>

        <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" class="q-pa-sm q-mb-xs">
          <template v-slot:avatar>
            <q-icon name="checklist" style="width: 20px" size="sm" />
          </template>
          <span v-if="formData.evaS"><span class="text-blue"> S(100점) : </span>{{ formData.evaS }}<br /></span>
          <span v-if="formData.evaA"><span class="text-blue"> A(90점) : </span>{{ formData.evaA }}<br /></span>
          <span v-if="formData.evaB"><span class="text-blue"> B(80점) : </span>{{ formData.evaB }}<br /></span>
          <span v-if="formData.evaC"><span class="text-blue"> C(70점) : </span>{{ formData.evaC }}<br /></span>
          <span v-if="formData.evaD"><span class="text-blue"> D(60점) : </span>{{ formData.evaD }}<br /></span>
          <template v-slot:action>
            <span class="text-bold text-subtitle1 text-teal"> 평가기준 </span>
          </template>
        </q-banner>

        <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" class="q-pa-sm">
          <template v-slot:avatar>
            <q-icon name="ads_click" style="width: 20px" size="sm" />
          </template>
          <span v-html="formData.workDoc" />
          <template v-slot:action>
            <span class="text-bold text-subtitle1 text-teal"> 성과업적/실적 </span>
          </template>
        </q-banner>

        <q-card class="q-px-sm q-pt-md">
          <div class="row q-col-gutter-x-xl">
            <div class="col">
              <q-field label="가중치" stack-label bottom-slots label-color="orange">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.weight }}</div>
                </template>
              </q-field>
            </div>
            <div class="col">
              <q-field label="자기평가점수" stack-label bottom-slots label-color="red">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.selfPoint }} ({{ formData.selfCh }})</div>
                </template>
              </q-field>
            </div>
            <div class="col">
              <q-field label="평가점수" stack-label bottom-slots label-color="red">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.markPoint }} ({{ formData.markCh }})</div>
                </template>
              </q-field>
            </div>
          </div>
        </q-card>

        <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" class="q-pa-sm">
          <template v-slot:avatar>
            <q-icon name="description" style="width: 20px" size="sm" />
          </template>
          <span v-html="formData.sExplains" />
          <template v-slot:action>
            <span class="text-bold text-subtitle1 text-teal"> 평가변동 사유 </span>
          </template>
        </q-banner>
      </q-card>
    </q-card>
  </q-dialog>

  <!--  성과평과 상세자료 조회 끝-->
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { QBtn, QIcon } from 'quasar';
import moment from 'moment/moment';
const storeYear = useYearInfoStore();

const rowData = ref();
const rowDataSel = ref();

onBeforeMount(() => {
  getData();
});

const formData = ref({
  stdYear: '',
  empCd: '',
  evsEmpNm: '',
  evtEmpNm: '',
  depgNm: '',
  deptNm: '',
  titlNm: '',
  workNo: 0,
  seq: 0,
  eidcNm: '',
  targetDoc: '',
  evaS: '',
  evaA: '',
  evaB: '',
  evaC: '',
  evaD: '',
  weight: 0,
  workDoc: '',
  workPer: 0,
  selfCh: '',
  selfPoint: 0,
  markCh: '',
  markPoint: 0,
  sExplains: '',
});

const isDialogView = ref(false);
const callWorkDocView = data => {
  getDataSel(data).then(() => {
    isDialogView.value = true;
  });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/aux/dashboard_page5_list', {
      paramSetYear: storeYear.setYear,
    });

    rowData.value = response.data.data;
    // console.log('data ; ', JSON.stringify(rowData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSel = async data => {
  try {
    const response = await api.post('/api/aux/dashboard_page5_select', {
      paramSetYear: data.stdYear,
      paramEmpCd: data.empCd,
      paramWorkNo: data.workNo,
    });

    formData.value.stdYear = response.data.data[0].stdYear;
    formData.value.empCd = response.data.data[0].empCd;
    formData.value.evsEmpNm = response.data.data[0].evsEmpNm;
    formData.value.evtEmpNm = response.data.data[0].evtEmpNm;
    formData.value.depgNm = response.data.data[0].depgNm;
    formData.value.deptNm = response.data.data[0].deptNm;
    formData.value.titlNm = response.data.data[0].titlNm;
    formData.value.workNo = response.data.data[0].workNo;
    formData.value.seq = response.data.data[0].seq;
    formData.value.eidcNm = response.data.data[0].eidcNm;
    formData.value.targetDoc = response.data.data[0].targetDoc;
    formData.value.targetDoc = formData.value.targetDoc.replace(/\n/g, '<br>');
    formData.value.evaS = response.data.data[0].evaS;
    formData.value.evaA = response.data.data[0].evaA;
    formData.value.evaB = response.data.data[0].evaB;
    formData.value.evaC = response.data.data[0].evaC;
    formData.value.evaD = response.data.data[0].evaD;
    formData.value.weight = response.data.data[0].weight;
    formData.value.workDoc = response.data.data[0].workDoc;
    formData.value.workDoc = formData.value.workDoc.replace(/\n/g, '<br>');
    formData.value.workPer = response.data.data[0].workPer;
    formData.value.selfCh = response.data.data[0].selfCh;
    formData.value.selfPoint = response.data.data[0].selfPoint;
    formData.value.markCh = response.data.data[0].markCh;
    formData.value.markPoint = response.data.data[0].markPoint;
    formData.value.sExplains = response.data.data[0].sExplains;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
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
</script>

<style scoped>
.full-width-chart {
  width: 100%;
}
</style>
