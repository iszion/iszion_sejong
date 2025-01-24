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

    <div class="row q-col-gutter-x-sm">
      <div class="col-12" :class="{ 'col-lg-6': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="">
            <q-icon name="list_alt" />
            <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
            <q-space />
            <q-btn
              class="q-pa-xs"
              rounded
              color="grey"
              text-color="black"
              dense
              size="0.4rem"
              @click="isScreenVisibleProcess"
              :icon="isScreenVisible ? 'open_in_full' : 'close_fullscreen'"
            >
              <q-tooltip class="bg-amber text-black shadow-4" anchor="center left" self="center right">
                <q-icon name="open_in_full" size="0.8rem" />
                <strong v-if="isClassActive"> 펼치기 </strong>
                <strong v-else> 축소하기 </strong>
              </q-tooltip>
            </q-btn>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions>
            <q-toggle
              class=""
              v-model="searchValue.useYn"
              false-value="N"
              true-value="Y"
              color="green"
              :label="searchValue.useYn === 'Y' ? '인세정보 등록된 자료만' : '등록안된 자료만'"
              @update:model-value="getData"
            />
            <q-toggle
              class=""
              v-model="searchValue.stopYn"
              false-value="N"
              true-value="Y"
              keep-color
              :color="searchValue.stopYn === 'Y' ? 'red' : 'blue'"
              :label="searchValue.stopYn === 'Y' ? '사용정지' : '사용중'"
              @update:model-value="getData"
            />
            <q-space />
            <q-input
              stack-label
              bottom-slots
              label-color="orange"
              v-model="searchValue.textValue"
              label="검색"
              dense
              class="q-pb-none"
              style="width: 120px"
              @keyup.enter="getData"
            >
              <template v-slot:append>
                <q-icon
                  v-if="searchValue.textValue !== ''"
                  name="close"
                  @click="searchValue.textValue = ''"
                  size="xs"
                  class="cursor-pointer q-pt-md"
                />
              </template>
            </q-input>
          </q-card-actions>
          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                ref="myGrid1"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptions1"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="isScreenVisible" class="col-6">
        <q-card bordered>
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
          </q-bar>
          <q-card-section class="q-pa-xs">
            <div style="height: 160px">
              <ag-grid-vue
                ref="myGrid2"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptions2"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn outline color="positive" @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
            <q-space />
            <q-btn v-if="isShowSaveBtn" outline color="primary" @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
            <q-btn v-if="isShowDeleteBtn" outline color="negative" @click="deleteDataSection"> <q-icon name="delete" size="xs" /> 삭제 </q-btn>
          </q-card-actions>
          <q-separator />
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-x-lg">
              <div class="col-6 row q-col-gutter-x-lg">
                <q-input
                  ref="firstFocus"
                  :dense="dense"
                  stack-label
                  class=""
                  v-model="formData.agentNm"
                  label="에이젠트명"
                  :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  :disable="formDisable"
                  @keyup.enter.prevent="openHelpAgentDialog(formData.agentNm)"
                >
                  <template v-slot:append>
                    <q-icon
                      size="0.8em"
                      v-if="formData.agentNm !== ''"
                      name="close"
                      @click="
                        formData.agentNm = '';
                        formData.agentCd = '';
                      "
                      class="cursor-pointer q-pt-md"
                    />
                    <q-icon size="0.8em" name="search" @click="openHelpAgentDialog('')" class="cursor-pointer q-pt-md" />
                  </template>
                </q-input>
                <q-input
                  stack-label
                  :dense="dense"
                  class="col-2"
                  v-model="formData.agentCd"
                  label="코드"
                  :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  readonly
                />
              </div>
              <div class="col-6">
                <q-toggle
                  :dense="dense"
                  :disable="formDisable"
                  class="q-pt-md"
                  label="사용정지"
                  left-label
                  color="pink"
                  false-value="N"
                  true-value="Y"
                  v-model="formData.stopYn"
                />
              </div>
            </div>
            <div class="row q-col-gutter-x-lg">
              <div class="col-6 row">
                <q-input
                  ref="secondFocus"
                  stack-label
                  :dense="dense"
                  class=""
                  v-model="formData.feesSday"
                  type="date"
                  label="계약기간"
                  :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  :disable="formDisable"
                >
                  <template v-slot:append>
                    <span class="q-pt-md q-pr-lg">~</span>
                  </template>
                </q-input>
                <q-input
                  stack-label
                  :dense="dense"
                  class="q-px-none"
                  v-model="formData.feesEday"
                  type="date"
                  label=""
                  :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  :disable="formDisable"
                >
                </q-input>
              </div>
              <div class="col-6 q-gutter-sm q-pt-md">
                <q-radio :dense="dense" :disable="formDisable" v-model="formData.calcFg" val="1" label="1년기준" />
                <q-radio :dense="dense" :disable="formDisable" v-model="formData.calcFg" val="2" label="상하분기" />
              </div>
            </div>
            <div class="row q-col-gutter-x-lg">
              <q-input
                stack-label
                class="col-6"
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

              <div class="col-6 q-gutter-sm q-pt-md">
                <q-radio :dense="dense" :disable="formDisable" v-model="formData.condFg" val="1" label="판매부수x(정가%)" />
                <q-radio :dense="dense" :disable="formDisable" v-model="formData.condFg" val="2" label="제작부수x(정가%)" />
              </div>
            </div>
          </q-card-section>

          <q-separator class="q-mt-md" />

          <q-card-actions class="justify-end">
            <div class="row q-gutter-x-sm">
              <q-btn dense outline color="primary" icon="add" label="라인추가" :disable="!isShowSaveBtn" @click="addDataDetailsRowSection('next')" />
              <q-btn dense outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow" />
            </div>
          </q-card-actions>
          <q-card-section class="q-pa-xs">
            <div style="height: 250px">
              <ag-grid-vue
                ref="myGrid3"
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :grid-options="gridOptions3"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
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
import { createRouter as Vue } from 'vue-router/dist/vue-router.esm-browser.prod';
import JsonUtil from 'src/js_comm/json-util';
import HelpAgent from 'components/subvue/HelpAgent.vue';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);

