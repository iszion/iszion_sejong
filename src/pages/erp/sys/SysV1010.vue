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
    <q-card bordered>
      <!--  end of contents list title bar -->
      <q-card-actions align="right" class="">
        <q-toolbar>
          <q-btn outline icon="refresh" color="primary" label="다시불러오기" @click="getDataSelect" />
          <q-space />
          <q-btn outline icon="save" color="primary" label="저장" @click="saveDataSection" />
        </q-toolbar>
      </q-card-actions>

      <q-separator size="3px" />

      <q-card-section class="q-pa-none">
        <div class="q-pa-md q-gutter-y-sm">
          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-6 text-subtitle1"
              v-model="formData.compBusinNm"
              label="법인명"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />

            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-3 text-subtitle1"
              v-model="formData.compBusinNo"
              label="사업자등록번호"
              mask="###-##-#####"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-3 text-subtitle1"
              v-model="formData.compOwner"
              label="대표자"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
          </div>

          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              class="col-xs-12 col-sm-2 text-subtitle1"
              :dense="dense"
              v-model="formData.compZip1"
              label="우편번호"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="5"
            >
              <template v-slot:append>
                <q-icon size="0.8em" v-if="formData.compZip1 !== ''" name="close" @click="formData.compZip1 = ''" class="cursor-pointer q-pt-md" />
                <q-icon size="0.8em" name="search" @click="openPostcodeSearch('1')" class="cursor-pointer q-pt-md" />
              </template>
            </q-input>

            <q-input
              outlined
              class="col-xs-12 col-sm-7 text-subtitle1"
              :dense="dense"
              v-model="formData.compAddr1"
              label="소재지"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="100"
            />
            <q-input
              outlined
              class="col-xs-12 col-sm-3 text-subtitle1"
              ref="addr1xFocus"
              :dense="dense"
              v-model="formData.compAddr1x"
              label="상세주소"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="100"
            />
          </div>

          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              class="col-xs-12 col-sm-2 text-subtitle1"
              :dense="dense"
              v-model="formData.compZip2"
              label="우편번호(우편물)"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="5"
            >
              <template v-slot:append>
                <q-icon size="0.8em" v-if="formData.compZip2 !== ''" name="close" @click="formData.compZip2 = ''" class="cursor-pointer q-pt-md" />
                <q-icon size="0.8em" name="search" @click="openPostcodeSearch('2')" class="cursor-pointer q-pt-md" />
              </template>
            </q-input>

            <q-input
              outlined
              class="col-xs-12 col-sm-7 text-subtitle1"
              :dense="dense"
              v-model="formData.compAddr2"
              label="소재지(우편물)"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="100"
            />

            <q-input
              outlined
              class="col-xs-12 col-sm-3 text-subtitle1"
              ref="addr2xFocus"
              :dense="dense"
              v-model="formData.compAddr2x"
              label="상세주소(우편물)"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="100"
            />
          </div>

          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-6 text-subtitle1"
              v-model="formData.compCond"
              label="업태"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-6 text-subtitle1"
              v-model="formData.compKind"
              label="종목"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
          </div>

          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-3 text-subtitle1"
              v-model="formData.manager"
              label="담당자"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-3 text-subtitle1"
              v-model="formData.mobile"
              label="휴대전화"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />

            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-3 text-subtitle1"
              v-model="formData.tel"
              label="전화번호"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-3 text-subtitle1"
              v-model="formData.fax"
              label="팩스"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />
          </div>

          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-4 text-subtitle1"
              v-model="formData.compEmail"
              label="이메일"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />

            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-4 text-subtitle1"
              v-model="formData.billEmail"
              label="이메일(계산서용)"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
              maxlength="50"
            />

            <q-input
              outlined
              :dense="dense"
              class="col-xs-12 col-sm-4 text-subtitle1"
              v-model="formData.estDay"
              type="date"
              label="설립일"
              :label-color="$q.dark.isActive ? 'green' : 'blue'"
              :disable="formDisable"
            />
            <q-space />
          </div>

          <div class="row q-col-gutter-x-xl">
            <q-input
              outlined
              class="col-12 text-subtitle1"
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
      </q-card-section>
    </q-card>
    <!--  end of contents list -->
  </q-page>
</template>

<script setup>
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import { useUserInfoStore } from 'src/store/setUserInfo';

const storeUser = useUserInfoStore();

const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;

const formDisable = ref(false);

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
  // 업체유형
  getDataSelect();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const oldFormData = ref(null);
const formData = ref({
  compCd: storeUser.compCd,
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
  mobile: '',
  tel: '',
  fax: '',
  estDay: '',
  explains: '',
});

const saveDataSection = () => {
  formData.value.estDay = commUtil.unFormatDate(formData.value.estDay);
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
    saveDataAndHandleResult(jsonUtil.dataJsonParse('no1', 'U', formData.value));
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  console.log('save : ', JSON.stringify(resFormData));
  api
    .post('/api/com/com1010_save_user', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
      getDataSelect();
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

const getDataSelect = async () => {
  console.log('dd : ', storeUser.compCd);
  try {
    const response = await api.post('/api/com/com1010_select_user', {
      paramCompCd: storeUser.compCd,
    });
    formData.value = response.data.data;
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.estDay = commUtil.formatDate(response.data.data.estDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

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
