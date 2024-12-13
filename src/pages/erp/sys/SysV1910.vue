<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-6': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">회사정보 리스트</span>
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
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <div class="row q-col-gutter-md">
                <q-input bottom-slots v-model="searchParam.word" label="검색" dense class="q-pb-none" style="width: 120px">
                  <template v-slot:append>
                    <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" dense @click="getData"><q-icon name="search" size="xs" /> 조회 </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> 삭제
                </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
              <ag-grid-vue
                style="width: 100%; height: 100%"
                :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                :columnDefs="columnDefs.columns"
                :rowData="rowData.rows"
                :defaultColDef="defaultColDef.def"
                :rowSelection="rowSelection"
                @selection-changed="onSelectionChanged"
                @grid-ready="onGridReady"
              >
              </ag-grid-vue>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-6">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">자료 조회/조정/삭제</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar class="row">
                <div class="q-gutter-xs"></div>
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <q-card flat bordered class="q-ma-xs q-pa-md">
                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input
                      ref="compCdFocus"
                      v-model="formData.compCd"
                      maxlength="5"
                      label="회사코드"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    >
                      <template v-slot:append>
                        <q-icon size="0.8em" name="done" class="cursor-pointer q-mt-lg">
                          <q-tooltip transition-show="rotate" transition-hide="rotate" class="bg-amber text-black shadow-4">
                            회사코드 중복체크
                          </q-tooltip>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 col-md-6"></div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.compNm" label="상호명(법인명)" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.compNmx" label="별칭명" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.repNm" label="대표자" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="formData.regNo"
                      mask="######-#######"
                      label="법인등록번호"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="formData.businNo"
                      mask="###-##-#####"
                      label="사업자등록번호"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.jongNo" maxlength="4" label="종사업장번호" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.businCond" label="업태" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.businKind" label="종목" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-md-4">
                    <q-input v-model="formData.businZip" label="우편번호" label-color="blue" color="blue" :disable="formDisable">
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.businZip !== ''"
                          name="close"
                          @click="formData.businZip = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openPostcodeSearch('1')" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row q-col-gutter-sm q-mb-lg">
                  <div class="col-12 col-md-8">
                    <q-input v-model="formData.businAddr1" label="사업장주소" label-color="blue" color="blue" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      ref="businAddr2Focus"
                      v-model="formData.businAddr2"
                      label="상세주소"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-md-4">
                    <q-input v-model="formData.postZip" label="우편번호" label-color="orange" color="orange" :disable="formDisable">
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.businZip !== ''"
                          name="close"
                          @click="formData.businZip = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-8">
                    <q-input v-model="formData.postAddr1" label="우편물주소" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      ref="postAddr2Focus"
                      v-model="formData.postAddr2"
                      label="우편물 상세주소"
                      label-color="orange"
                      color="orange"
                      :disable="formDisable"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.managerNm" label="업무담당자" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.mobile" label="휴대폰번호" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.tel" label="대표전화" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.fax" label="팩스" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-xl q-mb-lg">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.email" label="이메일" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.emailBill" label="이메일(홈텍스)" label-color="orange" color="orange" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-xl q-mb-lg">
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.tsDay" type="date" label="거래시작일" label-color="cyan" color="cyan" :disable="formDisable" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="formData.teDay" type="date" label="거래종료일" label-color="red" color="red" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-xl">
                  <div class="col-12">
                    <q-input
                      :disable="formDisable"
                      type="textarea"
                      v-model="formData.explains"
                      label="참고사항"
                      label-color="orange"
                      color="orange"
                      autogrow
                      counter
                      maxlength="30"
                      hint="30자까지 입력가능"
                    />
                  </div>
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->
    </div>
  </q-page>
  <q-dialog v-model="postViewVisible">
    <help-post :searchPost="searchPost" @setPostData="setPostData" />
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';
import HelpPost from 'pages/help/HelpPost.vue';
import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();

let isSaveFg = null;

