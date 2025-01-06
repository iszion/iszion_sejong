<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <q-card bordered>
      <!-- contents list title bar -->
      <q-bar class="">
        <q-icon name="list_alt" />
        <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
        <q-space />
      </q-bar>
      <!--  end of contents list title bar -->
      <q-card-section>
        <div class="row q-col-gutter-x-sm">
          <div class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-3">
            <q-date
              minimal
              style="width: 100%"
              color="blue"
              mask="YYYY-MM-DD"
              v-model="currentDate"
              :events="eventDays"
              :event-color="() => ($q.dark.isActive ? 'tear' : 'orange')"
              @update:model-value="onDateClick"
              @navigation="onNavigation"
              :default-year-month="currentYearMonth"
            />
          </div>
          <div class="col-xs-12 col-sm-7 col-md-8 col-lg-9 col-xl-9">
            <div class="row q-pb-xs q-pt-xs-sm q-pt-md-none">
              <q-select
                stack-label
                dense
                options-dense
                class="q-px-md"
                label-color="orange"
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
                label-color="orange"
                v-model="searchParam.word"
                label="검색"
                dense
                class="q-pb-none"
                style="width: 90px"
                @keyup.enter="getDataSearch"
              >
                <template v-slot:append>
                  <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                </template>
              </q-input>
              <q-space />
              <div class="q-gutter-xs text-right">
                <q-btn outline color="positive" @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                <q-btn v-if="isShowSaveBtn" outline color="primary" :disable="isReceipt.yn" @click="saveDataSection"
                  ><q-icon name="save" size="xs" /> 저장
                  <q-badge v-show="delRowsCount > 0" color="red" floating>{{ delRowsCount }}</q-badge>
                </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" :disable="isReceipt.yn" @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> 전체삭제
                  <q-badge color="red" floating>{{ selectedRows.header.length }}</q-badge>
                </q-btn>
              </div>
            </div>
            <!--            <div :style="contentZoneStyle">-->
            <div style="height: 244px">
              <ag-grid-vue
                ref="myGridHeader"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptionsHeader"
              >
              </ag-grid-vue>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- contents list title bar -->
      <q-bar class="q-px-sm">
        <q-icon name="list_alt" />
        <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
        <q-space />
        <!--        <q-toggle v-model="second" color="pink" icon="calculate"><q-badge outline align="middle" color="teal">금액자동계산 </q-badge></q-toggle>-->
        <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
          <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
        </q-chip>
        <q-toggle dense left-label v-model="isReceipt.yn" color="pink" :icon="isReceipt.yn ? 'lock' : 'lock_open'" label="접수완료" />
      </q-bar>
      <q-card-section class="q-py-none">
        <div class="row q-col-gutter-x-lg">
          <q-input
            stack-label
            :dense="dense"
            class="col-2 text-subtitle1"
            v-model="formData.dealDay"
            type="date"
            label="출고일"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            :disable="formDisable"
            :readonly="isReceipt.yn"
          />
          <div class="col-1"></div>
          <q-input
            stack-label
            :dense="dense"
            class="col-1 text-subtitle1"
            v-model="formData.seq"
            label="전표번호"
            fill-mask
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            :disable="formDisable"
            :readonly="isReceipt.yn"
          >
            <template v-slot:append>
              <q-icon v-if="isSaveFg === 'I'" size="0.8em" name="sync" @click="getDataMaxSeqCheck()" class="cursor-pointer q-pt-md">
                <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                  <strong> 코드생성하기 </strong>
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
          <div class="col-1" />
          <q-select
            stack-label
            options-dense
            class="col-1 text-subtitle1"
            :disable="formDisable"
            :readonly="isReceipt.yn"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            v-model="formData.divCd"
            :options="searchParam.divCdOptions"
            option-value="commCd"
            option-label="commNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 100px"
            label="구분"
          />
        </div>
        <div class="row q-col-gutter-x-lg">
          <q-input
            ref="startFocus"
            :dense="dense"
            stack-label
            class="col-3 text-subtitle1"
            v-model="formData.custNm"
            label="출고처"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            :disable="formDisable"
            :readonly="isReceipt.yn"
            @keyup.enter.prevent="openHelpCustDialog(formData.custNm)"
          >
            <template v-slot:append>
              <q-icon
                size="0.8em"
                v-if="formData.custNm !== ''"
                name="close"
                @click="
                  formData.custNm = '';
                  formData.custCd = '';
                  formData.custsCd = '';
                  formData.custSeq = '';
                "
                class="cursor-pointer q-pt-md"
              />
              <q-icon size="0.8em" name="search" @click="openHelpCustDialog('')" class="cursor-pointer q-pt-md" />
            </template>
          </q-input>
          <q-input
            stack-label
            :dense="dense"
            class="col-1 text-subtitle1"
            v-model="formData.custCd"
            label="코드"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            readonly
          />

          <q-select
            ref="secondFocus1"
            stack-label
            options-dense
            class="col-1 text-subtitle1"
            :disable="formDisable"
            :readonly="isReceipt.yn"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            v-model="formData.custsCd"
            :options="custsCdOptions"
            option-value="custsCd"
            option-label="custsNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 100px"
            label="지점명"
            @update:model-value="handleUpdateCustsSeqSet"
          />

          <q-select
            stack-label
            options-dense
            class="col-1 text-subtitle1"
            :disable="formDisable"
            :readonly="isReceipt.yn"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            v-model="formData.custSeq"
            :options="custSeqOptions"
            option-value="value"
            option-label="label"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 100px"
            label="주문차수"
          />

          <q-input
            ref="secondFocus2"
            stack-label
            class="col-4"
            :dense="dense"
            :disable="formDisable"
            :readonly="isReceipt.yn"
            v-model="formData.remarks"
            label="참고사항"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            clearable
            :hint="`${byteCount.remarks} / 50(한글25)자 까지 입력하실 수 있습니다.`"
            @update:model-value="updateByteCount('remarks', formData.remarks, 50)"
            @keyup.enter.prevent="nextGridEdit"
          />
        </div>
      </q-card-section>

      <!--      <q-separator />-->
      <!--  end of contents list (우측 화면)  -->

      <q-card-actions class="row">
        <div v-if="!formDisable" class="q-gutter-x-sm self-end">
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
        <q-space />
        <div v-if="!formDisable && isSaveFg !== 'I' && isReceipt.date" class="q-gutter-x-sm self-end">
          <q-chip class="glossy" square color="pink" text-color="white" icon="numbers"> 접수건수 : {{ isReceipt.cnt }}건</q-chip>
          <q-chip class="glossy" square color="pink" text-color="white" icon="event"> 접수시간 : {{ isReceipt.date }}</q-chip>
        </div>
        <q-space />
        <div class="text-right q-gutter-x-sm">
          <q-btn
            dense
            outline
            color="primary"
            icon="add"
            label="라인추가"
            :disable="!isShowSaveBtn || isReceipt.yn"
            @click="addDataDetailsRowSection('next')"
          />
          <q-btn
            dense
            outline
            color="negative"
            icon="remove"
            label="라인제거"
            :disable="removeRowsCount <= 0 || isReceipt.yn"
            @click="removeSelectedRow"
          />
        </div>
      </q-card-actions>
      <q-card-section class="q-pa-xs">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            ref="myGridDetails"
            style="width: 100%; height: 100%"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :grid-options="gridOptionsDetails"
          >
          </ag-grid-vue>
        </div>
      </q-card-section>
    </q-card>
    <!--  end of contents list  (좌측 화면) -->
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
const isSaveFg = ref(null);
const custsCdOptions = ref([]);
const custSeqOptions = ref([]);
const searchParam = reactive({
  divCd: '1',
  divCdOptions: [],
  useYn: 'N',
  word: '',
  calcuFg: true,
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);

const selectedRows = reactive({ header: [], details: [] });

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 700}px`,
}));

const rowData = reactive({ header: [], details: [] });
const rowDataOrdBack = ref([]);

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
  custSeqOptions.value = [{ label: '', value: '' }];
  for (let i = 1; i < 100; i++) {
    let tmpJson = {
      value: i.toString().padStart(2, '0'),
      label: i.toString().padStart(2, '0') + '차',
    };
    custSeqOptions.value.push(tmpJson);
  }
  // console.log('aa : ', JSON.stringify(custSeqOptions.value));

  currentYearMonth.value = commUtil.getTodayYear() + '/' + commUtil.getTodayMonth();
  getDataCommOption('401').then(() => {
    getDataCommOption('402').then(() => {
      getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
        onDateClick(currentDate.value);
      });
    });
  });
});

// 오늘날자 setting
const today = new Date();
const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
const currentDate = ref(formattedDate);
// 오늘날자 setting 끝

const eventDays = ref([]);
const selectedDate = reactive({
  date: '',
  year: '',
  month: '',
  day: '',
});

const currentYearMonth = ref(null);
const viewDateYYMM = reactive({
  year: currentDate.value.substring(0, 4),
  month: currentDate.value.substring(5, 7),
});
const onDateClick = resSelectedDate => {
  if (resSelectedDate) {
    const [year, month, day] = resSelectedDate.split('-');
    selectedDate.year = `${year}`;
    selectedDate.month = `${month}`;
    selectedDate.day = `${day}`;
    selectedDate.date = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    getData();
    formScreenReset();
  }
};

function onNavigation(event) {
  viewDateYYMM.year = event.year;
  viewDateYYMM.month = event.month;
  getEventData(event.year, event.month).then(() => {});
}

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const handleUpdateCustsSeqSet = () => {
  getDataCustSeqCheck(formData.value).then(val => {
    formData.value.custSeq = val;

    setTimeout(() => {
      secondFocus2.value.focus();
    }, 200);
  });
};

const columnDefsHeader = ref([
  {
    headerName: '#',
    minWidth: 60,
    maxWidth: 60,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
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
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '출고일',
    field: 'dealDay',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueFormatter: dateFormatter,
    minWidth: 120,
    maxWidth: 120,
  },
  {
    headerName: '전표번호',
    field: 'seq',
    minWidth: 100,
    maxWidth: 100,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '출고처',
    field: 'custNm',
    minWidth: 150,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
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
    field: 'sumCnt',
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
    headerName: '수량',
    field: 'sumQty',
    minWidth: 110,
    maxWidth: 110,
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
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
  },
]);

const updateFields = params => {
  const rowData = params.data; // 현재 행 데이터
  const resDealFg = rowData.dealFg; // 선택된 dealFg 값

  // yul 필드 값 계산
  const checkYul = checkYulReset(resDealFg); // checkYulReset 메서드 호출
  rowData.yul = checkYul;

  // amt 필드 값 계산
  const qty = parseFloat(rowData.qty) || 0; // 수량
  const price = parseFloat(rowData.price) || 0; // 단가
  rowData.amt = qty * (price * (checkYul / 100)); // 금액 계산
  console.log('qty : ', qty, price, rowData.amt, checkYul);

  params.api.refreshCells({
    // 변경된 셀 갱신
    rowNodes: [params.node],
    columns: ['yul', 'amt'],
  });
};

const dealFgOptions = ref([]);
const columnDefsDetails = ref([
  {
    headerName: 'No',
    field: '',
    minWidth: 70,
    maxWidth: 70,
    editable: false,
    filter: false,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      // Customize row numbers as needed
      if (params.node.rowPinned) {
        return null; // Do not display a number for pinned rows
      }
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '',
    field: '',
    maxWidth: 50,
    minWidth: 50,
    editable: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,

    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '구분',
    field: 'dealFg',
    cellEditor: 'agSelectCellEditor',
    maxWidth: 70,
    minWidth: 70,
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
    cellEditorParams: () => {
      return {
        values: dealFgOptions.value.map(option => option.commCd), // 최신 값을 동적으로 반영
      };
    },
    cellRenderer: params => {
      const option = dealFgOptions.value.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
    valueFormatter: params => {
      const option = dealFgOptions.value.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 150,
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 100,
    maxWidth: 100,
    editable: false,
    cellRendererSelector: params => {
      // 조건에 따라 cellRenderer 설정
      if (!params.node.rowPinned) {
        return {
          component: CompHelpProdButton,
          params: {
            updateSelectedValue: selectedParams => {
              params.node.setDataValue('prodNm', selectedParams.prodNm); // prodNm 업데이트
              params.node.setDataValue('prodCd', selectedParams.prodCd); // prodCd 업데이트
              params.node.setDataValue('price', selectedParams.sPrice); // prodCd 업데이트
            },
          },
        };
      }
      // 조건에 맞지 않으면 cellRenderer를 사용하지 않음
      return null;
    },
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
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
    // valueSetter: params => {
    //   const newValue = parseFloat(params.newValue) || 0;
    //   const oldValue = params.data.qty || 0;
    //   if (newValue !== oldValue) {
    //     params.data.qty = newValue;
    //     params.data.amt = newValue * (params.data.price || 0); // Update amt
    //     return true; // Return true to indicate value changed
    //   }
    //   return false;
    // },
  },
  {
    headerName: '단가',
    field: 'price',
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
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
    // valueSetter: params => {
    //   const newValue = parseFloat(params.newValue) || 0;
    //   const oldValue = params.data.price || 0;
    //   if (newValue !== oldValue) {
    //     params.data.price = newValue;
    //     params.data.amt = (params.data.qty || 0) * newValue; // Update amt
    //     return true; // Return true to indicate value changed
    //   }
    //   return false;
    // },
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
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
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
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '반품일',
    field: 'returnDay',
    valueFormatter: dateFormatter,
    minWidth: 120,
    maxWidth: 120,
    editable: params => !params.node.rowPinned && !isReceipt.value.yn, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
]);

const oldFormData = ref(null);
const formData = ref(null);

const formDataInitialize = () => {
  formData.value = {
    dealDay: '',
    seq: '',
    divCd: '',
    custCd: '',
    custNm: '',
    custsCd: '',
    custSeq: '',
    remarks: '',
    coupRetuenDay: '',
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
    iuD: 'I',
  };
};

const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const secondFocus1 = ref(null);
const secondFocus2 = ref(null);
const addDataSection = () => {
  isReceipt.value.yn = false;
  if (currentDate.value) {
    getDataMaxSeqCheck().then(valMaxSeq => {
      myGridHeader.value.api.deselectAll();
      setTimeout(() => {
        formDataInitialize();
        oldFormData.value = null;
        isShowStatusEdit.value = true;
        statusEdit.icon = 'edit';
        statusEdit.message = '신규입력모드 입니다';
        statusEdit.color = 'primary';
        isSaveFg.value = 'I';
        isShowSaveBtn.value = true;
        formDisable.value = false;
        formData.value.seq = valMaxSeq;
        formData.value.dealDay = currentDate.value;
        formData.value.divCd = searchParam.divCd;

        rowData.details = [];
        myGridDetails.value.api.setRowData([]);
        myGridDetails.value.api.hideOverlay(); // 로딩 오버레이 제거

        setTimeout(() => {
          startFocus.value.focus();
        }, 100);
      });
    }, 100);
  } else {
    $q.notify({
      message: '일자를 선택하세요',
      position: 'center',
      progress: true,
      color: 'orange',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
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
    });
  }
};
const deleteDataSection = () => {
  $q.dialog({
    dark: true,
    title: '자료삭제',
    message: '선택된 자료를 삭제하시겠습니까? ',
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
      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRows.header.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.header[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
        if (val.rtn === '0') {
          getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
            onDateClick(currentDate.value);
          });
        }
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  formData.value.dealDay = commUtil.unFormatDate(formData.value.dealDay);

  if (isEqual(formData.value, oldFormData.value) && isEqual(rowData.details, rowDataOrdBack.value) && selectedRows.details.length === 0) {
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
    if (isSaveFg.value === 'U' && formData.value.dealDay !== oldFormData.value.dealDay) {
      saveDataInsertDelete();
    } else {
      // Detail 자료 분류작업
      let iu = [];
      let iuD = [];

      // 신규 수정 자료정리
      for (let i = 0; i < rowData.details.length; i++) {
        if (!isEmpty(rowData.details[i].prodCd)) {
          if (rowData.details[i].iuD === 'I' || rowData.details[i].iuD === 'U') {
            rowData.details[i]['dealDay'] = commUtil.unFormatDate(formData.value.dealDay);
            rowData.details[i]['custCd'] = formData.value.custCd;
            let tmpJson = '{"mode": "' + rowData.details[i].iuD + '","data":' + JSON.stringify(rowData.details[i]) + '}';
            iu.push(tmpJson);
          }
        }
      }

      // 삭제 자료정리
      for (let i = 0; i < selectedRows.details.length; i++) {
        if (selectedRows.details[i].iuD === 'R' || selectedRows.details[i].iuD === 'U') {
          let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.details[i]) + '}';
          iuD.push(tmpJson);
        }
      }

      // Header 자료 정리
      const obj_no1 = jsonUtil.dataJsonParse('no1', isSaveFg.value, formData.value);
      const _obj_no1 = obj_no1.slice(1, -1); // 앞뒤 {} 제거

      // Detail 자료 정리
      const obj_no2 = JSON.stringify(JsonUtil.jsonFiller('no2', iu, iuD));
      const _obj_no2 = obj_no2.slice(1, -1); // 앞뒤 {} 제거

      const saveData = '{' + _obj_no1 + ',' + _obj_no2 + '}'; // 제거된 object 하나로 묶기
      saveDataAndHandleResult(saveData).then(val => {
        if (val.rtn === '0') {
          getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
            onDateClick(currentDate.value);
          });
        }
      });
    }
  }
};

const saveDataInsertDelete = () => {
  // 새로운 일자 Insert 처리부분
  // Detail 자료 분류작업
  let iu = [];
  let iuD = [];

  // 신규 수정 자료정리
  for (let i = 0; i < rowData.details.length; i++) {
    if (!isEmpty(rowData.details[i].prodCd)) {
      if (rowData.details[i].iuD === 'R' || rowData.details[i].iuD === 'U') {
        rowData.details[i]['dealDay'] = commUtil.unFormatDate(formData.value.dealDay);
        rowData.details[i]['custCd'] = formData.value.custCd;
        let tmpJson = '{"mode": "I", "data":' + JSON.stringify(rowData.details[i]) + '}';
        iu.push(tmpJson);
      }
    }
  }

  // 삭제 자료정리
  for (let i = 0; i < selectedRows.details.length; i++) {
    if (selectedRows.details[i].iuD === 'R' || selectedRows.details[i].iuD === 'U') {
      let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.details[i]) + '}';
      iuD.push(tmpJson);
    }
  }

  // Header 자료 정리
  let obj_no1 = jsonUtil.dataJsonParse('no1', 'I', formData.value);
  let _obj_no1 = obj_no1.slice(1, -1); // 앞뒤 {} 제거

  // Detail 자료 정리
  let obj_no2 = JSON.stringify(JsonUtil.jsonFiller('no2', iu, iuD));
  let _obj_no2 = obj_no2.slice(1, -1); // 앞뒤 {} 제거

  let saveData = '{' + _obj_no1 + ',' + _obj_no2 + '}'; // 제거된 object 하나로 묶기
  saveDataAndHandleResult(saveData).then(val => {
    if (val.rtn === '0') {
      // 기존 일자 Delete 처리부분
      // Header 자료 정리
      saveData = jsonUtil.dataJsonParse('no1', 'D', oldFormData.value);

      saveDataAndHandleResult(saveData).then(val => {
        if (val.rtn === '0') {
          getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
            onDateClick(currentDate.value);
          });
        }
      });
    }
  });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/sal/sal2010_save', resFormData);
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

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getEventData = async (resYear, resMonth) => {
  try {
    const response = await api.post('/api/sal/sal2010_list_event', {
      paramYear: resYear,
      paramMonth: resMonth,
    });
    eventDays.value.splice(0);
    for (let i = 0; i < response.data.data.length; i++) {
      let tmpDay = response.data.data[i].eventDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
      eventDays.value.push(tmpDay);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSearch = async () => {
  try {
    const response = await api.post('/api/sal/sal2010_list_search', {
      paramYyMm: currentYearMonth.value.replace(/\//g, ''), // 모든 `/`를 제거
      paramValueNm: searchParam.word,
    });
    rowData.header = response.data.data;
    myGridHeader.value.api.setGridOption('rowData', rowData.header);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getData = async () => {
  try {
    const response = await api.post('/api/sal/sal2010_list_header', {
      paramDealDay: commUtil.unFormatDate(currentDate.value),
      paramDivCd: searchParam.divCd,
    });
    rowData.header = response.data.data;
    myGridHeader.value.api.setGridOption('rowData', rowData.header);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자동코드처리 마지막 코드+1 가져오기 부분  *****************************//
const getDataMaxSeqCheck = async () => {
  try {
    const response = await api.post('/api/sal/sal2010_maxSeqCheck', {
      paramDealDay: commUtil.unFormatDate(currentDate.value),
    });
    return response.data.data[0].maxSeq;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 자동코드처리 마지막 코드+1 가져오기 부분  *****************************//
const getDataCustSeqCheck = async resData => {
  try {
    const response = await api.post('/api/sal/sal2010_cust_seq_check', {
      paramDealDay: commUtil.unFormatDate(resData.dealDay),
      paramCustCd: resData.custCd,
      paramCustsCd: resData.custsCd,
    });
    return commUtil.getDataWithZero(response.data.data[0].custSeq, 2);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resData => {
  try {
    const response = await api.post('/api/sal/sal2010_select_header', {
      paramDealDay: commUtil.unFormatDate(resData.dealDay),
      paramSeq: resData.seq,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.dealDay = commUtil.formatDate(response.data.data[0].dealDay);
    console.log('aa : ', JSON.stringify(formData.value));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const isReceipt = ref({
  yn: false,
  cnt: 0,
  date: null,
});
const getDataSelectList = async resData => {
  try {
    const response = await api.post('/api/sal/sal2010_select_list_details', {
      paramDealDay: commUtil.unFormatDate(resData.dealDay),
      paramSeq: resData.seq,
    });
    rowData.details = response.data.data;
    rowDataOrdBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGridDetails.value.api.setGridOption('rowData', rowData.details);
    myGridDetails.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);

    isReceipt.value.yn = rowData.details.some(row => row.receiptYn === 'Y');
    isReceipt.value.cnt = rowData.details.filter(row => row.receiptYn === 'Y').length;

    const isReceipt_data = rowData.details.filter(row => row.receiptYn === 'Y');
    if (isReceipt_data.length > 0) {
      isReceipt.value.date = commUtil.formatDatetime(isReceipt_data[0].receiptDate);
    } else {
      isReceipt.value.date = null; // Handle case where no matching data is found
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

async function getDataCustsOption(resCustCd) {
  try {
    const response = await api.post('/api/mst/custs_option_list', { paramCustCd: resCustCd });
    custsCdOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

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
      case '402':
        dealFgOptions.value = response.data.data;
        break;
      default:
        dealFgOptions.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGridHeader = ref(null);
const gridOptionsHeader = {
  columnDefs: columnDefsHeader.value,
  rowData: rowData.header,
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
    handleRowHeaderClick(event.data);
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
    selectedRows.header = event.api.getSelectedRows();
    isShowDeleteBtn.value = false;

    if (selectedRows.header.length === 0) {
      formScreenReset();

      rowData.details = [];
      myGridDetails.value.api.setRowData([]);
    } else if (selectedRows.header.length === 1) {
      handleRowHeaderClick(selectedRows.header[0]);
      isShowDeleteBtn.value = true;
    } else {
      isShowDeleteBtn.value = true;
      formScreenReset();

      rowData.details = [];
      myGridDetails.value.api.setRowData([]);
    }
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

const formScreenReset = () => {
  isSaveFg.value = '';
  isShowSaveBtn.value = false;
  isShowStatusEdit.value = false;
  formDisable.value = true;
  formDataInitialize();
  rowData.details = [];
  myGridDetails.value.api.setGridOption('rowData', rowData.details);
  myGridDetails.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
};
const handleRowHeaderClick = data => {
  getDataSelect(data).then(() => {
    getDataSelectList(data).then(() => {
      getDataCustsOption(data.custCd).then(() => {
        isSaveFg.value = 'U';
        isShowSaveBtn.value = true;
        isShowStatusEdit.value = true;
        statusEdit.icon = 'edit_note';
        statusEdit.message = '수정/삭제모드 입니다';
        statusEdit.color = 'accent';
        formDisable.value = false;
      });
    });
  });
};
// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    prodNm: '합계',
    qty: 0,
    amt: 0,
  };

  rowData.details.forEach(row => {
    totalRow.qty += row.qty || 0;
    totalRow.amt += row.amt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  dealFg: 'prodNm',
  prodNm: 'qty',
  qty: 'price',
  price: 'yul',
  yul: 'amt',
  amt: 'remarks',
};

const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGridDetails = ref(null);
const gridOptionsDetails = {
  columnDefs: columnDefsDetails.value,
  rowData: rowData.details,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: true,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 40;
    }
    return 35;
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
  onCellKeyDown: event => {
    // console.log('Event keyDown:', event);
    if (event.column.colId === 'prodNm' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
    if (event.column.colId === 'remarks' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);

    if (event.column.colId === 'prodNm' && eventKey.value === 'Enter') {
      //     // 중복 이벤트 방지
      if (processedEventKey === eventKey.value) {
        processedEventKey = null;
        return;
      }
      processedEventKey = eventKey.value;
      // 중복 이벤트 방지 끝
      openHelpProdDialog(event);
      // }
      // });
    }
    if (event.column.colId === 'remarks' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      processedEventKey = null;
      addDataDetailsRowSection('next');
    }

    const nextColumn = columnFocusMap[event.column.colId];
    if (nextColumn) {
      myGridDetails.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
    }
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
    // event.api.startEditingCell({
    //   rowIndex: event.rowIndex,
    //   colKey: event.column.getId(),
    // });
  },
  // isRowSelectable: node => !node.footer,
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    if (!isReceipt.value.yn) {
      selectedRows.details = event.api.getSelectedRows();
      isShowStatusEdit.value = false;
      // isShowSaveBtn.value = selectedRows.details.length > 0;
      removeRowsCount.value = selectedRows.details.filter(row => row.iuD === 'I').length;
      delRowsCount.value = selectedRows.details.filter(row => row.iuD !== 'I').length;

      // const selRow = selectedRows.details.filter(row => row.iuD !== 'I');
      // rowData.details = rowData.details.filter(row => !delRow.some(del => del.iuD === row.iuD));

      // 그리드에 변경된 데이터 적용
      // event.api.setRowData(rowData.details);
      // selectedRows.details = selRow;
    } else {
      selectedRows.details = [];
      event.api.deselectAll();
    }
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    if (event.column.colId === 'dealFg' || event.column.colId === 'qty' || event.column.colId === 'price' || event.column.colId === 'yul') {
      const rowData = event.data; // 현재 행 데이터
      const resDealFg = rowData.dealFg; // 선택된 dealFg 값

      if (event.column.colId === 'dealFg') {
        // yul 필드 값 계산
        rowData.yul = checkYulReset(resDealFg); // checkYulReset 메서드 호출
      }

      // amt 필드 값 계산
      const qty = parseFloat(rowData.qty) || 0; // 수량
      const price = parseFloat(rowData.price) || 0; // 단가
      const yul = parseFloat(rowData.yul) || 0; // 단가
      rowData.amt = qty * (price * (yul / 100)); // 금액 계산
      console.log('qty : ', qty, price, rowData.amt, yul);

      event.api.refreshCells({
        // 변경된 셀 갱신
        rowNodes: [event.node],
        columns: ['yul', 'amt'],
      });
    }

    const backData = rowDataOrdBack.value.filter(item => item.cnt === event.data.cnt);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
    // console.log('rowData :: ', JSON.stringify(rowData.details));

    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
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

// 3  자리수 마다 콤마 포맷된 값을 관리하는 computed
const formattedLimitAmt = formattedValue('limitAmt');

function formattedValue(key) {
  return computed({
    get() {
      return formData.value[key].toLocaleString(); // 3자리 콤마
    },
    set(value) {
      formData.value[key] = Number(value.replace(/,/g, '')) || 0; // 콤마 제거 후 숫자로 변환
    },
  });
}

// 공통 업데이트 함수
function updateValue(key, value) {
  formData.value[key] = Number(value.replace(/,/g, '')) || 0;
}
// 포맷된 값을 관리하는 computed 끝

/* *** 코드헬프부분 ** */
const openHelpCustDialog = resNm => {
  $q.dialog({
    component: HelpCust,
    componentProps: {
      paramValueNm: resNm,
      paramUseYn: 'N',
      paramCloseDay: commUtil.unFormatDate(formData.value.dealDay),
    },
  })
    .onOk(res => {
      formData.value.custCd = res.custCd;
      formData.value.custNm = res.custNm;

      formData.value.yulWt = res.yulWt;
      formData.value.yulMj = res.yulMj;
      formData.value.yulHm = res.yulHm;
      formData.value.yulNp = res.yulNp;
      formData.value.yulTb = res.yulTb;
      formData.value.yulHd = res.yulHd;
      formData.value.yulHs = res.yulHs;
      formData.value.yulSg = res.yulSg;
      formData.value.yulGt = res.yulGt;

      getDataCustsOption(res.custCd).then(() => {
        getDataCustSeqCheck(formData.value).then(val => {
          formData.value.custSeq = val;
          setTimeout(() => {
            if (custsCdOptions.value.length > 0) {
              secondFocus1.value.focus();
            } else {
              secondFocus2.value.focus();
            }
          }, 200);
        });
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

const openHelpProdDialog = event => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: event.data.prodNm,
      paramUseYn: 'N',
      paramCloseDay: commUtil.unFormatDate(formData.value.dealDay),
    },
  })
    .onOk(res => {
      event.node.setDataValue('prodNm', res.prodNm);
      event.node.setDataValue('prodCd', res.prodCd);
      event.node.setDataValue('price', res.sPrice);
      myGridDetails.value.api.setFocusedCell(event.node.rowIndex, 'qty');
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

/** **** 그리드 Detail 편집부분 ****/
const maxCnt = ref(0);
const rowIndex = ref(0);
const addDataDetailsRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGridDetails.value.api.getDisplayedRowCount();
  }
  // const addIndex = rowIndex.value;
  const newItems = {
    dealDay: formData.value.dealDay,
    seq: formData.value.seq,
    cnt: maxCnt.value,
    custCd: formData.value.custCd,
    divCd: '1',
    dealFg: '',
    prodCd: '',
    prodNm: '',
    qty: 0,
    price: 0,
    amt: 0,
    yul: 0,
    returnDay: '',
    receiptYn: 'N',
    receiptDate: '00000000',
    remarks: '',
    iuD: 'I',
  };
  rowData.details.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGridDetails.value.api.setRowData(rowData.details);
  // 첫컬럼에 focus
  myGridDetails.value.api.setFocusedCell(newRowIndex, 'dealFg');
};

const nextGridEdit = () => {
  rowIndex.value = 0;
  addDataDetailsRowSection('first');
};

const removeSelectedRow = () => {
  const selectedNodes = myGridDetails.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  console.log('selectedData : ', JSON.stringify(selectedData));

  // 선택된 행을 제거
  // rowData.details = rowData.details.filter(row => !selectedData.includes(row));
  rowData.details = rowData.details.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));
  console.log('rowData : ', JSON.stringify(rowData.details));

  // 그리드 데이터 갱신
  myGridDetails.value.api.setRowData(rowData.details);
};

const checkYulReset = resDealFg => {
  let checkYul = 0;
  switch (resDealFg) {
    case '4021101':
      checkYul = formData.value.yulWt;
      break;
    case '4021102':
      checkYul = formData.value.yulMj;
      break;
    case '4021103':
      checkYul = formData.value.yulHm;
      break;
    case '4021104':
      checkYul = formData.value.yulNp;
      break;
    case '4021108':
      checkYul = formData.value.yulHs;
      break;
    case '4021109':
      checkYul = formData.value.yulSg;
      break;
    case '4021199':
      checkYul = formData.value.yulGt;
      break;
    default:
      checkYul = 0;
      break;
  }
  return checkYul;
};
</script>

<style lang="sass" scoped></style>
