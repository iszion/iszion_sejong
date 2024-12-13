<template>
  <q-page padding>
    <q-card class="q-pa-xs">
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">나의정보</q-item-label>
      </q-card-section>
      <q-card-section class="row q-col-gutter-x-xl q-py-md">
        <div class="col-12 col-sm-auto q-py-md flex flex-center">
          <div>
            <q-avatar square size="180px">
              <q-img
                :src="`https://www.iszion.com/images/${formData.imageFileNm}?${new Date().getTime()}`"
                style="object-fit: cover; width: 100%; height: 100%"
              />
              <!--              <q-img :src="`https://www.iszion.com/images/${formData.imageFileNm}?${new Date().getTime()}?${new Date().getTime()}`" />-->
            </q-avatar>
            <!--            <q-avatar square size="180px"> <q-img :src="`https://www.iszion.com/images/${formData.imageFileNm}`" /></q-avatar>-->
            <div class="row q-py-md">
              <q-btn round color="primary" glossy text-color="white" icon="photo_camera" class="cursor-pointer" @click="handleImageUpload" />
              <q-space />
              <q-btn
                round
                :disable="formData.imageFileNm"
                color="red"
                glossy
                text-color="white"
                icon="delete_forever"
                class="cursor-pointer"
                @click="handleImageDelete"
              />
            </div>
          </div>
        </div>
        <!--        <div class="col-12 col-sm-grow column justify-between">-->
        <div class="col-12 col-sm-grow justify-between q-gutter-y-md">
          <div class="row items-center">
            <span class="text-h5 text-weight-bold">{{ formData.empNm }}</span>
            <q-space />
            <div class="q-gutter-x-sm">
              <!--              <q-btn outline color="secondary" label="프로필 수정" />-->
              <q-btn outline color="secondary" label="패스워드 변경" @click="isDialogVisible = true" />
              <q-btn @click="promptInstall" id="installButton" label="App 홈화면추가" color="primary" />
            </div>
          </div>
          <!--          <div class="q-gutter-x-lg">-->
          <!--            <span>{{ formData.empCd }}</span>-->
          <!--            <span>팔로워 2,000</span>-->
          <!--            <span>팔로우 3,000</span>-->
          <!--          </div>-->
          <div class="q-gutter-y-xs text-subtitle1">
            <div>
              사번 : <span class="text-bold text-orange"> {{ formData.empCd }}</span>
            </div>
            <div>
              소속 : <span class="text-bold text-orange"> {{ formData.deptNm }}</span>
            </div>
            <div>
              직위 : <span class="text-bold text-orange"> {{ formData.pstnNm }}</span>
            </div>
            <div>
              직급 : <span class="text-bold text-orange"> {{ formData.titlNm }}</span>
            </div>
            <div>
              전화 : <span class="text-bold text-orange"> {{ formData.mobile }}</span>
            </div>
            <div>
              메일 : <span class="text-bold text-orange"> {{ formData.email }}</span>
            </div>
            <div>
              이미지 : <span class="text-bold text-orange"> {{ formData.imageFileNm }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
  <q-dialog v-model="isDialogVisible" @show="onDialogShow" @hide="onDialogHide">
    <q-card flat bordered style="max-width: 520px; width: 100%">
      <q-card-section>
        <div class="text-h4 text-center text-weight-bold">패스워드 변경</div>
      </q-card-section>
      <q-card-section>
        <div class="text-center text-subtitle2 text-grey">패스워드 변경 시 다시 로그인합니다. 😊</div>
      </q-card-section>
      <q-card-section>
        <div class="q-px-xl q-mb-sm">
          <q-input v-model="form.oldPassword" :type="isPwd1 ? 'password' : 'text'" label="패스워드" hint="현재 패스워드를 입력하세요" class="">
            <template v-slot:append>
              <q-icon :name="isPwd1 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd1 = !isPwd1" />
            </template>
          </q-input>
        </div>
        <div class="q-gutter-y-sm q-pa-xl">
          <!--            class="q-mt-md"-->
          <q-input v-model="form.newPassword" :type="isPwd2 ? 'password' : 'text'" label="새로운 패스워드" hint="새로운 패스워드를 입력하세요">
            <template v-slot:append>
              <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
            </template>
          </q-input>
          <q-input v-model="form.newPasswordX" :type="isPwd3 ? 'password' : 'text'" label="패스워드(확인)" hint="다시한번 입력하세요">
            <template v-slot:append>
              <q-icon :name="isPwd3 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd3 = !isPwd3" />
            </template>
          </q-input>
        </div>
        <div class="row">
          <q-btn class="full-width q-mt-lg" unelevated color="primary" size="lg" label="변경하기" @click="passwordChangeSave" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { nextTick, onBeforeMount, ref } from 'vue';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { api } from 'boot/axios';
import { QBtn, QIcon, useQuasar } from 'quasar';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useRouter } from 'vue-router';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const $q = useQuasar();
const router = useRouter();

