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
              :event-color="() => ($q.dark.isActive ? 'orange' : 'orange')"
              @update:model-value="onDateClick"
              @navigation="onNavigation"
              :default-year-month="currentYearMonth"
            />
          </div>
          <div class="col-xs-12 col-sm-7 col-md-8 col-lg-9 col-xl-9">
            <div class="row q-pb-xs q-pt-xs-sm q-pt-md-none">
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
                <q-btn v-if="isShowSaveBtn" outline color="primary" @click="saveDataSection"
                  ><q-icon name="save" size="xs" /> 저장
                  <q-badge v-show="delRowsCount > 0" color="red" floating>{{ delRowsCount }}</q-badge>
                </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" @click="deleteDataSection">
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
        <q-toggle dense left-label v-model="searchParam.calcuFg" color="pink" icon="calculate" label="자동계산" />
      </q-bar>
      <q-card-section class="q-py-none">
        <div class="row q-col-gutter-x-lg">
          <q-input
            stack-label
            :dense="dense"
            class="col-2 text-subtitle1"
            v-model="formData.buyDay"
            type="date"
            label="매입일자"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            :disable="formDisable"
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
          >
            <template v-slot:append>
              <q-icon v-if="isSaveFg === 'I'" size="0.8em" name="sync" @click="getDataMaxSeqCheck()" class="cursor-pointer q-pt-md">
                <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                  <strong> 코드생성하기 </strong>
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row q-col-gutter-x-lg">
          <q-input
            ref="startFocus"
            :dense="dense"
            stack-label
            class="col-3 text-subtitle1"
            v-model="formData.custNm"
            label="입고처"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            :disable="formDisable"
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
          <div class="col-1"></div>
          <q-input
            ref="secondFocus"
            stack-label
            class="col-5"
            :dense="dense"
            :disable="formDisable"
            v-model="formData.remarks"
            label="참고사항"
            :label-color="$q.dark.isActive ? 'green' : 'blue'"
            clearable
            :hint="`${byteCount.remarks} / 200(한글100)자 까지 입력하실 수 있습니다.`"
            @update:model-value="updateByteCount('remarks', formData.remarks, 200)"
            @keyup.enter.prevent="nextGridEdit"
          />
        </div>
      </q-card-section>

      <!--      <q-separator />-->
      <!--  end of contents list (우측 화면)  -->

      <q-card-actions class="justify-end">
        <div class="row q-gutter-x-sm">
          <q-btn dense outline color="primary" icon="add" label="라인추가" :disable="!isShowSaveBtn" @click="addDataDetailsRowSection('next')" />
          <q-btn dense outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow" />
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

