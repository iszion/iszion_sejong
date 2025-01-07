<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents title bar -->
    <div class="row">
      <q-icon name="font_download" size="sm" class="text-orange" />
      <q-toolbar-title class="text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</q-toolbar-title>

      <q-breadcrumbs active-color="grey" style="font-size: 14px" class="self-end">
        <q-breadcrumbs-el label="판매관리" icon="home" />
        <q-breadcrumbs-el label="출고관리" icon="widgets" />
        <q-breadcrumbs-el :label="menuLabel" />
      </q-breadcrumbs>
    </div>
    <!-- end of contents title bar -->
    <q-separator class="q-mb-xs" color="cyan" size="0.2rem" />

    <!--  contents zone -->
    <div class="row q-col-gutter-x-sm">
      <!--  contents Zone (좌측 화면) -->
      <div class="col-5">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-bar class="text-subtitle2">출고전표 정보</q-bar>
            <q-card-actions>
              <q-input
                readonly
                dense
                v-model="searchParam.stdDay"
                mask="####-##-##"
                label="반품일"
                :label-color="$q.dark.isActive ? 'green' : 'blue'"
                style="max-width: 130px"
                class="text-subtitle1"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        minimal
                        v-model="searchParam.basicDay"
                        :options="returnDayOptions"
                        @update:model-value="updateSearchReturnDay"
                        @navigation="onNavigation"
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="선택하기" color="primary" flat @click="getData(searchParam.basicDay.toString().slice(2))" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-space />
              <q-btn outline color="positive" icon="refresh" @click="getData(searchParam.basicDay.toString().slice(2))">다시불러오기</q-btn>
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
      <!-- end of contents zone (좌측 화면) -->

      <!--  contents zone  (우측 화면) -->
      <div class="col-7">
        <q-card flat bordered>
          <q-bar class="text-subtitle2"
            >반품정보
            <span class="q-pl-sm" v-if="rowData.rowsSel.length > 0 && formData.iuD !== 'U'">( 접수대상 : {{ rowData.rowsSel.length }}건)</span>
          </q-bar>
          <q-card-actions class="justify-end">
            <q-btn :disable="isSaveFg" outline color="positive" icon="save" @click="saveCoupDataSection"> 반품정보 저장 </q-btn>
          </q-card-actions>
          <q-separator size="2px" />
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-x-lg">
              <q-input
                stack-label
                :dense="dense"
                class="col-3 text-subtitle1"
                v-model="formData.dealDay"
                type="date"
                label="반품적용일"
                :label-color="$q.dark.isActive ? 'green' : 'blue'"
                :readonly="formDisable"
              />
              <div class="col-2"></div>
              <q-field class="col-2" label="전표번호" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">자동부여</div>
                </template>
              </q-field>
              <q-space />
              <q-field class="col-2" label="상태" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.iuD === 'U' ? '처리완료' : '반품전표' }}</div>
                </template>
              </q-field>
            </div>

            <div class="row q-col-gutter-x-lg">
              <q-field class="col-5" label="출고처" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.custNm }}</div>
                </template>
              </q-field>
              <q-field class="col-2" label="코드" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.custCd }}</div>
                </template>
              </q-field>
              <q-space />
              <q-field class="col-2" label="지점명" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.custsCd }}</div>
                </template>
              </q-field>
            </div>
            <div class="row q-col-gutter-x-lg">
              <q-field class="col-10" label="적용율" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    <div v-if="formData.iuD !== ''" class="q-gutter-x-sm self-end">
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'">
                        현매
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulWt }}%</span></q-badge
                        >
                      </span>
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'"
                        >매절
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulMj }}%</span></q-badge
                        >
                      </span>
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'"
                        >현매
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulHm }}%</span></q-badge
                        >
                      </span>
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'"
                        >납품
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulNp }}%</span></q-badge
                        >
                      </span>
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'"
                        >행사
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulHs }}%</span></q-badge
                        >
                      </span>
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'"
                        >신간
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulSg }}%</span></q-badge
                        >
                      </span>
                      <span class="text-subtitle2" :class="$q.dark.isActive ? 'text-green' : 'text-blue'"
                        >기타
                        <q-badge outline align="middle" color="teal"
                          ><span :class="$q.dark.isActive ? 'text-white' : 'text-black'">{{ formData.yulGt }}%</span></q-badge
                        >
                      </span>
                    </div>
                  </div>
                </template>
              </q-field>
              <q-field class="col-2" label="주문차수" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ formData.custSeq }}</div>
                </template>
              </q-field>
            </div>
            <div class="row q-col-gutter-x-lg">
              <q-input
                ref="secondFocus2"
                stack-label
                class="col-8"
                :dense="dense"
                :readonly="formDisable"
                v-model="formData.remarks"
                label="참고사항"
                :label-color="$q.dark.isActive ? 'green' : 'blue'"
                clearable
                :hint="`${byteCount.remarks} / 50(한글25)자 까지 입력하실 수 있습니다.`"
                @update:model-value="updateByteCount('remarks', formData.remarks, 50)"
              />

              <q-field class="col-4" label="처리상태" :readonly="formDisable" stack-label :label-color="$q.dark.isActive ? 'orange' : 'orange'">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    <span v-if="formData.iuD === 'I'" class="text-bold text-red">미저장상태</span>
                    <span v-else-if="formData.iuD === 'U'" class="text-bold text-blue">반품 저장완료</span>
                    <span v-else></span>
                  </div>
                </template>
              </q-field>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <div class="q-pa-xs" :style="dynamicStyle(575)">
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
        <!--  end of contents zone  (우측 화면) -->
      </div>
    </div>
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
const isSaveFg = ref(true);

