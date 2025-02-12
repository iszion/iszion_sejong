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
                <div class="row q-gutter-x-lg">
                  <q-select
                    dense
                    stack-label
                    options-dense
                    label-color="orange"
                    v-model="searchParam.divCd"
                    :options="divCdOptionsSearch"
                    option-value="commCd"
                    option-label="commNm"
                    option-disable="inactive"
                    emit-value
                    map-options
                    style="min-width: 130px; max-width: 130px"
                    label="업체분류"
                    @update:model-value="handelGetData"
                  />

                  <q-checkbox
                    keep-color
                    v-model="searchParam.useYn"
                    label="출고정지"
                    color="red"
                    true-value="Y"
                    false-value="N"
                    @click="handelGetData"
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
                <div class="row q-col-gutter-x-lg">
                  <q-input
                    ref="startFocus"
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-3 text-subtitle1"
                    v-model="formData.custCd"
                    label="코드"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon v-if="isSaveFg === 'I'" size="0.8em" name="sync" @click="getDataMaxCustCdCheck()" class="cursor-pointer q-pt-md">
                        <q-tooltip class="bg-amber text-black shadow-4" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          <strong> 코드생성하기 </strong>
                        </q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-select
                    :dense="dense"
                    stack-label
                    class="col-xs-12 col-sm-5"
                    :disable="formDisable"
                    v-model="formData.divCd"
                    :options="divCdOptions"
                    label="업체분류"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                    @update:model-value="value => (formData.divCdNm = divCdOptions.find(option => option.commCd === value)?.commNm || '')"
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
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.makeDay"
                    type="date"
                    label="등록일"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-12"
                    v-model="formData.custNm"
                    label="상호"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="close" v-if="formData.custNm !== ''" @click="formData.custNm = ''" class="cursor-pointer q-pt-md" />
                      <span class="q-pl-md text-subtitle2 text-orange">가칭명</span>
                    </template>
                  </q-input>
                </div>
                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    stack-label
                    class="col-12"
                    v-model="formData.custBusinNm"
                    label="상호"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="close" v-if="formData.custNm !== ''" @click="formData.custNm = ''" class="cursor-pointer q-pt-md" />
                      <span class="q-pl-md text-subtitle2 text-orange">정식법인명</span>
                    </template>
                  </q-input>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.custBusinNo"
                    label="사업자등록번호"
                    mask="###-##-#####"
                    fill-mask
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.custOwner"
                    label="대표자"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.custCond"
                    label="업태"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-6"
                    v-model="formData.custKind"
                    label="종목"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row">
                  <q-input
                    :dense="dense"
                    stack-label
                    v-model="formData.custZip1"
                    label="우편번호(법인소재)"
                    label-color="blue"
                    color="blue"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon
                        size="0.8em"
                        v-if="formData.custZip1 !== ''"
                        name="close"
                        @click="formData.custZip1 = ''"
                        class="cursor-pointer q-pt-md"
                      />
                      <q-icon size="0.8em" name="search" @click="openPostcodeSearch('1')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                </div>

                <div class="row q-col-gutter-x-sm">
                  <div class="col-12 col-md-8">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.custAddr1"
                      label="주소(법인소재)"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      ref="addr1Focus"
                      :dense="dense"
                      stack-label
                      v-model="formData.custAddr1X"
                      label="상세주소(법인소재)"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                </div>

                <div class="row">
                  <q-input
                    :dense="dense"
                    stack-label
                    v-model="formData.custZip2"
                    label="우편번호(우편물)"
                    label-color="blue"
                    color="blue"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon
                        size="0.8em"
                        v-if="formData.custZip2 !== ''"
                        name="close"
                        @click="formData.custZip2 = ''"
                        class="cursor-pointer q-pt-md"
                      />
                      <q-icon size="0.8em" name="search" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                </div>

                <div class="row q-col-gutter-x-sm">
                  <div class="col-12 col-md-8">
                    <q-input
                      :dense="dense"
                      stack-label
                      v-model="formData.custAddr2"
                      label="주소(우편물)"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      :dense="dense"
                      stack-label
                      ref="addr2Focus"
                      v-model="formData.custAddr2X"
                      label="상세주소(우편물)"
                      label-color="blue"
                      color="blue"
                      :disable="formDisable"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.managerNm"
                    label="담당자"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formattedLimitAmt"
                    label="한도액"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    @input="val => updateValue('limitAmt', val)"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.mobile"
                    label="휴대폰"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.tel"
                    label="전화번호"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-4"
                    v-model="formData.fax"
                    label="팩스"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulWt"
                    type="number"
                    label="위탁"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulMj"
                    type="number"
                    label="매절"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulHm"
                    type="number"
                    label="현매"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulNp"
                    type="number"
                    label="납품"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulHs"
                    type="number"
                    label="행사"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulSg"
                    type="number"
                    label="신간"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-3"
                    v-model="formData.yulGt"
                    type="number"
                    label="기타"
                    :label-color="$q.dark.isActive ? 'green' : 'orange'"
                    :disable="formDisable"
                  >
                    <template v-slot:append>
                      <q-icon size="0.8em" name="percent" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
                    </template>
                  </q-input>
                </div>

                <div class="row q-col-gutter-x-xl">
                  <q-toggle
                    class="col-xs-12 col-sm-4"
                    v-model="formData.billYn"
                    :disable="formDisable"
                    color="orange"
                    label="계산서"
                    true-value="Y"
                    false-value="N"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                  />
                  <q-input
                    stack-label
                    :dense="dense"
                    class="col-xs-12 col-sm-8"
                    v-model="formData.billEmail"
                    label="계산서이메일"
                    :label-color="$q.dark.isActive ? 'orange' : 'orange'"
                    :disable="formDisable || formData.billYn !== 'Y'"
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
                <div class="row q-col-gutter-x-xl">
                  <div class="col-12">
                    <q-input
                      stack-label
                      :dense="dense"
                      :disable="formDisable"
                      type="textarea"
                      v-model="formData.remarks2"
                      label="참고사항2"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      autogrow
                      clearable
                      :hint="`${byteCount.remarks2} / 200(한글100)자 까지 입력하실 수 있습니다.`"
                      @update:model-value="updateByteCount('remarks', formData.remarks2, 200)"
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

