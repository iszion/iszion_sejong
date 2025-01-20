<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md" :style-fn="myTweak">
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

    <q-card class="q-pa-sm">
      <q-toolbar class="q-px-sm q-pt-none">
        <div class="row q-col-gutter-x-md">
          <q-input
            stack-label
            label-color="orange"
            label="기준년도"
            class="text-subtitle1"
            v-model="searchValue.year"
            type="number"
            style="width: 100px"
            @update:model-value="getData"
          >
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>

          <q-input
            v-if="!$q.screen.xs"
            stack-label
            label-color="orange"
            bottom-slots
            v-model="searchValue.textValue"
            label="검색어"
            class="q-pb-none"
            style="width: 120px"
            @update:model-value="handelGetData"
          >
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="row q-gutter-x-xs q-gutter-y-md">
          <q-btn outline color="grey" @click="handelGetData" class="q-px-sm">
            <q-icon name="search" size="xs" class="q-mr-xs" />
            조회
          </q-btn>

          <q-btn v-if="!$q.screen.xs" :disable="rowData.rows.length === 0" outline color="teal" @click="isDialogVisible = true" class="q-px-sm">
            <q-icon name="download" size="xs" class="q-mr-xs" />
            엑셀/출력
          </q-btn>
        </div>
      </q-toolbar>
      <q-card class="q-mt-sm">
        <div :style="contentZoneStyle">
          <ag-grid-vue
            style="width: 100%; height: 100%"
            ref="myGrid"
            :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
            :grid-options="myGridOptions"
          >
          </ag-grid-vue>
        </div>
      </q-card>
    </q-card>

    <q-dialog persistent full-height full-width v-model="isDialogVisible">
      <q-card class="q-pa-none q-ma-none">
        <q-card-section class="q-pa-none q-ma-none">
          <sal-v4440p :messages="{ rowData: rowData, titleNm: menuLabel, searchValue: searchValue }" @close="handleClose" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
ㅌ
<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { QBtn, QIcon, useQuasar } from 'quasar';
import SalV4440p from 'pages/erp/sal/SalV4440p.vue';
import commUtil from 'src/js_comm/comm-util';

const rowData = reactive({ rows: [], rowsSum: [] });
const isDialogVisible = ref(false);

// grid Height 자동처리부분1
const gridHeight = ref(145); // 초기 높이
const rowHeight = 45; // 행당 높이 (예: 25px)
const minHeight = ref(90); // 최소 높이 (예: 300px) rowHeight의 3배

const $q = useQuasar();

