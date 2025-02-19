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

    <q-card bordered>
      <q-card-actions class="q-py-sm">
        <div class="row q-gutter-lg">
          <q-input
            dense
            stack-label
            label-color="orange"
            label="손익년도"
            class="text-subtitle1"
            v-model="searchValue.year"
            type="number"
            style="width: 90px"
            @update:model-value="getData"
          >
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>
          <q-btn outline color="primary" icon="refresh" label="불러오기" @click="getData" />
        </div>
        <q-space />
        <q-input
          stack-label
          bottom-slots
          label-color="orange"
          v-model="searchValue.textValue"
          label="검색"
          dense
          class="q-pb-none"
          style="width: 120px"
          @keyup.enter="getData"
        >
          <template v-slot:append>
            <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
          </template>
        </q-input>

        <q-space />
        <div class="inline q-gutter-x-xs">
          <q-btn outline color="primary" icon="add" label="라인추가" @click="addDataRowSection('next')" />
          <q-btn outline color="negative" icon="remove" label="라인제거" :disable="removeRowsCount <= 0" @click="removeSelectedRow" />
          <q-btn v-if="rowData.rows.length > 0" outline color="primary" icon="save" label="저장" @click="saveDataSection">
            <q-badge v-show="delRowsCount > 0" color="red" floating>{{ delRowsCount }}</q-badge>
          </q-btn>
        </div>
      </q-card-actions>
      <q-separator />
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, useQuasar } from 'quasar';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import JsonUtil from 'src/js_comm/json-util';
import CompHelpProdButton from 'components/CompHelpProdButton.vue';
import HelpProd from 'components/subvue/HelpProd.vue';

const $q = useQuasar();

