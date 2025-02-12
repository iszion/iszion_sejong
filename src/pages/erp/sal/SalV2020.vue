<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <q-card>
      <!-- contents list title bar -->
      <q-bar>
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>

      <!--  contents list  (좌측 화면) -->
      <q-card-section>
        <div class="row q-col-gutter-x-sm">
          <div class="col-5">
            <q-card flat bordered>
              <q-card-section class="q-pa-none">
                <q-bar class="text-subtitle2">출고전표 정보</q-bar>
                <q-card-actions>
                  <q-input
                    dense
                    stack-label
                    v-model="searchParam.stdDay"
                    type="date"
                    label="출고일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    @update:model-value="getData"
                  />
                  <q-select
                    stack-label
                    dense
                    options-dense
                    class="q-px-md"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    v-model="searchParam.divCd"
                    :options="searchParam.divCdOptions"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 100px"
                    label="구분"
                    @update:model-value="getData"
                  />
                  <q-input
                    stack-label
                    bottom-slots
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    v-model="searchParam.word"
                    label="검색"
                    dense
                    class="q-pb-none"
                    style="width: 90px"
                    @keyup.enter="getData"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="searchParam.word !== ''"
                        name="close"
                        @click="
                          searchParam.word = '';
                          getData();
                        "
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </q-card-actions>
                <div class="q-pa-xs" :style="contentZoneStyle">
                  <ag-grid-vue
                    ref="myGrid"
                    style="width: 100%; height: 100%"
                    :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                    :grid-options="gridOptions"
                  >
                  </ag-grid-vue>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <!--  end of contents list  (좌측 화면) -->

          <!--  contents list  (우측 화면) -->
          <div class="col-7">
            <q-splitter v-model="splitterModel" horizontal :style="dynamicStyle(210)">
              <template v-slot:before>
                <!--  contents list  (우측 상단 화면) -->
                <q-card flat bordered>
                  <q-card-section class="q-pa-none">
                    <q-bar class="text-subtitle2"
                      >출고접수 정보수
                      <span class="q-pl-sm" v-if="rowData.rowsSel.length > 0">( 접수대상 : {{ rowData.rowsSel.length }}건)</span>
                    </q-bar>
                    <q-card-actions class="justify-end">
                      <q-btn :disable="isSaveFg" outline color="positive" icon="upload" @click="saveCoupDataSection"> 접수진행 </q-btn>
                    </q-card-actions>
                    <div class="q-pa-xs" :style="dynamicStyle(790)">
                      <ag-grid-vue
                        ref="myGridSel"
                        style="width: 100%; height: 100%"
                        :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                        :grid-options="gridOptionsSel"
                      >
                      </ag-grid-vue>
                    </div>
                  </q-card-section>
                </q-card>
                <!--  end of contents list  (우측 상단화면) -->
              </template>

              <template v-slot:after>
                <div class="q-py-xs">
                  <!--  contents list  (우측 하단 화면) -->
                  <q-card flat bordered>
                    <q-card-section class="q-pa-none">
                      <q-bar class="text-subtitle2"
                        >코업물류 출고접수 정보
                        <span class="q-pl-sm" v-if="rowData.rowsSel.length > 0">( 접수건수 : {{ rowData.rowsSel.length }}건)</span>
                      </q-bar>

                      <div class="q-pa-xs" :style="dynamicStyle(845)">
                        <ag-grid-vue
                          ref="myGridSet"
                          style="width: 100%; height: 100%"
                          :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                          :grid-options="gridOptionsSet"
                        >
                        </ag-grid-vue>
                      </div>
                    </q-card-section>
                  </q-card>
                  <!--  end of contents list  (우측 하단 화면) -->
                </div>
              </template>
            </q-splitter>

            <!--  end of contents list  (좌측 화면) -->
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import HelpCust from 'components/subvue/HelpCust.vue';
import HelpProd from 'components/subvue/HelpProd.vue';
import CompHelpProdButton from 'components/CompHelpProdButton.vue';
import JsonUtil from 'src/js_comm/json-util';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(false);
const splitterModel = ref(55);

