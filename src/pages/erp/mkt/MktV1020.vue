<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
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
            <q-toolbar class="row">
              <div class="row q-col-gutter-md">
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
                  style="min-width: 130px; max-width: 130px"
                  label="영업담당"
                  @update:model-value="handelGetData"
                />

                <q-input
                  stack-label
                  bottom-slots
                  label-color="orange"
                  v-model="searchParam.word"
                  label="검색"
                  dense
                  class="q-pb-none"
                  style="width: 120px"
                  @keyup.enter="handelGetData"
                >
                  <template v-slot:append>
                    <q-icon v-if="searchParam.word !== ''" name="close" @click="searchParam.word = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="q-gutter-sm">
                <q-btn outline color="positive" dense @click="handelGetData"><q-icon name="search" size="xs" class="" /> 조회 </q-btn>
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
            <div class="q-pa-md flex flex-center">
              <q-select
                dense
                borderless
                v-model="pagination.pageRows"
                options-dense
                :options="pagination.pageOption"
                class="q-mr-md"
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
                        {{ isSaveFg === 'I' ? '자동생성' : formData.nacdCd }}
                      </div>
                    </template>
                  </q-field>

                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.makeDay"
                    type="date"
                    label="등록일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <div class="col-xs-12 col-sm-4 q-pt-md text-right">
                    <q-toggle
                      v-model="formData.useYn"
                      :disable="formDisable"
                      color="red"
                      label="폐기"
                      true-value="Y"
                      false-value="N"
                      left-label
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    ref="startFocus"
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.nacdNm"
                    label="성명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />

                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    :disable="formDisable"
                    v-model="formData.salesCd"
                    :options="salesOptions"
                    label="영업담당"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="salesCd"
                    option-label="salesNm"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                      <q-item v-bind="itemProps">
                        <q-item-section>
                          <q-item-label v-html="opt.salesNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-9"
                    v-model="formData.orcuNm"
                    label="소속처"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="6"
                    @keyup.enter="openHelpOrcuDialog()"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" v-if="formData.orcuNm !== ''" name="close" @click="formData.orcuNm = ''" class="cursor-pointer q-pt-md" />
                      <q-icon size="0.8em" name="search" @click="openHelpOrcuDialog()" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    ref="orcuFocus"
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-3"
                    v-model="formData.orcuCd"
                    label="코드"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    readonly
                    maxlength="100"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    v-model="formData.deptNm"
                    label="담당부서"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="100"
                  />
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    v-model="formData.titlNm"
                    label="직책"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="100"
                  />
                </div>

                <div class="row">
                  <div class="col-xs-12 col-sm-6 q-col-gutter-x-xl">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.zipCdH"
                      label="우편번호(집)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="5"
                    >
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.zipCdH !== ''"
                          name="close"
                          @click="formData.zipCdH = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openPostcodeSearch('H')" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.addrHb"
                      label="기본주소(집)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-input
                      ref="addrHdFocus"
                      :dense="dense"
                      stack-label
                      v-model="formData.addrHd"
                      label="상세주소(집)"
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
                      stack-label
                      v-model="formData.zipCdO"
                      label="우편번호(회사)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="5"
                    >
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.zipCdO !== ''"
                          name="close"
                          @click="formData.zipCdO = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openPostcodeSearch('O')" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.addrOb"
                      label="기본주소(화사)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-input
                      ref="addrOdFocus"
                      :dense="dense"
                      stack-label
                      v-model="formData.addrOd"
                      label="상세주소(회사)"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="100"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.mobile"
                      label="휴대폰"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="30"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.tel"
                      label="회사전화"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="30"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-x-xl">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.fax"
                      label="팩스"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="30"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.email"
                      label="이메일"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="30"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <div class="col-12">
                    <q-input
                      :dense="dense"
                      stack-label
                      :disable="formDisable"
                      type="textarea"
                      v-model="formData.explains"
                      label="참고사항"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      autogrow
                      clearable
                      :hint="`${byteCount.explains} / 300(한글150)자 까지 입력하실 수 있습니다.`"
                      @update:model-value="updateByteCount('explains', formData.explains, 300)"
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
import HelpOrcu from 'components/subvue/HelpOrcu.vue';

