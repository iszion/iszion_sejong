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
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-8': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
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
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar>
              <q-select
                dense
                stack-label
                options-dense
                class="q-mr-lg"
                label-color="orange"
                v-model="searchValue.divCd"
                :options="searchValue.divOptions"
                option-value="commCd"
                option-label="commNm"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 100px; max-width: 130px"
                label="유형"
                @update:model-value="getData"
              />
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
                  <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" class="cursor-pointer" />
                </template>
              </q-input>
              <q-space />
              <div class="q-gutter-sm">
                <q-btn outline color="positive" dense @click="getData"><q-icon name="search" size="xs" class="" /> 조회 </q-btn>
                <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection">
                  <q-icon name="delete" size="xs" /> 삭제</q-btn
                >
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="contentZoneStyle">
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
      <!--  end of contents list -->
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-4">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions align="right" class="q-pa-none">
              <q-toolbar class="row">
                <q-space />
                <div class="q-gutter-xs">
                  <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                  <q-btn outline color="positive" dense @click="addDataSection"><q-icon name="add" size="xs" /> 신규 </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <div class="q-pa-md q-gutter-y-sm">
                <div class="row q-col-gutter-x-xl">
                  <q-field :dense="dense" class="col-12 col-md-4" label="코드" label-color="orange" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline text-bold text-subtitle1" tabindex="0">
                        {{ formData.compCd }}
                      </div>
                    </template>
                  </q-field>
                  <q-space />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-5"
                    v-model="formData.makeDay"
                    type="date"
                    label="등록일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    ref="startFocus"
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compNm"
                    label="회사명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compBusinNm"
                    label="법인명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compBusinNo"
                    label="사업자등록번호"
                    mask="###-##-#####"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compOwner"
                    label="대표자"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row">
                  <div class="col-xs-12 col-sm-6 q-col-gutter-x-xl">
                    <q-input
                      :dense="dense"
                      v-model="formData.compZip1"
                      label="우편번호"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="5"
                    >
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.compZip1 !== ''"
                          name="close"
                          @click="formData.compZip1 = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openPostcodeSearch('1')" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      v-model="formData.compAddr1"
                      label="소재지"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-input
                      ref="addr1xFocus"
                      :dense="dense"
                      v-model="formData.compAddr1x"
                      label="상세주소"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-xs-12 col-sm-6 q-col-gutter-x-xl">
                    <q-input
                      :dense="dense"
                      v-model="formData.compZip2"
                      label="우편번호(우편물)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="5"
                    >
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.compZip2 !== ''"
                          name="close"
                          @click="formData.compZip2 = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      v-model="formData.compAddr2"
                      label="소재지(우편물)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-input
                      ref="addr2xFocus"
                      :dense="dense"
                      v-model="formData.compAddr2x"
                      label="상세주소(우편물)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compCond"
                    label="업태"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compKind"
                    label="종목"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.manager"
                    label="담당자"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.mobile"
                    label="휴대전화"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.tel"
                    label="전화번호"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.fax"
                    label="팩스"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.compEmail"
                    label="이메일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.billEmail"
                    label="이메일(계산서용)"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />

                  <q-toggle
                    class="col-xs-12 col-sm-6"
                    v-model="formData.billYn"
                    :disable="formDisable"
                    color="blue"
                    label="계산서발행"
                    true-value="Y"
                    false-value="N"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-5"
                    v-model="formData.estDay"
                    type="date"
                    label="설립일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-space />
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-5"
                    v-model="formData.outDay"
                    type="date"
                    label="사용중지일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>
                <q-separator class="q-mt-md" />
                <div class="row q-col-gutter-x-xl">
                  <q-select
                    :disable="formDisable"
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.divCd"
                    :options="divOptions"
                    label="유형"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                    @update:model-value="handleDatabaseReset"
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.commNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.database"
                    label="데이타베이스명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      :disable="formDisable"
                      type="textarea"
                      v-model="formData.explains"
                      label="참고사항"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      autogrow
                      clearable
                      :hint="`${byteCount.explains} / 100(한글50)자 까지 입력하실 수 있습니다.`"
                      @update:model-value="updateByteCount('explains', formData.explains, 100)"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->
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

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';

const $q = useQuasar();
const dense = ref(true);
let isSaveFg = null;

