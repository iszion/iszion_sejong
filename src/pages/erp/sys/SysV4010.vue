<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12 col-md-3">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">프로그램 리스트</span>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <q-select
                stack-label
                dense
                style="width: 100px"
                label-color="orange"
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
              <q-input
                dense
                stack-label
                label-color="orange"
                ref="filterRef"
                v-model="filter"
                label="검색내에프로그래명검색"
                style="width: 130px"
                class=""
              >
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
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div :style="treeZoneStyle" class="q-editor q-py-sm" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
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
                    <!--                    <q-icon color="blue" size="12px" class="q-mr-sm" :name="props.node.open ? 'fa fa-folder-open' : 'fa fa-folder'" />-->
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
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <div class="col-12 col-md-9">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="text-subtitle2 q-px-sm">프로그램 사용설명서 관리 (관리자용)</span>
            <q-space />
            <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
              <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
            </q-chip>
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions align="right" class="q-pa-none">
            <q-toolbar class="row">
              <span v-if="selectedProgId" class="text-subtitle1 text-bold shadow-5 q-px-lg q-py-xs bg-secondary rounded-borders">
                {{ selectedProgNm }} ( {{ selectedProgId }} )</span
              >
              <q-space />
              <q-btn v-if="selectedProgId" outline dense color="primary" @click="saveDataDocSection" class="q-px-sm q-mr-sm"
                ><q-icon class="q-mr-xs" name="save" size="xs" /> 저장
              </q-btn>
              <q-btn v-if="showDeleteBtn" outline dense color="negative" @click="deleteDataDocSection" class="q-px-sm q-mr-sm"
                ><q-icon class="q-mr-xs" name="delete" size="xs" /> 삭제
              </q-btn>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <q-card flat bordered class="q-ma-xs q-pa-none">
              <!-- Color Picker and Apply Button -->
              <div v-if="editColor" :style="colorPickerStyle">
                <!--                    <q-btn icon="check" round color="green" @click="applyColor" />-->
                <q-color v-model="textColor" no-header style="width: 90px" no-footer @click="applyColor" />
              </div>
              <q-editor
                :disable="!selectedProgId"
                class="q-editor"
                :style="contentZoneStyle"
                ref="contentsFocus"
                v-model="formData.contents"
                :dense="$q.screen.lt.md"
                :definitions="{
                  insert_img: {
                    tip: '사진 첨부',
                    label: '사진넣기',
                    icon: 'photo',
                    handler: insertImg,
                  },
                  font_color: {
                    tip: 'Change font color',
                    icon: 'colorize',
                    label: '글색상',
                    handler: fontColor,
                  },
                }"
                :toolbar="toolbar"
                :fonts="fonts"
              />
            </q-card>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEmpty, isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const $q = useQuasar();

const contentZoneHeight = ref(500);
const treeZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value + 50}px`,
}));
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value + 40}px`,
}));

const menuList = ref([]);
const selected = ref(null);
const filter = ref('');
const filterRef = ref(null);
const selectedGroup = ref(null);
const selectedProgId = ref(null);
const selectedProgNm = ref(null);
const contentsFocus = ref(null);

const resetFilter = () => {
  filter.value = '';
  filterRef.value.focus();
};

const oldFormData = ref(null);
const formData = ref({
  progId: '',
  contents: '',
});

const formDisable = ref(true);
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});
let isSaveFg = '';

const isShowStatusEdit = ref(false);
const showDeleteBtn = ref(false);
const showSaveBtn = ref(false);

