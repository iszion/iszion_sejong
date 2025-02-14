<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
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
          <q-card-actions align="right" class="">
            <q-toolbar>
              <div class="row q-col-gutter-md q-py-none">
                <q-input
                  stack-label
                  bottom-slots
                  label-color="orange"
                  v-model="searchValue.textValue"
                  label="검색"
                  class="q-py-none"
                  style="width: 120px"
                  @keyup.enter="getData"
                >
                  <template v-slot:append>
                    <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <q-btn v-if="selectedRows.length === 1" outline color="negative" dense @click="passwordReset">
                <q-icon name="lock_reset" size="xs" class="q-mr-xs" /> 패스워드 Reset
              </q-btn>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn outline color="positive" icon="search" label="조회" @click="getData" />
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
                :rowData="rowData.rows"
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

          <q-card-actions align="right">
            <q-toolbar class="row">
              <div class="q-gutter-xs"></div>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn v-if="isShowSaveBtn" icon="save" label="저장" outline color="primary" @click="saveDataSection" />
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-x-xl">
              <div class="col-12 col-md-6">
                <q-card class="text-center">
                  <q-img
                    :src="`https://www.iszion.com/images/${formData.imageFileNm}?${new Date().getTime()}`"
                    spinner-color="white"
                    style="width: 150px; height: 150px; max-width: 200px"
                    :fit="'scale-down'"
                  />
                  <!--                        <q-img :src="`https://www.iszion.com/images/${formData.imageFileNm}?${new Date().getTime()}`" />-->
                  <q-card-actions>
                    <q-btn
                      v-if="!formDisable"
                      round
                      color="primary"
                      glossy
                      text-color="white"
                      icon="photo_camera"
                      class="cursor-pointer"
                      @click="handleImageUpload"
                    />
                    <q-space />
                    <q-btn
                      v-if="!formDisable"
                      round
                      :disable="isImageDelete"
                      color="red"
                      glossy
                      text-color="white"
                      icon="delete_forever"
                      class="cursor-pointer"
                      @click="handleImageDelete"
                    />
                  </q-card-actions>
                  <!--                        <div class="text-center">{{ formData.imageFileNm }}</div>-->
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  class="text-bold text-subtitle1"
                  ref="userIdFocus"
                  v-model="formData.userId"
                  label="사원번호"
                  label-color="orange"
                  :disable="formDisableUserId"
                  readonly
                />

                <q-input ref="userNmFocus" v-model="formData.userNm" label="성명" label-color="orange" :disable="formDisable" />
                <q-input v-model="formData.userNmx" label="닉네임" label-color="orange" :disable="formDisable" />

                <q-toggle
                  class="q-pt-md"
                  v-model="formData.manager"
                  :disable="formDisable"
                  color="blue"
                  label="담당자"
                  true-value="Y"
                  false-value="N"
                  :label-color="$q.dark.isActive ? 'green' : 'blue'"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-x-xl">
              <q-select
                class="col-xs-12 col-sm-5"
                :disable="formDisable"
                v-model="formData.deptCd"
                :options="deptOptions"
                label="소속팀"
                label-color="orange"
                option-value="commCd"
                option-label="commNm"
                options-dense
                emit-value
                map-options
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

              <q-space />
              <q-select
                class="col-xs-12 col-sm-5"
                options-dense
                :disable="formDisable"
                v-model="formData.titlCd"
                :options="titlOptions"
                option-value="commCd"
                option-label="commNm"
                label="직위"
                label-color="orange"
                emit-value
                map-options
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
            </div>

            <div class="row q-col-gutter-x-xl">
              <q-input class="col-xs-12 col-sm-6" :disable="formDisable" v-model="formData.mobile" label="Mobile" label-color="orange" />
              <q-input class="col-xs-12 col-sm-6" :disable="formDisable" v-model="formData.tel" label="전화번호" label-color="orange" />
            </div>

            <div class="row q-col-gutter-x-xl">
              <q-input class="col-xs-12 col-sm-6" :disable="formDisable" v-model="formData.email" label="이메일" label-color="orange" />
              <q-input
                class="col-xs-12 col-sm-6"
                :disable="formDisable"
                v-model="formData.birthday"
                type="date"
                label="생년월일"
                label-color="orange"
              />
            </div>

            <div class="row q-col-gutter-x-xl">
              <q-input class="col-xs-12 col-sm-6" :disable="formDisable" v-model="formData.inDay" type="date" label="입사일" label-color="orange" />
            </div>

            <div class="col-12">
              <q-input type="textarea" autogrow v-model="formData.explains" label="참고사항" label-color="orange" :disable="formDisable" />
            </div>
          </q-card-section>
        </q-card>
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
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';

