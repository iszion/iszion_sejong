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

          <q-select
            stack-label
            options-dense
            label-color="orange"
            v-model="searchValue.prodDiv"
            :options="searchValue.prodDivOptions"
            option-value="commCd"
            option-label="commNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 150px"
            label="구분"
          />

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
          <sal-v4460p :messages="{ rowData: rowData, titleNm: menuLabel, searchValue: searchValue }" @close="handleClose" />
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
import SalV4460p from 'pages/erp/sal/SalV4460p.vue';
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
  prodDivOptions: [],
  prodDiv: '1011101',
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
    headerName: '도서명',
    field: 'prodNm',
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
    minWidth: 200,
    valueGetter: params => {
      return params.data.prodNm;
    },
    cellStyle: params => {
      return { textAlign: 'left' };
    },
  },
  {
    headerName: '코드',
    field: 'prodCd',
    minWidth: 90,
    maxWidth: 90,
    resizable: true,
    valueGetter: function (params) {
      return params.data.prodCd;
    },
  },
  {
    headerName: '합계',
    children: [
      {
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'totIQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'totIbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'totOQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'totOjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'totObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'totOxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'totOzQty',
        minWidth: 110,
        maxWidth: 110,
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
    headerName: '1월',
    children: [
      {
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm01IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm01IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm01OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm01OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm01ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm01OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm01OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm02IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm02IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm02OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm02OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm02ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm02OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm02OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm03IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm03IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm03OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm03OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm03ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm03OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm03OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm04IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm04IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm04OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm04OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm04ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm04OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm04OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm05IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm05IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm05OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm05OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm05ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm05OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm05OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm06IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm06IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm06OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm06OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm06ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm06OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm06OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm07IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm07IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm07OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm07OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm07ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm07OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm07OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm08IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm08IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm08OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm08OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm08ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm08OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm08OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm09IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm09IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm09OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm09OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm09ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm09OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm09OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm10IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm10IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm10OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm10OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm10ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm10OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm10OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm11IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm11IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm11OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm11OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm11ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm11OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm11OzQty',
        minWidth: 110,
        maxWidth: 110,
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
        headerName: '입고',
        children: [
          {
            headerName: '입고',
            field: 'm12IQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '입고반품',
            field: 'm12IbQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '출고',
        children: [
          {
            headerName: '출고',
            field: 'm12OQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '증정',
            field: 'm12OjQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '반품',
            field: 'm12ObQty',
            minWidth: 110,
            maxWidth: 110,
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
            headerName: '폐기',
            field: 'm12OxQty',
            minWidth: 110,
            maxWidth: 110,
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
        headerName: '조정',
        field: 'm12OzQty',
        minWidth: 110,
        maxWidth: 110,
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
    const response = await api.post('/api/sal/sal4460_list', {
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
    prodNm: '합계',
    totIQty: 0,
    totIbQty: 0,
    totOQty: 0,
    totOjQty: 0,
    totObQty: 0,
    totOxQty: 0,
    totOzQty: 0,

    m01IQty: 0,
    m02IQty: 0,
    m03IQty: 0,
    m04IQty: 0,
    m05IQty: 0,
    m06IQty: 0,
    m07IQty: 0,
    m08IQty: 0,
    m09IQty: 0,
    m10IQty: 0,
    m11IQty: 0,
    m12IQty: 0,

    m01IbQty: 0,
    m02IbQty: 0,
    m03IbQty: 0,
    m04IbQty: 0,
    m05IbQty: 0,
    m06IbQty: 0,
    m07IbQty: 0,
    m08IbQty: 0,
    m09IbQty: 0,
    m10IbQty: 0,
    m11IbQty: 0,
    m12IbQty: 0,

    m01OQty: 0,
    m02OQty: 0,
    m03OQty: 0,
    m04OQty: 0,
    m05OQty: 0,
    m06OQty: 0,
    m07OQty: 0,
    m08OQty: 0,
    m09OQty: 0,
    m10OQty: 0,
    m11OQty: 0,
    m12OQty: 0,

    m01OjQty: 0,
    m02OjQty: 0,
    m03OjQty: 0,
    m04OjQty: 0,
    m05OjQty: 0,
    m06OjQty: 0,
    m07OjQty: 0,
    m08OjQty: 0,
    m09OjQty: 0,
    m10OjQty: 0,
    m11OjQty: 0,
    m12OjQty: 0,

    m01ObQty: 0,
    m02ObQty: 0,
    m03ObQty: 0,
    m04ObQty: 0,
    m05ObQty: 0,
    m06ObQty: 0,
    m07ObQty: 0,
    m08ObQty: 0,
    m09ObQty: 0,
    m10ObQty: 0,
    m11ObQty: 0,
    m12ObQty: 0,

    m01OxQty: 0,
    m02OxQty: 0,
    m03OxQty: 0,
    m04OxQty: 0,
    m05OxQty: 0,
    m06OxQty: 0,
    m07OxQty: 0,
    m08OxQty: 0,
    m09OxQty: 0,
    m10OxQty: 0,
    m11OxQty: 0,
    m12OxQty: 0,

    m01OzQty: 0,
    m02OzQty: 0,
    m03OzQty: 0,
    m04OzQty: 0,
    m05OzQty: 0,
    m06OzQty: 0,
    m07OzQty: 0,
    m08OzQty: 0,
    m09OzQty: 0,
    m10OzQty: 0,
    m11OzQty: 0,
    m12OzQty: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.totIQty += row.totIQty || 0;
    totalRow.totIbQty += row.totIbQty || 0;
    totalRow.totOQty += row.totOQty || 0;
    totalRow.totOjQty += row.totOjQty || 0;
    totalRow.totObQty += row.totObQty || 0;
    totalRow.totOxQty += row.totOxQty || 0;
    totalRow.totOzQty += row.totOzQty || 0;

    totalRow.m01IQty += row.m01IQty || 0;
    totalRow.m02IQty += row.m02IQty || 0;
    totalRow.m03IQty += row.m03IQty || 0;
    totalRow.m04IQty += row.m04IQty || 0;
    totalRow.m05IQty += row.m05IQty || 0;
    totalRow.m06IQty += row.m06IQty || 0;
    totalRow.m07IQty += row.m07IQty || 0;
    totalRow.m08IQty += row.m08IQty || 0;
    totalRow.m09IQty += row.m09IQty || 0;
    totalRow.m10IQty += row.m10IQty || 0;
    totalRow.m11IQty += row.m11IQty || 0;
    totalRow.m12IQty += row.m12IQty || 0;

    totalRow.m01IbQty += row.m01IbQty || 0;
    totalRow.m02IbQty += row.m02IbQty || 0;
    totalRow.m03IbQty += row.m03IbQty || 0;
    totalRow.m04IbQty += row.m04IbQty || 0;
    totalRow.m05IbQty += row.m05IbQty || 0;
    totalRow.m06IbQty += row.m06IbQty || 0;
    totalRow.m07IbQty += row.m07IbQty || 0;
    totalRow.m08IbQty += row.m08IbQty || 0;
    totalRow.m09IbQty += row.m09IbQty || 0;
    totalRow.m10IbQty += row.m10IbQty || 0;
    totalRow.m11IbQty += row.m11IbQty || 0;
    totalRow.m12IbQty += row.m12IbQty || 0;

    totalRow.m01OQty += row.m01OQty || 0;
    totalRow.m02OQty += row.m02OQty || 0;
    totalRow.m03OQty += row.m03OQty || 0;
    totalRow.m04OQty += row.m04OQty || 0;
    totalRow.m05OQty += row.m05OQty || 0;
    totalRow.m06OQty += row.m06OQty || 0;
    totalRow.m07OQty += row.m07OQty || 0;
    totalRow.m08OQty += row.m08OQty || 0;
    totalRow.m09OQty += row.m09OQty || 0;
    totalRow.m10OQty += row.m10OQty || 0;
    totalRow.m11OQty += row.m11OQty || 0;
    totalRow.m12OQty += row.m12OQty || 0;

    totalRow.m01OjQty += row.m01OjQty || 0;
    totalRow.m02OjQty += row.m02OjQty || 0;
    totalRow.m03OjQty += row.m03OjQty || 0;
    totalRow.m04OjQty += row.m04OjQty || 0;
    totalRow.m05OjQty += row.m05OjQty || 0;
    totalRow.m06OjQty += row.m06OjQty || 0;
    totalRow.m07OjQty += row.m07OjQty || 0;
    totalRow.m08OjQty += row.m08OjQty || 0;
    totalRow.m09OjQty += row.m09OjQty || 0;
    totalRow.m10OjQty += row.m10OjQty || 0;
    totalRow.m11OjQty += row.m11OjQty || 0;
    totalRow.m12OjQty += row.m12OjQty || 0;

    totalRow.m01ObQty += row.m01ObQty || 0;
    totalRow.m02ObQty += row.m02ObQty || 0;
    totalRow.m03ObQty += row.m03ObQty || 0;
    totalRow.m04ObQty += row.m04ObQty || 0;
    totalRow.m05ObQty += row.m05ObQty || 0;
    totalRow.m06ObQty += row.m06ObQty || 0;
    totalRow.m07ObQty += row.m07ObQty || 0;
    totalRow.m08ObQty += row.m08ObQty || 0;
    totalRow.m09ObQty += row.m09ObQty || 0;
    totalRow.m10ObQty += row.m10ObQty || 0;
    totalRow.m11ObQty += row.m11ObQty || 0;
    totalRow.m12ObQty += row.m12ObQty || 0;

    totalRow.m01OxQty += row.m01OxQty || 0;
    totalRow.m02OxQty += row.m02OxQty || 0;
    totalRow.m03OxQty += row.m03OxQty || 0;
    totalRow.m04OxQty += row.m04OxQty || 0;
    totalRow.m05OxQty += row.m05OxQty || 0;
    totalRow.m06OxQty += row.m06OxQty || 0;
    totalRow.m07OxQty += row.m07OxQty || 0;
    totalRow.m08OxQty += row.m08OxQty || 0;
    totalRow.m09OxQty += row.m09OxQty || 0;
    totalRow.m10OxQty += row.m10OxQty || 0;
    totalRow.m11OxQty += row.m11OxQty || 0;
    totalRow.m12OxQty += row.m12OxQty || 0;

    totalRow.m01OzQty += row.m01OzQty || 0;
    totalRow.m02OzQty += row.m02OzQty || 0;
    totalRow.m03OzQty += row.m03OzQty || 0;
    totalRow.m04OzQty += row.m04OzQty || 0;
    totalRow.m05OzQty += row.m05OzQty || 0;
    totalRow.m06OzQty += row.m06OzQty || 0;
    totalRow.m07OzQty += row.m07OzQty || 0;
    totalRow.m08OzQty += row.m08OzQty || 0;
    totalRow.m09OzQty += row.m09OzQty || 0;
    totalRow.m10OzQty += row.m10OzQty || 0;
    totalRow.m11OzQty += row.m11OzQty || 0;
    totalRow.m12OzQty += row.m12OzQty || 0;
  });

  const hasMeaningfulData =
    totalRow.totIQty !== 0 ||
    totalRow.totIbQty !== 0 ||
    totalRow.totOQty !== 0 ||
    totalRow.totOjQty !== 0 ||
    totalRow.totObQty !== 0 ||
    totalRow.totOxQty !== 0 ||
    totalRow.totOzQty !== 0 ||
    totalRow.jAmt !== 0 ||
    totalRow.m01IQty !== 0 ||
    totalRow.m02IQty !== 0 ||
    totalRow.m03IQty !== 0 ||
    totalRow.m04IQty !== 0 ||
    totalRow.m05IQty !== 0 ||
    totalRow.m06IQty !== 0 ||
    totalRow.m07IQty !== 0 ||
    totalRow.m08IQty !== 0 ||
    totalRow.m09IQty !== 0 ||
    totalRow.m10IQty !== 0 ||
    totalRow.m11IQty !== 0 ||
    totalRow.m12IQty !== 0 ||
    totalRow.m01IbQty !== 0 ||
    totalRow.m02IbQty !== 0 ||
    totalRow.m03IbQty !== 0 ||
    totalRow.m04IbQty !== 0 ||
    totalRow.m05IbQty !== 0 ||
    totalRow.m06IbQty !== 0 ||
    totalRow.m07IbQty !== 0 ||
    totalRow.m08IbQty !== 0 ||
    totalRow.m09IbQty !== 0 ||
    totalRow.m10IbQty !== 0 ||
    totalRow.m11IbQty !== 0 ||
    totalRow.m12IbQty !== 0 ||
    totalRow.m01OQty !== 0 ||
    totalRow.m02OQty !== 0 ||
    totalRow.m03OQty !== 0 ||
    totalRow.m04OQty !== 0 ||
    totalRow.m05OQty !== 0 ||
    totalRow.m06OQty !== 0 ||
    totalRow.m07OQty !== 0 ||
    totalRow.m08OQty !== 0 ||
    totalRow.m09OQty !== 0 ||
    totalRow.m10OQty !== 0 ||
    totalRow.m11OQty !== 0 ||
    totalRow.m12OQty !== 0 ||
    totalRow.m01OjQty !== 0 ||
    totalRow.m02OjQty !== 0 ||
    totalRow.m03OjQty !== 0 ||
    totalRow.m04OjQty !== 0 ||
    totalRow.m05OjQty !== 0 ||
    totalRow.m06OjQty !== 0 ||
    totalRow.m07OjQty !== 0 ||
    totalRow.m08OjQty !== 0 ||
    totalRow.m09OjQty !== 0 ||
    totalRow.m10OjQty !== 0 ||
    totalRow.m11OjQty !== 0 ||
    totalRow.m12OjQty !== 0 ||
    totalRow.m01ObQty !== 0 ||
    totalRow.m02ObQty !== 0 ||
    totalRow.m03ObQty !== 0 ||
    totalRow.m04ObQty !== 0 ||
    totalRow.m05ObQty !== 0 ||
    totalRow.m06ObQty !== 0 ||
    totalRow.m07ObQty !== 0 ||
    totalRow.m08ObQty !== 0 ||
    totalRow.m09ObQty !== 0 ||
    totalRow.m10ObQty !== 0 ||
    totalRow.m11ObQty !== 0 ||
    totalRow.m12ObQty !== 0 ||
    totalRow.m01OxQty !== 0 ||
    totalRow.m02OxQty !== 0 ||
    totalRow.m03OxQty !== 0 ||
    totalRow.m04OxQty !== 0 ||
    totalRow.m05OxQty !== 0 ||
    totalRow.m06OxQty !== 0 ||
    totalRow.m07OxQty !== 0 ||
    totalRow.m08OxQty !== 0 ||
    totalRow.m09OxQty !== 0 ||
    totalRow.m10OxQty !== 0 ||
    totalRow.m11OxQty !== 0 ||
    totalRow.m12OxQty !== 0 ||
    totalRow.m01OzQty !== 0 ||
    totalRow.m02OzQty !== 0 ||
    totalRow.m03OzQty !== 0 ||
    totalRow.m04OzQty !== 0 ||
    totalRow.m05OzQty !== 0 ||
    totalRow.m06OzQty !== 0 ||
    totalRow.m07OzQty !== 0 ||
    totalRow.m08OzQty !== 0 ||
    totalRow.m09OzQty !== 0 ||
    totalRow.m10OzQty !== 0 ||
    totalRow.m11OzQty !== 0 ||
    totalRow.m12OzQty !== 0;

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