const searchParam = reactive({
  divCd: '1',
  divCdOptions: [],
  word: '',
  stdDay: commUtil.getToday(),
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const rowData = reactive({ rows: [], rowsSel: [], rowsSet: [] });
const selectedRows = reactive({ rows: [], rowsSel: [] });

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 300}px`,
}));
const dynamicStyle = offset => {
  return {
    height: `${contentZoneHeight.value - offset}px`,
  };
};

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  getDataCommOption('401').then(() => {
    getData();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs = ref([
  {
    headerName: '#',
    field: 'rowNum',
    minWidth: 60,
    maxWidth: 60,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    // valueGetter: function (params) {
    //   // Customize row numbers as needed
    //   return params.node.rowIndex + 1;
    // },
  },
  {
    headerName: '',
    field: '',
    maxWidth: 50,
    minWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: false,
    filter: false,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '접수',
    field: 'receiptYnNm',
    minWidth: 80,
    maxWidth: 80,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    cellStyle: param => {
      const isDarkMode = $q.dark.isActive; // 다크 모드 여부
      const receiptYn = param.data?.receiptYn;
      return receiptYn === 'Y'
        ? {
            color: isDarkMode ? 'lime' : 'teal',
          }
        : {
            color: isDarkMode ? 'teal' : 'orange',
          };
    },
  },
  {
    headerName: '출고처',
    field: 'custNm',
    minWidth: 150,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '지점명',
    field: 'custsCd',
    minWidth: 120,
    maxWidth: 120,
  },
  {
    headerName: '전표번호',
    field: 'seq',
    minWidth: 100,
    maxWidth: 100,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '차수',
    field: 'custSeq',
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: '건수',
    field: 'cnt',
    minWidth: 80,
    maxWidth: 80,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '금액',
    field: 'sumAmt',
    minWidth: 120,
    maxWidth: 120,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '코드',
    field: 'custCd',
    minWidth: 80,
    maxWidth: 80,
  },
]);

const columnDefsSel = ref([
  {
    headerName: '#',
    field: 'rowNum',
    minWidth: 60,
    maxWidth: 60,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    // valueGetter: function (params) {
    //   // Customize row numbers as needed
    //   return params.node.rowIndex + 1;
    // },
  },

  {
    headerName: '접수',
    field: 'receiptYnNm',
    minWidth: 80,
    maxWidth: 80,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    cellStyle: param => {
      const isDarkMode = $q.dark.isActive; // 다크 모드 여부
      const receiptYn = param.data?.receiptYn;
      return receiptYn === 'Y'
        ? {
            color: isDarkMode ? 'lime' : 'teal',
          }
        : {
            color: isDarkMode ? 'teal' : 'orange',
          };
    },
  },
  {
    headerName: '접수시간',
    field: 'receiptDateFormat',
    minWidth: 160,
    cellStyle: param => {
      const isDarkMode = $q.dark.isActive; // 다크 모드 여부
      const receiptYn = param.data?.receiptYn;
      return receiptYn === 'Y'
        ? {
            color: isDarkMode ? 'lime' : 'teal',
          }
        : {
            color: isDarkMode ? 'teal' : 'orange',
          };
    },
  },
  {
    headerName: '구분',
    field: 'dealFgNm',
    minWidth: 80,
    maxWidth: 80,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 150,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 80,
    maxWidth: 80,
  },
  {
    headerName: '수량',
    field: 'qty',
    minWidth: 80,
    maxWidth: 80,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '단가',
    field: 'price',
    minWidth: 90,
    maxWidth: 90,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '비율',
    field: 'yul',
    minWidth: 80,
    maxWidth: 80,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '금액',
    field: 'amt',
    minWidth: 120,
    maxWidth: 120,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '기타사항',
    field: 'remarksD',
    minWidth: 100,
  },
]);

const columnDefsSet = ref([
  {
    headerName: '#',
    field: '',
    minWidth: 60,
    maxWidth: 60,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '출고일',
    field: 'ymd',
    minWidth: 100,
    maxWidth: 100,
  },
  {
    headerName: '출판사',
    field: 'ccd',
    minWidth: 100,
  },
  {
    headerName: '서점코드',
    field: 'sejem',
    minWidth: 100,
  },
  {
    headerName: '차수',
    field: 'chasu',
    minWidth: 80,
  },
  {
    headerName: '도서',
    field: 'dose',
    minWidth: 90,
    maxWidth: 90,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '정가',
    field: 'jenga',
    minWidth: 90,
    maxWidth: 90,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '부수',
    field: 'busu',
    minWidth: 80,
    maxWidth: 80,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '공급율',
    field: 'yul',
    minWidth: 90,
    maxWidth: 90,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '총금액',
    field: 'kum',
    minWidth: 120,
    maxWidth: 120,
    valueFormatter: params => {
      if (params.value != null) {
        return new Intl.NumberFormat('ko-KR', {
          // style: 'currency',
          // currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
      }
      return '';
    },
    cellClass: 'ag-right-aligned-cell',
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'teal',
      };
    },
  },
  {
    headerName: '구분',
    field: 'gubun',
    minWidth: 80,
    maxWidth: 80,
    // pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '비고',
    field: 'bigo',
    minWidth: 100,
  },
  {
    headerName: '전송시간',
    field: 'or_time',
    minWidth: 100,
    maxWidth: 100,
    cellStyle: param => {
      const isDarkMode = $q.dark.isActive; // 다크 모드 여부
      const receiptYn = param.data?.receiptYn;
      return receiptYn === 'Y'
        ? {
            color: isDarkMode ? 'lime' : 'teal',
          }
        : {
            color: isDarkMode ? 'teal' : 'orange',
          };
    },
  },
  {
    headerName: '분점',
    field: 'bunjem',
    minWidth: 100,
    maxWidth: 100,
  },
  {
    headerName: '비고',
    field: 'bigo_2',
    minWidth: 100,
  },
  {
    headerName: '전표번호',
    field: 'lotno',
    minWidth: 100,
    maxWidth: 100,
  },
]);

const saveCoupDataSection = () => {
  $q.dialog({
    dark: true,
    title: '안내',
    message: '접수를 진행하시겠습니까?',
    // persistent: true,
    ok: {
      label: '진행',
      push: true,
      color: 'primary',
    },
    cancel: {
      label: '취소',
      push: true,
      color: 'grey-7',
    },
  })
    .onOk(() => {
      let iu = [];
      let iuD = [];

      // 신규 수정 자료정리
      for (let i = 0; i < rowData.rowsSel.length; i++) {
        let tmpJson = '{"mode": "' + 'I' + '","data":' + JSON.stringify(rowData.rowsSel[i]) + '}';
        //
        // // 일자를 포멧에 맞게 변경
        // let dealDay = rowData.rowsSel[i].dealDay;
        // if (dealDay && dealDay.length === 8) {
        //   // 값이 유효한지 확인
        //   dealDay = dealDay.slice(2, 4) + '/' + dealDay.slice(4, 6) + '/' + dealDay.slice(6, 8);
        // }
        //
        // // dealFg 마지막 1자리 추출
        // let dealFg = rowData.rowsSel[i].dealFg;
        // if (dealFg && dealFg.length === 7) {
        //   // 값이 유효한지 확인
        //   dealFg = dealFg.slice(-1); // 마지막 1자리 추출
        // }
        //
        // // 변환된 dealDay, dealFg를 포함하여 JSON 구성
        // let rowDataCopy = { ...rowData.rowsSel[i], dealDay, dealFg }; // 기존 데이터 복사 후 dealDay 변경
        // let tmpJson = '{"mode": "I","data":' + JSON.stringify(rowDataCopy) + '}';

        iu.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
        if (val.rtn === '0') {
          getDataCoupList(selectedRows.rows[0]);

          let selectedRow = myGrid.value.api.getSelectedNodes()[0];
          selectedRow.data.receiptYn = 'Y';
          selectedRow.data.receiptYnNm = '접수';
          rowData.rows.forEach(row => {
            if (row.seq === selectedRows.rows[0].seq) {
              row.receiptYn = 'Y';
              row.receiptYnNm = '접수';
            }
          });
          myGrid.value.api.applyTransaction({ update: [selectedRow.data] });
        }
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resData => {
  try {
    const res = await api.post('/api/coup/sal2020_coup_save', resData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus;
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

// ***** 코업 접수자료 가져오기 부분  *****************************//
const getDataCoupList = async resParam => {
  try {
    const response = await api.post('/api/coup/sal2020_coup_select_list', {
      paramDay: resParam.dealDayX,
      paramCustCd: resParam.custCd,
      paramCustsCd: resParam.custsCd,
      paramCustSeq: resParam.custSeq,
    });
    rowData.rowsSet = response.data.data;
    myGridSet.value.api.setGridOption('rowData', rowData.rowsSet);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 출고전표(미접수) 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/sal/sal2020_list', {
      paramStdDay: commUtil.unFormatDate(searchParam.stdDay),
      paramDivCd: searchParam.divCd,
      paramValue: searchParam.word,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 자료 가져오기 부분  *****************************//
const getDataSelect = async resData => {
  console.log('sel : ', JSON.stringify(resData));
  try {
    const response = await api.post('/api/sal/sal2020_select_list', {
      paramStdDay: resData.dealDay,
      paramSeq: resData.seq,
      paramReceiptYn: resData.receiptYn,
    });
    rowData.rowsSel = response.data.data;
    myGridSel.value.api.setGridOption('rowData', rowData.rowsSel);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '401':
        searchParam.divCdOptions = response.data.data;
        // console.log('option1 : ', JSON.stringify(searchParam.divCdOptions));
        // 코드를 마지막 1자리만 사용
        searchParam.divCdOptions.forEach(obj => {
          if (obj.commCd.length > 0) {
            obj.commCd = obj.commCd.slice(-1); // Extract the last digit of `cd`
          }
        });
        // console.log('option2 : ', JSON.stringify(searchParam.divCdOptions));
        break;
      default:
        searchParam.divCdOptions = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 40;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.rows = event.api.getSelectedRows();
    if (selectedRows.rows.length > 0) {
      isSaveFg.value = selectedRows.rows[0].receiptYn === 'Y';
      getDataSelect(selectedRows.rows[0]).then(() => {
        getDataCoupList(selectedRows.rows[0]);
      });
    } else {
      rowData.rowsSel = [];
      rowData.rowsSet = [];
      myGridSel.value.api.setGridOption('rowData', rowData.rowsSel);
      myGridSet.value.api.setGridOption('rowData', rowData.rowsSet);
    }
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};

const myGridSel = ref(null);
const gridOptionsSel = {
  columnDefs: columnDefsSel.value,
  rowData: rowData.rowsSel,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 30;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    // selectedRows.header = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};

const myGridSet = ref(null);
const gridOptionsSet = {
  columnDefs: columnDefsSet.value,
  rowData: rowData.rowsSet,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 25;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};
</script>

<style lang="sass" scoped></style>