const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;

const salesOptionsSearch = ref(null);
const salesOptions = ref(null);
const regionOptions = ref(null);

const searchParam = reactive({
  orcuFg: '',
  salesCd: '',
  word: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const orcuFgOptions = ref([
  {
    value: '1',
    label: '발주처',
  },
  {
    value: '2',
    label: '시공사',
  },
  {
    value: '3',
    label: '설계사',
  },
  {
    value: '4',
    label: '협력사',
  },
  {
    value: '9',
    label: '기타',
  },
]);

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
  // 영업담당
  getDataSalesOption().then(() => {
    handelGetData();
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const columnDefs = reactive({
  columns: [
    {
      headerName: 'No',
      field: 'rowNum',
      minWidth: 70,
      filter: true,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
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
      field: 'nacdCd',
      minWidth: 90,
      maxWidth: 90,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '성명',
      field: 'nacdNm',
      minWidth: 120,
    },
    {
      headerName: '영업담당',
      field: 'salesNm',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: '소속처',
      field: 'orcuNm',
      minWidth: 150,
    },
    {
      headerName: '소속부서',
      field: 'deptNm',
      minWidth: 100,
    },
    {
      headerName: '직책',
      field: 'titlNm',
      minWidth: 100,
    },
    {
      headerName: '휴대폰',
      field: 'mobile',
      minWidth: 150,
    },
    {
      headerName: '전화',
      field: 'tel',
      minWidth: 150,
    },
    {
      headerName: '팩스',
      field: 'fax',
      minWidth: 150,
    },
    {
      headerName: '이메일',
      field: 'email',
      minWidth: 150,
    },
    {
      headerName: 'ZIP(집)',
      field: 'zipCdH',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: '기본주소(집)',
      field: 'addrHb',
      minWidth: 200,
    },
    {
      headerName: '상세주소(집)',
      field: 'addrHd',
      minWidth: 150,
    },
    {
      headerName: 'ZIP(회사)',
      field: 'zipCdO',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: '기본주소(회사)',
      field: 'addrOb',
      minWidth: 200,
    },
    {
      headerName: '상세주소(회사)',
      field: 'addrOd',
      minWidth: 150,
    },
    {
      headerName: '등록일',
      field: 'makeDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '폐기',
      field: 'useYn',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '참고사항',
      field: 'explains',
      maxWidth: 100,
      minWidth: 100,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  nacdCd: '',
  nacdNm: '',
  salesCd: '',
  orcuCd: '',
  orcuNm: '',
  deptNm: '',
  titlNm: '',
  makeDay: '',
  mobile: '',
  tel: '',
  fax: '',
  email: '',
  zipCdH: '',
  addrHb: '',
  addrHd: '',
  zipCdO: '',
  addrOb: '',
  addrOd: '',
  explains: '',
  useYn: '',
});

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const addDataSection = () => {
  formData.value = {};
  oldFormData.value = {};
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.useYn = 'N';
  formData.value.makeDay = commUtil.getToday();
  setTimeout(() => {
    startFocus.value.focus();
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
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  formData.value.makeDay = commUtil.unFormatDate(formData.value.makeDay);

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
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value));
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mkt/mkt1020_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.oldOrcuCd = formData.value.orcuCd;

          let newData = [formData.value];
          myGrid.value.api.applyTransaction({
            add: newData,
            addIndex: 0,
          });
          handelGetData();
        } else if (isSaveFg === 'U') {
          const selectedData = myGrid.value.api.getSelectedRows();
          // selectedData[0] = { ...formData.value };
          selectedData[0].nacdCd = formData.value.nacdCd;
          selectedData[0].oldNacdCd = formData.value.nacdCd;
          selectedData[0].nacdNm = formData.value.nacdNm;
          selectedData[0].salesCd = formData.value.salesCd;
          selectedData[0].orcuCd = formData.value.orcuCd;
          selectedData[0].orcuNm = formData.value.orcuNm;
          selectedData[0].deptNm = formData.value.deptNm;
          selectedData[0].titlNm = formData.value.titlNm;
          selectedData[0].makeDay = formData.value.makeDay;
          selectedData[0].mobile = formData.value.mobile;
          selectedData[0].tel = formData.value.tel;
          selectedData[0].fax = formData.value.fax;
          selectedData[0].email = formData.value.email;
          selectedData[0].zipCdH = formData.value.zipCdH;
          selectedData[0].addrHb = formData.value.addrHb;
          selectedData[0].addrHd = formData.value.addrHd;
          selectedData[0].zipCdO = formData.value.zipCdO;
          selectedData[0].addrOb = formData.value.addrOb;
          selectedData[0].addrOd = formData.value.addrOd;
          selectedData[0].explains = formData.value.explains;
          selectedData[0].useYn = formData.value.useYn;
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
const handelGetData = () => {
  getDataMaxPages().then(() => {
    getData();
  });
};

const getDataMaxPages = async () => {
  totalPages.value = 0;
  currentPages.value = 0;
  pagination.startRowNum = 0;
  try {
    const response = await api.post('/api/mkt/mkt1020_maxPages', {
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
    const response = await api.post('/api/mkt/mkt1020_list', {
      paramSalesCd: searchParam.salesCd,
      paramSearchValue: searchParam.word,
      paramPageRows: pagination.pageRows,
      paramStartRowNum: pagination.startRowNum,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resNacdCd => {
  try {
    const response = await api.post('/api/mkt/mkt1020_select', {
      paramNacdCd: resNacdCd,
    });
    formData.value = response.data.data[0];
    // console.log('select data ::: ', JSON.stringify(formData.value));
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.makeDay = commUtil.formatDate(response.data.data[0].makeDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

async function getDataSalesOption() {
  try {
    const response = await api.post('/api/mst/sales_option_list', {});

    // console.log('getData1: ', JSON.stringify(response.data.data));
    salesOptions.value = response.data.data;
    salesOptionsSearch.value = JSON.parse(JSON.stringify(response.data.data));
    salesOptionsSearch.value.unshift({ salesCd: '', salesNm: '전체' });
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
      getDataSelect(selectedRows.value[0].nacdCd);
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
    onCellValueChanged();
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

// ********** 우편번호 처리
const orcuFocus = ref(null);
const openOrcuSearch = () => {};

// ********** 우편번호 처리
const addrHdFocus = ref(null);
const addrOdFocus = ref(null);
const openPostcodeSearch = resFg => {
  new window.daum.Postcode({
    oncomplete: data => {
      if (resFg === '1') {
        formData.value.zipCd = data.zonecode;
        formData.value.addrB = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          addrDFocus.value.focus();
        }, 100);
      } else {
      }
    },
  }).open();
};

const byteCount = ref({ nacdNm: 0, explains: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'nacdNm':
        byteCount.value.rocuNm = commUtil.textByteLength(val);
        if (byteCount.value.nacdNm > maxCnt) {
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

// ******* 그리드 페이지 처리
const totalPages = ref(0); // 총 페이지 수
const currentPages = ref(1); // 현재 처리하는 페이지
const currentGroup = ref(5); // 화면에 보여줄 최대 페이지 수

const pagination = reactive({
  pageRows: 50,
  startRowNum: 0,
  pageOption: [10, 50, 100, 300, 500, 1000],
});

const handlePageChange = newPage => {
  // console.log(`Current Page: ${newPage}`);
  pagination.startRowNum = (newPage - 1) * pagination.pageRows;
  currentPages.value = newPage;
  // myGrid.value.api.paginationGoToPage(newPage - 1);
  getData();
};

const useDialog = ref(false);
const openHelpOrcuDialog = () => {
  useDialog.value = true;
  openHelpOrcuDialog1();
};

const openHelpOrcuDialog1 = () => {
  if (useDialog.value) {
    $q.dialog({
      component: HelpOrcu,
      componentProps: {
        paramValueNm: formData.value.orcuNm,
        paramCloseDay: commUtil.unFormatDate(formData.value.makeDay),
      },
    })
      .onOk(res => {
        // console.log('res ::: ', res.valueCd, res.valueNm);
        formData.value.orcuCd = res.valueCd;
        formData.value.orcuNm = res.valueNm;
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        // console.log('Called on OK or Cancel');
        useDialog.value = false;
      });
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