function handleClose() {
  console.log('handleClose called');
  isDialogVisible.value = false;
}
const contentZoneHeight = ref(300);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 160}px`,
}));

const searchValue = reactive({
  year: commUtil.getTodayYear(),
  textValue: '',
});

const columnDefs = ref([
  {
    headerName: '#',
    field: 'rowNum',
    minWidth: 80,
    maxWidth: 80,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    sortable: true,
    filter: false,
    valueGetter: function (params) {
      if (params.node.rowPinned) {
        return null; // Do not display a number for pinned rows
      }
      return params.node.rowIndex + 1;
    },
    cellStyle: params => {
      return { textAlign: 'center' };
    },
  },
  {
    headerName: '거래처명',
    field: 'custNm',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    minWidth: 200,
    valueGetter: params => {
      return params.data.custNm;
    },
    cellStyle: params => {
      return { textAlign: 'left' };
    },
  },
  {
    headerName: '코드',
    field: 'custCd',
    minWidth: 90,
    maxWidth: 90,
    resizable: true,
    valueGetter: function (params) {
      return params.data.custCd;
    },
  },
  {
    headerName: '전기잔액',
    field: 'wAmt',
    minWidth: 150,
    maxWidth: 150,
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
  },
  {
    headerName: '당기합계',
    children: [
      {
        headerName: '당기매출액',
        field: 'toAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '당기반품액',
        field: 'tobAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '당기수금액',
        field: 'tinAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '당기잔액',
    field: 'jAmt',
    minWidth: 150,
    maxWidth: 150,
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
    // cellStyle: () => {
    //   return {
    //     color: $q.dark.isActive ? 'orange' : 'teal',
    //   };
    // },
  },
  {
    headerName: '1월',
    children: [
      {
        headerName: '매출액',
        field: 'm01OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm01ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm01InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '2월',
    children: [
      {
        headerName: '매출액',
        field: 'm02OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm02ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm02InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '3월',
    children: [
      {
        headerName: '매출액',
        field: 'm03OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm03ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm03InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '4월',
    children: [
      {
        headerName: '매출액',
        field: 'm04OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm04ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm04InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '5월',
    children: [
      {
        headerName: '매출액',
        field: 'm05OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm05ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm05InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '6월',
    children: [
      {
        headerName: '매출액',
        field: 'm06OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm06ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm06InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '7월',
    children: [
      {
        headerName: '매출액',
        field: 'm07OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm07ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm07InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '8월',
    children: [
      {
        headerName: '매출액',
        field: 'm08OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm08ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm08InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '9월',
    children: [
      {
        headerName: '매출액',
        field: 'm09OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm09ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm09InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '10월',
    children: [
      {
        headerName: '매출액',
        field: 'm10OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm10ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm10InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '11월',
    children: [
      {
        headerName: '매출액',
        field: 'm11OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm11ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm11InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
  {
    headerName: '12월',
    children: [
      {
        headerName: '매출액',
        field: 'm12OAmt',
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '반품액',
        field: 'm12ObAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
      {
        headerName: '수금액',
        field: 'm12InAmt',
        minWidth: 150,
        maxWidth: 150,
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
        // cellStyle: () => {
        //   return {
        //     color: $q.dark.isActive ? 'orange' : 'teal',
        //   };
        // },
      },
    ],
  },
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  getDataCommOption('101').then(() => {
    handelGetData();
  });
});

const handelGetData = () => {
  getData();
};

const menuLabel = ref('');
onMounted(() => {
  window.addEventListener('resize', handleResize);
  menuLabel.value = window.history.state.label;
  handleResize();
});

const selectedRows = ref([]);

// ======================================================
const screenSizeHeight = ref(0);
const myTweak = offset => {
  screenSizeHeight.value = offset;

  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
};
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - screenSizeHeight.value;
  // contentZoneHeight.value = window.innerHeight - state.height - 680;
};
// ======================================================

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

const getData = async () => {
  try {
    const response = await api.post('/api/sal/sal4440_list', {
      paramYear: searchValue.year,
      paramValue: searchValue.textValue,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setColumnDefs(columnDefs.value);
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    // console.log('data : ', JSON.stringify(rowData.rowsSum));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 공통코드정보 가져오기 부분  *****************************//
const getDataCommOption = async resCommCd1 => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });

    switch (resCommCd1) {
      case '101':
        searchValue.prodDivOptions = JSON.parse(JSON.stringify(response.data.data));
        searchValue.prodDivOptions.push({ commCd: '', commNm: '전체' });
        break;
      default:
        searchValue.prodDivOptions = [];
    }

    // console.log('getData1: ', JSON.stringify(response.data.data));
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
  rowData.rowsSum = [];

  let totalRow = {
    custNm: '합계',
    wAmt: 0,
    toAmt: 0,
    tobAmt: 0,
    tinAmt: 0,
    jAmt: 0,

    m01OAmt: 0,
    m02OAmt: 0,
    m03OAmt: 0,
    m04OAmt: 0,
    m05OAmt: 0,
    m06OAmt: 0,
    m07OAmt: 0,
    m08OAmt: 0,
    m09OAmt: 0,
    m10OAmt: 0,
    m11OAmt: 0,
    m12OAmt: 0,

    m01ObAmt: 0,
    m02ObAmt: 0,
    m03ObAmt: 0,
    m04ObAmt: 0,
    m05ObAmt: 0,
    m06ObAmt: 0,
    m07ObAmt: 0,
    m08ObAmt: 0,
    m09ObAmt: 0,
    m10ObAmt: 0,
    m11ObAmt: 0,
    m12ObAmt: 0,

    m01InAmt: 0,
    m02InAmt: 0,
    m03InAmt: 0,
    m04InAmt: 0,
    m05InAmt: 0,
    m06InAmt: 0,
    m07InAmt: 0,
    m08InAmt: 0,
    m09InAmt: 0,
    m10InAmt: 0,
    m11InAmt: 0,
    m12InAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.wAmt += row.wAmt || 0;
    totalRow.toAmt += row.toAmt || 0;
    totalRow.tinAmt += row.tinAmt || 0;
    totalRow.jAmt += row.jAmt || 0;

    totalRow.m01OAmt += row.m01OAmt || 0;
    totalRow.m02OAmt += row.m02OAmt || 0;
    totalRow.m03OAmt += row.m03OAmt || 0;
    totalRow.m04OAmt += row.m04OAmt || 0;
    totalRow.m05OAmt += row.m05OAmt || 0;
    totalRow.m06OAmt += row.m06OAmt || 0;
    totalRow.m07OAmt += row.m07OAmt || 0;
    totalRow.m08OAmt += row.m08OAmt || 0;
    totalRow.m09OAmt += row.m09OAmt || 0;
    totalRow.m10OAmt += row.m10OAmt || 0;
    totalRow.m11OAmt += row.m11OAmt || 0;
    totalRow.m12OAmt += row.m12OAmt || 0;

    totalRow.m01ObAmt += row.m01ObAmt || 0;
    totalRow.m02ObAmt += row.m02ObAmt || 0;
    totalRow.m03ObAmt += row.m03ObAmt || 0;
    totalRow.m04ObAmt += row.m04ObAmt || 0;
    totalRow.m05ObAmt += row.m05ObAmt || 0;
    totalRow.m06ObAmt += row.m06ObAmt || 0;
    totalRow.m07ObAmt += row.m07ObAmt || 0;
    totalRow.m08ObAmt += row.m08ObAmt || 0;
    totalRow.m09ObAmt += row.m09ObAmt || 0;
    totalRow.m10ObAmt += row.m10ObAmt || 0;
    totalRow.m11ObAmt += row.m11ObAmt || 0;
    totalRow.m12ObAmt += row.m12ObAmt || 0;

    totalRow.m01InAmt += row.m01InAmt || 0;
    totalRow.m02InAmt += row.m02InAmt || 0;
    totalRow.m03InAmt += row.m03InAmt || 0;
    totalRow.m04InAmt += row.m04InAmt || 0;
    totalRow.m05InAmt += row.m05InAmt || 0;
    totalRow.m06InAmt += row.m06InAmt || 0;
    totalRow.m07InAmt += row.m07InAmt || 0;
    totalRow.m08InAmt += row.m08InAmt || 0;
    totalRow.m09InAmt += row.m09InAmt || 0;
    totalRow.m10InAmt += row.m10InAmt || 0;
    totalRow.m11InAmt += row.m11InAmt || 0;
    totalRow.m12InAmt += row.m12InAmt || 0;
  });

  const hasMeaningfulData =
    totalRow.wAmt !== 0 ||
    totalRow.toAmt !== 0 ||
    totalRow.tobAmt !== 0 ||
    totalRow.tinAmt !== 0 ||
    totalRow.jAmt !== 0 ||
    totalRow.m01OAmt !== 0 ||
    totalRow.m02OAmt !== 0 ||
    totalRow.m03OAmt !== 0 ||
    totalRow.m04OAmt !== 0 ||
    totalRow.m05OAmt !== 0 ||
    totalRow.m06OAmt !== 0 ||
    totalRow.m07OAmt !== 0 ||
    totalRow.m08OAmt !== 0 ||
    totalRow.m09OAmt !== 0 ||
    totalRow.m10OAmt !== 0 ||
    totalRow.m11OAmt !== 0 ||
    totalRow.m12OAmt !== 0 ||
    totalRow.m01ObAmt !== 0 ||
    totalRow.m02ObAmt !== 0 ||
    totalRow.m03ObAmt !== 0 ||
    totalRow.m04ObAmt !== 0 ||
    totalRow.m05ObAmt !== 0 ||
    totalRow.m06ObAmt !== 0 ||
    totalRow.m07ObAmt !== 0 ||
    totalRow.m08ObAmt !== 0 ||
    totalRow.m09ObAmt !== 0 ||
    totalRow.m10ObAmt !== 0 ||
    totalRow.m11ObAmt !== 0 ||
    totalRow.m12ObAmt !== 0 ||
    totalRow.m01InAmt !== 0 ||
    totalRow.m02InAmt !== 0 ||
    totalRow.m03InAmt !== 0 ||
    totalRow.m04InAmt !== 0 ||
    totalRow.m05InAmt !== 0 ||
    totalRow.m06InAmt !== 0 ||
    totalRow.m07InAmt !== 0 ||
    totalRow.m08InAmt !== 0 ||
    totalRow.m09InAmt !== 0 ||
    totalRow.m10InAmt !== 0 ||
    totalRow.m11InAmt !== 0 ||
    totalRow.m12InAmt !== 0;

  if (hasMeaningfulData) {
    rowData.rowsSum.push(totalRow);
  }

  return totalRow;
};
// rows 전체 합 구하는 부분 끝

// *********************************
const myGrid = ref(null);
const myGridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  rowSelection: 'single' /* 'single' or 'multiple',*/,
  // enableColResize: true,
  // enableSorting: true,
  // enableFilter: true,
  // enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (event) {
    if (event.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    // return { 'text-align': 'left' };
    // seq가 undefined이면 행 배경색 변경 및 "소계" 삽입
    // if (event.data.saleDay === '00000000') {
    //   return { backgroundColor: 'rgba(0,181,117,0.24)', fontWeight: 'bold' }; // 예: 연한 주황색
    // }
    // if (event.data.custNm === '일계') {
    //   return { backgroundColor: 'rgba(1,127,194,0.17)' }; // 예: 연한 파란색
    // }
    // if (event.data.custNm === '총계') {
    //   return { backgroundColor: 'rgba(3,147,5,0.22)' }; // 예: 연한 파란색
    // }
    // dealDay가 undefined이면 행 배경색 변경 및 "합계" 삽입
    return null; // 기본 스타일
  },
  getRowHeight: function (event) {
    // 고정된 행의 높이
    if (event.node.rowPinned) {
      return 35;
    }
    return 30;
  },
  headerHeight: 25, // 헤더 행 높이를 50px로 설정
  // 또는 동적으로 헤더 높이를 계산
  // getHeaderHeight: function () {
  //   return 60; // 동적으로 60px 설정
  // },
  // // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
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
    selectedRows.value = event.api.getSelectedRows();
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
    // console.log('onSelectionChanged');
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  pinnedBottomRowData: [calculateTotal()],
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  // getRowNodeId: function (event) {
  //   console.log('getRowNodeId');
  // return null;
  // },
  // 리드 상단 고정
  // setPinnedTopRowData: function (data) {
  //   return null;
  // },
  // 그리드 하단 고정
  // setPinnedBottomRowData: function (data) {
  //   return null;
  // },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};

/* *** 코드헬프부분 ** */
</script>
<style></style>
