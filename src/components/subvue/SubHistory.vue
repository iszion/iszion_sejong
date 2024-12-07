<template>
  <!-- notice dialogRef here -->
  <q-dialog :maximized="$q.screen.lt.md" full-height ref="dialogRef">
    <q-card class="my-card q-dialog-plugin" :style="{ width: '100%', maxWidth: '80vh' }">
      <q-toolbar :class="$q.dark.isActive ? 'bg-teal-8' : 'bg-orange'">
        <q-btn @click.stop="onDialogCancel"> <q-icon name="close" size="xs" class="q-mr-xs" />닫기</q-btn>
        <q-space />
        <span class="text-h6 text-bold q-ml-sm"> {{ params.paramProjectNm }} </span>
        <q-space />
      </q-toolbar>
      <q-card-section class="grid-container q-pa-none">
        <q-timeline :layout="layout" color="secondary" class="q-ma-none">
          <q-scroll-area style="height: 100vh; width: 100%" class="q-pa-md">
            <q-timeline-entry
              class="q-ma-sm"
              v-for="(data, index) in rowData.rows"
              :key="index"
              :avatar="
                data.imageFileNm
                  ? `https://www.iszion.com/images/thumb/${data.imageFileNm}?${new Date().getTime()}`
                  : `https://www.iszion.com/images/thumb/iszion_logo.png`
              "
              color="teal"
              :side="index % 2 === 0 ? 'left' : 'right'"
            >
              <template v-slot:title>
                <div class="text-bold text-pink">{{ data.subject }}</div>
              </template>
              <template v-slot:subtitle>
                <div v-if="$q.screen.lt.md" class="row">
                  <div class="text-subtitle1 text-bold text-pink">{{ commUtil.formatWeekDate(data.stdDay) }} [ {{ data.salesNm }} ]</div>
                  <q-space />
                  <q-fab padding="xs" color="amber" text-color="black" icon="more_vert" direction="left">
                    <q-fab-action padding="xs" color="amber" text-color="black" @click="onReplyCall(data)" icon="reply" />
                    <q-fab-action padding="xs" color="amber" text-color="black" @click="onDayDocCall(data)" icon="article" />
                  </q-fab>
                </div>
                <div v-if="!$q.screen.lt.md && index % 2 !== 0" class="row">
                  <q-fab padding="xs" color="amber" text-color="black" icon="more_vert" direction="right">
                    <q-fab-action padding="xs" color="amber" text-color="black" @click="onReplyCall(data)" icon="reply" />
                    <q-fab-action padding="xs" color="amber" text-color="black" @click="onDayDocCall(data)" icon="article" />
                  </q-fab>

                  <q-space />
                  <div class="text-subtitle1 text-bold text-pink">{{ commUtil.formatWeekDate(data.stdDay) }} [ {{ data.salesNm }} ]</div>
                </div>
                <div v-if="!$q.screen.lt.md && index % 2 === 0" class="row">
                  <div class="text-subtitle1 text-bold text-pink">{{ commUtil.formatWeekDate(data.stdDay) }} [ {{ data.salesNm }} ]</div>
                  <q-space />
                  <q-fab padding="xs" color="amber" text-color="black" icon="more_vert" direction="left">
                    <q-fab-action padding="xs" color="amber" text-color="black" @click="onReplyCall(data)" icon="reply" />
                    <q-fab-action padding="xs" color="amber" text-color="black" @click="onDayDocCall(data)" icon="article" />
                  </q-fab>
                </div>
              </template>
              <!--              <template>-->
              <!--                <div class="text-subtitle1 text-bold">( {{ data.typeNm }} )</div>-->
              <!--              </template>-->
              <span v-html="data.contents" />
            </q-timeline-entry>
          </q-scroll-area>
        </q-timeline>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QBtn, QIcon, useDialogPluginComponent, useQuasar } from 'quasar';
import { computed, onMounted, reactive, ref } from 'vue';
import { api } from 'src/boot/axios';
import commUtil from 'src/js_comm/comm-util';
import SubDayDoc from 'components/subvue/SubDayDoc.vue';
import SubDayReply from 'components/subvue/SubDayReply.vue';

const $q = useQuasar();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const layout = computed(() => {
  return $q.screen.lt.sm ? 'dense' : $q.screen.lt.md ? 'comfortable' : 'loose';
});

const params = defineProps({
  paramProjectCd: {
    type: String,
    required: false,
    default: null,
  },
  paramProjectNm: {
    type: String,
    required: false,
    default: null,
  },
});

const rowData = reactive({ rows: [] });

onMounted(() => {
  getData();
});

const onReplyCall = data => {
  $q.dialog({
    component: SubDayReply,
    componentProps: {
      paramStdDay: commUtil.unFormatDate(data.stdDay),
      paramSalesCd: data.salesCd,
      paramSalesNm: data.salesNm,
      paramSeq: data.seq,
    },
  })
    .onOk(res => {
      // console.log('res ::: ', res.valueCd, res.valueNm);
    })
    .onCancel(() => {
      // console.log('Cancel');
    })
    .onDismiss(() => {
      // console.log('Called on OK or Cancel');
    });
};
const onDayDocCall = data => {
  $q.dialog({
    component: SubDayDoc,
    componentProps: {
      paramStdDay: commUtil.unFormatDate(data.stdDay),
      paramSalesCd: data.salesCd,
      paramSalesNm: data.salesNm,
      paramSeq: data.seq,
    },
  })
    .onOk(res => {
      // console.log('res ::: ', res.valueCd, res.valueNm);
    })
    .onCancel(() => {
      // console.log('Cancel');
    })
    .onDismiss(() => {
      // console.log('Called on OK or Cancel');
    });
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 고객정보 검색리스트 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/aux/docHistory_list', {
      paramProjectCd: params.paramProjectCd,
    });
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 판매정보(일전체 고객별) 목록 자료 가져오기 부분 끝  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>

<style lang="sass" scoped></style>
