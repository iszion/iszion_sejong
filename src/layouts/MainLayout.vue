<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="shadow-3" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar>
        <q-btn flat dense round aria-label="Menu" @click="toggleLeftDrawer" class="q-mr-md" :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
          ><q-icon name="menu" size="sm" />
        </q-btn>

        <!--        <q-avatar square size="sm" @click="handleHomeClick" class="cursor-pointer">-->
        <!--          <img src="../assets/images/iszion_logo.png" />-->
        <!--        </q-avatar>-->
        <div
          class="text-h6 text-bold text-deep-orange q-pl-sm self-center cursor-pointer"
          :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
          @click="handleHomeClick"
        >
          <!--          {{ $t('project_name') }}-->
          {{ storeUser.compNm }}
        </div>

        <q-space />
        <!--  Main Menu List -->
        <q-tabs
          v-model="activeTab"
          active-class="text-orange text-bold"
          dense
          no-caps
          inline-label
          align="center"
          active-color="primary"
          indicator-color="orange"
          v-if="$q.screen.gt.sm"
        >
          <template v-for="m in menuListData.mainMenu" :key="m.menu_cd">
            <q-tab :name="m.name" @click="selectMenu(m)" class="text-bold text-subtitle2">
              <q-icon :name="m.icon" class="q-mr-xs" :class="$q.dark.isActive ? 'text-white' : 'text-dark'" />
              <q-tooltip class="lt-sm bg-indigo" :offset="[10, 10]">
                {{ m.label }}
              </q-tooltip>
              <span class="gt-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">{{ m.label }}</span>
              <!--              {{ $q.screen.md ? null : $t(m.labelExt) }}-->
            </q-tab>
          </template>
          <!--        <q-route-tab icon="menu" exact replace label="종합정보1" to="inf" />-->
        </q-tabs>
        <!--  end of Main Menu List -->
        <q-space />
        <q-separator class="q-mx-sm-sm" :class="$q.dark.isActive ? 'light' : 'dark'" vertical inset />
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
          @click="toggleDarkMode"
        >
          <q-tooltip
            class="bg-amber text-black shadow-4"
            anchor="top middle"
            self="bottom middle"
            transition-show="rotate"
            transition-hide="rotate"
            :offset="[10, 10]"
          >
            <q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" size="0.8rem" />
            <strong v-if="$q.dark.isActive"> 라이트모드 전환하기 </strong>
            <strong v-if="!$q.dark.isActive"> 다크모드 전환하기 </strong>
          </q-tooltip>
        </q-btn>
        <!-- dark_mode-->
        <q-separator v-if="$q.screen.xs" class="q-mx-sm-sm" :class="$q.dark.isActive ? 'light' : 'dark'" vertical inset />
        <!-- MAIN MENU ICON  -->
        <q-btn v-if="!$q.screen.gt.sm" flat round dence icon="apps" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
          <q-menu :offset="[40, 10]" transition-show="flip-right" transition-hide="flip-left">
            <q-list dense style="min-width: 100px">
              <template v-for="m in menuListData.mainMenu" :key="m.menu_cd">
                <q-item clickable @click="selectMenu(m)">
                  <q-item-section avatar>
                    <q-icon color="primary" :name="m.icon" />
                  </q-item-section>
                  <q-item-section>{{ $t(m.labelExt) }}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- MAIN MENU ICON  끝  -->
        <q-separator class="q-mx-sm-sm" :class="$q.dark.isActive ? 'light' : 'dark'" vertical inset />

        <!-- 사용자 관리 ICON   -->
        <q-btn flat size="sm" class="q-pa-none q-ml-sm">
          <div v-if="!$q.screen.xs">
            <div v-show="$q.screen.gt.md" class="text-subtitle2 text-bold q-mr-sm text-orange" style="font-size: 1.2em">
              {{ storeUser.deptNm }}
            </div>
            <div class="text-subtitle2 text-bold q-mr-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">{{ storeUser.userNm }}</div>
          </div>
          <q-avatar rounded color="white" class="flex flex-center">
            <q-img
              v-if="userImageName"
              loading="eager"
              :src="`https://www.iszion.com/images/thumb/${userImageName}?${new Date().getTime()}`"
              style="object-fit: cover; width: 100%; height: 100%"
            />
            <!--            <q-img loading="eager" :src="`https://www.iszion.com/images/thumb/${userImageName}?${new Date().getTime()}`" />-->
            <q-icon v-if="!userImageName" name="face" color="teal" size="40px" style="height: 40px" />
          </q-avatar>
          <q-menu :offset="[0, 10]" transition-show="scale" transition-hide="scale">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/main/profile">
                <q-item-section>{{ $t('header_menu_profile') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="logout">{{ $t('header_menu_logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- 사용자 관리 ICON 끝  -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" :width="230">
      <div v-if="mainMenuTitle.titleName" class="row q-px-sm q-pt-md q-pb-sm justify-between" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-6'">
        <div class="text-subtitle1 text-bold">
          [ {{ $te(mainMenuTitle.titleName) ? $t(mainMenuTitle.titleName) : mainMenuTitle.titleName }} 관리 ]
        </div>
        <div>
          <q-btn :disable="!nodeValue.menuData.label" class="q-px-xs" flat size="11px" icon="bookmark_add" @click="addFavorites">
            <q-tooltip
              class="bg-amber text-black shadow-4"
              anchor="top middle"
              self="bottom middle"
              transition-show="rotate"
              transition-hide="rotate"
              :offset="[10, 10]"
            >
              <q-icon name="menu_book" size="0.8rem" />
              <strong> 즐겨찾기 저장하기 </strong>
            </q-tooltip>
          </q-btn>

          <q-btn :disable="!nodeValue.menuData.label" class="q-px-xs" flat size="11px" icon="menu_book" @click="handleHelpDialog">
            <q-tooltip
              class="bg-amber text-black shadow-4"
              anchor="top middle"
              self="bottom middle"
              transition-show="rotate"
              transition-hide="rotate"
              :offset="[10, 10]"
            >
              <q-icon name="menu_book" size="0.8rem" />
              <strong> 사용설명서 </strong>
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-separator size="2px" />
      <q-input class="q-mb-lg q-px-lg" dense ref="filterRef" v-model="filter" placeholder="Search" :hint="$t('searchWordMenu')">
        <template v-slot:append>
          <q-icon
            :name="filter !== '' ? 'clear search' : 'search'"
            class="cursor-pointer"
            :class="filter !== '' ? 'q-pr-md' : ''"
            @click="resetFilter"
          />
        </template>
      </q-input>

      <q-tree
        dense
        :nodes="menuList"
        node-key="id"
        :icon-key="'icon'"
        :filter="filter"
        v-model:expanded="treeExpanded"
        no-connectors
        :selected-color="$q.dark.isActive ? 'orange' : 'blue-14'"
        v-model:selected="selected"
        @click="handleNodeClick"
      >
        <template #header-folder="props">
          <div class="row items-center">
            <q-icon :color="$q.dark.isActive ? 'orange' : 'blue'" size="12px" class="q-mr-sm" :name="props.node.icon || 'share'" />
            <div class="text-bold" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
              {{ $te(props.node.labelExt) ? $t(props.node.labelExt) : props.node.label }}
            </div>
          </div>
        </template>
        <template #default-header="props">
          <div class="row items-center">
            <q-icon :color="$q.dark.isActive ? 'white' : 'dark'" size="12px" class="q-mr-sm" :name="props.node.icon || 'share'" />
            <div class="">
              {{ $te(props.node.labelExt) ? $t(props.node.labelExt) : props.node.label }}
            </div>
          </div>
        </template>
      </q-tree>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

    <footer-bar />
  </q-layout>
  <q-dialog maximized v-model="helpDialogVisible">
    <page-manual :message="nodeValue" />
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import FooterBar from 'layouts/FooterBar.vue';
import { QIcon, useQuasar, SessionStorage, QBtn } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { api } from '/src/boot/axios';
import PageManual from 'components/comm/PageManual.vue';
import notifySave from 'src/js_comm/notify-save';
import JsonUtil from 'src/js_comm/json-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const $q = useQuasar();
const router = useRouter();

const activeTab = ref(null);
const filter = ref('');
const filterRef = ref(null);
const selected = ref(null);
const helpDialogVisible = ref(false);

const handleHelpDialog = () => {
  helpDialogVisible.value = true;
};
/* ******************************************************************************* */
/* ************   menu set  ****************************************************** */
/* ******************************************************************************* */
const menuList = ref([]);
const menuIcon = ref(null);
const mainMenuTitle = ref({
  titleName: '',
  titleCd: '',
});
const treeExpanded = ref([]);
const pageTitleBarVisible = ref(false);

const resetFilter = () => {
  filter.value = '';
  filterRef.value.focus();
};

const selectMenu = m => {
  getMenuTreeReset();

  // console.log('m ; ', m);
  setTimeout(() => {
    selected.value = null;
    menuIcon.value = m.icon;
    mainMenuTitle.value.titleName = m.labelExt;
    mainMenuTitle.value.titleCd = m.name;
    if (m.name === 'fav') {
      getFavMenuData(m.name);
    } else {
      getSubMenuData(m.name);
    }
  }, 100);
};

let tree = [];
function buildTreeMenuData(data) {
  tree = [];
  const map = {};

  // First pass: create a map of all items using mn1 and mn2
  data.forEach(item => {
    map[item.menuId] = { ...item, children: [] };
  });
  // Second pass: build the tree structure
  Object.values(map).forEach(item => {
    treeExpanded.value.push(item.id);
    treeExpanded.value.push(item.disabled);
    if (item.menuParent === '#') {
      // Top-level menu
      tree.push(item);
      nodeValue.value.submenuName = item.labelExt;
      nodeValue.value.menuData = {};
    } else {
      // Submenu
      const parent = map[item.menuParent] || map[item.menuId];
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  return tree;
}

/* ******************************************************************************* */
/* ************  end of menu set  ************************************************ */
/* ******************************************************************************* */

/* ******************************************************************************* */
/* ************   Head Main Control Menu toggle, 언어, darkMode    **************** */
/* ******************************************************************************* */
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set('darkMode', $q.dark.isActive);
  selectLanguage('ko-KR');
};

const selectLanguage = val => {
  import(`../../node_modules/quasar/lang/${val}.js`).then(lang => {
    $q.lang.set(lang.default);
    locale.value = val;
    $q.localStorage.set('lang', val);
  });
};

const { locale } = useI18n();

onBeforeMount(() => {
  selectLanguage('ko-KR');
  storeUser.userId = SessionStorage.getItem('userId');
  getDataSetUserInfo().then(() => {
    getDataMainMenu();
  });
});

onMounted(() => {
  if ($q.screen.width >= $q.screen.sizes.sm) {
    toggleLeftDrawer();
    menuList.value = [];
  }
});

// 메인화면 재시작 (평가기준년도 변경시 실행)
const handleHomeClick = () => {
  rootView();
};
const rootView = () => {
  leftDrawerOpen.value = false;
  pageTitleBarVisible.value = false;
  activeTab.value = null;
  menuList.value = [];

  router.push({ path: '/main' });
};
/* ******************************************************************************* */
/* ************  end of Head Main Control select  ******************************** */
/* ******************************************************************************* */

/* ******************************************************************************* */
/* ************   tree Click select data    ************************************** */
/* ******************************************************************************* */
const nodeValue = ref({
  submenuName: '',
  menuData: {},
});
const handleNodeClick = () => {
  if (!selected.value) return false;
  pageTitleBarVisible.value = true;
  nodeValue.value.menuData = findValueById(menuList.value, selected.value);
  if (nodeValue.value.menuData.children.length === 0) {
    // console.log('node : ', JSON.stringify(nodeValue.value.menuData));
    router.push({
      path: nodeValue.value.menuData.url,
      state: { label: nodeValue.value.menuData.label },
    });
  }
};
function findValueById(data, id) {
  for (const node of data) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const foundValue = findValueById(node.children, id);
      if (foundValue !== null) {
        return foundValue;
      }
    }
  }
  return null; // Return null if id is not found
}

/* ******************************************************************************** */
/* ******    end of tree Click select data     ************************************ */
/* ******************************************************************************** */

/* ******************************************************************************** */
/* ******    token 처리 부분   ****************************************************** */
/* ******************************************************************************** */

const accessToken = sessionStorage.getItem('accessToken');
const refreshToken = sessionStorage.getItem('refreshToken');

const form = ref({
  accessToken: accessToken,
  refreshToken: refreshToken,
});
const logout = () => {
  api
    .post('/api/auth/logout', form.value)
    .then(res => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      router.push({ path: '/' });
    })
    .catch(res => {
      console.log('Error');
    });
};

/* ******************************************************************************** */
/* ******  end of  token 처리 부분   ************************************************ */
/* ******************************************************************************** */

// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 유저정보 처리 부분 *****************************//
const userImageName = ref(null);
const getDataSetUserInfo = async () => {
  try {
    const response = await api.post('/api/com/user_info', { paramUserId: storeUser.userId });

    userImageName.value = response.data.data.imageFileNm;

    if (!response.data.data.levelCd) {
      response.data.data.levelCd = '9011004';
    }

    // console.log('set1 : ', JSON.stringify(response));
    storgeUserInfoGroupSave(
      response.data.data.userId +
        '|' +
        response.data.data.userNm +
        '|' +
        response.data.data.userNmx +
        '|' +
        response.data.data.compCd +
        '|' +
        response.data.data.compNm +
        '|' +
        response.data.data.deptCd +
        '|' +
        response.data.data.deptNm +
        '|' +
        response.data.data.titlCd +
        '|' +
        response.data.data.titlNm +
        '|' +
        response.data.data.levelCd.charAt(response.data.data.levelCd.length - 1) +
        '|' +
        response.data.data.levelNm,
    );
    // console.log('set2 : ', JSON.stringify(response));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 유저정보 설정 부분 *****************************//
const storgeUserInfoGroupSave = resSetUserInfoGroup => {
  SessionStorage.set('setUserInfoGroup', resSetUserInfoGroup);
  getStorgeSetUserInfoGroup();
};

const getStorgeSetUserInfoGroup = () => {
  const _value = SessionStorage.getItem('setUserInfoGroup').split('|');
  storeUser.userId = _value[0];
  storeUser.userNm = _value[1];
  storeUser.userNmx = _value[2];
  storeUser.compCd = _value[3];
  storeUser.compNm = _value[4];
  storeUser.deptCd = _value[5];
  storeUser.deptNm = _value[6];
  storeUser.titlCd = _value[7];
  storeUser.titlNm = _value[8];
  storeUser.levelCd = _value[9];
  storeUser.levelNm = _value[10];
};
// ***** 유저정보 처리 부분 끝 *****************************//

// ***** DataBase 메인메뉴자료 가져오기 부분 *****************************//
const menuListData = reactive({
  mainMenu: {},
  subMenu: {},
});
const getDataMainMenu = async () => {
  console.log('comp : ', storeUser.compCd);
  try {
    const response = await api.post('/api/com/menu_main_list', { paramCompCd: storeUser.compCd, paramUserId: storeUser.userId });
    menuListData.mainMenu = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getSubMenuData = async param => {
  try {
    const response = await api.post('/api/sys/menu_sub_list', {
      paramCompCd: storeUser.compCd,
      paramGroupCd: param,
      paramUserId: storeUser.userId,
    });

    const tmpMenu = response.data.data;

    // 사용자별 메뉴 추출 시 메뉴가 없는 헤더항목을 제거하는 부분
    // const menuIdValues = new Set(tmpMenu.map(entry => entry.menuId));
    const setMenuList = tmpMenu.filter(entry => {
      if (entry.menuParent === '#') {
        // Check if this menuId is a parent of any other menuParent
        return tmpMenu.some(e => e.menuParent === entry.menuId);
      }
      return true;
    });
    // 사용자별 메뉴 추출 시 메뉴가 없는 헤더항목을 제거하는 부분 끝

    // 평가기간 작업 유형에 따른 메뉴 셋팅부분
    let _disable = false;
    const _menuList = setMenuList.map(item => {
      if (item.progId !== '') {
        return { ...item, disabled: _disable };
      } else {
        return item;
      }
    });
    // 평가기간 작업 유형에 따른 메뉴 셋팅부분  끝

    menuList.value = buildTreeMenuData(_menuList);

    leftDrawerOpen.value = true;
    pageTitleBarVisible.value = true;
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// 즐겨찾기
const getFavMenuData = async param => {
  const paramData = { paramUserId: storeUser.userId };
  try {
    const response = await api.post('/api/sys/menu_fav_list', paramData);

    menuList.value = buildTreeMenuData(response.data.data);
    menuList.value.forEach(item => addDisabled(item));
    // console.log('get :: ', JSON.stringify(menuList.value));

    leftDrawerOpen.value = true;
    pageTitleBarVisible.value = true;
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
function addDisabled(obj) {
  let _disable = false;
  if (obj.progId !== '') {
    obj.disabled = _disable;
  }
  if (obj.children) {
    obj.children.forEach(child => addDisabled(child));
  }
}
// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// ***** 즐겨찾기 정보저장 설정 부분 *****************************//
const addFavorites = () => {
  $q.dialog({
    dark: true,
    title: nodeValue.value.menuData.label,
    message: '즐겨찾기에 저장 하시겠습니까?',
    ok: {
      flat: true,
      push: true,
    },
    cancel: {
      flat: true,
      push: true,
    },
    // persistent: true,
  })
    .onOk(() => {
      // console.log('>>>> OK')
      // console.log(JSON.stringify(nodeValue.value.menuData));
      // favoritesSaveSection(resMsgProp.message.menuData);
      const resData = nodeValue.value.menuData;
      // console.log(JSON.stringify(resData));

      let iu = [];
      let iuD = [];
      let jsonFormData = {
        userId: storeUser.userId,
        location: 'fav',
        progNm: resData.label,
        progId: resData.progId,
        icon: resData.icon,
        type: 'file',
      };
      let tmpJson = '{"mode":"I","data":' + JSON.stringify(jsonFormData) + '}';
      iu.push(tmpJson);
      const resFormData = JsonUtil.jsonFiller('no1', iu, iuD);
      api
        .post('/api/sys/fav_save', resFormData)
        .then(res => {
          let saveStatus = {};
          saveStatus.rtn = res.data.rtn;
          saveStatus.rtnMsg = res.data.rtnMsg;
          notifySave.notifyView(saveStatus);
        })
        .catch(error => {
          let saveStatus = {};
          saveStatus.rtn = '2';
          saveStatus.rtnMsg = '처리되지 않았습니다.';
          notifySave.notifyView(saveStatus);
          console.log('error: ', error);
        });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// 메뉴리스트 저장부분
// 로컬스토리지 키
const EXPANDED_KEY = 'treeExpanded';
const SELECTED_KEY = 'treeSelected';

// 로컬스토리지에서 상태 로드
const getMenuTreeReset = () => {
  const savedExpanded = $q.localStorage.getItem(EXPANDED_KEY);
  const savedSelected = $q.localStorage.getItem(SELECTED_KEY);

  if (savedExpanded) {
    treeExpanded.value = savedExpanded;
  }
  if (savedSelected) {
    selected.value = savedSelected;
  }
};

// 상태가 변경될 때 로컬스토리지에 저장
watch(treeExpanded, newVal => {
  $q.localStorage.set(EXPANDED_KEY, newVal);
});

watch(selected, newVal => {
  $q.localStorage.set(SELECTED_KEY, newVal);
});
// 메뉴리스트 저장부분 끝
</script>

<style scoped lang="sass"></style>