const $q = useQuasar();
const dense = ref(false);
const isSaveFg = ref(null);

const divCdOptionsSearch = ref(null);
const divCdOptions = ref(null);

const searchParam = reactive({
  divCd: '',
  useYn: 'N',
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

const businNoFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 10) {
    return `${dateStr.slice(0, 3)}-${dateStr.slice(3, 5)}-${dateStr.slice(5)}`;
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
  getDataCommOption('201').then(() => {
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
      field: 'custCd',
      minWidth: 80,
      maxWidth: 80,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '가칭명',
      field: 'custNm',
      minWidth: 150,
      pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    },
    {
      headerName: '법인명',
      field: 'custBusinNm',
      minWidth: 150,
    },
    {
      headerName: '분류',
      field: 'divCdNm',
      minWidth: 150,
    },
    {
      headerName: '위탁',
      field: 'yulWt',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '매절',
      field: 'yulMj',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '현매',
      field: 'yulHm',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '납품',
      field: 'yulNp',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '행사',
      field: 'yulHs',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '신간',
      field: 'yulSg',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '기타',
      field: 'yulGt',
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
      cellClass: 'ag-center-aligned-cell',
      cellStyle: () => {
        return {
          color: $q.dark.isActive ? 'orange' : 'teal',
        };
      },
    },
    {
      headerName: '등록일',
      field: 'makeDay',
      valueFormatter: dateFormatter,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      headerName: '한도액',
      field: 'limitAmt',
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
      headerName: '지역',
      field: 'zoneNm',
      minWidth: 80,
    },
    {
      headerName: '대표자',
      field: 'custOwner',
      minWidth: 100,
    },
    {
      headerName: '사업자등록번호',
      field: 'custBusinNo',
      valueFormatter: businNoFormatter,
      minWidth: 140,
    },
    {
      headerName: '업태',
      field: 'custCond',
      minWidth: 120,
    },
    {
      headerName: '종목',
      field: 'custKind',
      minWidth: 120,
    },
    {
      headerName: '우편번호',
      field: 'custZip',
      minWidth: 120,
    },
    {
      headerName: '소재지',
      field: 'custAddr1',
      minWidth: 200,
    },
    {
      headerName: '담당자',
      field: 'managerNm',
      minWidth: 120,
    },
    {
      headerName: '모바일',
      field: 'mobile',
      minWidth: 150,
    },
    {
      headerName: '전화번호',
      field: 'tel',
      minWidth: 150,
    },
    {
      headerName: '팩스',
      field: 'fax',
      minWidth: 140,
    },
    {
      headerName: '담당자',
      field: 'managerNm',
      minWidth: 120,
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
    {
      headerName: '참조2',
      field: 'remarks2',
      minWidth: 200,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref(null);
const formDataInitialize = () => {
  formData.value = {
    custCd: '',
    custNm: '',
    divCd: '',
    divCdNm: '',
    zoneNm: '',
    custBusinNm: '',
    custOwner: '',
    custBusinNo: '',
    custCond: '',
    custKind: '',
    custZip1: '',
    custAddr1: '',
    custAddr1X: '',
    custZip2: '',
    custAddr2: '',
    custAddr2X: '',
    managerNm: '',
    mobile: '',
    tel: '',
    fax: '',
    yulWt: '0',
    yulHm: '0',
    yulMj: '0',
    yulNp: '0',
    yulTb: '0',
    yulHd: '0',
    yulHs: '0',
    yulSg: '0',
    yulGt: '0',
    limitAmt: '0',
    makeDay: '',
    billYn: '',
    billEmail: '',
    useYn: 'N',
    useExplain: '',
    remarks: '',
    remarks2: '',
  };
};

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const secondFocus = ref(null);
const addDataSection = () => {
  getDataMaxCustCdCheck();
  formDataInitialize();
  oldFormData.value = null;
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg.value = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  formData.value.itemCl = '1';
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
  formData.value.custBusinNo = formData.value.custBusinNo.replace(/-/g, '');
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
    .post('/api/mst/mst2020_save', resFormData)
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
    const response = await api.post('/api/mst/mst2020_maxPages', {
      paramDivCd: searchParam.divCd,
      paramUseYn: searchParam.useYn,
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
    const response = await api.post('/api/mst/mst2020_list', {
      paramDivCd: searchParam.divCd,
      paramUseYn: searchParam.useYn,
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
const getDataMaxCustCdCheck = async () => {
  try {
    const response = await api.post('/api/mst/mst2020_max_codeCheck', {});
    formData.value.custCd = response.data.data[0].maxCd;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resCustCd => {
  try {
    const response = await api.post('/api/mst/mst2020_select', {
      paramCustCd: resCustCd,
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

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '201':
        divCdOptionsSearch.value = [...response.data.data];
        divCdOptions.value = response.data.data;
        divCdOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      default:
        divCdOptionsSearch.value = [];
        divCdOptions.value = [];
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
      getDataSelect(selectedRows.value[0].custCd).then(() => {
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
    onCellValueChanged();
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

// 포맷된 값을 관리하는 computed
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

const addr1Focus = ref(null);
const addr2Focus = ref(null);
const openPostcodeSearch = resFg => {
  new window.daum.Postcode({
    oncomplete: data => {
      if (resFg === '1') {
        formData.value.custZip1 = data.zonecode;
        formData.value.custAddr1 = `${data.address} ${data.buildingName || ''}`;
        addr1Focus.value.focus();
      } else {
        formData.value.custZip2 = data.zonecode;
        formData.value.custAddr2 = `${data.address} ${data.buildingName || ''}`;
        setTimeout(() => {
          addr2Focus.value.focus();
        }, 100);
      }
    },
  }).open();
};
</script>

<style lang="sass" scoped></style>