/* ******************************************************************************* */
/* ************   tree Click select data    ************************************** */
/* ******************************************************************************* */
const nodeValue = ref({
  submenuName: '',
  menuData: {},
});
const handleNodeClick = () => {
  nodeValue.value.menuData = findValueById(menuList.value, selected.value);
  if (nodeValue.value.menuData) {
    showSaveBtn.value = true;
    if (nodeValue.value.menuData.children.length === 0) {
      // alert(JSON.stringify(nodeValue.value.menuData));
      selectedProgId.value = nodeValue.value.menuData.progId;
      selectedProgNm.value = nodeValue.value.menuData.label;
      getDataDoc(selectedProgId.value);
      setTimeout(() => {
        contentsFocus.value.focus();
      }, 100);
    }
  } else {
    showSaveBtn.value = false;
    showDeleteBtn.value = false;
    selectedProgId.value = null;
    selectedProgNm.value = null;
    formData.value.progId = null;
    formData.value.contents = null;
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
// ***** Screen 초기자료 부분  *************************************//
// **************************************************************//
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 180;
};
onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getGroupData();
  setTimeout(() => {
    handleSelectedGroup();
  }, 500);
});
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
const saveDataDocSection = () => {
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
    saveDataDocAndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg, formData.value));
    selected.value = null;
  }
};

const deleteDataDocSection = () => {
  isSaveFg = 'D';
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
      saveDataDocAndHandleResult(jsonUtil.dataJsonParse('no1', isSaveFg, formData.value));
      selected.value = null;
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};

// ***** 검색 선택 처리 부분 ***********************************//
const handleSelectedGroup = () => {
  getSubMenuData();
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
// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** DataBase 서브메뉴자료 가져오기 부분 *****************************//
const getSubMenuData = async () => {
  const paramData = { paramGroupCd: selectedGroup.value };
  try {
    const response = await api.post('/api/sys/sys4010_list', paramData);

    menuList.value = buildTreeMenuData(response.data.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** DataBase 메뉴얼자료 가져오기 부분 *****************************//
const getDataDoc = async resProgId => {
  const paramData = { paramProgId: resProgId };
  try {
    const response = await api.post('/api/sys/sys4010_docA_select', paramData);
    if (isEmpty(response.data.data)) {
      isSaveFg = 'I';
      formData.value.progId = selectedProgId.value;
      formData.value.contents = '';
      isShowStatusEdit.value = true;
      statusEdit.icon = 'edit_note';
      statusEdit.message = '신규모드 입니다';
      statusEdit.color = 'orange';
      showDeleteBtn.value = false;
    } else {
      isSaveFg = 'U';
      formData.value.progId = response.data.data[0].progId;
      formData.value.contents = response.data.data[0].contents;
      isShowStatusEdit.value = true;
      statusEdit.icon = 'edit_note';
      statusEdit.message = '수정/삭제모드 입니다';
      statusEdit.color = 'orange';
      showDeleteBtn.value = true;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
// saveStatus = 0=수정성공 1=신규성공 2=삭제성공 3=수정에러 4=시스템에러
const saveDataDocAndHandleResult = resFormData => {
  api
    .post('/api/sys/sys4010_docA_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'I') {
          formData.value.oldUserId = formData.value.userId;
        }
      }
      getSubMenuData();
      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);
    })
    .catch(error => {
      console.log('error: ', error);
    });
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

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

//*** 이미지 삽입 ********
function insertImg() {
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
        formData.value.contents += `<div><img style="max-width: 100%;" src="${dataUrl}" /></div>`;
      };
    };
    reader.readAsDataURL(file);
  };
  input.click();
} //*** 이미지 삽입 끝 ********

//*** 폰트 컬러 지정 ********
const textColor = ref('#000');
const editColor = ref(false);
const qEditorContents = ref(null);
const colorPickerStyle = ref({ top: '0px', left: '0px' });

function applyColor() {
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

  editColor.value = false;
}
function fontColor(event) {
  editColor.value = !editColor.value;
  console.log('event : ', JSON.stringify(event));
  const { clientX, clientY } = event;
  colorPickerStyle.value = {
    top: `${clientY - 120}px`, // Position below the button
    left: `${clientY + 20}px`, // Align horizontally with the button
    position: 'absolute',
  };
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
.q-editor {
  overflow: auto;
  border: none;
}
</style>
