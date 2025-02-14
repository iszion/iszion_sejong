<template>
  <q-layout
    view="lHh lpr lFf"
    container
    style="height: 800px; max-width: 1000px"
    class="shadow-2"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
      <q-toolbar>
        <q-toolbar-title class="text-bold text-subtitle1">
          [ <span class="text-orange">{{ message.menuData.label }}</span> ] 사용설명서 (
          <span class="text-grey-5"> {{ message.menuData.progId }}</span> )</q-toolbar-title
        >
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
                  :color="props.node.docYn === 'Y' ? ($q.dark.isActive ? 'white' : 'dark') : $q.dark.isActive ? 'grey-7' : 'grey-5'"
                  :class="props.node.docYn === 'Y' ? 'text-bold' : ''"
                  size="12px"
                  class="q-mr-sm"
                  :name="props.node.icon || 'share'"
                />
                <div
                  :class="
                    props.node.docYn === 'Y'
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
      <q-page class="q-pa-md">
        <span v-html="manualDocA" />

        <q-separator class="q-my-xs" style="height: 2px" color="accent" />

        <q-banner inline-actions rounded class="q-mb-sm" :class="$q.dark.isActive ? 'bg-blue-grey-8' : 'bg-blue-grey-2'">
          <q-icon size="sm" color="orange" text-color="white" name="info" />
          <span class="gt-xs"> 사용자가 업무에 필요한 실무적인 처리 사항을 기재하여 모든 사용자가 같이 볼 수 있도록 처리하는 부분입니다.</span>

          <template v-slot:action>
            <q-btn
              :disable="nodeValue.menuData.header === 'folder'"
              flat
              class="text-bold"
              @click.stop="
                selectedDocBedit = true;
                selectedDocUedit = false;
              "
            >
              <q-avatar size="24px" color="orange" class="q-mr-xs"><q-icon name="edit" size="16px" /> </q-avatar>
              사용자메뉴얼(공통)편집
            </q-btn>
          </template>
        </q-banner>
        <span v-if="!selectedDocBedit" v-html="manualDocB.contents" />
        <q-card v-if="selectedDocBedit" flat bordered>
          <q-card-actions :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-5'">
            <span class="text-subtitle1 text-bold">사용자메뉴얼편집 (사용자 공통자료)</span>
            <q-space />
            <q-btn outline dense :color="$q.dark.isActive ? 'orange' : 'accent'" @click="saveDataDocBSection"
              ><q-icon name="save" size="xs" class="q-mr-xs" />저장하기</q-btn
            >
            <q-btn
              outline
              dense
              color="dark"
              @click="
                getDataDocB(selectedProgId);
                selectedDocBedit = false;
              "
              ><q-icon name="close" size="xs" class="q-mr-xs" />편집모드 닫기</q-btn
            >
          </q-card-actions>
          <!-- Color Picker and Apply Button -->
          <div v-if="editColorB" :style="colorPickerStyle">
            <!--                    <q-btn icon="check" round color="green" @click="applyColor" />-->
            <q-color v-model="textColor" no-header style="width: 90px" no-footer @click="applyColor('B')" />
          </div>
          <q-editor
            class="q-editor"
            ref="contentsFocus"
            v-model="manualDocB.contents"
            :dense="$q.screen.lt.md"
            :definitions="{
              insert_img: {
                tip: '사진 첨부',
                label: '사진넣기',
                icon: 'photo',
                handler: () => insertImg(manualDocB.contents, 'B'),
              },
              font_color: {
                tip: 'Change font color',
                icon: 'colorize',
                label: '글색상',
                handler: event => fontColor(event, 'B'),
              },
            }"
            :toolbar="toolbar"
            :fonts="fonts"
          />
        </q-card>

        <!-- place QPageScroller at end of page -->
        <q-separator class="q-my-xs" style="height: 2px" color="accent" />

        <q-banner inline-actions rounded class="q-mb-sm" :class="$q.dark.isActive ? 'bg-blue-grey-8' : 'bg-blue-grey-2'">
          <q-icon size="sm" color="deep-orange" text-color="white" name="info" />
          <span class="gt-xs"> 사용자가 필요한 업무 사항을 본인만 볼 수 있도록 기재하여 업무에 참조할 수 있는 부분입니다.</span>

          <template v-slot:action>
            <q-btn
              :disable="nodeValue.menuData.header === 'folder'"
              flat
              class="text-bold"
              @click.stop="
                selectedDocUedit = true;
                selectedDocBedit = false;
              "
            >
              <q-avatar size="24px" color="red" class="q-mr-xs"><q-icon name="edit" size="16px" /> </q-avatar>
              사용자메뉴얼(전용)편집
            </q-btn>
          </template>
        </q-banner>
        <span v-if="!selectedDocUedit" v-html="manualDocU.contents" />
        <q-card v-if="selectedDocUedit" flat bordered>
          <q-card-actions :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-5'">
            <span class="text-subtitle1 text-bold">사용자메뉴얼편집 (사용자 전용자료)</span>
            <q-space />
            <q-btn outline dense :color="$q.dark.isActive ? 'orange' : 'accent'" @click="saveDataDocUSection"
              ><q-icon name="save" size="xs" class="q-mr-xs" />저장하기</q-btn
            >
            <q-btn
              outline
              dense
              color="dark"
              @click="
                getDataDocU(selectedProgId, storeUser.userId);
                selectedDocUedit = false;
              "
              ><q-icon name="close" size="xs" class="q-mr-xs" />편집모드 닫기</q-btn
            >
          </q-card-actions>
          <!-- Color Picker and Apply Button -->
          <div v-if="editColorU" :style="colorPickerStyle">
            <!--                    <q-btn icon="check" round color="green" @click="applyColor" />-->
            <q-color v-model="textColor" no-header style="width: 90px" no-footer @click="applyColor('U')" />
          </div>
          <q-editor
            class="q-editor"
            ref="contentsFocus"
            v-model="manualDocU.contents"
            :dense="$q.screen.lt.md"
            :definitions="{
              insert_img: {
                tip: '사진 첨부',
                label: '사진넣기',
                icon: 'photo',
                handler: () => insertImg(manualDocU.contents, 'U'),
              },
              font_color: {
                tip: 'Change font color',
                icon: 'colorize',
                label: '글색상',
                handler: event => fontColor(event, 'U'),
              },
            }"
            :toolbar="toolbar"
            :fonts="fonts"
          />
        </q-card>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[10, 10]">
          <q-btn dense icon="keyboard_arrow_up" color="accent" />
        </q-page-scroller>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { QBtn, QIcon, useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { api } from '/src/boot/axios';
import notifySave from 'src/js_comm/notify-save';
import jsonUtil from 'src/js_comm/json-util';
import { isEmpty } from 'lodash';
import { useUserInfoStore } from 'src/store/setUserInfo';

const storeUser = useUserInfoStore();

const resMsgProp = defineProps(['message']);
// console.log('aa : ', JSON.stringify(resMsgProp.message));

const $q = useQuasar();

const menuList = ref([]);
const selected = ref(null);
const filter = ref('');
const filterRef = ref(null);
const selectedGroup = ref(null);
const selectedProgId = ref(null);
const selectedProgNm = ref(null);

const drawerRight = ref(false);
const manualDocA = ref(null);
const manualDocB = ref({
  progId: '',
  contents: '',
});
const manualDocU = ref({
  progId: '',
  userId: storeUser.userId,
  contents: '',
});

const selectedDocBedit = ref(false);
const selectedDocUedit = ref(false);

let isSaveFgB = 'I';
let isSaveFgU = 'I';
const resetFilter = () => {
  filter.value = '';
  filterRef.value.focus();
};
const handleSelectedGroup = () => {
  getSubMenuData();
};

const contentsFocus = ref(null);

onMounted(() => {
  selectedGroup.value = resMsgProp.message.menuData.progId.substring(0, 3);
  getGroupData();
  getSubMenuData();

  selectedProgId.value = resMsgProp.message.menuData.progId;
  getDataDocA(resMsgProp.message.menuData.progId);
  getDataDocB(selectedProgId.value);
  getDataDocU(selectedProgId.value, storeUser.userId);

  drawerRight.value = false;
  selectedDocBedit.value = false;
  selectedDocUedit.value = false;
});

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

const saveDataDocBSection = () => {
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
      let _content = manualDocB.value.contents;
      _content = _content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      _content = _content.trim(); // Remove any leading or trailing whitespace
      // console.log('aaa :: ', _content);
      if (_content === '') {
        isSaveFgB = 'D';
      }
      saveDataDocBhandleResult(jsonUtil.dataJsonParse('no1', isSaveFgB, manualDocB.value));
      selectedDocBedit.value = false;
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

const saveDataDocUSection = () => {
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
      let _content = manualDocU.value.contents;
      _content = _content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      _content = _content.trim(); // Remove any leading or trailing whitespace
      // console.log('aaa :: ', _content);
      if (_content === '') {
        isSaveFgU = 'D';
      }
      saveDataDocUhandleResult(jsonUtil.dataJsonParse('no1', isSaveFgU, manualDocU.value));
      selectedDocUedit.value = false;
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
  console.log('sel : ', JSON.stringify(nodeValue.value.menuData));
  if (nodeValue.value.menuData.children.length === 0) {
    selectedProgId.value = nodeValue.value.menuData.progId;
    selectedProgNm.value = nodeValue.value.menuData.label;
    getDataDocA(selectedProgId.value);
    getDataDocB(selectedProgId.value);
    getDataDocU(selectedProgId.value, storeUser.userId);
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

// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getSubMenuData = async () => {
  try {
    const response = await api.post('/api/sys/menu_sub_list', {
      paramCompCd: storeUser.compCd,
      paramGroupCd: selectedGroup.value,
      paramUserId: storeUser.userId,
    });

    menuList.value = buildTreeMenuData(response.data.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 메뉴얼자료 가져오기 부분 *****************************//
const getDataDocA = async resProgId => {
  const paramData = { paramProgId: resProgId };
  try {
    const response = await api.post('/api/com/com8010_docA_select', paramData);
    if (isEmpty(response.data.data)) {
      manualDocA.value = '메뉴얼자료가 없습니다';
    } else {
      manualDocA.value = response.data.data[0].contents;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const getDataDocB = async resProgId => {
  const paramData = { paramProgId: resProgId };
  try {
    const response = await api.post('/api/sys/sys4020_docB_select', paramData);
    if (isEmpty(response.data.data)) {
      manualDocB.value.progId = selectedProgId.value;
      manualDocB.value.contents = '메뉴얼자료가 없습니다';
      isSaveFgB = 'I';
    } else {
      manualDocB.value.progId = response.data.data[0].progId;
      manualDocB.value.contents = response.data.data[0].contents;
      isSaveFgB = 'U';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getDataDocU = async (resProgId, resUserId) => {
  const paramData = { paramProgId: resProgId, paramUserId: resUserId };
  try {
    const response = await api.post('/api/sys/sys4030_docU_select', paramData);
    if (isEmpty(response.data.data)) {
      manualDocU.value.progId = selectedProgId.value;
      manualDocU.value.contents = '메뉴얼자료가 없습니다';
      isSaveFgU = 'I';
    } else {
      manualDocU.value.progId = response.data.data[0].progId;
      manualDocU.value.contents = response.data.data[0].contents;
      isSaveFgU = 'U';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);

const getGroupData = async () => {
  try {
    const response = await api.post('/api/com/prog_group_list_comp', { paramUserId: '' });
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
const saveDataDocBhandleResult = resFormData => {
  api
    .post('/api/sys/sys4020_docB_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      getDataDocB(selectedProgId.value);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};
const saveDataDocUhandleResult = resFormData => {
  api
    .post('/api/sys/sys4030_docU_save', resFormData)
    .then(res => {
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      getDataDocU(selectedProgId.value, storeUser.userId);
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

//*** 이미지 삽입 ********
function insertImg(resFormData, resFg) {
  console.log('aa : ', resFormData);
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.png, .jpg, .jpeg';

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height);

        // 파일 크기를 줄이기 위해 이미지 품질을 설정합니다(0~1 사이, 1은 전체 품질)
        const quality = 0.3; // 0.5 낮은 퀄릴티, 0.8 높은 퀄리티

        // Use JPEG format for quality reduction; PNG does not support quality settings in toDataURL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Insert the image with reduced file size
        console.log('aa1 : ', resFormData);
        resFormData += `<div><img style="max-width: 100%;" src="${dataUrl}" /></div>`;
        if (resFg === 'B') {
          manualDocB.value.contents = resFormData;
        } else {
          manualDocU.value.contents = resFormData;
        }
        console.log('aa2 : ', resFormData);
      };
    };
    reader.readAsDataURL(file);
  };
  input.click();
} //*** 이미지 삽입 끝 ********

//*** 폰트 컬러 지정 ********
const textColor = ref('#000');
const editColorB = ref(false);
const editColorU = ref(false);
const qEditorContents = ref(null);
const colorPickerStyle = ref({ top: '0px', left: '0px' });

function applyColor(resFg) {
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (selection.isCollapsed) {
      // If there is no text selected, create a span with the chosen color
      const span = document.createElement('span');
      span.style.color = textColor.value;
      span.appendChild(document.createTextNode('\u200B')); // Zero-width space to allow typing

      range.insertNode(span);
      range.setStart(span.firstChild, 1); // Move the cursor inside the span
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If text is selected, use execCommand to apply the color
      document.execCommand('foreColor', false, textColor.value);
    }
  }
  if (resFg === 'B') {
    editColorB.value = false;
  } else {
    editColorU.value = false;
  }
}
function fontColor(event, resFg) {
  console.log('event1 : ', JSON.stringify(event));

  const { clientX, clientY } = event;
  console.log('clientY, X : ', clientY, clientX);

  if (resFg === 'B') {
    editColorB.value = !editColorB.value;
    colorPickerStyle.value = {
      top: `${clientY - 400}px`, // Position below the button
      left: `${clientY - 220}px`, // Align horizontally with the button
      position: 'absolute',
    };
  } else {
    editColorU.value = !editColorU.value;
    colorPickerStyle.value = {
      top: `${clientY - 900}px`, // Position below the button
      left: `${clientY - 220}px`, // Align horizontally with the button
      position: 'absolute',
    };
  }
}
//*** 폰트 컬러 지정 끝 ********

const toolbar = [
  [
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
      options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana'],
    },
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify'],
    },
  ],

  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript', 'font_color'],
  ['insert_img'],
  ['hr', 'link'],
  ['print', 'fullscreen'],
  ['unordered', 'ordered', 'outdent', 'indent'],

  ['undo', 'redo'],
  ['viewsource'],
];

const fonts = {
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana',
};
</script>

<style scoped>
.q-editor__content {
  max-height: 400px; /* 스크롤 영역의 최대 높이를 설정합니다. 필요에 따라 조절하세요. */
  overflow-y: auto; /* 수직 스크롤바를 자동으로 표시합니다. */
}
</style>