const searchParam = reactive({
  divCd: '1',
  divCdOptions: [],
  word: '',
  // stdDay: commUtil.getToday(),
  stdDay: null,
  basicDay: commUtil.getToday(),
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);
const formData = ref(null);

const formDataInitialize = () => {
  formData.value = {
    dealDay: '',
    seq: '',
    divCd: '9',
    custCd: '',
    custNm: '',
    custsCd: '',
    custSeq: '',
    remarks: '',
    coupReturnDay: '',
    receiptYn: '',
    receiptDate: '00000000',
    yulWt: '',
    yulMj: '',
    yulHm: '',
    yulNp: '',
    yulTb: '',
    yulHd: '',
    yulHs: '',
    yulSg: '',
    yulGt: '',
    iuD: '',
  };
};

const returnDayOptions = ref([]);
const updateSearchReturnDay = newDate => {
  searchParam.stdDay = newDate;

  // getData(searchParam.stdDay.toString().slice(2));
};

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
  formDataInitialize();
  const _YyMm = commUtil.getTodayYear().toString().slice(-2) + '/' + commUtil.getTodayMonth();
  startReturnYyMm(_YyMm);
});
function onNavigation(event) {
  const _YyMm = event.year.toString().slice(-2) + '/' + commUtil.getDataWithZero(event.month, 2);
  startReturnYyMm(_YyMm);
}
const startReturnYyMm = resYyMm => {
  let paramDay = '00/00/00';
  getDataReturnDay(resYyMm).then(() => {
    if (returnDayOptions.value.length > 0) {
      paramDay = returnDayOptions.value[0].slice(2);
    }
    getData(paramDay);
  });
};

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs = ref([
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
    headerName: '거래처명',
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
    headerName: '총수량',
    field: 'qty',
    minWidth: 100,
    maxWidth: 100,
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
    headerName: '',
    field: '',
    maxWidth: 50,
    minWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    filter: false,
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
    headerName: '업체반품일',
    field: 'returnDay',
    valueFormatter: dateFormatter,
    minWidth: 120,
    maxWidth: 120,
  },
  {
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 100,
  },
]);

