<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List (좌측 화면) -->
      <div class="col-12" :class="{ 'col-md-8': isClassActive }">
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
              <div class="row col-xs-9">
                <div class="row q-col-gutter-md">
                  <q-select
                    dense
                    stack-label
                    options-dense
                    class="q-pb-sm q-mr-lg"
                    label-color="orange"
                    v-model="searchParam.prodDiv"
                    :options="prodDivOptionsSearch"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 130px; max-width: 130px"
                    label="도서분류"
                    @update:model-value="handelGetData"
                  />

                  <q-select
                    dense
                    stack-label
                    options-dense
                    class="q-pb-sm q-mr-lg"
                    label-color="orange"
                    v-model="searchParam.prodFg"
                    :options="prodFgOptionsSearch"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 80px; max-width: 80px"
                    label="구분"
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
              </div>
              <q-space />
              <div class="q-gutter-sm col-xs-3 text-right">
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
      <!--  end of contents list  (좌측 화면) -->

      <!-- contents List (우측화면) -->
      <div v-if="isScreenVisible" class="col-xs-12 col-md-4">
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
            <q-scroll-area :style="contentRightZoneStyle">
              <div class="q-pa-md q-gutter-y-sm">
                <div class="row q-col-gutter-x-xl">
                  <q-input
                    ref="startFocus"
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-3 text-subtitle1"
                    v-model="formData.prodCd"
                    label="코드"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon v-if="isSaveFg === 'I'" size="0.8em" name="sync" @click="getDataMaxProdCdCheck()" class="cursor-pointer q-pt-md">
                        <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          <strong> 코드생성하기 </strong>
                        </q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-6"
                    :disable="formDisable"
                    v-model="formData.prodDiv"
                    :options="prodDivOptions"
                    label="도서분류"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                    @update:model-value="value => (formData.prodDivNm = prodDivOptions.find(option => option.commCd === value)?.commNm || '')"
                  >
                    <template v-slot:option="{ prodProps, opt, selected, toggleOption }">
                      <q-item v-bind="prodProps">
                        <q-item-section>
                          <q-item-label v-html="opt.commNm" />
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-3"
                    :disable="formDisable"
                    v-model="formData.prodFg"
                    :options="prodFgOptions"
                    label="구분"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                    @update:model-value="value => (formData.prodFgNm = prodFgOptions.find(option => option.commCd === value)?.commNm || '')"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-12"
                    v-model="formData.prodNm"
                    label="도서명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>
                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.authorNm"
                    label="저자명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.isbn"
                    label="ISBN"
                    mask="###-##-####-###-#"
                    fill-mask
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formattedSprice"
                    label="정가"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    @input="val => updateValue('sPrice', val)"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formattedIprice"
                    label="입고단가"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    @input="val => updateValue('iPrice', val)"
                  />

                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.p1Page"
                    label="페이지수"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <span class="q-pt-md text-subtitle2">쪽</span>
                    </template>
                  </q-input>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.sunNm"
                    label="선서자명"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.managerNm"
                    label="도서담당"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.bundleProdCd"
                    label="묶음도서코드"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-7"
                    v-model="formData.copyrightNm"
                    label="저작권사"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <div class="col-xs-12 col-sm-5 self-center">
                    <q-radio keep-color v-model="formData.prodCl" label="국내" val="1" color="teal" :disable="formDisable" />
                    <q-radio keep-color v-model="formData.prodCl" label="국외" val="2" color="orange" :disable="formDisable" />
                  </div>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-auto"
                    v-model="formData.copyrightSday"
                    label="저작기간 시작일"
                    type="date"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-auto"
                    v-model="formData.copyrightEday"
                    label="저작기간 종료일"
                    type="date"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-9"
                    v-model="formData.agentNm"
                    label="에이젠트"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    @keyup.enter="openHelpAgentDialog()"
                  >
                    <template v-slot:append>
                      <q-icon
                        size="0.8em"
                        v-if="formData.agentNm !== ''"
                        name="close"
                        @click="formData.agentNm = ''"
                        class="cursor-pointer q-pt-md"
                      />
                      <q-icon size="0.8em" name="search" @click="openHelpAgentDialog()" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-3"
                    v-model="formData.agentCd"
                    label="코드"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    readonly
                    maxlength="100"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    ref="secondFocus"
                    stack-label
                    :dense="dense"
                    class="col-auto"
                    v-model="formData.pubDay"
                    type="date"
                    label="발행일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-auto"
                    v-model="formData.makeDay"
                    type="date"
                    label="등록일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-toggle
                    class="col-xs-12 col-sm-4"
                    v-model="formData.ebookYn"
                    :disable="formDisable"
                    color="orange"
                    label="전자책"
                    true-value="Y"
                    false-value="N"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-5"
                    v-model="formData.ebookIsbn"
                    label="ISBN"
                    mask="###-##-####-###-#"
                    fill-mask
                    :label-color="$q.dark.isActive ? 'orange' : 'orange'"
                    :disable="formDisable || formData.ebookYn !== 'Y'"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-3"
                    v-model="formattedEbookPrice"
                    label="정가"
                    :label-color="$q.dark.isActive ? 'orange' : 'orange'"
                    :disable="formDisable || formData.ebookYn !== 'Y'"
                    @input="val => updateValue('ebookPrice', val)"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-toggle
                    class="col-xs-12 col-sm-4"
                    v-model="formData.useYn"
                    :disable="formDisable"
                    color="red"
                    label="출고정지"
                    true-value="Y"
                    false-value="N"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-8"
                    v-model="formData.useExplain"
                    label="정지사유"
                    :label-color="$q.dark.isActive ? 'red' : 'red'"
                    :disable="formDisable || formData.useYn !== 'Y'"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <div class="col-12">
                    <q-input
                      stack-label
                      :dense="dense"
                      :disable="formDisable"
                      type="textarea"
                      v-model="formData.remarks"
                      label="참고사항"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      autogrow
                      clearable
                      :hint="`${byteCount.remarks} / 200(한글100)자 까지 입력하실 수 있습니다.`"
                      @update:model-value="updateByteCount('remarks', formData.remarks, 200)"
                    />
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list (우측 화면)  -->
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
import HelpAgent from 'components/subvue/HelpAgent.vue';

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);

