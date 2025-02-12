<template>
  <div style="width: 100%; height: 400px">
    <ag-grid-vue
      ref="myGrid"
      style="width: 100%; height: 100%"
      :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
      :grid-options="gridOptions"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';

const myGrid = ref(null);
// Sample row data
const rowData = ref([
  { a1: '', a2: '', a3: '' },
  { a1: '', a2: '', a3: '' },
]);

// Grid ready event handler

// Column definitions
const columnDefs = ref([
  {
    headerName: 'A1 (5 chars)',
    field: 'a1',
    editable: true,
  },
  {
    headerName: 'A2 (Amount)',
    field: 'a2',
    editable: true,
  },
  {
    headerName: 'A3 (Text)',
    field: 'a3',
    editable: true,
  },
]);

const selectedRows = ref(null);

const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.value,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: true,
  },
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
    console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    console.log('cellEditingStarted');
    if (event.colDef.field === 'a1') {
      const input = event.api.getCellEditorInstances()[0].eInput;

      input.addEventListener('input', function handleInputChange(e) {
        const currentValue = e.target.value;
        console.log('Current input:', currentValue);

        if (currentValue.length > 5) {
          console.log('Exceeded 5 characters:', currentValue);
          // Trigger custom event or any logic
          alert('The input exceeds 5 characters!');
        }
      });

      // Store reference to remove the event listener later
      event.api.editingInput = handleInputChange;
    }
  },
  onCellEditingStopped: function (event) {
    console.log('cellEditingStopped');
    if (event.colDef.field === 'a1') {
      const input = event.api.getCellEditorInstances()[0].eInput;
      input.removeEventListener('input', event.api.editingInput);
    }
  },
  onRowClicked: function (event) {
    console.log('onRowClicked');
    // selectedRows.value = event.api.getSelectedRows();
    // console.log('sel: ', JSON.stringify(selectedRows.value));
  },
  onCellClicked: function (event) {
    console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    console.log('onSelectionChanged1');
    selectedRows.value = event.api.getSelectedRows();
  },
  onSortChanged: function (event) {
    console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    console.log('onCellValueChanged');
    if (event.colDef.field === 'a1') {
      console.log('a1 field changed:', event.newValue);
      // 추가적인 로직 처리
    }
  },

  debug: false,
};
</script>

<style>
/* Optional: AG-Grid theme styling */
.ag-theme-alpine {
  height: 100%;
  width: 100%;
}
</style>
