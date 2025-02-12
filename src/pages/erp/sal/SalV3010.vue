<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
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
    <q-separator class="q-mb-sm" color="cyan" size="0.2rem" />

    <q-card class="">
      <q-toolbar class="">
        <div class="row q-gutter-lg">
          <q-input stack-label readonly v-model="searchValue.yymm" label="매출년월" label-color="orange" style="width: 130px" class="text-subtitle1">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer q-pt-md" @click="beforeYymm = null" />
            </template>
            <q-popup-proxy v-model="showDatePopup" transition-show="scale" transition-hide="scale">
              <q-date
                minimal
                v-model="searchValue.yymm"
                mask="YYYY년 MM월"
                type="month"
                color="orange"
                default-view="Years"
                options-override="month"
                @navigation="onNavigation('yymm', $event)"
              />
            </q-popup-proxy>
          </q-input>

          <q-input
            stack-label
            bottom-slots
            label-color="orange"
            v-model="searchValue.textValue"
            label="검색"
            class="q-pb-none"
            style="width: 150px"
            @keyup.enter="getData"
          >
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" class="cursor-pointer" />
            </template>
          </q-input>
          <q-btn outline class="self-end" color="grey" icon="refresh" label="다시불러오기" @click="getData" />
        </div>
        <q-space />
        <div class="row q-gutter-sm self-end">
          <div class="q-gutter-xs">
            <q-btn outline color="primary" icon="add" label="라인추가" @click="addDataDetailsRowSection('first')" />
            <q-btn outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow">
              <q-badge v-show="removeRowsCount > 0" color="red" floating>{{ removeRowsCount }}</q-badge>
            </q-btn>
          </div>
          <div class="q-gutter-xs">
            <q-btn outline color="primary" icon="save" label="저장" @click="saveDataSection">
              <q-badge v-show="saveRowsCount + delRowsCount > 0" color="red" floating>{{ saveRowsCount + delRowsCount }}</q-badge>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
      <!--  end of contents list title bar -->
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-x-sm">
          <div :class="billUse ? 'col-9' : 'col-12'" :style="contentZoneStyle">
            <ag-grid-vue
              ref="myGrid"
              style="width: 100%; height: 100%"
              :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
              :grid-options="gridOptions"
              @compositionstart="handleComposition"
              @compositionend="handleComposition"
              @compositionupdate="handleComposition"
            >
            </ag-grid-vue>
          </div>
          <div class="col-3">
            <q-card bordered>
              <q-bar class="q-px-sm">
                <q-icon name="list_alt" />
                <span class="text-subtitle2 q-px-sm">어음정보 등록조정</span>
                <q-space />
                <span v-if="isSaveFg === 'I'" class="text-caption text-blue">신규모드입니다</span>
                <span v-else class="text-caption text-orange">수정모드입니다</span>
              </q-bar>
              <q-card-actions>
                <q-toolbar class="row">
                  <q-field square outlined label="전표연결번호" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">
                        {{ commUtil.unFormatDate(formData.accDay) }}-{{ formData.seq }}
                      </div>
                    </template>
                  </q-field>
                  <q-space />
                  <div class="q-gutter-x-sm">
                    <q-btn outline icon="save" label="저장" color="primary" @click="saveDataBillSection" />
                    <q-btn outline icon="delete" label="삭제" color="negative" :disable="isSaveFg === 'I'" @click="deleteDataBillSection" />
                  </div>
                </q-toolbar>
              </q-card-actions>
              <q-separator />
              <q-card-section>
                <div class="q-pa-md q-gutter-y-sm">
                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      ref="startFocus"
                      stack-label
                      class="col-xs-6 col-sm-6 text-subtitle1"
                      v-model="formData.billNo"
                      label="어음번호"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />

                    <q-select
                      stack-label
                      class="col-xs-6 col-sm-6"
                      :readonly="formDisable"
                      v-model="formData.divCd"
                      :options="searchValue.divCdOptions"
                      label="유형"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      option-value="commCd"
                      option-label="commNm"
                      options-dense
                      emit-value
                      map-options
                    />
                  </div>

                  <q-input
                    stack-label
                    class="text-subtitle1"
                    :dense="dense"
                    v-model="formData.pubComp"
                    label="발행처"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :readonly="formDisable"
                  />

                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.pubNm"
                      label="발행인"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />

                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.pubDay"
                      type="date"
                      label="발행일자"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />
                  </div>

                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.recDay"
                      type="date"
                      label="받은일"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />

                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.payDay"
                      type="date"
                      label="지급일"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />
                  </div>

                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.payBank"
                      label="지급은행"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />

                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.payPoint"
                      label="지급지점"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />
                  </div>

                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.payComp"
                      label="지급처"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />
                  </div>

                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.endDay"
                      type="date"
                      label="만기일"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />

                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formattedBillAmt"
                      label="발행금액"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                      @input="val => updateNumberValue('billAmt', val)"
                    />
                  </div>

                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formData.yul"
                      label="할인율"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                    />

                    <q-input
                      stack-label
                      class="col-xs-6 col-sm-6"
                      v-model="formattedYulAmt"
                      label="할인금액"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :readonly="formDisable"
                      @input="val => updateNumberValue('yulAmt', val)"
                    />
                  </div>

                  <q-input
                    stack-label
                    v-model="formData.remarks"
                    label="참고사항"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :readonly="formDisable"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
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
import CompHelpCustButton from 'components/CompHelpCustButton.vue';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);
const billUse = ref(false);

