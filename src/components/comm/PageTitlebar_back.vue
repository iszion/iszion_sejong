<template>
  <div v-if="message" class="row q-px-sm bg-grey-8 shadow-5">
    <div v-if="message.menuData.label" class="q-pt-xs">
      <span class="text-subtitle1 text-bold q-ml-sm" :class="$q.dark.isActive ? 'text-white' : 'text-white'">
        [ {{ $te(message.menuData.labelExt) ? $t(message.menuData.labelExt) : message.menuData.label }} ]
      </span>
    </div>

    <q-space />

    <q-btn class="q-px-xs text-white" flat size="11px" icon="bookmark_add" @click="addFavorites">
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

    <q-btn class="q-px-xs text-white" flat size="11px" icon="menu_book" @click="handleDialogShow">
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

    <!--    <q-breadcrumbs v-if="!$q.screen.xs" class="self-center q-pt-sm">-->
    <!--      <q-breadcrumbs-el label="Main" :class="$q.dark.isActive ? 'bg-grey-8 text-grey-5' : 'bg-grey-4 text-grey'" />-->
    <!--      <q-breadcrumbs-el-->
    <!--        v-if="message.submenuName"-->
    <!--        :label="$te(message.submenuName) ? $t(message.submenuName) : message.label"-->
    <!--        :class="$q.dark.isActive ? 'bg-grey-8 text-grey-5' : 'bg-grey-4 text-grey'"-->
    <!--      />-->
    <!--      <q-breadcrumbs-el-->
    <!--        v-if="message.menuData.labelExt"-->
    <!--        :label="$te(message.menuData.labelExt) ? $t(message.menuData.labelExt) : message.menuData.label"-->
    <!--        :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-4 text-dark'"-->
    <!--      />-->
    <!--    </q-breadcrumbs>-->
  </div>

  <q-dialog maximized v-model="dialogOpen">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 800px; max-width: 800px"
      class="shadow-2"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-toolbar-title class="text-bold text-subtitle1">
            [ <span class="text-orange">{{ message.menuData.label }}</span> ] 사용설명서 (
            <span class="text-grey-5"> {{ message.menuData.progId }}</span> )</q-toolbar-title
          >
          <q-separator dark vertical class="q-mr-sm" />

          <q-btn flat class="text-bold" @click.stop="selectedDocEdit = true">
            <q-avatar size="24px" color="orange" class="q-mr-xs"><q-icon name="edit" size="16px" /> </q-avatar>
            사용자 메뉴얼 편집
          </q-btn>
          <q-separator dark vertical class="q-mx-sm" />
          <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
          <q-separator dark vertical class="q-mx-sm" />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawerRight" side="right" :width="250" :breakpoint="700" behavior="desktop" bordered>
        <q-toolbar class="row q-pb-sm">
          <q-select
            style="width: 100px"
            dense
            label-color="orange"
            class="super-small"
            label="메인그룹명"
            v-model="selectedGroup"
            :options="groupOptions"
            option-value="groupCd"
            option-label="groupNm"
            options-dense
            emit-value
            map-options
            @update:model-value="handleSelectedGroup"
          />
          <q-space />
          <q-input dense ref="filterRef" v-model="filter" placeholder="프로그램검색" style="width: 130px">
            <template v-slot:append>
              <q-icon
                size="xs"
                :name="filter !== '' ? 'clear search' : 'search'"
                class="cursor-pointer"
                :class="filter !== '' ? 'q-pr-md' : ''"
                @click="resetFilter"
              />
            </template>
          </q-input>
        </q-toolbar>
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <q-tree
              dense
              :nodes="menuList"
              node-key="id"
              :filter="filter"
              v-model:expanded="treeExpanded"
              no-connectors
              v-model:selected="selected"
              @click="handleNodeClick"
            >
              <template #header-folder="props">
                <div class="row items-center">
                  <q-icon color="blue" size="12px" class="q-mr-sm" :name="props.node.icon || 'share'" />
                  <div class="text-bold text-blue">
                    {{ $te(props.node.labelExt) ? $t(props.node.labelExt) : props.node.label }}
                  </div>
                </div>
              </template>
              <template #header-file="props">
                <div class="row items-center">
                  <q-icon
                    :color="props.node.docAyn === 'Y' ? ($q.dark.isActive ? 'white' : 'dark') : $q.dark.isActive ? 'grey-7' : 'grey-5'"
                    :class="props.node.docAyn === 'Y' ? 'text-bold' : ''"
                    size="12px"
                    class="q-mr-sm"
                    :name="props.node.icon || 'share'"
                  />
                  <div
                    :class="
                      props.node.docAyn === 'Y'
                        ? $q.dark.isActive
                          ? 'text-bold text-white'
                          : 'text-bold text-dark'
                        : $q.dark.isActive
                        ? 'text-grey-5'
                        : 'text-grey-7'
                    "
                  >
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
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <span v-html="menualDocA" />
          <q-separator class="q-my-md" style="height: 2px" color="accent" />
          <span v-if="!selectedDocEdit" v-html="menualDocU.contents" />
          <q-card v-if="selectedDocEdit" flat bordered>
            <q-card-actions :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-5'">
              <q-space />
              <q-btn outline den기se :color="$q.dark.isActive ? 'orange' : 'accent'" @click="saveDataDocSection"
                ><q-icon name="save" size="xs" class="q-mr-xs" />저장하기</q-btn
              >
              <q-btn outline den기se color="dark" @click="selectedDocEdit = false"
                ><q-icon name="close" size="xs" class="q-mr-xs" />편집모드 닫기</q-btn
              >
            </q-card-actions>
            <q-editor
              class="q-editor"
              ref="contentsFocus"
              v-model="menualDocU.contents"
              :dense="$q.screen.lt.md"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify'],
                  },
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify'],
                  },
                ],
                ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
                  },
                  {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana',
                    ],
                  },
                  'removeFormat',
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource'],
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana',
              }"
            />
          </q-card>
          <!-- place QPageScroller at end of page -->
          <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[10, 10]">
            <q-btn dense icon="keyboard_arrow_up" color="accent" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup>