const isDialogVisible = ref(false);
const rowData = ref(null);
const formData = ref({
  empCd: '',
  empNm: '',
  deptCd: '',
  deptNm: '',
  pstnCd: '',
  pstnNm: '',
  titlCd: '',
  titlNm: '',
  mobile: '',
  email: '',
  imageFileNm: '',
});

const isPwd1 = ref(true);
const isPwd2 = ref(true);
const isPwd3 = ref(true);
const form = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordX: '',
});

onBeforeMount(() => {
  getData().then(() => {
    formData.value = rowData.value;
  });
});

const onDialogShow = () => {};
const onDialogHide = () => {};

const passwordChangeSave = () => {
  if (form.value.newPassword === form.value.newPasswordX) {
    api
      .post('/api/sys/passwordCheck', {
        paramUserId: storeUser.setEmpCd,
        paramOldPassword: form.value.oldPassword,
        paramNewPassword: form.value.newPassword,
      })
      .then(res => {
        if (res.data.data) {
          passwdSave();
        } else {
          $q.dialog({
            dark: true,
            title: '안내',
            message: '패스워드가 변경되지 않았습니다. 패스워드를 확인하고 다시 입력하세요',
          })
            .onOk(() => {})
            .onCancel(() => {})
            .onDismiss(() => {});
        }
      })
      .catch(res => {
        console.log(res);
        console.log('error1');
      });
  } else {
    $q.dialog({
      dark: true,
      title: '패스워드체크',
      message: '새로운 패스워드가 불일치 합니다. 다시 입력하세요',
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {});
  }
};
const passwdSave = () => {
  let iu = [];
  let iuD = [];

  let formData = {};
  formData.userId = storeUser.setEmpCd;
  formData.newPasswd = form.value.newPassword;
  let tmpJson = '{"mode": "U","data":' + JSON.stringify(formData) + '}';
  iu.push(tmpJson);
  saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD)).then(val => {
    if (val.rtn === '0') {
      isDialogVisible.value = false;
      logout();
    }
  });
};

const accessToken = sessionStorage.getItem('accessToken');
const refreshToken = sessionStorage.getItem('refreshToken');

const tokenData = ref({
  accessToken: accessToken,
  refreshToken: refreshToken,
});
const logout = () => {
  api
    .post('/api/auth/logout', tokenData.value)
    .then(res => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      router.push({ path: '/' });
    })
    .catch(res => {
      console.log('Error');
    });
};

// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/sys/passwdUpdate_save', resFormData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus; // saveStatus 객체를 반환
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

// ***** 유저정보 처리 부분 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1010_select', { paramStdYear: storeYear.setYear, paramEmpCd: storeUser.setEmpCd });
    rowData.value = response.data.data[0];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 유저정보 처리 부분 끝 *****************************//

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
      await uploadFile(file).then(() => {
        // formData.value.imageFileNm = formData.value.empCd + '_' + file.name;
        // console.log('filename last : ', formData.value.imageFileNm);
      });
      await nextTick();
    }
  };
  input.click();
};

const uploadFile = async file => {
  try {
    const param = new FormData();
    param.append('file', file); // 'file'은 서버에서 받는 파라미터 이름
    param.append('empCd', formData.value.empCd);
    const response = await api.post('/api/mst/mst1010_fileSave', param, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더
      },
    });
    // 서버의 응답 처리
    console.log(file.name, ' === ', JSON.stringify(file));
    formData.value.imageFileNm = formData.value.empCd + '_' + file.name;
    await nextTick(); // Ensure Vue reactivity updates the view

    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    // 오류 처리
    console.error('Error uploading file:', error);
  }
};

const handleImageDelete = () => {
  $q.dialog({
    dark: true,
    title: '사진삭제',
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
  const response = await api.delete('/api/mst/mst1010_fileDelete', {
    params: {
      filename: formData.value.imageFileNm,
      empCd: formData.value.empCd,
    },
  });
  // console.log('delete : ' + response);
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

// ******** 홈 화면 추가 설정 **************
let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  // 모바일에 미니 정보 표시줄이 나타나지 않도록 합니다.
  e.preventDefault();
  // 나중에 트리거할 수 있도록 이벤트를 보관합니다.
  deferredPrompt = e;

  // 선택적으로 사용자가 설치를 수동으로 트리거할 수 있는 버튼을 만들 수 있습니다.
  document.querySelector('#installButton').style.display = 'block';
});

const promptInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the installation');
    } else {
      console.log('User dismissed the installation');
    }
    deferredPrompt = null;
  } else {
    console.log('err : ', deferredPrompt);
  }
};
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #fafafa;
}
</style>
