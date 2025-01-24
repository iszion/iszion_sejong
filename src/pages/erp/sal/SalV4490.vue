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
            stack-label
            class=""
            v-model="searchValue.prodNm"
            label="도서명"
            label-color="orange"
            @keyup.enter.prevent="openHelpProdDialog(searchValue.prodNm)"
          >
            <template v-slot:prepend>
              <q-btn dense flat class="q-mt-md text-bold" icon="search" size="md" :label="searchValue.prodCd" @click="openHelpProdDialog('')" />
            </template>
            <template v-slot:append>
              <q-icon
                size="0.8em"
                v-if="searchValue.prodNm !== ''"
                name="close"
                @click="
                  searchValue.prodNm = '';
                  searchValue.prodCd = '';
                  handelGetData();
                "
                class="cursor-pointer q-pt-md"
              />
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
          <sal-v4490p :messages="{ rowData: rowData, titleNm: menuLabel, searchValue: searchValue }" @close="handleClose" />
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
import SalV4490p from 'pages/erp/sal/SalV4490p.vue';
import commUtil from 'src/js_comm/comm-util';
import HelpCust from 'components/subvue/HelpCust.vue';
import HelpProd from 'components/subvue/HelpProd.vue';

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
  prodCd: '',
  prodNm: '',
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
    headerName: '합계',
    children: [
      {
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'tOQty',
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
            headerName: '금액',
            field: 'tOAmt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'tObQty',
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
            headerName: '금액',
            field: 'tObAmt',
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
        headerName: '재생',
        field: 'tOjQty',
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
        field: 'tOxQty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM01Qty',
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
            headerName: '금액',
            field: 'oM01Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM01Qty',
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
            headerName: '금액',
            field: 'obM01Amt',
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
        headerName: '재생',
        field: 'ojM01Qty',
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
        field: 'oxM01Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM02Qty',
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
            headerName: '금액',
            field: 'oM02Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM02Qty',
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
            headerName: '금액',
            field: 'obM02Amt',
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
        headerName: '재생',
        field: 'ojM02Qty',
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
        field: 'oxM02Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM03Qty',
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
            headerName: '금액',
            field: 'oM03Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM03Qty',
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
            headerName: '금액',
            field: 'obM03Amt',
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
        headerName: '재생',
        field: 'ojM03Qty',
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
        field: 'oxM03Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM04Qty',
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
            headerName: '금액',
            field: 'oM04Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM04Qty',
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
            headerName: '금액',
            field: 'obM04Amt',
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
        headerName: '재생',
        field: 'ojM04Qty',
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
        field: 'oxM04Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM05Qty',
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
            headerName: '금액',
            field: 'oM05Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM05Qty',
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
            headerName: '금액',
            field: 'obM05Amt',
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
        headerName: '재생',
        field: 'ojM05Qty',
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
        field: 'oxM05Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM06Qty',
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
            headerName: '금액',
            field: 'oM06Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM06Qty',
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
            headerName: '금액',
            field: 'obM06Amt',
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
        headerName: '재생',
        field: 'ojM06Qty',
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
        field: 'oxM06Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM07Qty',
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
            headerName: '금액',
            field: 'oM07Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM07Qty',
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
            headerName: '금액',
            field: 'obM07Amt',
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
        headerName: '재생',
        field: 'ojM07Qty',
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
        field: 'oxM07Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM08Qty',
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
            headerName: '금액',
            field: 'oM08Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM08Qty',
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
            headerName: '금액',
            field: 'obM08Amt',
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
        headerName: '재생',
        field: 'ojM08Qty',
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
        field: 'oxM08Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM09Qty',
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
            headerName: '금액',
            field: 'oM09Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM09Qty',
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
            headerName: '금액',
            field: 'obM09Amt',
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
        headerName: '재생',
        field: 'ojM09Qty',
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
        field: 'oxM09Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM10Qty',
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
            headerName: '금액',
            field: 'oM10Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM10Qty',
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
            headerName: '금액',
            field: 'obM10Amt',
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
        headerName: '재생',
        field: 'ojM10Qty',
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
        field: 'oxM10Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM11Qty',
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
            headerName: '금액',
            field: 'oM11Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM11Qty',
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
            headerName: '금액',
            field: 'obM11Amt',
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
        headerName: '재생',
        field: 'ojM11Qty',
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
        field: 'oxM11Qty',
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
        headerName: '출고',
        children: [
          {
            headerName: '수량',
            field: 'oM12Qty',
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
            headerName: '금액',
            field: 'oM12Amt',
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
        headerName: '반품',
        children: [
          {
            headerName: '수량',
            field: 'obM12Qty',
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
            headerName: '금액',
            field: 'obM12Amt',
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
        headerName: '재생',
        field: 'ojM12Qty',
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
        field: 'oxM12Qty',
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
  getData();
});

const handelGetData = () => {
  if (searchValue.custCd === '') {
    $q.dialog({
      dark: true,
      title: '안내',
      html: true,
      message: '거래처코드를 선택하세요',
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {});
  } else {
    getData();
  }
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
    const response = await api.post('/api/sal/sal4490_list', {
      paramYear: searchValue.year,
      paramProdCd: searchValue.prodCd,
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

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//
// *********************************
// rows 전체 합 구하는 부분
const calculateTotal = () => {
  rowData.rowsSum = [];

  let totalRow = {
    custNm: '합계',
    tOQty: 0,
    tOAmt: 0,
    tObQty: 0,
    tObAmt: 0,
    tOjQty: 0,
    tOxQty: 0,

    oM01Qty: 0,
    oM01Amt: 0,
    obM01Qty: 0,
    obM01Amt: 0,
    ojM01Qty: 0,
    oxM01Qty: 0,

    oM02Qty: 0,
    oM02Amt: 0,
    obM02Qty: 0,
    obM02Amt: 0,
    ojM02Qty: 0,
    oxM02Qty: 0,

    oM03Qty: 0,
    oM03Amt: 0,
    obM03Qty: 0,
    obM03Amt: 0,
    ojM03Qty: 0,
    oxM03Qty: 0,

    oM04Qty: 0,
    oM04Amt: 0,
    obM04Qty: 0,
    obM04Amt: 0,
    ojM04Qty: 0,
    oxM04Qty: 0,

    oM05Qty: 0,
    oM05Amt: 0,
    obM05Qty: 0,
    obM05Amt: 0,
    ojM05Qty: 0,
    oxM05Qty: 0,

    oM06Qty: 0,
    oM06Amt: 0,
    obM06Qty: 0,
    obM06Amt: 0,
    ojM06Qty: 0,
    oxM06Qty: 0,

    oM07Qty: 0,
    oM07Amt: 0,
    obM07Qty: 0,
    obM07Amt: 0,
    ojM07Qty: 0,
    oxM07Qty: 0,

    oM08Qty: 0,
    oM08Amt: 0,
    obM08Qty: 0,
    obM08Amt: 0,
    ojM08Qty: 0,
    oxM08Qty: 0,

    oM09Qty: 0,
    oM09Amt: 0,
    obM09Qty: 0,
    obM09Amt: 0,
    ojM09Qty: 0,
    oxM09Qty: 0,

    oM10Qty: 0,
    oM10Amt: 0,
    obM10Qty: 0,
    obM10Amt: 0,
    ojM10Qty: 0,
    oxM10Qty: 0,

    oM11Qty: 0,
    oM11Amt: 0,
    obM11Qty: 0,
    obM11Amt: 0,
    ojM11Qty: 0,
    oxM11Qty: 0,

    oM12Qty: 0,
    oM12Amt: 0,
    obM12Qty: 0,
    obM12Amt: 0,
    ojM12Qty: 0,
    oxM12Qty: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.tOQty += row.tOQty || 0;
    totalRow.tOAmt += row.tOAmt || 0;
    totalRow.tObQty += row.tObQty || 0;
    totalRow.tObAmt += row.tObAmt || 0;
    totalRow.tOjQty += row.tOjQty || 0;
    totalRow.tOxQty += row.tOxQty || 0;

    totalRow.oM01Qty += row.oM01Qty || 0;
    totalRow.oM01Amt += row.oM01Amt || 0;
    totalRow.obM01Qty += row.obM01Qty || 0;
    totalRow.obM01Amt += row.obM01Amt || 0;
    totalRow.ojM01Qty += row.ojM01Qty || 0;
    totalRow.oxM01Qty += row.oxM01Qty || 0;

    totalRow.oM02Qty += row.oM02Qty || 0;
    totalRow.oM02Amt += row.oM02Amt || 0;
    totalRow.obM02Qty += row.obM02Qty || 0;
    totalRow.obM02Amt += row.obM02Amt || 0;
    totalRow.ojM02Qty += row.ojM02Qty || 0;
    totalRow.oxM02Qty += row.oxM02Qty || 0;

    totalRow.oM03Qty += row.oM03Qty || 0;
    totalRow.oM03Amt += row.oM03Amt || 0;
    totalRow.obM03Qty += row.obM03Qty || 0;
    totalRow.obM03Amt += row.obM03Amt || 0;
    totalRow.ojM03Qty += row.ojM03Qty || 0;
    totalRow.oxM03Qty += row.oxM03Qty || 0;

    totalRow.oM04Qty += row.oM04Qty || 0;
    totalRow.oM04Amt += row.oM04Amt || 0;
    totalRow.obM04Qty += row.obM04Qty || 0;
    totalRow.obM04Amt += row.obM04Amt || 0;
    totalRow.ojM04Qty += row.ojM04Qty || 0;
    totalRow.oxM04Qty += row.oxM04Qty || 0;

    totalRow.oM05Qty += row.oM05Qty || 0;
    totalRow.oM05Amt += row.oM05Amt || 0;
    totalRow.obM05Qty += row.obM05Qty || 0;
    totalRow.obM05Amt += row.obM05Amt || 0;
    totalRow.ojM05Qty += row.ojM05Qty || 0;
    totalRow.oxM05Qty += row.oxM05Qty || 0;

    totalRow.oM06Qty += row.oM06Qty || 0;
    totalRow.oM06Amt += row.oM06Amt || 0;
    totalRow.obM06Qty += row.obM06Qty || 0;
    totalRow.obM06Amt += row.obM06Amt || 0;
    totalRow.ojM06Qty += row.ojM06Qty || 0;
    totalRow.oxM06Qty += row.oxM06Qty || 0;

    totalRow.oM07Qty += row.oM07Qty || 0;
    totalRow.oM07Amt += row.oM07Amt || 0;
    totalRow.obM07Qty += row.obM07Qty || 0;
    totalRow.obM07Amt += row.obM07Amt || 0;
    totalRow.ojM07Qty += row.ojM07Qty || 0;
    totalRow.oxM07Qty += row.oxM07Qty || 0;

    totalRow.oM08Qty += row.oM08Qty || 0;
    totalRow.oM08Amt += row.oM08Amt || 0;
    totalRow.obM08Qty += row.obM08Qty || 0;
    totalRow.obM08Amt += row.obM08Amt || 0;
    totalRow.ojM08Qty += row.ojM08Qty || 0;
    totalRow.oxM08Qty += row.oxM08Qty || 0;

    totalRow.oM09Qty += row.oM09Qty || 0;
    totalRow.oM09Amt += row.oM09Amt || 0;
    totalRow.obM09Qty += row.obM09Qty || 0;
    totalRow.obM09Amt += row.obM09Amt || 0;
    totalRow.ojM09Qty += row.ojM09Qty || 0;
    totalRow.oxM09Qty += row.oxM09Qty || 0;

    totalRow.oM10Qty += row.oM10Qty || 0;
    totalRow.oM10Amt += row.oM10Amt || 0;
    totalRow.obM10Qty += row.obM10Qty || 0;
    totalRow.obM10Amt += row.obM10Amt || 0;
    totalRow.ojM10Qty += row.ojM10Qty || 0;
    totalRow.oxM10Qty += row.oxM10Qty || 0;

    totalRow.oM11Qty += row.oM11Qty || 0;
    totalRow.oM11Amt += row.oM11Amt || 0;
    totalRow.obM11Qty += row.obM11Qty || 0;
    totalRow.obM11Amt += row.obM11Amt || 0;
    totalRow.ojM11Qty += row.ojM11Qty || 0;
    totalRow.oxM11Qty += row.oxM11Qty || 0;

    totalRow.oM12Qty += row.oM12Qty || 0;
    totalRow.oM12Amt += row.oM12Amt || 0;
    totalRow.obM12Qty += row.obM12Qty || 0;
    totalRow.obM12Amt += row.obM12Amt || 0;
    totalRow.ojM12Qty += row.ojM12Qty || 0;
    totalRow.oxM12Qty += row.oxM12Qty || 0;
  });

  const hasMeaningfulData =
    totalRow.tOQty !== 0 ||
    totalRow.tOAmt !== 0 ||
    totalRow.tObQty !== 0 ||
    totalRow.tObAmt !== 0 ||
    totalRow.tOjQty !== 0 ||
    totalRow.tOxQty !== 0 ||
    totalRow.oM01Qty !== 0 ||
    totalRow.oM01Amt !== 0 ||
    totalRow.obM01Qty !== 0 ||
    totalRow.obM01Amt !== 0 ||
    totalRow.ojM01Qty !== 0 ||
    totalRow.oxM01Qty !== 0 ||
    totalRow.oM02Qty !== 0 ||
    totalRow.oM02Amt !== 0 ||
    totalRow.obM02Qty !== 0 ||
    totalRow.obM02Amt !== 0 ||
    totalRow.ojM02Qty !== 0 ||
    totalRow.oxM02Qty !== 0 ||
    totalRow.oM03Qty !== 0 ||
    totalRow.oM03Amt !== 0 ||
    totalRow.obM03Qty !== 0 ||
    totalRow.obM03Amt !== 0 ||
    totalRow.ojM03Qty !== 0 ||
    totalRow.oxM03Qty !== 0 ||
    totalRow.oM04Qty !== 0 ||
    totalRow.oM04Amt !== 0 ||
    totalRow.obM04Qty !== 0 ||
    totalRow.obM04Amt !== 0 ||
    totalRow.ojM04Qty !== 0 ||
    totalRow.oxM04Qty !== 0 ||
    totalRow.oM05Qty !== 0 ||
    totalRow.oM05Amt !== 0 ||
    totalRow.obM05Qty !== 0 ||
    totalRow.obM05Amt !== 0 ||
    totalRow.ojM05Qty !== 0 ||
    totalRow.oxM05Qty !== 0 ||
    totalRow.oM06Qty !== 0 ||
    totalRow.oM06Amt !== 0 ||
    totalRow.obM06Qty !== 0 ||
    totalRow.obM06Amt !== 0 ||
    totalRow.ojM06Qty !== 0 ||
    totalRow.oxM06Qty !== 0 ||
    totalRow.oM07Qty !== 0 ||
    totalRow.oM07Amt !== 0 ||
    totalRow.obM07Qty !== 0 ||
    totalRow.obM07Amt !== 0 ||
    totalRow.ojM07Qty !== 0 ||
    totalRow.oxM07Qty !== 0 ||
    totalRow.oM08Qty !== 0 ||
    totalRow.oM08Amt !== 0 ||
    totalRow.obM08Qty !== 0 ||
    totalRow.obM08Amt !== 0 ||
    totalRow.ojM08Qty !== 0 ||
    totalRow.oxM08Qty !== 0 ||
    totalRow.oM09Qty !== 0 ||
    totalRow.oM09Amt !== 0 ||
    totalRow.obM09Qty !== 0 ||
    totalRow.obM09Amt !== 0 ||
    totalRow.ojM09Qty !== 0 ||
    totalRow.oxM09Qty !== 0 ||
    totalRow.oM10Qty !== 0 ||
    totalRow.oM10Amt !== 0 ||
    totalRow.obM10Qty !== 0 ||
    totalRow.obM10Amt !== 0 ||
    totalRow.ojM10Qty !== 0 ||
    totalRow.oxM10Qty !== 0 ||
    totalRow.oM11Qty !== 0 ||
    totalRow.oM11Amt !== 0 ||
    totalRow.obM11Qty !== 0 ||
    totalRow.obM11Amt !== 0 ||
    totalRow.ojM11Qty !== 0 ||
    totalRow.oxM11Qty !== 0 ||
    totalRow.oM12Qty !== 0 ||
    totalRow.oM12Amt !== 0 ||
    totalRow.obM12Qty !== 0 ||
    totalRow.obM12Amt !== 0 ||
    totalRow.ojM12Qty !== 0 ||
    totalRow.oxM12Qty !== 0;

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
const openHelpProdDialog = resNm => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: searchValue.prodNm,
      paramUseYn: 'N',
      paramCloseDay: '99991231',
    },
  })
    .onOk(res => {
      searchValue.prodNm = res.prodNm;
      searchValue.prodCd = res.prodCd;
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
</script>
<style></style>