import ImageView from 'components/ImageView.vue';
import { useUserInfoStore } from 'src/store/setUserInfo';

const storeUser = useUserInfoStore();

const $q = useQuasar();

let isSaveFg = null;

const deptOptionsSearch = ref(null);
const deptOptions = ref(null);
const pstnOptions = ref(null);
const titlOptions = ref(null);
const isImageDelete = ref(true);
const isSignDelete = ref(true);

const searchValue = reactive({
  textValue: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  formDataInitialize();
  getDataCommOption('501').then(() => {
    getDataCommOption('502').then(() => {
      getData();
    });
  });
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const formDisableUserId = ref(true);
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

const rowData = reactive({ rows: [] });

const dateFormatter = params => {
  const dateStr = params.value;
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

const columnDefs = reactive({
  columns: [
    {
      headerName: '#',
      minWidth: 80,
      maxWidth: 80,
      pinned: 'left',
      valueGetter: function (params) {
        // Customize row numbers as needed
        return params.node.rowIndex + 1;
      },
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'ID',
      field: 'userId',
      pinned: 'left',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      headerName: '성명',
      field: 'userNm',
      minWidth: 100,
      maxWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '',
      field: 'imageFileNm',
      minWidth: 70,
      maxWidth: 70,
      filter: false,
      pinned: 'left',
      cellRenderer: ImageView,
      cellRendererParams: params => {
        // console.log('param: ', JSON.stringify(params.data));
        return {
          // imageData: params.data.imageFileNm, // imageFileNm 필드 데이터 전달
          rowData: {
            userId: params.data.userId,
            userNm: params.data.userNm,
            deptNm: params.data.deptNm,
            titlNm: params.data.titlNm,
            imageFileNm: params.data.imageFileNm,
          }, // 전체 row 데이터 전달 (필요 시)
        };
      },
    },

    {
      headerName: '담당',
      field: 'manager',
      minWidth: 80,
    },
    {
      headerName: '소속팀',
      field: 'deptNm',
      minWidth: 100,
    },
    {
      headerName: '직위',
      field: 'titlNm',
      minWidth: 100,
    },
    {
      headerName: '생년월일',
      field: 'birthday',
      valueFormatter: dateFormatter,
      maxWidth: 130,
      minWidth: 130,
    },
    {
      headerName: 'Mobile',
      field: 'mobile',
      minWidth: 140,
    },
    {
      headerName: '전화',
      field: 'tel',
      minWidth: 140,
    },
    {
      headerName: '이메일',
      field: 'email',
      minWidth: 150,
    },
    {
      headerName: '입사일',
      field: 'inDay',
      valueFormatter: dateFormatter,
      maxWidth: 130,
      minWidth: 130,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '이미지파일명',
      field: 'imageFileNm',
      minWidth: 150,
    },
  ],
});

const oldFormData = ref(null);
const formData = ref({
  userNm: '',
  userNmx: '',
  deptCd: '',
  titlCd: '',
  manager: '',
  mobile: '',
  tel: '',
  email: '',
  inDay: '',
  birthday: '',
  explains: '',
  imageFileNm: '',
  imageFileNmFull: '',
});

const formDataInitialize = () => {
  formData.value.userNm = '';
  formData.value.userNmx = '';
  formData.value.deptCd = '';
  formData.value.titlCd = '';
  formData.value.manager = '';
  formData.value.mobile = '';
  formData.value.tel = '';
  formData.value.email = '';
  formData.value.inDay = '';
  formData.value.birthday = '';
  formData.value.explains = '';
  formData.value.imageFileNm = '';
  formData.value.imageFileNmFull = '';
};

const selectedDept = computed(() => {
  const selectedOption = deptOptions.value.find(option => option.commCd === formData.value.deptCd);
  return selectedOption ? selectedOption.commNm : null;
});

const selectedTitl = computed(() => {
  const selectedOption = titlOptions.value.find(option => option.commCd === formData.value.titlCd);
  return selectedOption ? selectedOption.commNm : null;
});

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const userIdFocus = ref(null);
const userNmFocus = ref(null);

const saveDataSection = () => {
  formData.value.birthday = commUtil.unFormatDate(formData.value.birthday);
  formData.value.inDay = commUtil.unFormatDate(formData.value.inDay);

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
    // alert(JSON.stringify(formData.value));
    saveDataAndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg, formData.value));
  }
};

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};