const postViewVisible = ref(false);
const searchPost = ref('');
const setPostData = val => {
  // editData.value = val;
};
const businAddr2Focus = ref(null);
const postAddr2Focus = ref(null);
const openPostcodeSearch = resFg => {
  new window.daum.Postcode({
    oncomplete: data => {
      if (resFg === '1') {
        formData.value.businZip = data.zonecode;
        formData.value.businAddr1 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          businAddr2Focus.value.focus();
        }, 100);
      } else {
        formData.value.postZip = data.zonecode;
        formData.value.postAddr1 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          postAddr2Focus.value.focus();
        }, 100);
      }
    },
  }).open();
};

const searchParam = reactive({
  deptCd: '',
  word: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const formDisable = ref(true);
const isScreenVisible = ref(true);
const isClassActive = ref(true);
const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};
const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const gridApi = ref(null);
const rowData = reactive({ rows: [] });

const onGridReady = params => {
  gridApi.value = params.api;
};

const defaultColDef = reactive({
  def: {
    flex: 1,
    minWidth: 180,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
});

const columnDefs = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      filter: false,
      pinned: 'left',
    },
    {
      headerName: '코드',
      field: 'compCd',
      maxWidth: 80,
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '상호명',
      field: 'compNm',
      maxWidth: 150,
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '별칭명',
      field: 'compNmx',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '대표자',
      field: 'repNm',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '법인번호',
      field: 'regNo',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '사업자번호',
      field: 'businNo',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '업태',
      field: 'businCond',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '종목',
      field: 'businKind',
    },
    {
      headerName: '사업장소재지1',
      field: 'businAddr1',
    },
    {
      headerName: '사업장소재지2',
      field: 'businAddr2',
    },
    {
      headerName: '우편번호',
      field: 'businZip',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '우편물주소1',
      field: 'postAddr1',
    },
    {
      headerName: '우편문주소2',
      field: 'postAddr2',
    },
    {
      headerName: '우편번호',
      field: 'postZip',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '담당자',
      field: 'managerNm',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '휴대폰',
      field: 'mobile',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '대표번호',
      field: 'tel',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '팩스',
      field: 'fax',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '대표이메일',
      field: 'email',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '이메일(Bill)',
      field: 'emailBill',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '종사업장',
      field: 'jongNo',
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '거래시작일',
      field: 'tsDay',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '거래종료일',
      field: 'teDay',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '참고사항',
      field: 'explains',
      maxWidth: 100,
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  compCd: '',
  compNm: '',
  compNmx: '',
  repNm: '',
  regNo: '',
  jongNo: '',
  businNo: '',
  businCond: '',
  businKind: '',
  businAddr1: '',
  businAddr2: '',
  businZip: '',
  postAddr1: '',
  postAddr2: '',
  postZip: '',
  managerNm: '',
  emailBill: '',
  email: '',
  mobile: '',
  tel: '',
  fax: '',
  tsDay: '',
  teDay: '',
  explains: '',
});
const formDataInitialize = {
  compCd: '',
  compNm: '',
  compNmx: '',
  repNm: '',
  regNo: '',
  jongNo: '',
  businNo: '',
  businCond: '',
  businKind: '',
  businAddr1: '',
  businAddr2: '',
  businZip: '',
  postAddr1: '',
  postAddr2: '',
  postZip: '',
  managerNm: '',
  emailBill: '',
  email: '',
  mobile: '',
  tel: '',
  fax: '',
  tsDay: '',
  teDay: '',
  explains: '',
};

const selectedRows = ref();
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  isShowStatusEdit.value = false;
  isShowDeleteBtn.value = selectedRows.value.length > 0;
  isShowSaveBtn.value = isShowDeleteBtn.value;

  if (selectedRows.value.length === 1) {
    getSelectData(selectedRows.value[0].compCd);
    isShowStatusEdit.value = true;
    statusEdit.icon = 'edit_note';
    statusEdit.message = '수정/삭제모드 입니다';
    statusEdit.color = 'accent';
    isSaveFg = 'U';
    formDisable.value = false;
  } else if (selectedRows.value.length > 1) {
    isSaveFg = 'D';
    isShowStatusEdit.value = true;
    statusEdit.icon = 'delete';
    statusEdit.message = '삭제모드 입니다';
    statusEdit.color = 'negative';
    formDisable.value = true;
    formData.value = initializeFormData.value;
  } else {
    formData.value = formDataInitialize;
    isShowStatusEdit.value = false;
    isSaveFg = '';
    formDisable.value = true;
  }
};