const saveCoupDataSection = () => {
  $q.dialog({
    dark: true,
    title: '안내',
    message: '반품전표를 등록 하시겠습니까?',
    // persistent: true,
    ok: {
      label: '저장',
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
      const _dealDay = commUtil.unFormatDate(formData.value.dealDay);

      // 신규 수정 자료정리
      for (let i = 0; i < selectedRows.rowsSel.length; i++) {
        selectedRows.rowsSel[i]['dealDay'] = _dealDay;
        selectedRows.rowsSel[i]['custCd'] = formData.value.custCd;
        let tmpJson = '{"mode": "' + 'I' + '","data":' + JSON.stringify(selectedRows.rowsSel[i]) + '}';
        iu.push(tmpJson);
      }

      // Header 자료 정리
      formData.value.dealDay = _dealDay;
      const obj_no1 = jsonUtil.dataJsonParse('no1', 'I', formData.value);
      const _obj_no1 = obj_no1.slice(1, -1); // 앞뒤 {} 제거

      // Detail 자료 정리
      const obj_no2 = JSON.stringify(JsonUtil.jsonFiller('no2', iu, iuD));
      const _obj_no2 = obj_no2.slice(1, -1); // 앞뒤 {} 제거

      const saveData = '{' + _obj_no1 + ',' + _obj_no2 + '}'; // 제거된 object 하나로 묶기
      saveDataAndHandleResult(saveData).then(val => {
        getData(searchParam.basicDay.toString().slice(2));
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
    const res = await api.post('/api/sal/sal2010_save', resData);
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

// ***** 코업 반풉자료 가져오기 부분  *****************************//
const getDataReturnDay = async resYyMm => {
  try {
    const response = await api.post('/api/coup/sal2030_coup_return_day_list', {
      paramYyMm: resYyMm,
    });
    const returnData = response.data.data;
    returnDayOptions.value = [];
    for (let i = 0; i < returnData.length; i++) {
      returnDayOptions.value.push(returnData[i].ymd);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getData = async resDay => {
  try {
    const response = await api.post('/api/coup/sal2030_coup_return_list', {
      paramDay: resDay,
    });
    rowData.rows = response.data.data;
    let returnDataCheck = [];
    try {
      const response = await api.post('/api/sal/sal2030_return_check_list', {
        paramDay: '20' + '' + resDay.replace(/\//g, ''),
      });
      returnDataCheck = response.data.data;

      for (let i = 0; i < rowData.rows.length; i++) {
        rowData.rows[i].iuD = 'I'; // 반품전표 저장 초기셋팅
        rowData.rows[i].dealDay = commUtil.unFormatDate(searchParam.stdDay);
        for (let j = 0; j < returnDataCheck.length; j++) {
          if (
            rowData.rows[i].custCd === returnDataCheck[j].custCd &&
            rowData.rows[i].custsCd === returnDataCheck[j].custsCd &&
            rowData.rows[i].custSeq === returnDataCheck[j].custSeq
          ) {
            rowData.rows[i].iuD = 'U'; // 반품처리 완료된 자료 체크
            rowData.rows[i].dealDay = returnDataCheck[j].dealDay;
          }
        }
      }
      myGrid.value.api.setGridOption('rowData', rowData.rows);

      formDataInitialize();
      rowData.rowsSel = [];
      formDisable.value = true;
      isSaveFg.value = true;
      myGridSel.value.api.setGridOption('rowData', rowData.rowsSel);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 선택한 자료 가져오기 부분  *****************************//
const getDataCoupReturnList = async resData => {
  try {
    const response = await api.post('/api/coup/sal2030_select_return_list', {
      paramDay: searchParam.stdDay.toString().slice(2).replace(/-/g, '/'),
      paramCustCd: resData.custCd,
      paramCustSeq: resData.custSeq,
      paramCustsCd: resData.custsCd,
    });
    rowData.rowsSel = response.data.data;

    rowData.rowsSel.forEach(row => {
      let yul = 0;
      if (custData) {
        yul = custData.yulWt ?? 0; // Use custData.yulWt or 0 if undefined/null
      }
      const qty = parseFloat(row.qty) || 0; // Convert qty to a number
      const price = parseFloat(row.price) || 0; // Convert price to a number

      row.yul = yul;
      row.amt = qty * (price * (yul / 100));
    });

    myGridSel.value.api.setGridOption('rowData', rowData.rowsSel);
    if (formData.value.iuD !== 'U') {
      myGridSel.value.api.selectAll();
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

let custData = null;
const getDataCust = async resCustCd => {
  try {
    const response = await api.post('/api/mst/mst2020_select', {
      paramCustCd: resCustCd,
    });
    custData = response.data.data[0];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

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
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    if (param.data && param.data.iuD === 'U') {
      // iuD가 'U'인 행의 배경색 파란색으로 설정
      return { color: 'blue' };
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
    // console.log('event : ', JSON.stringify(event.data));

    formDataInitialize();
    getDataCust(event.data.custCd).then(() => {
      formData.value.dealDay = commUtil.formatDateSel(event.data.dealDay, '-');
      formData.value.custNm = event.data.custNm;
      formData.value.custCd = event.data.custCd;
      formData.value.custSeq = event.data.custSeq;
      formData.value.custsCd = event.data.custsCd;
      formData.value.coupReturnDay = commUtil.unFormatDate(searchParam.stdDay);

      if (custData) {
        formData.value.yulWt = custData.yulWt;
        formData.value.yulMj = custData.yulMj;
        formData.value.yulHm = custData.yulHm;
        formData.value.yulNp = custData.yulNp;
        formData.value.yulTb = custData.yulTb;
        formData.value.yulHd = custData.yulHd;
        formData.value.yulHs = custData.yulHs;
        formData.value.yulSg = custData.yulSg;
        formData.value.yulGt = custData.yulGt;
      }

      formData.value.iuD = event.data.iuD;

      isSaveFg.value = !(formData.value.iuD === 'I' && selectedRows.rowsSel.length > 0);

      formDisable.value = formData.value.iuD === 'U';

      getDataCoupReturnList(event.data).then(() => {});
    });
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
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  getRowNodeId: function (data) {
    return null;
  },
  // 리드 상단 고정
  setPinnedTopRowData: function (data) {
    return null;
  },
  // 그리드 하단 고정
  setPinnedBottomRowData: function (data) {
    return null;
  },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
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
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
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
    selectedRows.rowsSel = event.api.getSelectedRows();

    isSaveFg.value = !(formData.value.iuD === 'I' && selectedRows.rowsSel.length > 0);
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  getRowNodeId: function (data) {
    return null;
  },
  // 리드 상단 고정
  setPinnedTopRowData: function (data) {
    return null;
  },
  // 그리드 하단 고정
  setPinnedBottomRowData: function (data) {
    return null;
  },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};

const byteCount = ref({ itemNm: 0, remarks: 0, remarks2: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'itemNm':
        byteCount.value.itemNm = commUtil.textByteLength(val);
        if (byteCount.value.itemNm > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'remarks':
        byteCount.value.remarks = commUtil.textByteLength(val);
        if (byteCount.value.remarks > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'remarks2':
        byteCount.value.remarks2 = commUtil.textByteLength(val);
        if (byteCount.value.remarks2 > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      default:
        break;
    }
  }
};
</script>

<style lang="sass" scoped></style>
