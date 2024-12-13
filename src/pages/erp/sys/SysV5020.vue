<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
    <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <template v-slot:avatar>
        <q-icon name="menu_book" color="primary" />
      </template>
      <span class="text-subtitle1 text-bold"> 메뉴설정 작업입니다.</span><br />
      1. 프로그램 목록은 모든 프로그램의 목록을 보여 줍니다.<br />
      <span class="material-icons-outlined"> folder </span>

      2. 메뉴성정 목록은 메인그룹명을 선택하면 설정되어 있는 목록을 보여줍니다. (초기시 헤더폴더만 보여줍니다) <br />
      3.
      <q-btn disable padding="0 sm" outline size="sm" icon="add" label="Root" />
      버튼은 메뉴의 처음 그룹명을 만들어 줍니다. <br />

      4.
      <q-btn disable padding="0 sm" outline size="sm" icon="add" label="Select" />
      버튼은 메뉴에서 선택된 그룹메뉴명 안에 그룹명을 만들어 줍니다. <br />
      5. 메뉴설정 목록에서 메뉴를 선택하고 우측마우스를 클릭하면 작업메뉴가 보여줍니다. (신규등록, 이름변경, 항목삭제) <br />
      6. 프로그램의 목록을 선택하고 메뉴설정 목록으로 드래그하여 원하는 위치에 프로그램을 설정합니다. (설정이 완료되면
      <q-btn disable padding="0 sm" outline size="sm" icon="save_alt" label="저장" />
      버튼을 클릭하여 설정된 메뉴를 등록 합니다. (작업완료)
    </q-banner>

    <q-separator class="q-my-md /" />

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card>
          <q-card-section class="text-center">
            <q-item-label class="text-h6">프로그램 목록</q-item-label>
          </q-card-section>
          <q-separator size="3px" class="q-mb-xs" />
          <q-card-actions>
            <q-btn padding="xs sm" outline size="sm" @click="progReloadBtn"><q-icon name="refresh" />다시불러오기</q-btn>
            <q-space />
            <q-input dense class="super-small" label="검색" v-model="text" :input-style="{ fontSize: '14px', width: '100px' }" @keyup="onPrgSearch">
              <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" size="xs" />
                <q-icon size="xs" name="search" />
              </template>
            </q-input>
          </q-card-actions>
          <q-separator size="2px" class="q-mb-sm" />
          <q-card class="q-pa-md scrollable-card" :style="contentZoneStyle">
            <div id="progTree" ref="progTree"></div>
          </q-card>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        <q-card>
          <q-card-section class="text-center">
            <q-item-label class="text-h6">메뉴설정 목록</q-item-label>
          </q-card-section>
          <q-separator size="3px" class="q-mb-xs" />
          <div class="row q-pa-sm">
            <div class="col-3">
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
            </div>
            <div class="col-9 text-right q-gutter-xs">
              <q-btn padding="xs sm" outline size="sm" icon="refresh" @click="menuReloadBtn" />
              <q-btn padding="xs sm" outline size="sm" @click="newRootBtn"><q-icon name="add" />그룹명</q-btn>
              <q-btn padding="xs sm" outline size="sm" @click="newSelectBtn"><q-icon name="add" />선택그룹명</q-btn>
              <q-btn padding="xs sm" outline size="sm" @click="saveBtn"><q-icon name="save_alt" />저장</q-btn>
            </div>
          </div>
          <q-separator size="2px" class="q-mb-sm" />
          <q-card class="q-pa-md scrollable-card" :style="contentZoneStyle">
            <div id="menuTree" ref="menuTree"></div>
          </q-card>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-5">
        <q-card>
          <q-card-section class="text-center">
            <q-item-label class="text-h6">아이콘 목록</q-item-label>
          </q-card-section>
          <q-separator size="3px" class="q-mb-xs" />
          <div class="row q-pa-sm">
            <span>Icon : {{ iconValueClass }} </span>
            <q-space />
            <q-btn padding="xs sm" outline size="sm" icon="refresh" label="아이콘 되돌리기" @click="iconRevertBtn" />
          </div>
          <q-separator size="2px" class="q-mb-sm" />
          <q-card class="q-pa-md scrollable-card" :style="contentZoneStyle">
            <IconList :icon-value="iconValue" @update="iconUpdate" />
          </q-card>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import $ from 'jquery';
import 'jstree';
import 'jstree/dist/themes/default/style.min.css';
import 'jstree/dist/themes/default-dark/style.min.css';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import IconList from 'components/IconList.vue';
import { api } from '/src/boot/axios';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';

const $q = useQuasar();
const iconValue = ref('');
const iconValueClass = ref('');
let old_icon = '';
const iconUpdate = iconValue => {
  let ref = $('#menuTree').jstree(true);
  let sel = ref.get_selected();
  old_icon = ref.get_icon(sel);
  iconValueClass.value = iconValue;

  if (!sel.length) {
    alert('안내', '메뉴설정 목록에서 메뉴를 선택하세요');
    return false;
  }
  ref.set_icon(sel, iconValue);
};
const iconRevertBtn = () => {
  if (old_icon !== '') {
    let ref = $('#menuTree').jstree(true);
    let sel = ref.get_selected();

    if (!sel.length) {
      alert('안내', '선택된 메뉴가 없습니다.');
      return false;
    }
    ref.set_icon(sel, old_icon);
    old_icon = '';
  } else {
    alert('안내', '변경된 자료가 없습니다.');
  }
};

const text = ref(null);

const prog_tree_data = ref([]);
const menu_tree_data = ref([]);

onMounted(() => {
  // 그룹선택

  $('#progTree').jstree({
    core: {
      data: prog_tree_data.value,
    },

    plugins: ['dnd', 'search', 'json_data', 'types'],
    search: {
      case_insensitive: true,
      show_only_matches: true,
      show_only_matches_children: true,
    },
  });

  progReloadBtn();

  $('#menuTree')
    .jstree({
      core: {
        multiple: true,
        themes: {
          responsive: false,
        },
        check_callback: true,
        data: menu_tree_data.value,
      },
      types: {
        '#': {
          //Root
          max_depth: 5, // 하위 5깨 까지 허용
        },
        file: {
          // type이 file인 경우 속성
          icon: 'fa-regular fa-file', // 기본적으로 file icon
          max_children: 0, // reaf이므로 자식을 못 갖도록 설정
          max_depth: 0, // 하위 노드도 생성 막음
        },
        default: {
          icon: 'fa-solid fa-folder-open', // directory folder 아이콘
        },
      },

      plugins: ['dnd', 'contextmenu', 'state', 'types'],
      contextmenu: {
        items: function ($node) {
          let tree = $('#menuTree').jstree(true);
          return {
            // 신규 선택 시 이벤트
            Create: {
              separator_before: false,
              separator_after: false,
              label: '신규 등록',
              action: function (obj) {
                $node = tree.create_node($node);
                tree.edit($node);
              },
            },
            // 수정 선택 시 이벤트
            Rename: {
              separator_before: false,
              separator_after: false,
              label: '이름 변경',
              action: function (obj) {
                tree.edit($node);
              },
            },
            // 삭제 선택 시 이벤트
            Remove: {
              separator_before: false,
              separator_after: false,
              label: '항목 삭제',
              action: function (obj) {
                tree.delete_node($node);
              },
            },
          };
        },
      },
    })
    .on('changed.jstree', function (e, data) {
      $('#treeMessageView').html(
        '<span class="text-red">선택자</span> : ( ' +
          data.instance.get_node(data.selected[0]).parent +
          ' ) : ( ' +
          data.instance.get_node(data.selected[0]).id +
          " ) : ( <span class='text-blue'>" +
          data.instance.get_node(data.selected[0]).text +
          '</span> )',
      );
      $('#treeMessageView').html(
        '<span class="text-red">선택자</span> : ( ' +
          data.instance.get_node(data.selected[0]).parent +
          ' ) : ( ' +
          data.instance.get_node(data.selected[0]).id +
          " ) : ( <span class='text-blue'>" +
          data.instance.get_node(data.selected[0]).text +
          "</span> ) : ( <span class='text-red'>" +
          JSON.stringify(data.instance.get_node(data.selected[0])) +
          '</span> )',
      );
      //		    let i, j, r = [];
      ////		    for(i = 0, j = data.selected.length; i < j; i++) {
      ////		    	console.log("i : " + i);
      ////
      //			r.push(data.instance.get_node(data.selected[0]).parent);
      //			r.push(data.instance.get_node(data.selected[0]).id);
      //			r.push(data.instance.get_node(data.selected[0]).text);
      ////			r.push(data.instance.get_node(data.selected[0]).icon);
      ////			r.push(data.instance.get_node(data.selected[0]).original);
      ////			console.log("data1 : " + JSON.stringify(data.instance.get_node(data.selected[0])));
      ////		    }
      //		    $('#treeMessageView').html('<span class="text-red">선택자</span> : ( ' + data.instance.get_node(data.selected[0]).parent + " ) : ( "+ data.instance.get_node(data.selected[0]).id + " ) : ( <span class='text-blue'>"+ data.instance.get_node(data.selected[0]).text + "</span> )" + " ) : ( <span class='text-blue'>"+ data.instance.get_node(data.selected[0]).icon + "</span> )");
      ////		    console.log("data2 : " + JSON.stringify(r));
    })
    .bind('loaded.jstree', function (e, data) {
      // console.log("loaded data : 		" + data.id + " = " + data.parent + " = " + data.text);
    })
    .bind('create_node.jstree', function (e, data) {
      // console.log('create data old : 	' + data.old);
      //		    console.log("create data : 		" + data.node.id + " = " + data.node.parent + " = " + data.node.text);
      ////		    console.log("create data parent : 	" + data.node.parent);
      ////		    console.log("create data text : 	" + data.node.text);
      ////		    console.log("create data icon : 	" + data.node.icon);
      //
      //		    // 신규항목 저장
      //		    let formData = { grop_id: data.node.id, grop_parent: data.node.parent, grop_nm: data.node.text, folder: '', icon: data.node.icon };
      //			selectFG = "I";
      //			let paramData = dataJsonParse('no1', selectFG, formData);
      ////			saveCallProcess(paramData);
      // 수정 후 이벤트
    })
    .bind('rename_node.jstree', function (e, data) {
      // console.log("update data old : 	" + data.old + " -  " + data.text);
      // for(let key in data.node) {
      // 	console.log(" key : " + key);
      // }
      //
      //		 console.log("rename data : 		" + data.node.id + " = " + data.node.parent + " = " + data.node.text);
      ////			console.log("rename data old : 	" + data.old);
      ////			console.log("rename data id : 		" + data.node.id);
      ////			console.log("rename data parent : 	" + data.node.parent);
      ////			console.log("rename data text : 	" + data.node.text);
      ////			console.log("rename data icon : 	" + data.node.icon);
      ////			console.log("rename data seq : 	" + data.node.original.seq);
      //
      //			//변경항목 저장
      //			let formData = { grop_id: data.node.id, grop_parent: data.node.parent, seq: data.node.original.seq, grop_nm: data.node.text, folder: '', icon: data.node.icon };
      //			selectFG = "U";
      //			let paramData = dataJsonParse('no1', selectFG, formData);
      ////			saveCallProcess(paramData);
      //
      ////			let cnt = 0;
      ////			let tmpAry;
      ////			iu1 = [];
      ////			iu1Del = [];
      ////			// 해당 그룹내 속하는 id값 추출
      ////		 	$("#" + data.node.parent + " > ul > li").each((index, elem) => {
      ////		 		  cnt += 1;
      ////		 		  let obj_data = new Object();
      ////		 		  obj_data.grop_id = elem.id;
      ////		 		  obj_data.seq = cnt;
      ////
      ////		 		 tmpAry =  {mode: "M", data: obj_data};
      ////		 		 iu1.push(JSON.stringify(tmpAry));
      ////	 		});
      ////		 	selectFG = "M";
      ////			let obj = jsonfiller('no1', iu1, iu1Del);
      ////			paramData = JSON.stringify(obj).replace(/null/gi, "");
      //////			console.log("paramData : " + JSON.stringify(paramData));
      ////		 	saveCallProcess(paramData);
      // 이동 후 이벤트
    })
    .bind('move_node.jstree', function (e, data) {
      ////			console.log("move data old : 	" + data.old);
      ////			console.log("move data id : 		" + data.node.id);
      ////			console.log("move data parent : 	" + data.node.parent);
      ////			console.log("move data text : 	" + data.node.text);
      ////			console.log("move data icon : 	" + data.node.icon);
      //		 	console.log("move data : 		" + data.node.id + " = " + data.node.parent + " = " + data.node.text);
      //		 	if(data.node.parent == "#"){
      //		 		alert("안내", "그룹명은 이동이 불가합니다.");
      //		 		return false;
      //		 	}
      //
      //			//변경항목 저장
      //			let formData = { menu_id: data.node.id, menu_parent: data.node.parent, prog_nm: data.node.text, groupCd: groupCd, icon: data.node.icon };
      //			selectFG = "U";
      //			let paramData = dataJsonParse('no1', selectFG, formData);
      //			console.log("move paramData : 	" + JSON.stringify(paramData));
      ////			saveCallProcess(paramData);
      //
      //			let cnt = 0;
      //			let tmpAry;
      //			iu1 = [];
      //			iu1Del = [];
      //			// 해당 그룹내 속하는 id값 추출
      //		 	$("#" + data.node.parent + " > ul > li").each((index, elem) => {
      //		 		  cnt += 1;
      //		 		  let obj_data = new Object();
      //		 		  obj_data.grop_id = elem.id;
      //		 		  obj_data.seq = cnt;
      //
      //		 		 tmpAry =  {mode: "M", data: obj_data};
      //		 		 iu1.push(JSON.stringify(tmpAry));
      //	 		});
      //		 	selectFG = "M";
      //			let obj = jsonfiller('no1', iu1, iu1Del);
      //			paramData = JSON.stringify(obj).replace(/null/gi, "");
      ////			console.log("paramData : " + JSON.stringify(paramData));
      //		 	saveCallProcess(paramData);
      // 삭제 후 이벤트
    })
    .bind('delete_node.jstree', function (e, data) {
      console.log('delete data old : 	' + data.node);
      console.log('delete data : 		' + data.node.id + ' = ' + data.node.parent + ' = ' + data.node.text);

      let tmpAry;
      let iu1 = [];
      let iu1Del = [];

      // 선택한 그룹 root node 자료 저장
      tmpAry = { mode: 'D', data: { menuId: data.node.id } };
      iu1Del.push(JSON.stringify(tmpAry));

      // 선택한 그룹 자식 node 자료 저장
      $('#' + data.node.id)
        .find('li')
        .each((index, elem) => {
          let obj_data = {};
          obj_data.menuId = elem.id;
          console.log('del id : ' + elem.id);
          tmpAry = { mode: 'D', data: obj_data };
          iu1Del.push(JSON.stringify(tmpAry));
        });
      let obj = jsonUtil.jsonFiller('no1', iu1, iu1Del);
      console.log('del ::', iu1Del);
      let paramData = JSON.stringify(obj).replace(/null/gi, '');
      // deleteDataAndHandleResult(paramData);
    });
  $(document)
    .bind('dnd_stop.vakata', function (evt, data) {
      //				console.log("dnd_stop data : 		" + data.element.id + " = " + data.element.parent + " = " + data.element.text);
      //				console.log("dnd_stop data : 		" + data.element);
      //				for(let key in data.element){
      //					console.log("key : " + key + " = " + data.element[key]);
      //
      //				}
      //				for(let key in data){
      //					console.log("key : " + key + " = " + data[key]);
      //					let obj = data[key];
      //					for(let i in obj) {
      //						console.log("key1 : " + i + " = " + obj[i]);
      //					}
      //				}
    })
    .bind('dnd_start.vakata', function (evt, data) {});

  menuReloadBtn();
});

const newRootBtn = () => {
  if (!selectedGroup.value) {
    alert('안내', '메인그룹명을 선택하세요');
    return false;
  }
  $('#menuTree').jstree('create_node', '#', { text: '새로운 그룹명', type: 'folder1' }, 'last');
};

const newSelectBtn = () => {
  let ref = $('#menuTree').jstree(true),
    sel = ref.get_selected();
  if (!sel.length) {
    alert('안내', '그룹메뉴를 추가할 메뉴목록을 선택하세요');
    return false;
  }
  sel = sel[0];
  sel = ref.create_node(sel, { text: '새로운 그룹명', type: 'folder2' });
  if (sel) {
    ref.edit(sel);
  }
};

const saveBtn = () => {
  let treeData = $('#menuTree').jstree(true).get_json('#', { flat: true });
  // console.log('treeData: ', JSON.stringify(treeData));
  if (treeData.length <= 0) {
    alert('안내', '저장할 자료가 없습니다');
    return false;
  }

  $q.dialog({
    dark: true,
    title: '자료저장',
    message: '시스템 메뉴설정을 저장하시겠습니까?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      let iu1 = [];
      let iu1Del = [];

      let jsonData = '';
      let tmpAry = '';
      let setType = '';
      let setProgId = '';
      let setIcon = null;
      for (let i = 0; i < treeData.length; i++) {
        if (typeof treeData[i].a_attr.progId == 'undefined') {
          setProgId = '';
        } else {
          setProgId = treeData[i].a_attr.progId;
        }
        if (typeof treeData[i].a_attr.type == 'undefined') {
          setType = 'folder';
        } else {
          setType = treeData[i].a_attr.type;
        }
        jsonData = {
          groupCd: selectedGroup.value,
          seq: i,
          menuId: treeData[i].id,
          menuParent: treeData[i].parent,
          progNm: treeData[i].text,
          progId: setProgId,
          type: setType,
          icon: treeData[i].icon,
          stateOpened: treeData[i].state.opened,
        };

        tmpAry = '{"mode":"I","data":' + JSON.stringify(jsonData) + '}';
        iu1.push(tmpAry);
      }
      tmpAry = '{"mode":"D","data":' + JSON.stringify(jsonData) + '}';
      iu1Del.push(tmpAry);

      let obj = jsonUtil.jsonFiller('no1', iu1, iu1Del);

      let paramData = JSON.stringify(obj).replace(/null/gi, '');
      // console.log('param:  ', JSON.stringify(paramData));
      saveDataAndHandleResult(paramData);
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

async function saveDataAndHandleResult(paramFormData) {
  try {
    let saveStatus = await saveData(paramFormData);
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.log('Error while saving data:', error);
  }
}
async function deleteDataAndHandleResult(paramFormData) {
  try {
    let saveStatus = await deleteData(paramFormData);
    console.log('status : ', saveStatus);
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.log('Error while saving data:', error);
  }
}

const onPrgSearch = e => {
  const searchText = e.target.value;
  $('#progTree').jstree('search', searchText);
};

function alert(_title, _message) {
  $q.dialog({
    dark: true,
    title: _title,
    message: _message,
  })
    .onOk(() => {})
    .onCancel(() => {})
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 프로그램 목록 가져오기 부분 **********************************//
const progReloadBtn = () => {
  getGroupData();
  prog_tree_data.value = [];

  api
    .post('/api/sys/sys5020_prog_list', {})
    .then(res => {
      prog_tree_data.value = res.data.data;

      for (let i = 0; i < prog_tree_data.value.length; i++) {
        // root 노드는 제외
        if (prog_tree_data.value[i].parent !== '#') {
          let obj = {};
          obj.progId = prog_tree_data.value[i].id;
          obj.type = 'file';

          prog_tree_data.value[i].a_attr = obj;
        } else {
          let obj = {};
          obj.progId = '';
          obj.type = 'folder';
          prog_tree_data.value[i].a_attr = obj;
        }
      }
      $('#progTree').jstree(true).settings.core.data = prog_tree_data.value;
      $('#progTree').jstree(true).refresh();
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
};

// ***** 메뉴 목록 가져오기 부분 **********************************//
const menuReloadBtn = () => {
  menu_tree_data.value = [];
  console.log('menuReloadBtn');
  api
    .post('/api/sys/sys5020_menu_list', { paramSelectedGroup: selectedGroup.value })
    .then(res => {
      console.log('res :::: ', res.data);
      if (res.data.data.length > 0) {
        menu_tree_data.value = res.data.data;

        for (let i = 0; i < menu_tree_data.value.length; i++) {
          // root 노드는 제외
          let obj = new Object();
          obj.opened = menu_tree_data.value[i].stateOpened;
          menu_tree_data.value[i].state = obj;

          obj = new Object();
          obj.progId = menu_tree_data.value[i].progId;
          obj.type = menu_tree_data.value[i].type;
          menu_tree_data.value[i].a_attr = obj;
        }
      } else {
        menu_tree_data.value = { id: 'j1_1', parent: '#', seq: 0, text: '새로운 그룹명', icon: 'fa fa-folder' };
      }
      $('#menuTree').jstree(true).settings.core.data = menu_tree_data.value;
      $('#menuTree').jstree(true).refresh();
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
};

// ***** DataBase 그룹자료 가져오기 부분 *****************************//
const groupOptions = ref([]);
const selectedGroup = ref(null);
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
    menuReloadBtn();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveData = async resFormData => {
  console.log('saveData:: ', JSON.stringify(resFormData));
  let saveStatus = 0;
  try {
    await api
      .post('/api/sys/sys5020_save', resFormData)
      .then(res => {
        // console.log('save: ', res.data.rtn);
        saveStatus = res.data.rtn;
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        saveStatus = 3;
      });
  } catch (error) {
    console.log('error >> ', error);
    saveStatus = 4;
  }
  return saveStatus;
};

const deleteData = async resFormData => {
  console.log('deleteData:: ', JSON.stringify(resFormData));
  let saveStatus = 2; // 삭제성공
  try {
    await api
      .post('/api/sys/sys5020_select_delete', resFormData)
      .then(res => {
        // console.log('save: ', res.data.rtn);
        saveStatus = res.data.rtn;
        if (saveStatus === '0') {
          saveStatus = 2;
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        saveStatus = 3;
      });
  } catch (error) {
    console.log('error >> ', error);
    saveStatus = 4;
  }
  return saveStatus;
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// ***** 검색 선택 처리 부분 ***********************************//
const handleSelectedGroup = resSelectedGroup => {
  console.log('selected group: ', resSelectedGroup);
  menuReloadBtn();
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//

//******* Screen Height resize check 부분 *************************************//
const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));

const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value - 380;
};
onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
////******* Screen Height resize check 부분 끝 *********************************//
</script>
<style lang="scss" scoped>
.super-small.q-field--dense {
  .q-field__control-container,
  .q-field__native {
    padding-top: 5px !important;
  }

  .q-field__control {
    height: 30px !important;
    min-height: 30px !important;
  }

  .q-field__marginal {
    height: 30px !important;
  }

  .q-field__label {
    top: 5px !important;
  }
}
.scrollable-card {
  //max-height: 500px; /* Set the maximum height as needed */
  overflow-y: auto; /* Enable vertical scrollbar if content exceeds the max height */
}
</style>
