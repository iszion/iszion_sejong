<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-select
                dense
                stack-label
                options-dense
                class="q-pb-sm q-mr-lg"
                label-color="orange"
                v-model="searchParam.salesCd"
                :options="salesOptionsSearch"
                option-value="salesCd"
                option-label="salesNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 70px; max-width: 70px"
                label="영업담당"
                @update:model-value="handleSearchEvent"
              />
              <q-space />

              <q-input ref="startFocus" dense outlined v-model="searchParam.word" @keyup.enter="handleSearchEvent">
                <template v-slot:append>
                  <q-icon size="1.0em" v-if="searchParam.word !== null" name="close" @click="handleResetWord" class="cursor-pointer q-pt-xs" />
                  <q-icon size="1.0em" name="search" @click="handleSearchEvent" class="cursor-pointer q-pt-xs" />
                </template>
              </q-input>
              <q-space />
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs" :style="contentZoneStyle">
            <q-scroll-area style="height: 100%; max-width: 100%">
              <q-list>
                <div v-for="data in rowData" :key="data.rowNum">
                  <q-item class="q-gutter-xs-x-none q-gutter-sm-x-md">
                    <q-item-section avatar>
                      <q-avatar>
                        <span class="text-subtitle2"> {{ data.rowNum }}</span>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="`https://www.iszion.com/images/thumb/${data.imageFileNm}?${new Date().getTime()}`" alt="" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section side>
                      <div class="">
                        {{ commUtil.formatWeekDate(data.stdDay) }}
                      </div>
                      <q-item-label class="text-bold">{{ data.salesNm }}</q-item-label>
                    </q-item-section>

                    <q-item-section class="cursor-pointer" @click="handleDayDocView(data)">
                      <q-item-label lines="1">
                        <span class="text-weight-medium">{{ data.subject }}</span>
                        <span class="text-grey-8"> ( {{ data.typeNm }} )</span>
                      </q-item-label>
                      <q-item-label caption lines="2" v-html="data.contents" />
                    </q-item-section>

                    <q-item-section class="cursor-pointer" @click="handleProjectView(data)">
                      <q-item-label lines="1">
                        {{ data.projectNm }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side bottom>
                      <q-item-label caption v-if="data.replyRating">{{ dayFormat(data.replyRegDate) }}</q-item-label>
                      <q-item-label caption v-if="data.replyRating">{{ data.replyEmpNm }}</q-item-label>

                      <q-item-label caption>
                        <q-rating
                          name="quality"
                          readonly
                          v-model="data.replyRating"
                          max="5"
                          size="1.5em"
                          color="deep-orange"
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

          <q-card-section class="q-pa-md flex flex-center">
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
        </q-card>
      </div>
      <!--  end of contents list -->
    </div>
  </q-page>
</template>

<script setup>
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { useUserInfoStore } from 'src/store/setUserInfo';
import moment from 'moment';
import commUtil from 'src/js_comm/comm-util';
import SubDayDoc from 'components/subvue/SubDayDoc.vue';
import SubHistory from 'components/subvue/SubHistory.vue';

const storeUser = useUserInfoStore();
const $q = useQuasar();
const startFocus = ref(null);

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
  getDataSalesOption();
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

const handleDayDocView = resData => {
  $q.dialog({
    component: SubDayDoc,
    componentProps: {
      paramStdDay: resData.stdDay,
      paramSalesCd: resData.salesCd,
      paramSalesNm: resData.salesNm,
      paramSeq: resData.seq,
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
const handleProjectView = resData => {
  $q.dialog({
    component: SubHistory,
    componentProps: {
      paramProjectCd: resData.projectCd,
      paramProjectNm: resData.projectNm,
    },
  })
    .onOk(res => {
      // console.log('res ::: ', res.valueCd, res.valueNm);
    })
    .onCancel(() => {
      // console.log('Cancel');
    })
    .onDismiss(() => {
      handelGetData();
      // console.log('Called on OK or Cancel');
    });
};
const handelGetData = () => {
  getDataMaxPages().then(() => {
    getData();
  });
};

const handleResetWord = () => {
  searchParam.word = '';
  startFocus.value.focus();
};
const handleSearchEvent = () => {
  handelGetData();
};
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getDataMaxPages = async () => {
  totalPages.value = 0;
  currentPages.value = 0;
  pagination.startRowNum = 0;
  try {
    const response = await api.post('/api/mkt/mkt4020_maxPages', {
      paramSalesCd: searchParam.salesCd,
      paramSearchValue: searchParam.word,
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
    const response = await api.post('/api/mkt/mkt4020_list', {
      paramSalesCd: searchParam.salesCd,
      paramSearchValue: searchParam.word,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    rowData.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const salesOptionsSearch = ref(null);

async function getDataSalesOption() {
  // console.log('aa : ', storeUser.setEmpCd, storeUser.setLevelCd);
  try {
    const response = await api.post('/api/mst/sales_event_option_list', { paramEmpCd: storeUser.setEmpCd, paramLevel: storeUser.setLevelCd });

    // console.log('getData1: ', JSON.stringify(response.data.data));
    salesOptionsSearch.value = response.data.data;
    if (storeUser.setLevelCd > '2') {
      searchParam.salesCd = salesOptionsSearch.value[0].salesCd;
    } else {
      salesOptionsSearch.value.unshift({ salesCd: '', salesNm: '전체' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// ******* 그리드 페이지 처리
const totalPages = ref(0); // 총 페이지 수
const currentPages = ref(1); // 현재 처리하는 페이지
const currentGroup = ref(5); // 화면에 보여줄 최대 페이지 수

const pagination = reactive({
  pageRows: 20,
  startRowNum: 0,
  pageOption: [10, 20, 30, 50, 100, 200],
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