// ***** 사용자 패스워드 리셋 부분  *****************************//
const passwordReset = () => {
  $q.dialog({
    dark: true,
    title: '패스워드 리셋',
    message: `<p>[ <span class="text-orange text-bold">${formData.value.userNm}</span> ] 의 패스워드를 <span class='text-red text-bold'>초기화</span> 합니다. </p> <p><span class='text-orange'>( <span class='text-red text-bold'>초기화</span> 시 패스워드는 <span class='text-red text-bold'> 아이디</span>와 동일하게 저장됩니다. )</span></p>`,
    html: true,
    // persistent: true,
    cancel: {
      push: true,
      label: '닫기',
      color: 'grey-7',
    },
    ok: {
      push: true,
      label: '진행',
      color: 'negative',
    },
  })
    .onOk(() => {
      savePasswordDataAndHandleResult(jsonUtil.dataJsonParse('no1', 'U', formData.value));
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 인사 이미지 업로드 처리부분 *****************************//
const handleImageUpload = () => {
  // const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  // const isAndroid = /Android/.test(navigator.userAgent);
  // 파일 선택 대화 상자 열기
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정 (선택 사항)
  // input.capture = 'environment'; // 모든 기기에서 카메라만 사용 가능하고 파일선택은 안됨
  // if (isAndroid) {
  //   input.capture = 'camera'; // Force camera usage on Android
  // }
  input.onchange = async event => {
    const file = event.target.files[0];
    // console.log('File object: ', file);
    // console.log('file name : ' + file.name);
    // console.log('File type: ', file.type);
    // console.log('File size: ', file.size);

    if (file) {
      // 파일이 선택된 경우, 여기에서 파일 업로드 로직을 추가할 수 있습니다.
      await uploadFile(file);
      await nextTick();
    }
  };
  input.click();
};

const uploadFile = async file => {
  try {
    const param = new FormData();
    param.append('file', file); // 'file'은 서버에서 받는 파라미터 이름
    param.append('userId', formData.value.userId);
    const response = await api.post('/api/com/com1020_fileSave', param, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더
      },
    });
    // 서버의 응답 처리
    formData.value.imageFileNm = formData.value.userId + '_' + file.name;
    await nextTick(); // Ensure Vue reactivity updates the view

    // console.log('File uploaded successfully:', response.data);
  } catch (error) {
    // 오류 처리
    console.error('Error uploading file:', error);
  }
};

const handleImageDelete = () => {
  $q.dialog({
    dark: true,
    title: '사진 삭제',
    message: '이미지를 삭제 하시겠습니까?',
    ok: {
      label: '삭제하기',
      push: true,
      color: 'negative',
    },
    cancel: {
      label: '취소',
      push: true,
      color: 'grey-7',
    },
  })
    .onOk(() => {
      imageDeleteCall();
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const imageDeleteCall = async () => {
  const response = await api.delete('/api/com/com1020_fileDelete', {
    params: {
      filename: formData.value.imageFileNm,
      userId: formData.value.userId,
    },
  });
  if (response.data === 'SUCCESS') {
    formData.value.imageFileNm = ''; // 이미지 삭제 후 이미지 파일명을 비움
    let saveStatus = {
      rtn: '0',
      rtnMsg: '삭제되었습니다',
    };
    notifySave.notifyView1(saveStatus, 1000);
  } else {
    let saveStatus = {
      rtn: '3',
      rtnMsg: '삭제실패~~~',
    };
    notifySave.notifyView1(saveStatus, 1000);
  }
};

const saveDataAndHandleResult = resFormData => {
  // console.log('save::: ', JSON.stringify(resFormData));
  api
    .post('/api/com/com1020_save_user', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.oldUserId = formData.value.userId;

          let newData = [formData.value];
          newData[0].deptNm = selectedDept.value;
          newData[0].titlNm = selectedTitl.value;
          myGrid.value.api.applyTransaction({
            add: newData,
            addIndex: 0,
          });
        } else if (isSaveFg === 'U') {
          const selectedData = myGrid.value.api.getSelectedRows();
          // selectedData[0] = { ...formData.value };
          selectedData[0].userId = formData.value.userId;
          selectedData[0].userNm = formData.value.userNm;
          selectedData[0].userNmx = formData.value.userNmx;
          selectedData[0].deptCd = formData.value.deptCd;
          selectedData[0].birthday = formData.value.birthday;
          selectedData[0].mobile = formData.value.mobile;
          selectedData[0].tel = formData.value.tel;
          selectedData[0].email = formData.value.email;
          selectedData[0].manager = formData.value.manager;
          selectedData[0].inDay = formData.value.inDay;

          selectedData[0].imageFileNm = formData.value.imageFileNm;
          selectedData[0].imageFileNmFull = formData.value.imageFileNmFull;

          selectedData[0].deptNm = selectedDept.value;
          selectedData[0].titlNm = selectedTitl.value;

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
// ***** 인사정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/com/com1020_list_user', {
      paramCompCd: storeUser.compCd,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 인사정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resUserId => {
  try {
    const response = await api.post('/api/com/com1020_select_user', { paramUserId: resUserId });
    formData.value = response.data.data;

    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.birthday = commUtil.formatDate(response.data.data.birthday);
    formData.value.inDay = commUtil.formatDate(response.data.data.inDay);
    formData.value.outDay = commUtil.formatDate(response.data.data.outDay);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사원번호 중복체크 부분  *****************************//
const getDataUserIdCheck = async () => {
  try {
    const response = await api.post('/api/com/com1020_userId_check', { paramUserId: formData.value.userId });
    if (response.data.data.ch === 0) {
      formDisable.value = false;
      setTimeout(() => {
        userNmFocus.value.focus();
      }, 100);
    } else {
      formData.value.userId = null;
      userIdFocus.value.focus();
      formDisable.value = true;
      $q.notify({
        position: 'top-right',
        type: 'negative',
        message: '중복된 사원번호가 존재합니다. 다른 사원번호로 입력하세요.',
        timeout: 1000,
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 패스워드 초기화 처리부분 *****************************//
const savePasswordDataAndHandleResult = resFormData => {
  api
    .post('/api/com/com1020_save_passwordReset', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/com/xComm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '501':
        deptOptions.value = response.data.data;
        deptOptionsSearch.value = JSON.parse(JSON.stringify(deptOptions.value));
        deptOptionsSearch.value.unshift({ commCd: '', commNm: '전체' });
        break;
      case '502':
        titlOptions.value = response.data.data;
        break;
      default:
        deptOptions.value = [];
        titlOptions.value = [];
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
  rowSelection: 'single' /* 'single' or 'multiple',*/,
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
      getDataSelect(selectedRows.value[0].userId);
      isImageDelete.value = selectedRows.value[0].imageFileNm;
      isShowStatusEdit.value = true;
      isShowSaveBtn.value = true;
      statusEdit.icon = 'edit_note';
      statusEdit.message = '수정/삭제모드 입니다';
      statusEdit.color = 'accent';
      isSaveFg = 'U';
      formDisableUserId.value = true;
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

  debug: false,
};
</script>

<style scoped></style>