const searchValue = reactive({
  year: commUtil.getTodayYear(),
  textValue: '',
});

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 260}px`,
}));

const selectedRows = reactive({ rows: [] });
const rowData = reactive({ rows: [] });
const rowDataBack = ref([]);

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});

onBeforeMount(() => {
  getData();
});

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
});

const dateGetter = (params, field) => {
  const dateStr = params.data[field];
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  }
  return dateStr;
};

// 편집 후 데이터를 저장할 때
const dateSetter = (params, field) => {
  const dateStr = params.newValue.replace(/-/g, '');
  if (dateStr.length === 8) {
    params.data[field] = dateStr;
    return true;
  }
  return false;
};

const columnDefs = ref([
  {
    headerName: '',
    field: '',
    maxWidth: 50,
    minWidth: 50,
    editable: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,

    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: 'No',
    field: '',
    minWidth: 70,
    maxWidth: 70,
    editable: false,
    filter: false,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    valueGetter: function (params) {
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: '발생일',
    field: 'makeDay',
    minWidth: 130,
    maxWidth: 130,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellEditor: 'agDateStringCellEditor',
    valueGetter: params => dateGetter(params, 'makeDay'),
    valueSetter: params => dateSetter(params, 'makeDay'),
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '도서명',
    field: 'prodNm',
    minWidth: 250,
    editable: params => !params.node.rowPinned, // 합계 Pinned 행에서는 편집 불가
    cellClassRules: {
      'pinned-row': params => params.node.rowPinned, // 합계 스타일 지정
    },
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 100,
    maxWidth: 100,
    editable: false,
    cellRendererSelector: params => {
      // 조건에 따라 cellRenderer 설정
      if (!params.node.rowPinned) {
        return {
          component: CompHelpProdButton,
          params: {
            updateSelectedValue: selectedParams => {
              params.node.setDataValue('prodNm', selectedParams.prodNm); // prodNm 업데이트
              params.node.setDataValue('prodCd', selectedParams.prodCd); // prodCd 업데이트
              params.node.setDataValue('price', selectedParams.sPrice); // prodCd 업데이트
            },
          },
        };
      }
      // 조건에 맞지 않으면 cellRenderer를 사용하지 않음
      return null;
    },
  },
  {
    headerName: '번역비',
    field: 'transAmt',
    minWidth: 140,
    maxWidth: 140,
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
    headerClass: params => ($q.dark.isActive ? 'dark-header ag-right-aligned-header' : 'light-header ag-right-aligned-header'),
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '외주비',
    field: 'expAmt',
    minWidth: 140,
    maxWidth: 140,
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
    headerClass: params => ($q.dark.isActive ? 'dark-header ag-right-aligned-header' : 'light-header ag-right-aligned-header'),
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '용지대',
    field: 'paperAmt',
    minWidth: 140,
    maxWidth: 140,
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
    headerClass: params => ($q.dark.isActive ? 'dark-header ag-right-aligned-header' : 'light-header ag-right-aligned-header'),
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '인쇄비',
    field: 'printAmt',
    minWidth: 140,
    maxWidth: 140,
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
    headerClass: params => ($q.dark.isActive ? 'dark-header ag-right-aligned-header' : 'light-header ag-right-aligned-header'),
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '기타비용',
    field: 'otherAmt',
    minWidth: 140,
    maxWidth: 140,
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
    headerClass: params => ($q.dark.isActive ? 'dark-header ag-right-aligned-header' : 'light-header ag-right-aligned-header'),
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '기타사항',
    field: 'remarks',
    minWidth: 200,
  },
]);

const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const saveDataSection = () => {
  if (isEqual(rowData.rows, rowDataBack.value) && selectedRows.rows.length === 0) {
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
    // Detail 자료 분류작업
    let iu = [];
    let iuD = [];
    console.log('data1 : ', JSON.stringify(rowData.rows));
    console.log('data2 : ', JSON.stringify(selectedRows.rows));
    // 신규 수정 자료정리
    for (let i = 0; i < rowData.rows.length; i++) {
      if (rowData.rows[i].prodNm !== '') {
        if (rowData.rows[i].iuD === 'I' || rowData.rows[i].iuD === 'U') {
          let tmpJson = '{"mode": "' + rowData.rows[i].iuD + '","data":' + JSON.stringify(rowData.rows[i]) + '}';
          iu.push(tmpJson);
        }
      }
    }

    // 삭제 자료정리
    for (let i = 0; i < selectedRows.rows.length; i++) {
      if (selectedRows.rows[i].iuD === 'R' || selectedRows.rows[i].iuD === 'U') {
        let tmpJson = '{"mode": "' + 'D' + '","data":' + JSON.stringify(selectedRows.rows[i]) + '}';
        iuD.push(tmpJson);
      }
    }

    // Detail 자료 정리
    const saveData = JSON.stringify(JsonUtil.jsonFiller('no1', iu, iuD));

    console.log('save : ', JSON.stringify(saveData));
    saveDataAndHandleResult(saveData).then(val => {
      getData();
    });
  }
};

// 다크 모드 변경 감지 후 컬럼 스타일 다시 설정
watch(
  () => $q.dark.isActive,
  () => {
    // ag-Grid에 컬럼 다시 적용
    myGrid.value.api?.setColumnDefs([...columnDefs.value]); // 참조 유지하면서 새로운 배열 할당
  },
);

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = async resFormData => {
  try {
    const res = await api.post('/api/cos/cos1020_save', resFormData);
    let saveStatus = {
      rtn: res.data.rtn,
      rtnMsg: res.data.rtnMsg,
    };
    notifySave.notifyView(saveStatus);
    return saveStatus;
  } catch (error) {
    console.log('error: ', error);
    throw error; // 에러 발생 시 에러를 던져 호출자에서 처리할 수 있도록 함
  }
};

// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/cos/cos1020_list', {
      paramYear: searchValue.year,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    rowDataBack.value = JSON.parse(JSON.stringify(response.data.data));
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

// *********************************

// rows 전체 합 구하는 부분
const calculateTotal = () => {
  let totalRow = {
    prodNm: '합계',
    transAmt: 0,
    expAmt: 0,
    paperAmt: 0,
    printAmt: 0,
    otherAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.transAmt += row.transAmt || 0;
    totalRow.expAmt += row.expAmt || 0;
    totalRow.paperAmt += row.paperAmt || 0;
    totalRow.printAmt += row.printAmt || 0;
    totalRow.otherAmt += row.otherAmt || 0;
  });

  return totalRow;
};
// rows 전체 합 구하는 부분 끝

// *********************************
let processedEventKey = null;
const eventKey = ref(null);
const columnFocusMap = {
  makeDay: 'prodNm',
  prodNm: 'transAmt',
  transAmt: 'expAmt',
  expAmt: 'paperAmt',
  paperAmt: 'printAmt',
  printAmt: 'otherAmt',
  otherAmt: 'remarks',
  remarks: 'makeDay',
};

const removeRowsCount = ref(0);
const delRowsCount = ref(0);
const myGrid = ref(null);

const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: true,
  },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  suppressRowClickSelection: true,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  headerHeight: 40, // 헤더 행 높이를 50px로 설정
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 40;
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
  onCellKeyDown: event => {
    // console.log('Event keyDown:', event);
    if (event.column.colId === 'prodNm' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
    if (event.column.colId === 'remarks' && event.event && (event.event.key === 'Enter' || event.event.key === 'Tab')) {
      eventKey.value = event.event.key;
    }
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped : ', event.column.colId);
    if (event.column.colId === 'prodNm' && eventKey.value === 'Enter') {
      //     // 중복 이벤트 방지
      if (processedEventKey === eventKey.value) {
        processedEventKey = null;
        return;
      }
      processedEventKey = eventKey.value;
      // 중복 이벤트 방지 끝
      openHelpProdDialog(event);
      // }
      // });
    }
    if (event.column.colId === 'remarks' && (eventKey.value === 'Enter' || eventKey.value === 'Tab')) {
      processedEventKey = null;
      addDataRowSection('next');
    } else {
      const nextColumn = columnFocusMap[event.column.colId];
      if (nextColumn) {
        myGrid.value.api.setFocusedCell(event.node.rowIndex, nextColumn);
      }
    }
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
    // event.api.startEditingCell({
    //   rowIndex: event.rowIndex,
    //   colKey: event.column.getId(),
    // });
  },
  // isRowSelectable: node => !node.footer,
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    selectedRows.rows = event.api.getSelectedRows();
    removeRowsCount.value = selectedRows.rows.filter(row => row.iuD === 'I').length;
    delRowsCount.value = selectedRows.rows.filter(row => row.iuD !== 'I').length;
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');

    const backData = rowDataBack.value.filter(item => item.makeDay === event.data.oldMakeDay && item.prodCd === event.data.oldProdCd);
    if (!isEqual(event.data, backData[0]) && event.data.iuD === 'R') {
      event.data.iuD = 'U';
    }
    // console.log('rowData :: ', JSON.stringify(rowData.rows));

    event.api.setGridOption('pinnedBottomRowData', [calculateTotal()]); // 자동 합계구하기
  },

  debug: false,
};

/** **** 그리드 Detail 편집부분 ****/

const addDataRowSection = event => {
  let newRowIndex;
  if (event === 'first') {
    newRowIndex = 0;
  } else {
    newRowIndex = myGrid.value.api.getDisplayedRowCount();
  }
  // const addIndex = rowIndex.value;
  const newItems = {
    prodNm: '',
    prodCd: '',
    makeDay: commUtil.unFormatDate(commUtil.getToday()),
    transAmt: 0,
    expAmt: 0,
    paperAmt: 0,
    printAmt: 0,
    otherAmt: 0,
    remarks: '',
    iuD: 'I',
  };

  rowData.rows.splice(newRowIndex, 0, newItems);
  // Refresh the grid
  myGrid.value.api.setRowData(rowData.rows);
  // 포커스를 해당 라인 위치에 적용
  myGrid.value.api.ensureIndexVisible(newRowIndex);
  // 첫컬럼에 focus
  myGrid.value.api.setFocusedCell(newRowIndex, 'makeDay');
};

const removeSelectedRow = () => {
  const selectedNodes = myGrid.value.api.getSelectedNodes();
  const selectedData = selectedNodes.map(node => node.data).filter(data => data.iuD === 'I');

  console.log('selectedData : ', JSON.stringify(selectedData));

  // 선택된 행을 제거
  // rowData.rows = rowData.rows.filter(row => !selectedData.includes(row));
  rowData.rows = rowData.rows.filter(row => !selectedData.some(selected => JSON.stringify(selected) === JSON.stringify(row)));
  console.log('rowData : ', JSON.stringify(rowData.rows));

  // 그리드 데이터 갱신
  myGrid.value.api.setRowData(rowData.rows);
};

const openHelpProdDialog = event => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: event.data.prodNm,
      paramUseYn: 'N',
      paramCloseDay: commUtil.unFormatDate(commUtil.getToday()),
    },
  })
    .onOk(res => {
      event.node.setDataValue('prodNm', res.prodNm);
      event.node.setDataValue('prodCd', res.prodCd);
      myGrid.value.api.setFocusedCell(event.node.rowIndex, 'transAmt');
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
</script>

<style lang="sass" scoped>
::v-deep(.dark-header)
  color: orange !important

::v-deep(.light-header)
  color: blue !important
</style>