const divOptions = ref(null);
const searchValue = reactive({
  textValue: '',
  divCd: '',
  divOptions: [],
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const handleDatabaseReset = value => {
  const divNm = divOptions.value.find(opt => opt.commCd === value);
  formData.value.database = divNm.commNm.substring(0, 1) + formData.value.compCd;
};

const formDisable = ref(true);
const isScreenVisible = ref(true);
const isClassActive = ref(true);

const isScreenVisibleProcess = () => {
  isScreenVisible.value = !isScreenVisible.value;
  isScreenVisible.value ? (isClassActive.value = true) : (isClassActive.value = false);
};

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 270;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const rowData = reactive({ rows: [] });

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  formDataInitialize();
  // 업체유형
  getDataCommOption('902').then(() => {
    getData();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const dateFormatter = params => {
  const valueStr = params.value;
  if (valueStr && valueStr.length === 8) {
    return `${valueStr.slice(0, 4)}-${valueStr.slice(4, 6)}-${valueStr.slice(6)}`;
  }
  return valueStr;
};

const columnDefs = reactive({
  columns: [
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
      headerName: '코드',
      field: 'compCd',
      minWidth: 80,
      maxWidth: 80,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: 'DB명',
      field: 'database',
      minWidth: 90,
    },
    {
      headerName: '유형',
      field: 'divNm',
      minWidth: 100,
    },
    {
      headerName: '회사명',
      field: 'compNm',
      minWidth: 120,
    },
    {
      headerName: '법인명',
      field: 'compBusinNm',
      minWidth: 120,
    },
    {
      headerName: '대표자',
      field: 'compOwner',
      minWidth: 100,
    },
    {
      headerName: '사업자등록번호',
      field: 'compBusinNo',
      minWidth: 140,
      valueFormatter: params => {
        const valueStr = params.value;
        if (valueStr && valueStr.length === 10) {
          return `${valueStr.slice(0, 3)}-${valueStr.slice(3, 5)}-${valueStr.slice(5)}`;
        }
        return valueStr;
      },
    },
    {
      headerName: '업태',
      field: 'compCond',
      minWidth: 120,
    },
    {
      headerName: '종목',
      field: 'compKind',
      minWidth: 120,
    },
    {
      headerName: '소재지(주소)',
      field: 'compAddr1',
      minWidth: 250,
    },
    {
      headerName: '소재지(상세주소)',
      field: 'compAddr1x',
      minWidth: 150,
    },
    {
      headerName: '우편No',
      field: 'compZip1',
      minWidth: 100,
    },
    {
      headerName: '소재지(우편물)',
      field: 'compAddr2',
      minWidth: 250,
    },
    {
      headerName: '소재지(상세주소)',
      field: 'compAddr2x',
      minWidth: 150,
    },
    {
      headerName: '우편No',
      field: 'compZip2',
      minWidth: 100,
    },
    {
      headerName: '담당자',
      field: 'manager',
      minWidth: 100,
    },
    {
      headerName: '모바일',
      field: 'mobile',
      minWidth: 140,
    },
    {
      headerName: '전화번호',
      field: 'tel',
      minWidth: 140,
    },
    {
      headerName: '팩스',
      field: 'fax',
      minWidth: 140,
    },
    {
      headerName: '이메일',
      field: 'compEmail',
      minWidth: 150,
    },
    {
      headerName: '이메일(세금계산서)',
      field: 'billEmail',
      minWidth: 250,
    },
    {
      headerName: '발행',
      field: 'billYn',
      minWidth: 90,
    },
    {
      headerName: '설립일',
      field: 'estDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '등록일',
      field: 'makeDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '사용중지일',
      field: 'outDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '참고사항',
      field: 'explains',
      minWidth: 100,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref(null);

const formDataInitialize = () => {
  formData.value = {
    compCd: '',
    compNm: '',
    compBusinNm: '',
    compOwner: '',
    compBusinNo: '',
    compCond: '',
    compKind: '',
    compAddr1: '',
    compAddr1x: '',
    compZip1: '',
    compAddr2: '',
    compAddr2x: '',
    compZip2: '',
    manager: '',
    compEmail: '',
    billEmail: '',
    billYn: '',
    mobile: '',
    tel: '',
    fax: '',
    estDay: '',
    makeDay: '',
    divCd: '',
    divNm: '',
    outDay: '',
    database: '',
    explains: '',
    regDate: '',
    iuD: 'I',
  };
};

const selectedDivNm = computed(() => {
  const selectedOption = divOptions.value.find(option => option.commCd === formData.value.divCd);
  return selectedOption ? selectedOption.commNm : null;
});

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const addDataSection = () => {
  formDataInitialize();
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isShowSaveBtn.value = true;
  formDisable.value = false;

  com1010_key_generation().then(() => {
    formData.value.makeDay = commUtil.getToday();
    formData.value.outDay = '9999-12-31';
    isSaveFg = 'I';
    setTimeout(() => {
      startFocus.value.focus();
    }, 100);
  });
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
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
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
  formData.value.makeDay = commUtil.unFormatDate(formData.value.makeDay);
  formData.value.estDay = commUtil.unFormatDate(formData.value.estDay);
  formData.value.outDay = commUtil.unFormatDate(formData.value.outDay);
  formData.value.compBusinNo = commUtil.unFormatCompNo(formData.value.compBusinNo);

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

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  console.log('save : ', JSON.stringify(resFormData));
  api
    .post('/api/com/com1010_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.compCd = res.data.createKeyValue;

          let newData = [formData.value];
          newData[0].divNm = selectedDivNm.value;
          myGrid.value.api.applyTransaction({
            add: newData,
            addIndex: 0,
          });
          getData();
        } else if (isSaveFg === 'U') {
          const selectedData = myGrid.value.api.getSelectedRows();
          // selectedData[0] = { ...formData.value };
          selectedData[0].compCd = formData.value.compCd;
          selectedData[0].compNm = formData.value.compNm;
          selectedData[0].comBusinNm = formData.value.compBusinNm;
          selectedData[0].compOwner = formData.value.compOwner;
          selectedData[0].compBusinNo = formData.value.compBusinNo;
          selectedData[0].compCond = formData.value.compCond;
          selectedData[0].compKind = formData.value.compKind;
          selectedData[0].compAddr1 = formData.value.compAddr1;
          selectedData[0].compAddr1x = formData.value.compAddr1x;
          selectedData[0].compZip1 = formData.value.compZip1;
          selectedData[0].compAddr2 = formData.value.compAddr2;
          selectedData[0].compAddr2x = formData.value.compAddr2x;
          selectedData[0].compZip2 = formData.value.compZip2;
          selectedData[0].manager = formData.value.manager;
          selectedData[0].compEmail = formData.value.compEmail;
          selectedData[0].billEmail = formData.value.billEmail;
          selectedData[0].billYn = formData.value.billYn;
          selectedData[0].mobile = formData.value.mobile;
          selectedData[0].tel = formData.value.tel;
          selectedData[0].fax = formData.value.fax;
          selectedData[0].estDay = formData.value.estDay;
          selectedData[0].makeDay = formData.value.makeDay;
          selectedData[0].divCd = formData.value.divCd;
          selectedData[0].outDay = formData.value.outDay;
          selectedData[0].database = formData.value.database;
          selectedData[0].explains = formData.value.explains;

          selectedData[0].divNm = selectedDivNm.value;

          myGrid.value.api.applyTransaction({
            update: selectedData,
          });
          myGrid.value.api.deselectAll();
        } else if (isSaveFg === 'D') {
          const selectedData = myGrid.value.api.getSelectedRows();
          myGrid.value.api.applyTransaction({ remove: selectedData });
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

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

const getData = async () => {
  try {
    const response = await api.post('/api/com/com1010_list', {
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const com1010_key_generation = async () => {
  try {
    const response = await api.post('/api/com/com1010_key_generation', {});
    formData.value.compCd = response.data.data.compCd;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataSelect = async resParam => {
  try {
    const response = await api.post('/api/com/com1010_select', {
      paramCompCd: resParam.compCd,
    });
    formData.value = response.data.data;
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.makeDay = commUtil.formatDate(response.data.data.makeDay);
    formData.value.estDay = commUtil.formatDate(response.data.data.estDay);
    formData.value.outDay = commUtil.formatDate(response.data.data.outDay);
    console.log('da : ', formData.value.makeDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/com/xComm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '902':
        searchValue.divOptions = response.data.data;
        divOptions.value = response.data.data;
        break;
      default:
        searchValue.divOptions.value = [];
        divOptions.value = [];
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
  columnDefs: columnDefs.columns,
  rowData: rowData.rows,
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
    // selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
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
    selectedRows.value = event.api.getSelectedRows();
    isShowStatusEdit.value = false;
    isShowDeleteBtn.value = selectedRows.value.length > 0;
    isShowSaveBtn.value = false;

    if (selectedRows.value.length === 1) {
      getDataSelect(selectedRows.value[0]);
      isShowSaveBtn.value = true;
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
      formData.value = {};
    } else {
      formData.value = {};
      isShowStatusEdit.value = false;
      isSaveFg = '';
      formDisable.value = true;
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

// ********** 우편번호 처리
const addr1xFocus = ref(null);
const addr2xFocus = ref(null);
const openPostcodeSearch = resFg => {
  new window.daum.Postcode({
    oncomplete: data => {
      if (resFg === '1') {
        formData.value.compZip1 = data.zonecode;
        formData.value.compAddr1 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          addr1xFocus.value.focus();
        }, 100);
      } else if (resFg === '2') {
        formData.value.compZip2 = data.zonecode;
        formData.value.compAddr2 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          addr2xFocus.value.focus();
        }, 100);
      } else {
      }
    },
  }).open();
};

const byteCount = ref({ orcuNm: 0, explains: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'orcuNm':
        byteCount.value.rocuNm = commUtil.textByteLength(val);
        if (byteCount.value.orcuNm > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'explains':
        byteCount.value.explains = commUtil.textByteLength(val);
        if (byteCount.value.explains > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      default:
        break;
    }
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