const searchValue = reactive({
  textValue: '',
  useYn: 'Y',
  stopYn: 'N',
});

const isScreenVisible = ref(true);
const isClassActive = ref(true);
const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};

const formDisable = ref(true);

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 260}px`,
}));

const selectedRows = reactive({ rowsList: [], details: [] });
const rowData = reactive({ rows: [], rowsList: [], header: {}, details: [] });
const rowDataDetailsBack = ref([]);
const oldFormData = ref(null);
const formData = ref(null);

const formDataInitialize = () => {
  formData.value = {
    prodCd: '',
    agentCd: '',
    agentNm: '',
    feesSday: '',
    feesEday: '',
    feesFg: '1',
    calcFg: '',
    condFg: '',
    stopYn: 'N',
    remarks: '',
    iuD: 'I',
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
  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs1 = ref([
  {
    headerName: '#',
    minWidth: 70,
    maxWidth: 70,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '등록수',
    field: 'hCnt',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueFormatter: dateFormatter,
    minWidth: 90,
    maxWidth: 90,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 200,
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 80,
    maxWidth: 80,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '정가',
    field: 'sPrice',
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
  },
  {
    headerName: '에이젠트',
    field: 'agentNm',
    minWidth: 100,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '저자명',
    field: 'authorNm',
    minWidth: 200,
  },
]);

const columnDefs2 = ref([
  {
    headerName: '#',
    minWidth: 70,
    maxWidth: 70,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      // Customize row numbers as needed
      return params.node.rowIndex + 1;
    },
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '에이젠트',
    field: 'agentNm',
    minWidth: 200,
  },
  {
    headerName: '코드',
    field: 'agentCd',
    minWidth: 90,
    maxWidth: 90,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
  {
    headerName: '계약기간',
    children: [
      {
        headerName: '시작일',
        field: 'feesSday',
        valueFormatter: dateFormatter,
        minWidth: 120,
        maxWidth: 120,
        cellStyle: () => {
          return {
            textAlign: 'center',
          };
        },
      },
      {
        headerName: '종료일',
        field: 'feesEday',
        valueFormatter: dateFormatter,
        minWidth: 120,
        maxWidth: 120,
        cellStyle: () => {
          return {
            textAlign: 'center',
          };
        },
      },
    ],
  },
  {
    headerName: '정산범위',
    field: 'calcFg',
    minWidth: 100,
    maxWidth: 100,
    cellStyle: () => {
      return {
        textAlign: 'center',
      };
    },
  },
]);

const buyFgOptions = ref([]);
const columnDefs3 = ref([
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
    headerName: 'No',
    field: '',
    minWidth: 70,
    maxWidth: 70,
    editable: false,
    filter: false,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '출고부수(이상)',
    field: 'baseQty',
    minWidth: 140,
    maxWidth: 140,
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
    headerName: '인세율%',
    field: 'baseYul',
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
    headerName: '금액',
    field: 'baseAmt',
    minWidth: 150,
    maxWidth: 150,
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

const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const firstFocus = ref(null);
const secondFocus = ref(null);
const addDataSection = () => {
  formDataInitialize();
  oldFormData.value = null;
  isSaveFg.value = 'I';
  isShowSaveBtn.value = true;
  isShowDeleteBtn.value = false;
  formDisable.value = false;
  formData.value.stopYn = 'N';
  formData.value.condFg = '1';
  formData.value.calcFg = '1';

  rowData.details = [];
  myGrid3.value.api.setRowData([]);
  myGrid3.value.api.hideOverlay(); // 로딩 오버레이 제거

  setTimeout(() => {
    firstFocus.value.focus();
  }, 100);
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
      let tmpJson = '{"mode":"D","data":' + JSON.stringify(formData.value) + '}';
      iuD.push(tmpJson);
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
        if (val.rtn === '0') {
          formScreenReset();
          rowData.details = [];
          myGrid3.value.api.setRowData([]);
        }
      });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  if (isEqual(formData.value, oldFormData.value) && isEqual(rowData.details, rowDataDetailsBack.value) && selectedRows.details.length === 0) {
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
    console.log('data : ', JSON.stringify(rowData.details));
    // 신규 수정 자료정리
    for (let i = 0; i < rowData.details.length; i++) {
      if (rowData.details[i].baseQty > 0) {
        if (rowData.details[i].iuD === 'I' || rowData.details[i].iuD === 'U') {
          rowData.details[i]['prodCd'] = formData.value.prodCd;
          rowData.details[i]['agentCd'] = formData.value.agentCd;
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
    formData.value.feesSday = commUtil.unFormatDate(formData.value.feesSday);
    formData.value.feesEday = commUtil.unFormatDate(formData.value.feesEday);

    const obj_no1 = jsonUtil.dataJsonParse('no1', isSaveFg.value, formData.value);
    const _obj_no1 = obj_no1.slice(1, -1); // 앞뒤 {} 제거

    // Detail 자료 정리
    const obj_no2 = JSON.stringify(JsonUtil.jsonFiller('no2', iu, iuD));
    const _obj_no2 = obj_no2.slice(1, -1); // 앞뒤 {} 제거

    const saveData = '{' + _obj_no1 + ',' + _obj_no2 + '}'; // 제거된 object 하나로 묶기
    console.log('save : ', JSON.stringify(saveData));
    saveDataAndHandleResult(saveData).then(val => {
      handleGetData(selectedRows.rowsList[0]);
    });
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/fee/fee1010_save', resFormData);
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

const getData = async () => {
  try {
    const response = await api.post('/api/fee/fee1010_list', {
      paramUseYn: searchValue.useYn,
      paramStopYn: searchValue.stopYn,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid1.value.api.updateGridOptions({ rowData: rowData.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSelect = async resProdCd => {
  try {
    const response = await api.post('/api/fee/fee1010_select_list', {
      paramProdCd: resProdCd,
    });
    rowData.rowsList = response.data.data;
    myGrid2.value.api.updateGridOptions({ rowData: rowData.rowsList });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelectHeader = async resData => {
  try {
    const response = await api.post('/api/fee/fee1010_select_header', {
      paramProdCd: resData.prodCd,
      paramAgentCd: resData.agentCd,
    });
    // console.log('header : ', JSON.stringify(response.data.data));
    formData.value = response.data.data;
    formData.value.feesSday = commUtil.formatDate(formData.value.feesSday);
    formData.value.feesEday = commUtil.formatDate(formData.value.feesEday);
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getDataSelectDetails = async resData => {
  try {
    const response = await api.post('/api/fee/fee1010_select_details', {
      paramProdCd: resData.prodCd,
      paramAgentCd: resData.agentCd,
    });
    // console.log('details : ', JSON.stringify(response.data.data));
    rowData.details = response.data.data;
    rowDataDetailsBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid3.value.api.updateGridOptions({ rowData: rowData.details });
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

const myGrid1 = ref(null);
const gridOptions1 = {
  columnDefs: columnDefs1.value,
  rowData: rowData.list,
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
  getRowStyle: function (event) {
    if (event.data.stopYn === 'Y') {
      return { color: 'red' };
      // return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    // if (param.node.rowPinned) {
    //   return 40;
    // }
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
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    getDataSelect(event.data.prodCd).then(() => {
      if (rowData.rowsList.length > 0) {
        myGrid2.value.api.getDisplayedRowAtIndex(0).setSelected(true);
        selectedRows.rowsList = myGrid2.value.api.getSelectedRows();
        // console.log('sel : ', JSON.stringify(selectedRows.rowsList));
        handleGetData(selectedRows.rowsList[0]);
      } else {
        formScreenReset();
        rowData.details = [];
        myGrid3.value.api.setRowData([]);
      }
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
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};

const myGrid2 = ref(null);
const gridOptions2 = {
  columnDefs: columnDefs2.value,
  rowData: rowData.rowsList,
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
    // if (param.node.rowPinned) {
    //   return { 'font-weight': 'bold', background: '#dddddd' };
    // }
    // return { 'text-align': 'left' };
  },
  headerHeight: 25, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    // if (param.node.rowPinned) {
    //   return 40;
    // }
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
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    handleGetData(event.data);
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
    selectedRows.rowsList = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },

  debug: false,
};

const handleGetData = data => {
  getDataSelectHeader(data).then(() => {
    getDataSelectDetails(data).then(() => {
      isSaveFg.value = 'U';
      isShowSaveBtn.value = true;
      isShowDeleteBtn.value = true;
      formDisable.value = false;
    });
  });
};
const formScreenReset = () => {
  isSaveFg.value = '';
  isShowSaveBtn.value = false;
  isShowDeleteBtn.value = false;
  formDisable.value = true;
  formDataInitialize();
  rowData.details = [];
  myGrid3.value.api.updateGridOptions({ rowData: rowData.details });
};

// *********************************
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  baseQty: 'baseYul',
  baseYul: 'baseAmt',
  baseAmt: 'remarks',
};

const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGrid3 = ref(null);
const gridOptions3 = {
  columnDefs: columnDefs3.value,
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
    // if (param.node.rowPinned) {
    //   return { 'font-weight': 'bold', background: '#dddddd' };
    // }
    // return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    // if (param.node.rowPinned) {
    //   return 40;
    // }
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
    if (event.column.colId === 'remarks' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      processedEventKey = null;
      addDataDetailsRowSection('next');
    } else {
      const nextColumn = columnFocusMap[event.column.colId];
      console.log('next : ', nextColumn);
      if (nextColumn) {
        myGrid3.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
      }
    }
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  // isRowSelectable: node => !node.footer,
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.details = event.api.getSelectedRows();
    removeRowsCount.value = selectedRows.details.filter(row => row.iuD === 'I').length;
    delRowsCount.value = selectedRows.details.filter(row => row.iuD !== 'I').length;
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
    const backData = rowDataDetailsBack.value.filter(item => item.seq === event.data.seq);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
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

// 공통 업데이트 함수
function updateValue(key, value) {
  formData.value[key] = Number(value.replace(/,/g, '')) || 0;
}
// 포맷된 값을 관리하는 computed 끝

/* *** 코드헬프부분 ** */
const openHelpAgentDialog = resNm => {
  $q.dialog({
    component: HelpAgent,
    componentProps: {
      paramValueNm: resNm,
      paramCloseDay: commUtil.unFormatDate(formData.value.makeDay),
    },
  })
    .onOk(res => {
      formData.value.agentCd = res.agentCd;
      formData.value.agentNm = res.agentNm;
    })
    .onCancel(() => {})
    .onDismiss(() => {});
  secondFocus.value.focus();
};

/** **** 그리드 Detail 편집부분 ****/
const maxCnt = ref(0);
const rowIndex = ref(0);
const addDataDetailsRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGrid3.value.api.getDisplayedRowCount();
  }
  // const addIndex = rowIndex.value;
  const newItems = {
    prodCd: '',
    agentCd: '',
    seq: 0,
    baseQty: 0,
    baseYul: 0,
    baseAmt: 0,
    remarks: '',
    iuD: 'I',
  };
  rowData.details.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid3.value.api.setRowData(rowData.details);
  // 첫컬럼에 focus
  myGrid3.value.api.setFocusedCell(newRowIndex, 'baseQty');
};

const nextGridEdit = () => {
  rowIndex.value = 0;
  addDataDetailsRowSection('next');
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid3.value.api.getSelectedNodes();
  // const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  // console.log('selectedData : ', JSON.stringify(selectedData));

  // 선택된 행을 제거
  // rowData.details = rowData.details.filter(row => !selectedData.includes(row));
  rowData.details = rowData.details.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));
  // console.log('rowData : ', JSON.stringify(rowData.details));

  // 그리드 데이터 갱신
  myGrid3.value.api.setRowData(rowData.details);
};
</script>

<style lang="sass" scoped></style>