const rowSelection = ref(null);

onBeforeMount(() => {
  rowSelection.value = 'multiple';
  getData();
});

const compCdFocus = ref(null);
const addDataSection = () => {
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value = formDataInitialize;
  formData.value.teDay = '9999-12-31';
  setTimeout(() => {
    compCdFocus.value.focus();
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
      isSaveFg = 'D';

      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRows.value.length; i++) {
        let tmpJson = '{"mode":"U","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  formData.value.tsDay = reFormatDate(formData.value.tsDay);
  formData.value.teDay = reFormatDate(formData.value.teDay);
  formData.value.regNo = reFormatMinus(formData.value.regNo);
  formData.value.businNo = reFormatMinus(formData.value.businNo);

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
    saveDataAndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg, formData.value));
  }
};

const reFormatDate = rawDate => {
  return rawDate ? rawDate.replace(/-/g, '') : null;
};

const formatDate = rawDate => {
  if (rawDate) {
    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};
const reFormatMinus = resData => {
  return resData ? resData.replace(/-/g, '') : null;
};

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};
onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys1910_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.oldCompCd = formData.value.compCd;

          let newData = [formData.value];
          gridApi.value.applyTransaction({
            add: newData,
            addIndex: 0,
          });
        } else if (isSaveFg === 'U') {
          const selectedData = gridApi.value.getSelectedRows();

          // selectedData[0] = { ...formData.value };
          selectedData[0].compCd = formData.value.compCd;
          selectedData[0].oldCompCd = formData.value.compCd;
          selectedData[0].compNm = formData.value.compNm;
          selectedData[0].compNmx = formData.value.compNmx;
          selectedData[0].repNm = formData.value.repNm;
          selectedData[0].regNo = formData.value.regNo;
          selectedData[0].jongNo = formData.value.jongNo;
          selectedData[0].businNo = formData.value.businNo;
          selectedData[0].businCond = formData.value.businCond;
          selectedData[0].businKind = formData.value.businKind;
          selectedData[0].businAddr1 = formData.value.businAddr1;
          selectedData[0].businAddr2 = formData.value.businAddr2;
          selectedData[0].businZip = formData.value.businZip;
          selectedData[0].postAddr1 = formData.value.postAddr1;
          selectedData[0].postAddr2 = formData.value.postAddr2;
          selectedData[0].postZip = formData.value.postZip;
          selectedData[0].managerNm = formData.value.managerNm;
          selectedData[0].emailBill = formData.value.emailBill;
          selectedData[0].email = formData.value.email;
          selectedData[0].mobile = formData.value.mobile;
          selectedData[0].tel = formData.value.tel;
          selectedData[0].fax = formData.value.fax;
          selectedData[0].tsDay = formData.value.tsDay;
          selectedData[0].teDay = formData.value.teDay;
          selectedData[0].explains = formData.value.explains;
          gridApi.value.applyTransaction({
            update: selectedData,
          });
        } else if (isSaveFg === 'D') {
          const selectedData = gridApi.value.getSelectedRows();
          gridApi.value.applyTransaction({ remove: selectedData });
        }
      }
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
// ***** 회사정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/sys/sys1910_list', {});
    rowData.rows = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 회사정보 목록 자료 가져오기 부분  *****************************//

// ***** 회사정보 선택된 자료 가져오기 부분  *****************************//
const getSelectData = async resParamCompCd => {
  try {
    const response = await api.post(+'/api/sys/sys1910_select', { paramCompCd: resParamCompCd });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.tsDay = formatDate(response.data.data[0].tsDay);
    formData.value.teDay = formatDate(response.data.data[0].teDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 회사정보 선택된 자료 가져오기 부분  *****************************//

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