const showDatePopup = ref(false);
const maxSeq = ref(0);
const beforeYymm = ref(null);
const onNavigation = (fg, date) => {
  searchValue[fg] = date.year + '년 ' + commUtil.getDataWithZero(date.month, 2) + '월';

  if (!beforeYymm.value) {
    showDatePopup.value = false;
    beforeYymm.value = date;
  } else {
    beforeYymm.value = date;
  }
};

const searchValue = reactive({
  year: commUtil.getTodayYear(),
  month: commUtil.getTodayMonth(),
  yymm: commUtil.getTodayYear() + '년 ' + commUtil.getTodayMonth() + '월',
  textValue: '',
  divCdOptions: [],
});

const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 230}px`,
}));

const rowData = reactive({ rows: [] });
const rowDataOrdBack = ref([]);
const selectedRows = reactive({ rows: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  formDataInitialize();
  getDataCommOption('311').then(() => {
    getData();
  });
});

const dateGetter = (params, field) => {
  const dateStr = params.data[field];
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

// 편집 후 데이터를 저장할 때
const dateSetter = (params, field) => {
  const dateStr = params.newValue.replace(/-/g, '');
  if (dateStr.length === 8) {
    params.data[field] = dateStr;
    return true;
  }
  return false;
};

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const accFgOptions = ref([
  { commNm: '현금', commCd: '1' },
  { commNm: '어음', commCd: '2' },
  { commNm: '은행', commCd: '3' },
  { commNm: '카드', commCd: '4' },
  { commNm: '공제', commCd: '5' },
  { commNm: '기타', commCd: '9' },
]);

const columnDefs = ref([
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
    headerName: '입금일',
    field: 'accDay',
    minWidth: 130,
    maxWidth: 130,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    // valueFormatter: params => dateGetter(params, 'ordDay'),
    valueGetter: params => dateGetter(params, 'accDay'),
    valueSetter: params => dateSetter(params, 'accDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '거래처명',
    field: 'custNm',
    minWidth: 150,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '코드',
    field: 'custCd',
    minWidth: 110,
    maxWidth: 110,
    editable: false,
    cellRendererSelector: params => {
      // 조건에 따라 cellRenderer 설정
      if (!params.node.rowPinned) {
        return {
          component: CompHelpCustButton,
          params: {
            updateSelectedValue: selectedParams => {
              params.node.setDataValue('prodNm', selectedParams.custNm);
              params.node.setDataValue('prodCd', selectedParams.custCd);
            },
          },
        };
      }
      // 조건에 맞지 않으면 cellRenderer를 사용하지 않음
      return null;
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
    headerName: '구분',
    field: 'accFg',
    cellEditor: 'agSelectCellEditor',
    maxWidth: 70,
    minWidth: 70,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
    cellEditorParams: () => {
      return {
        values: accFgOptions.value.map(option => option.commCd), // 최신 값을 동적으로 반영
      };
    },
    cellRenderer: params => {
      const option = accFgOptions.value.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
    },
    valueFormatter: params => {
      const option = accFgOptions.value.find(opt => opt.commCd === params.value);
      return option ? option.commNm : params.value;
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
    billNo: '',
    divCd: '',
    pubComp: '',
    pubNm: '',
    pubDay: '',
    recDay: '',
    payDay: '',
    payBank: '',
    payPoint: '',
    payComp: '',
    endDay: '',
    billAmt: 0,
    yul: 0,
    yulAmt: 0,
    remarks: '',
    iuD: 'I',
    accDay: '00000000',
    seq: '0',
  };
};

const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const secondFocus = ref(null);

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
      for (let i = 0; i < selectedRows.rows.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.rows[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
        if (val.rtn === '0') {
          getData();
        }
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  if (isEqual(rowData.rows, rowDataOrdBack.value) && selectedRows.rows.length === 0) {
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
    // Detail 자료 분류작업
    let iu = [];
    let iuD = [];

    // 신규 수정 자료정리
    for (let i = 0; i < rowData.rows.length; i++) {
      if (!isEmpty(rowData.rows[i].custCd)) {
        if (rowData.rows[i].iuD === 'I' || rowData.rows[i].iuD === 'U') {
          let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
          iu.push(tmpJson);
        }
      }
    }

    // 삭제 자료정리
    for (let i = 0; i < selectedRows.rows.length; i++) {
      if (selectedRows.rows[i].iuD === 'R' || selectedRows.rows[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.rows[i]) + '}';
        iuD.push(tmpJson);
      }
    }

    saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
      if (val.rtn === '0') {
        getData();
      }
    });
  }
};
const saveDataBillSection = () => {
  formData.value.pubDay = commUtil.unFormatDate(formData.value.pubDay);
  formData.value.recDay = commUtil.unFormatDate(formData.value.recDay);
  formData.value.payDay = commUtil.unFormatDate(formData.value.payDay);
  formData.value.endDay = commUtil.unFormatDate(formData.value.endDay);
  formData.value.accDay = commUtil.unFormatDate(formData.value.accDay);

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
    isSaveFg.value = isSaveFg.value === 'R' ? 'U' : isSaveFg.value;
    const saveData = jsonUtil.dataJsonParse('no1', isSaveFg.value, formData.value);
    // console.log('save : ', isSaveFg.value, JSON.stringify(saveData));
    saveDataBillAndHandleResult(saveData).then(val => {
      billUse.value = false;
    });
  }
};

const deleteDataBillSection = () => {
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
      const saveData = jsonUtil.dataJsonParse('no1', 'D', formData.value);
      saveDataBillAndHandleResult(saveData).then(val => {
        if (val.rtn === '0') {
          getData();
        }
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/sal/sal3010_save', resFormData);
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

const saveDataBillAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/sal/sal3010_save_bill', resFormData);
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
const getData = async () => {
  const match = searchValue.yymm.match(/^(\d{4})년 (\d{1,2})월$/);
  if (match) {
    searchValue.year = match[1]; // 추출된 년도
    searchValue.month = String(match[2]).padStart(2, '0'); // 추출된 월 및 2자리로 패딩
    try {
      const response = await api.post('/api/sal/sal3010_list', {
        paramYear: searchValue.year,
        paramMonth: searchValue.month,
        paramValue: searchValue.textValue,
      });
      rowData.rows = response.data.data;
      rowDataOrdBack.value = JSON.parse(JSON.stringify(response.data.data));
      myGrid.value.api.setGridOption('rowData', rowData.rows);
      myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);

      maxSeq.value = 0;
      if (rowData.rows.length > 0) {
        // 제일 큰 일렴번호 추출
        const maxSeqRow = rowData.rows.reduce((maxRow, row) => (row.seq > maxRow.seq ? row : maxRow), rowData.rows[0]);
        maxSeq.value = maxSeqRow.seq;
      }

      saveRowsCount.value = 0;
      removeRowsCount.value = 0;
      delRowsCount.value = 0;
      isSaveFg.value = null;
      billUse.value = false;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  } else {
    console.log('Invalid date format');
  }
};

const getDataBill = async resData => {
  try {
    const response = await api.post('/api/sal/sal3010_select_bill', {
      paramAccDay: resData.accDay,
      paramSeq: resData.seq,
      // paramBillSeq: resData.billSeq,
    });

    if (response.data.data.length > 0) {
      isSaveFg.value = 'U';
      formData.value = response.data.data[0];
      oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
      formData.value.accDay = commUtil.formatDate(formData.value.accDay);
      formData.value.pubDay = commUtil.formatDate(formData.value.pubDay);
      formData.value.recDay = commUtil.formatDate(formData.value.recDay);
      formData.value.payDay = commUtil.formatDate(formData.value.payDay);
      formData.value.endDay = commUtil.formatDate(formData.value.endDay);
    } else {
      formDataInitialize();
      isSaveFg.value = 'I';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '311':
        searchValue.divCdOptions = response.data.data;
        break;
      default:
        searchValue.divCdOptions = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    custNm: '합계',
    amt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.amt += row.amt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝
// *********************************
const composing = ref(false);
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  accDay: 'custNm',
  custNm: 'amt',
  amt: 'accFg',
  accFg: 'remarks',
};

const saveRowsCount = ref(0);
const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  // dateComponentParams: {
  //   dateFormat: 'YYYY-MM-DD', // 달력에서 사용하는 날짜 형식
  // },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  // enableColResize: false,
  // enableSorting: true,
  // enableFilter: false,
  // enableRangeSelection: true,
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
    if (composing.value && event.key === 'Enter') {
      event.preventDefault();
    }
    if (event.column.colId === 'custNm' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);

    // 거래처명 입력부분
    if (event.column.colId === 'custNm' && eventKey.value === 'Enter') {
      //     // 중복 이벤트 방지
      if (processedEventKey === eventKey.value) {
        processedEventKey = null;
        return;
      }
      processedEventKey = eventKey.value;
      // 중복 이벤트 방지 끝
      openHelpCustDialog(event);
    } // 거래처명 입력부분 끝

    // 기타사항 입력부분
    if (event.column.colId === 'remarks' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      if (processedEventKey === eventKey.value) {
        processedEventKey = null;
        return;
      }
      addDataDetailsRowSection('first');
      processedEventKey = eventKey.value;
      return;
    } // 기타사항 입력부분 끝

    const nextColumn = columnFocusMap[event.column.colId];
    if (nextColumn) {
      myGrid.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
    }

    // console.log('rowData : ', JSON.stringify(rowData.rows));
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    saveRowsCount.value = rowData.rows.filter(row => row.iuD === 'I' || row.iuD === 'U').length;
    if (event.data.accFg === '2') {
      getDataBill(event.data).then(() => {
        if (isSaveFg.value === 'I') {
          formData.value.pubDay = commUtil.formatDate(event.data.accDay);
          formData.value.pubComp = event.data.custNm;
          formData.value.accDay = event.data.accDay;
          formData.value.seq = event.data.seq;
          formData.value.billAmt = event.data.amt;
        }
        formDisable.value = false;
        billUse.value = true;
      });
    } else {
      formDataInitialize();
      isSaveFg.value = null;
      billUse.value = false;
    }
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
    // event.api.startEditingCell({
    //   rowIndex: event.rowIndex,
    //   colKey: event.column.getId(),
    // });
    // if (event.column.colId === 'accFg' && event.data.accFg === '2') {
    //   console.log('data: ', JSON.stringify(event.data));
    //   getDataBill(event.data).then(() => {
    //     formDisable.value = false;
    //     isDialogVisible.value = true;
    //   });
    // }
  },
  // isRowSelectable: node => !node.footer,
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.rows = event.api.getSelectedRows();
    // isShowSaveBtn.value = selectedRows.details.length > 0;
    removeRowsCount.value = selectedRows.rows.filter(row => row.iuD === 'I').length;
    delRowsCount.value = selectedRows.rows.filter(row => row.iuD !== 'I').length;
    // console.log('count : ', removeRowsCount.value, delRowsCount.value);
    // const selRow = selectedRows.details.filter(row => row.iuD !== 'I');
    // rowData.rows = rowData.rows.filter(row => !delRow.some(del => del.iuD === row.iuD));

    // 그리드에 변경된 데이터 적용
    // event.api.setRowData(rowData.rows);
    // selectedRows.details = selRow;
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged : ', event.column.colId, event.data.accFg);

    if (event.column.colId === 'accFg') {
      if (event.data.accFg === '2') {
        getDataBill(event.data).then(() => {
          if (isSaveFg.value === 'I') {
            formData.value.pubDay = commUtil.formatDate(event.data.accDay);
            formData.value.pubComp = event.data.custNm;
            formData.value.accDay = event.data.accDay;
            formData.value.seq = event.data.seq;
            formData.value.billAmt = event.data.amt;
          }
          formDisable.value = false;
          billUse.value = true;
        });
      } else {
        billUse.value = false;
      }
    }

    const backData = rowDataOrdBack.value.filter(item => item.accDay === event.data.accDay && item.seq === event.data.seq);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }

    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
  },
  // getRowNodeId: function (data) {
  //   return null;
  // },
  // 리드 상단 고정
  // setPinnedTopRowData: function (data) {
  //   return null;
  // },
  // 그리드 하단 고정
  // setPinnedBottomRowData: function (data) {
  //   return null;
  // },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};
const handleComposition = event => {
  if (event.type === 'compositionstart') {
    composing.value = true;
    // console.log('Korean IME composition started');
  } else if (event.type === 'compositionend') {
    composing.value = false;
    // console.log('Korean IME composition ended');
  }
};

/* *** 코드헬프부분 ** */
const openHelpCustDialog = event => {
  $q.dialog({
    component: HelpCust,
    componentProps: {
      paramValueNm: event.data.custNm,
      paramUseYn: 'N',
      paramCloseDay: commUtil.unFormatDate(formData.value.buyDay),
    },
  })
    .onOk(res => {
      event.node.setDataValue('custNm', res.custNm);
      event.node.setDataValue('custCd', res.custCd);
      myGrid.value.api.setFocusedCell(event.node.rowIndex, 'amt');
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

/** **** 그리드 Detail 편집부분 ****/

const rowIndex = ref(0);
const addDataDetailsRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGrid.value.api.getDisplayedRowCount();
  }
  maxSeq.value++;
  const newItems = {
    accDay: commUtil.unFormatDate(commUtil.getToday()),
    oldAccDay: '',
    seq: maxSeq.value,
    oldSeq: 0,
    accFg: '',
    custCd: '',
    custNm: '',
    amt: 0,
    remarks: '',
    iuD: 'I',
  };
  // console.log('newItems : ', newRowIndex, maxSeq.value, JSON.stringify(newItems));
  rowData.rows.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setGridOption('rowData', rowData.rows);
  // myGrid.value.api.updateGridOptions({ rowData: rowData.rows });
  // 첫컬럼에 focus
  setTimeout(() => {
    myGrid.value.api.setFocusedCell(newRowIndex, 'accDay');
  }, 200);
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  // 선택된 행을 제거
  // rowData.rows = rowData.rows.filter(row => !selectedData.includes(row));
  rowData.rows = rowData.rows.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));

  // 그리드 데이터 갱신
  myGrid.value.api.setGridOption('rowData', rowData.rows);
};

const formattedBillAmt = formattedNumberValue('billAmt');
const formattedYulAmt = formattedNumberValue('yulAmt');
function formattedNumberValue(key) {
  return computed({
    get() {
      return formData.value[key].toLocaleString(); // 3자리 콤마
    },
    set(value) {
      formData.value[key] = Number(value.replace(/,/g, '')) || 0; // 콤마 제거 후 숫자로 변환
    },
  });
}
const updateNumberValue = (key, value) => {
  formData.value[key] = Number(value.replace(/,/g, '')) || 0;
};
</script>

<style lang="sass" scoped></style>
