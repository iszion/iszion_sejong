<template>
  <div class="">
    <q-card bordered class="">
      <q-bar class="text-subtitle1 text-bold">
        결제정보
        <q-space />
        <q-btn
          flat
          :text-color="$q.dark.isActive ? 'orange' : 'purple'"
          unelevated
          icon="refresh"
          :label="$q.screen.lt.sm ? '' : '다시불러오기'"
          @click="handelGetData()"
        />
        <q-space />
        <div class="q-gutter-none">
          <q-radio
            keep-color
            size="sm"
            class="text-subtitle2"
            v-model="searchStatus"
            val="0"
            :label="$q.screen.lt.sm ? '대기' : '결재대기'"
            color="orange"
            @click="handelGetData()"
          />
          <q-radio
            keep-color
            size="sm"
            class="text-subtitle2"
            v-model="searchStatus"
            val="1"
            :label="$q.screen.lt.sm ? '왼료' : '결재완료'"
            color="teal"
            @click="handelGetData()"
          />
          <q-radio keep-color size="sm" class="text-subtitle2" v-model="searchStatus" val="2" label="반려" color="red" @click="handelGetData()" />
        </div>
      </q-bar>
      <q-card-section class="q-pa-xs">
        <div :style="{ height: 300 + 'px' }">
          <q-card-section class="q-pa-xs" style="height: 260px">
            <q-scroll-area style="height: 100%; max-width: 100%">
              <q-list>
                <div v-for="data in rowData" :key="data.rowNum">
                  <q-item class="q-gutter-xs-x-none q-gutter-sm-x-md q-py-none">
                    <q-item-section side>
                      <span class="text-subtitle2"> {{ data.rowNum }}</span>
                    </q-item-section>

                    <q-item-section style="max-width: 50px">
                      <span class="text-subtitle2"> {{ data.lineNo }}</span>
                    </q-item-section>

                    <q-item-section style="max-width: 100px">
                      <span class="text-caption"> {{ data.lineNm }}</span>
                    </q-item-section>

                    <q-item-section class="cursor-pointer" @click="handleApproval(data)">
                      <q-item-label lines="1">
                        <span class="text-weight-medium">{{ data.subject }} ( {{ data.stdDay }} )</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section v-if="data.attachFileCnt > 0" side class="cursor-pointer" @click="handleApproval(data)">
                      <q-item-label lines="1">
                        <q-icon name="attach_file" size="sm" />
                        <q-badge outline color="orange" text-color="black" :label="data.attachFileCnt" />
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side class="cursor-pointer" @click="handleApproval(data)">
                      <q-item-label lines="1">
                        <span class="text-weight-medium">{{ data.statusNm }}</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="`https://www.iszion.com/images/thumb/${data.imageFileNm}?${new Date().getTime()}`" alt="" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side bottom style="min-width: 90px">
                      <q-item-label caption>{{ dayFormat(data.regDate) }}</q-item-label>
                      <q-item-label caption>{{ data.empNm }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator inset />
                </div>
              </q-list>
            </q-scroll-area>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-py-none flex flex-center">
            <q-select
              dense
              borderless
              v-model="pagination.pageRows"
              options-dense
              :options="pagination.pageOption"
              class="q-mr-md gt-xs"
              @update:model-value="handelGetData"
            />
            <q-pagination
              v-model="currentPages"
              :max="totalPages"
              :max-pages="currentGroup"
              direction-links
              boundary-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
              @update:model-value="handlePageChange"
            />
          </q-card-section>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import moment from 'moment';
import AuxV1011 from 'pages/erp/aux/AuxV1011.vue';

import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();
const $q = useQuasar();
const startFocus = ref(null);
const searchStatus = ref('0');

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 280;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = ref([]);

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  handelGetData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const searchParam = reactive({
  salesCd: '',
  word: null,
});

const handleApproval = resData => {
  // console.log('res : ', JSON.stringify(resData));
  $q.dialog({
    component: AuxV1011,
    componentProps: { data: resData },
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

const handelGetData = () => {
  getDataMaxPages().then(() => {
    if (totalPages.value > 0) {
      getData();
    } else {
      $q.dialog({
        dark: true,
        title: '안내',
        message: '결재할 서류가 없습니다. ',
      })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getDataMaxPages = async () => {
  totalPages.value = 0;
  currentPages.value = 0;
  pagination.startRowNum = 0;
  try {
    const response = await api.post('/api/aux/aux1010_maxPages', {
      paramStatus: searchStatus.value,
      paramEmpCdApp: storeUser.setEmpCd,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    let maxRows = response.data.data[0].maxPages;

    totalPages.value = Math.ceil(maxRows / pagination.pageRows);
    // console.log('totalPage : ', totalPages.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getData = async () => {
  try {
    const response = await api.post('/api/aux/aux1010_list', {
      paramStatus: searchStatus.value,
      paramEmpCdApp: storeUser.setEmpCd,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    rowData.value = response.data.data;
    // console.log('data : ', JSON.stringify(rowData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// ******* 그리드 페이지 처리
const totalPages = ref(0); // 총 페이지 수
const currentPages = ref(1); // 현재 처리하는 페이지
const currentGroup = ref(5); // 화면에 보여줄 최대 페이지 수

const pagination = reactive({
  pageRows: 5,
  startRowNum: 0,
  pageOption: [5, 10, 20, 30, 40, 50, 100],
});

const handlePageChange = newPage => {
  // console.log(`Current Page: ${newPage}`);
  pagination.startRowNum = (newPage - 1) * pagination.pageRows;
  currentPages.value = newPage;
  // myGrid.value.api.paginationGoToPage(newPage - 1);
  getData();
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
</script>

<style lang="sass" scoped></style>