const searchParam = reactive({
  divCd: '',
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
  currentYearMonth.value = commUtil.getTodayYear() + '/' + commUtil.getTodayMonth();
  getDataCommOption('302').then(() => {
    getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
      onDateClick(currentDate.value);
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
    headerName: '입고일',
    field: 'buyDay',
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
  },
  {
    headerName: '입고처',
    field: 'custNm',
    minWidth: 150,
  },
  {
    headerName: '코드',
    field: 'custCd',
    minWidth: 80,
    maxWidth: 80,
  },

  {
    headerName: '건수',
    field: 'totSeq',
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
    field: 'totQty',
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
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
  },
]);

const buyFgOptions = ref([]);
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
    field: 'buyFg',
    cellEditor: 'agSelectCellEditor',
    maxWidth: 70,
    minWidth: 70,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
    cellEditorParams: () => {
      return {
        values: buyFgOptions.value.map(option => option.commCd), // 최신 값을 동적으로 반영
      };
    },
    cellRenderer: params => {
      const option = buyFgOptions.value.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
    valueFormatter: params => {
      const option = buyFgOptions.value.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 150,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
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
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
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
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
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
    field: 'buyYul',
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
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
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
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
]);

const oldFormData = ref(null);
const formData = ref(null);

const formDataInitialize = () => {
  formData.value = {
    buyDay: '',
    seq: '',
    custCd: '',
    custNm: '',
    divCd: '1',
    remarks: '',
    iuD: 'I',
  };
};

const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const secondFocus = ref(null);
const addDataSection = () => {
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
        formData.value.buyDay = currentDate.value;

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
  formData.value.buyDay = commUtil.unFormatDate(formData.value.buyDay);

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
    if (isSaveFg.value === 'U' && formData.value.buyDay !== oldFormData.value.buyDay) {
      saveDataInsertDelete();
    } else {
      // Detail 자료 분류작업
      let iu = [];
      let iuD = [];

      // 신규 수정 자료정리
      for (let i = 0; i < rowData.details.length; i++) {
        if (!isEmpty(rowData.details[i].prodCd)) {
          if (rowData.details[i].iuD === 'I' || rowData.details[i].iuD === 'U') {
            rowData.details[i]['buyDay'] = commUtil.unFormatDate(formData.value.buyDay);
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
        rowData.details[i]['buyDay'] = commUtil.unFormatDate(formData.value.buyDay);
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
    const res = await api.post('/api/sal/sal1010_save', resFormData);
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
    const response = await api.post('/api/sal/sal1010_list_event', {
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
    const response = await api.post('/api/sal/sal1010_list_search', {
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
    const response = await api.post('/api/sal/sal1010_list_header', {
      paramBuyDay: commUtil.unFormatDate(currentDate.value),
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
    const response = await api.post('/api/sal/sal1010_maxSeqCheck', {
      paramBuyDay: commUtil.unFormatDate(currentDate.value),
    });
    return response.data.data[0].maxSeq;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resData => {
  try {
    const response = await api.post('/api/sal/sal1010_select_header', {
      paramBuyDay: commUtil.unFormatDate(resData.buyDay),
      paramSeq: resData.seq,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.buyDay = commUtil.formatDate(response.data.data[0].buyDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getDataSelectList = async resData => {
  try {
    const response = await api.post('/api/sal/sal1010_select_list_details', {
      paramBuyDay: commUtil.unFormatDate(resData.buyDay),
      paramSeq: resData.seq,
    });
    rowData.details = response.data.data;
    rowDataOrdBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGridDetails.value.api.setGridOption('rowData', rowData.details);
    myGridDetails.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '302':
        buyFgOptions.value = response.data.data;
        break;
      default:
        buyFgOptions.value = [];
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
      return 40;
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
      isSaveFg.value = 'U';
      isShowSaveBtn.value = true;
      isShowStatusEdit.value = true;
      statusEdit.icon = 'edit_note';
      statusEdit.message = '수정/삭제모드 입니다';
      statusEdit.color = 'accent';
      formDisable.value = false;
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
  buyFg: 'prodNm',
  prodNm: 'qty',
  qty: 'price',
  price: 'buyYul',
  buyYul: 'amt',
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
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 40;
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
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    if (searchParam.calcuFg && (event.column.colId === 'qty' || event.column.colId === 'price')) {
      const qty = parseFloat(event.data.qty) || 0;
      const price = parseFloat(event.data.price) || 0;
      event.data.amt = qty * price; // Calculate the new amount
      event.api.refreshCells({
        rowNodes: [event.node],
        force: true,
        columns: ['amt'], // Refresh the 'amt' column
      });
    }

    const backData = rowDataOrdBack.value.filter(item => item.cnt === event.data.cnt);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
    // console.log('rowData :: ', JSON.stringify(rowData.details));

    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
  },

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
      paramCloseDay: commUtil.unFormatDate(formData.value.buyDay),
    },
  })
    .onOk(res => {
      formData.value.custCd = res.custCd;
      formData.value.custNm = res.custNm;
      setTimeout(() => {
        secondFocus.value.focus();
      }, 200);
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
      paramCloseDay: commUtil.unFormatDate(formData.value.buyDay),
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
    buyDay: formData.value.buyDay,
    seq: formData.value.seq,
    cnt: maxCnt.value,
    custCd: formData.value.custCd,
    divCd: '1',
    buyFg: '',
    prodCd: '',
    prodNm: '',
    qty: 0,
    price: 0,
    amt: 0,
    buyYul: 0,
    remarks: '',
    iuD: 'I',
  };
  rowData.details.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGridDetails.value.api.setRowData(rowData.details);
  // 첫컬럼에 focus
  myGridDetails.value.api.setFocusedCell(newRowIndex, 'buyFg');
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
</script>

<style lang="sass" scoped></style>