import { QBtn, QIcon, useQuasar } from 'quasar';
import { ref } from 'vue';
import { api } from '/src/boot/axios';
import notifySave from 'src/js_comm/notify-save';
import jsonUtil from 'src/js_comm/json-util';
import { isEmpty, isEqual } from 'lodash';

const resMsgProp = defineProps(['message']);

const $q = useQuasar();

const menuList = ref([]);
const selected = ref(null);
const filter = ref('');
const filterRef = ref(null);
const selectedGroup = ref(null);
const selectedProgId = ref(null);
const selectedProgNm = ref(null);

const dialogOpen = ref(false);
const drawerRight = ref(false);

const menualDocA = ref(null);
const menualDocU = ref({
  progId: '',
  contents: '',
});

const selectedDocEdit = ref(false);

let isSaveFg = null;
const resetFilter = () => {
  filter.value = '';
  filterRef.value.focus();
};
const handleSelectedGroup = () => {
  getSubMenuData();
};
const addFavorites = () => {
  $q.dialog({
    dark: true,
    title: resMsgProp.message.menuData.label,
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
      // console.log(JSON.stringify(resMsgProp.message.menuData));
      favoritesSaveSection(resMsgProp.message.menuData);
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const handleDialogShow = () => {
  if (resMsgProp.message.menuData.progId) {
    selectedGroup.value = resMsgProp.message.menuData.progId.substring(0, 3);
    getGroupData();
    getSubMenuData();

    getDataDocA(resMsgProp.message.menuData.progId);
    // setTimeout(() => {
    getDataDocU(resMsgProp.message.menuData.progId);
    // }, 500);
    dialogOpen.value = true;
    drawerRight.value = false;
    selectedDocEdit.value = false;
  } else {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '메뉴목록이 선택되지 않았습니다.',
      // persistent: true,
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {});
  }
};
const favoritesSaveSection = resData => {
  let iu = [];
  let iuD = [];
  let jsonFormData = { userId: 'admin', location: 'fav', progNm: resData.label, progId: resData.progId, icon: resData.icon, type: 'file' };
  let tmpJson = '{"mode":"I","data":' + JSON.stringify(jsonFormData) + '}';
  iu.push(tmpJson);
  saveDataAndHandleResult(jsonUtil.jsonFiller('no1', iu, iuD));
};

let tree = [];
const treeExpanded = ref([]);
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

const saveDataDocSection = () => {
  $q.dialog({
    dark: true,
    title: '저장',
    message: '자료를 저장하시겠습니까? ',
    // persistent: true,
    ok: {
      push: true,
      color: 'negative',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
  })
    .onOk(() => {
      saveDataDocUndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg, menualDocU.value));
      selectedDocEdit.value = false;
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

/* ******************************************************************************* */
/* ************   tree Click select data    ************************************** */
/* ******************************************************************************* */
const nodeValue = ref({
  submenuName: '',
  menuData: {},
});
const handleNodeClick = () => {
  nodeValue.value.menuData = findValueById(menuList.value, selected.value);
  if (nodeValue.value.menuData.children.length === 0) {
    selectedProgId.value = nodeValue.value.menuData.progId;
    selectedProgNm.value = nodeValue.value.menuData.label;
    getDataDocA(selectedProgId.value);
    // setTimeout(() => {
    getDataDocU(selectedProgId.value);
    // }, 500);
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

// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataAndHandleResult = resFormData => {
  api
    .post('/api/sys/fav_save', resFormData)
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

// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getSubMenuData = async () => {
  const paramData = { paramGroupCd: selectedGroup.value };
  try {
    const response = await api.post('/api/sys/menu_sub_list', paramData);

    menuList.value = buildTreeMenuData(response.data.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 메뉴얼자료 가져오기 부분 *****************************//
const getDataDocA = async resProgId => {
  const paramData = { paramProgId: resProgId };
  try {
    const response = await api.post('/api/sys/sys4010_docA_select', paramData);
    if (isEmpty(response.data.data)) {
      menualDocA.value = '메뉴얼자료가 없습니다';
    } else {
      menualDocA.value = response.data.data[0].contents;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getDataDocU = async resProgId => {
  const paramData = { paramProgId: resProgId };
  try {
    const response = await api.post('/api/sys/sys4020_docB_select', paramData);
    if (isEmpty(response.data.data)) {
      menualDocU.value.progId = selectedProgId.value;
      menualDocU.value.contents = '메뉴얼자료가 없습니다';
      isSaveFg = 'I';
    } else {
      menualDocU.value.progId = response.data.data[0].progId;
      menualDocU.value.contents = response.data.data[0].contents;
      isSaveFg = 'U';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);

const getGroupData = async () => {
  try {
    const response = await api.post('/api/sys/prog_group_list', { paramUserId: '' });
    // 옵션 초기화
    groupOptions.value = [];

    response.data.data.forEach(group => {
      if (!selectedGroup.value) {
        selectedGroup.value = group.groupCd;
      }
      groupOptions.value.push(group);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 사용자메뉴얼 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataDocUndHandleResult = resFormData => {
  api
    .post('/api/sys/sys4020_docB_save', resFormData)
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

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
</script>