const prodDivOptionsSearch = ref(null);
const prodFgOptionsSearch = ref(null);
const prodFgOptions = ref(null);
const prodDivOptions = ref(null);

const searchParam = reactive({
  prodDiv: '',
  prodFg: '',
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
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 280}px`,
}));
const contentRightZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 200}px`,
}));

const rowData = reactive({ rows: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

const isbnFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 13) {
    return `${dateStr.slice(0, 3)}-${dateStr.slice(3, 5)}-${dateStr.slice(5, 9)}-${dateStr.slice(9, 12)}-${dateStr.slice(12)}`;
  }
  return dateStr;
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  formDataInitialize();
  // 영업담당
  getDataCommOption('101').then(() => {
    getDataCommOption('102').then(() => {
      handelGetData();
    });
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
      field: 'prodCd',
      minWidth: 80,
      maxWidth: 80,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '도서명',
      field: 'prodNm',
      minWidth: 250,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '분류',
      field: 'prodDivNm',
      minWidth: 150,
    },
    {
      headerName: '구분',
      field: 'prodFgNm',
      minWidth: 80,
    },
    {
      headerName: '저자명',
      field: 'authorNm',
      minWidth: 150,
    },
    {
      headerName: '묶음코드',
      field: 'bundleProdCd',
      minWidth: 100,
    },
    {
      headerName: '등록일',
      field: 'makeDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '발행일',
      field: 'pubDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: 'ISBN',
      field: 'isbn',
      valueFormatter: isbnFormatter,
      minWidth: 180,
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
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '입고단가',
      field: 'iPrice',
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
      headerName: '페이지수',
      field: 'p1Page',
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
      minWidth: 120,
    },
    {
      headerName: '도서담당',
      field: 'managerNm',
      minWidth: 120,
    },
    {
      headerName: '전자책ISBN',
      field: 'ebookIsbn',
      valueFormatter: isbnFormatter,
      minWidth: 180,
    },
    {
      headerName: '전자책정가',
      field: 'ebookPrice',
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
      headerName: '출고정지',
      field: 'useYn',
      minWidth: 100,
    },
    {
      headerName: '출고정지사유',
      field: 'useExplain',
      minWidth: 150,
    },
    {
      headerName: '참조',
      field: 'remarks',
      minWidth: 200,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref(null);
const formDataInitialize = () => {
  formData.value = {
    prodCd: '',
    prodDiv: '',
    prodDivNm: '',
    prodNm: '',
    authorNm: '',
    prodFg: '',
    prodFgNm: '',
    prodCl: '',
    isbn: '',
    iPrice: '0',
    oPrice: '0',
    sPrice: '0',
    p1Page: '0',
    p2Page: '0',
    ebookYn: '',
    ebookIsbn: '',
    ebookPrice: '0',
    useYn: '',
    useExplain: '',
    copyrightNm: '',
    copyrightSday: '',
    copyrightEday: '',
    agentCd: '',
    agentNm: '',
    bundleProdCd: '',
    namagerNm: '',
    remarks: '',
    makeDay: '',
    pubDay: '',
  };
};

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const secondFocus = ref(null);
const addDataSection = () => {
  getDataMaxProdCdCheck();
  formDataInitialize();
  oldFormData.value = null;
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg.value = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.prodCl = '1';
  formData.value.ebookYn = 'N';
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
      isSaveFg.value = 'D';

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
  formData.value.pubDay = commUtil.unFormatDate(formData.value.pubDay);
  formData.value.copyrightSday = commUtil.unFormatDate(formData.value.copyrightSday);
  formData.value.copyrightEday = commUtil.unFormatDate(formData.value.copyrightEday);
  formData.value.isbn = formData.value.isbn.replace(/-/g, '');
  formData.value.ebookIsbn = formData.value.ebookIsbn.replace(/-/g, '');
  // console.log('formData : ', JSON.stringify(formData.value));
  // console.log('oldFormData : ', JSON.stringify(oldFormData.value));

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
    saveDataAndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg.value, formData.value));
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/mst/mst2010_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg.value === 'I') {
          let newData = [formData.value];
          myGrid.value.api.applyTransaction({
            add: newData,
            addIndex: 0,
          });
          handelGetData();
        } else if (isSaveFg.value === 'U') {
          const selectedData = myGrid.value.api.getSelectedRows();
          Object.assign(selectedData[0], formData.value);

          myGrid.value.api.applyTransaction({
            update: selectedData,
          });
          myGrid.value.api.deselectAll();
        } else if (isSaveFg.value === 'D') {
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
    const response = await api.post('/api/mst/mst2010_maxPages', {
      paramProdDiv: searchParam.prodDiv,
      paramProdFg: searchParam.prodFg,
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
    const response = await api.post('/api/mst/mst2010_list', {
      paramProdDiv: searchParam.prodDiv,
      paramProdFg: searchParam.prodFg,
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

// ***** 자동코드처리 마지막 코드+1 가져오기 부분  *****************************//
const getDataMaxProdCdCheck = async () => {
  try {
    const response = await api.post('/api/mst/mst2010_max_codeCheck', {});
    formData.value.prodCd = response.data.data[0].maxCd;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resProdCd => {
  try {
    const response = await api.post('/api/mst/mst2010_select', {
      paramProdCd: resProdCd,
    });
    formData.value = response.data.data[0];
    // console.log('select data ::: ', JSON.stringify(formData.value));
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.pubDay = commUtil.formatDate(response.data.data[0].pubDay);
    formData.value.makeDay = commUtil.formatDate(response.data.data[0].makeDay);
    formData.value.copyrightSday = commUtil.formatDate(response.data.data[0].copyrightSday);
    formData.value.copyrightEday = commUtil.formatDate(response.data.data[0].copyrightEday);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '101':
        prodDivOptionsSearch.value = [...response.data.data];
        prodDivOptions.value = response.data.data;
        prodDivOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      case '102':
        prodFgOptionsSearch.value = [...response.data.data];
        prodFgOptions.value = response.data.data;
        prodFgOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        prodDivOptionsSearch.value = [];
        prodDivOptions.value = [];
        prodFgOptionsSearch.value = [];
        prodFgOptions.value = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
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
      getDataSelect(selectedRows.value[0].prodCd).then(() => {
        isShowSaveBtn.value = true;
        isShowStatusEdit.value = true;
        statusEdit.icon = 'edit_note';
        statusEdit.message = '수정/삭제모드 입니다';
        statusEdit.color = 'accent';
        isSaveFg.value = 'U';
        formDisable.value = false;
      });
    } else if (selectedRows.value.length > 1) {
      isSaveFg.value = 'D';
      isShowStatusEdit.value = true;
      statusEdit.icon = 'delete';
      statusEdit.message = '삭제모드 입니다';
      statusEdit.color = 'negative';
      formDisable.value = true;
      formDataInitialize();
    } else {
      formDataInitialize();
      isShowStatusEdit.value = false;
      isSaveFg.value = '';
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

const byteCount = ref({ prodNm: 0, remarks: 0 });
const updateByteCount = (ch, val, maxCnt) => {
  if (val) {
    switch (ch) {
      case 'prodNm':
        byteCount.value.prodNm = commUtil.textByteLength(val);
        if (byteCount.value.prodNm > maxCnt) {
          alert('한글 ' + maxCnt + '자 (한글 ' + Math.trunc(maxCnt / 2) + '자)까지 가능합니다.');
        }
        break;
      case 'remarks':
        byteCount.value.remarks = commUtil.textByteLength(val);
        if (byteCount.value.remarks > maxCnt) {
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

const formattedSprice = formattedValue('sPrice');
const formattedIprice = formattedValue('iPrice');
const formattedEbookPrice = formattedValue('ebookPrice');
// 포맷된 값을 관리하는 computed
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

/* *** 코드헬프부분 ** */
const openHelpAgentDialog = () => {
  $q.dialog({
    component: HelpAgent,
    componentProps: {
      paramValueNm: formData.value.agentNm,
      paramCloseDay: commUtil.unFormatDate(formData.value.makeDay),
    },
  })
    .onOk(res => {
      console.log('res ::: ', res.valueCd, res.valueNm);
      formData.value.agentCd = res.valueCd;
      formData.value.agentNm = res.valueNm;
    })
    .onCancel(() => {})
    .onDismiss(() => {});
  secondFocus.value.focus();
};
</script>

<style lang="sass" scoped></style>
