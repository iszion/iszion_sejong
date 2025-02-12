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
            label="기준년"
            class="text-subtitle1"
            v-model="searchValue.year"
            type="number"
            style="width: 100px"
            @update:model-value="handleGetData"
          >
            <template v-slot:append>
              <span class="text-subtitle1 q-pt-md">년</span>
            </template>
          </q-input>

          <q-select
            stack-label
            options-dense
            label-color="orange"
            v-model="searchValue.month"
            :options="searchValue.monthOptions"
            option-value="valueCd"
            option-label="valueNm"
            option-disable="inactive"
            emit-value
            map-options
            style="min-width: 90px"
            label="기준월"
            @update:model-value="getData"
          />

          <q-input
            stack-label
            bottom-slots
            label-color="orange"
            v-model="searchValue.textValue"
            label="검색"
            class="q-pb-none"
            style="width: 200px"
            @keyup.enter="getData"
          >
            <template v-slot:before>
              <q-icon name="search" @click="getData" class="cursor-pointer q-pt-md" />
            </template>
            <template v-slot:append>
              <q-icon v-if="searchValue.textValue !== ''" name="close" @click="searchValue.textValue = ''" size="xs" class="cursor-pointer q-pt-md" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="row q-gutter-x-xs q-gutter-y-md">
          <q-btn outline color="grey" @click="getData" class="q-px-sm">
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
          <fee-v4010p :messages="{ rowData: rowData, titleNm: menuLabel, searchValue: searchValue }" @close="handleClose" />
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
import FeeV4010p from 'pages/erp/fee/FeeV4010p.vue';
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
  month: commUtil.getTodayMonth(),
  // year: '2024',
  // month: '12',
  monthOptions: [],
  textValue: '',
  // prodDivOptions: [],
  // prodDiv: '1011101',
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
    headerName: '도서정보',
    children: [
      {
        headerName: '도서명',
        field: 'prodNm',
        pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
        minWidth: 250,
        cellStyle: params => {
          return { textAlign: 'left' };
        },
      },
      {
        headerName: '코드',
        field: 'prodCd',
        pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
        minWidth: 90,
        maxWidth: 90,
        resizable: true,
      },
      {
        headerName: '작가',
        field: 'agentNm',
        pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
        minWidth: 120,
        maxWidth: 120,
        resizable: true,
      },
    ],
  },
  {
    headerName: '정가',
    field: 'sPrice',
    minWidth: 100,
    maxWidth: 100,
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
    headerName: '입출고정보',
    children: [
      {
        headerName: '입고수량',
        field: 'itQty',
        minWidth: 100,
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
        headerName: '출고정보',
        children: [
          {
            headerName: '누적수량',
            field: 'otQty',
            minWidth: 100,
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
            headerName: '홍보수량',
            field: 'pmQty',
            minWidth: 100,
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
            headerName: '정산수량',
            field: 'owQty',
            minWidth: 100,
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
            headerName: '이월미정산',
            field: 'owoQty',
            minWidth: 110,
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
            headerName: '판매부수',
            field: 'oQty',
            minWidth: 100,
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
            cellStyle: () => {
              return {
                color: $q.dark.isActive ? 'orange' : 'blue',
              };
            },
          },
        ],
      },
    ],
  },
  {
    headerName: '정산조건 1단계',
    children: [
      {
        headerName: '기준치(이상)',
        children: [
          {
            headerName: '기준량',
            field: 'bQ1',
            minWidth: 90,
            maxWidth: 90,
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
            cellStyle: () => {
              return {
                // color: $q.dark.isActive ? 'orange' : 'teal',
                textAlign: 'center',
              };
            },
          },
          {
            headerName: '%',
            field: 'bY1',
            minWidth: 70,
            maxWidth: 70,
            valueFormatter: params => {
              if (params.value != null) {
                return (
                  new Intl.NumberFormat('ko-KR', {
                    // style: 'currency',
                    // currency: 'KRW',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(params.value) + '%'
                );
              }
              return '';
            },
            cellClass: 'ag-right-aligned-cell',
            cellStyle: () => {
              return {
                //     color: $q.dark.isActive ? 'orange' : 'teal',
                textAlign: 'center',
              };
            },
          },
        ],
      },
      {
        headerName: '정산자료',
        children: [
          {
            headerName: '수량',
            field: 'oQ1',
            minWidth: 100,
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
            headerName: '정산액',
            field: 'oAmt1',
            minWidth: 130,
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
            cellStyle: () => {
              return {
                color: $q.dark.isActive ? 'orange' : 'blue',
              };
            },
          },
        ],
      },
    ],
  },
  {
    headerName: '정산조건 2단계',
    children: [
      {
        headerName: '기준치(이상)',
        children: [
          {
            headerName: '기준량',
            field: 'bQ2',
            minWidth: 90,
            maxWidth: 90,
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
            cellStyle: () => {
              return {
                // color: $q.dark.isActive ? 'orange' : 'teal',
                textAlign: 'center',
              };
            },
          },
          {
            headerName: '%',
            field: 'bY2',
            minWidth: 70,
            maxWidth: 70,
            valueFormatter: params => {
              if (params.value != null) {
                return (
                  new Intl.NumberFormat('ko-KR', {
                    // style: 'currency',
                    // currency: 'KRW',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(params.value) + '%'
                );
              }
              return '';
            },
            cellClass: 'ag-right-aligned-cell',
            cellStyle: () => {
              return {
                //     color: $q.dark.isActive ? 'orange' : 'teal',
                textAlign: 'center',
              };
            },
          },
        ],
      },
      {
        headerName: '정산자료',
        children: [
          {
            headerName: '수량',
            field: 'oQ2',
            minWidth: 100,
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
            headerName: '정산액',
            field: 'oAmt2',
            minWidth: 130,
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
            cellStyle: () => {
              return {
                color: $q.dark.isActive ? 'orange' : 'blue',
              };
            },
          },
        ],
      },
    ],
  },
  {
    headerName: '정산조건 3단계',
    children: [
      {
        headerName: '기준치(이상)',
        children: [
          {
            headerName: '기준량',
            field: 'bQ3',
            minWidth: 90,
            maxWidth: 90,
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
            cellStyle: () => {
              return {
                //     color: $q.dark.isActive ? 'orange' : 'teal',
                textAlign: 'center',
              };
            },
          },
          {
            headerName: '%',
            field: 'bY3',
            minWidth: 70,
            maxWidth: 70,
            valueFormatter: params => {
              if (params.value != null) {
                return (
                  new Intl.NumberFormat('ko-KR', {
                    // style: 'currency',
                    // currency: 'KRW',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(params.value) + '%'
                );
              }
              return '';
            },
            cellClass: 'ag-right-aligned-cell',
            cellStyle: () => {
              return {
                //     color: $q.dark.isActive ? 'orange' : 'teal',
                textAlign: 'center',
              };
            },
          },
        ],
      },
      {
        headerName: '정산자료',
        children: [
          {
            headerName: '수량',
            field: 'oQ3',
            minWidth: 100,
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
            headerName: '정산액',
            field: 'oAmt3',
            minWidth: 130,
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
            cellStyle: () => {
              return {
                color: $q.dark.isActive ? 'orange' : 'blue',
              };
            },
          },
        ],
      },
    ],
  },
  {
    headerName: '정산합계',
    children: [
      {
        headerName: '수량',
        field: 'ototQty',
        minWidth: 100,
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
        cellStyle: () => {
          return {
            color: $q.dark.isActive ? 'orange' : 'blue',
          };
        },
      },
      {
        headerName: '정산액',
        field: 'ototAmt',
        minWidth: 130,
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
        cellStyle: () => {
          return {
            color: $q.dark.isActive ? 'orange' : 'blue',
          };
        },
      },
    ],
  },
  {
    headerName: '중간정산액',
    field: 'dptAmt',
    minWidth: 130,
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
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'orange' : 'blue',
      };
    },
  },
  {
    headerName: '인세정산',
    children: [
      {
        headerName: '기지급금',
        field: 'stAmt',
        minWidth: 130,
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
        cellStyle: () => {
          return {
            color: $q.dark.isActive ? 'orange' : 'blue',
          };
        },
      },
      {
        headerName: '지급정산인세',
        field: 'sotAmt',
        minWidth: 130,
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
        cellStyle: () => {
          return {
            color: $q.dark.isActive ? 'orange' : 'blue',
          };
        },
      },
      {
        headerName: '기지급잔액',
        field: 'sjAmt',
        minWidth: 130,
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
        cellStyle: () => {
          return {
            color: $q.dark.isActive ? 'orange' : 'blue',
          };
        },
      },
    ],
  },
  {
    headerName: '지급액',
    field: 'jAmt',
    minWidth: 130,
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
    cellStyle: () => {
      return {
        color: $q.dark.isActive ? 'red' : 'red',
      };
    },
  },
]);

onBeforeUnmount(() => {
  // console.log('onBeforeUnmount....');
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  handleGetData();
});

const handleGetData = () => {
  getDataMonth().then(status => {
    if (status) {
      getData();
    } else {
      rowData.rows = [];
      rowData.rowsSum = [];
      myGrid.value.api.setGridOption('rowData', rowData.rows);
      myGrid.value.api.setGridOption('pinnedBottomRowData', [calculateTotal()]);
    }
  });
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

const getDataMonth = async () => {
  try {
    const response = await api.post('/api/fee/fee4010_month_list', {
      paramYear: searchValue.year,
    });
    if (response.data.data.length > 0) {
      searchValue.monthOptions = response.data.data;
      const lastItem = searchValue.monthOptions[searchValue.monthOptions.length - 1];
      searchValue.month = lastItem.valueCd;
      return true;
    } else {
      searchValue.monthOptions = [];
      searchValue.monthOptions.push({ valueCd: '', valueNm: '자료없음' });
      searchValue.month = '';
      return false;
    }

    // console.log('data : ', JSON.stringify(rowData.rowsSum));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getData = async () => {
  try {
    const response = await api.post('/api/fee/fee4010_list', {
      paramYear: searchValue.year,
      paramMonth: searchValue.month,
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
    prodNm: '합계',
    itQty: 0,
    otQty: 0,
    owQty: 0,
    owoQty: 0,
    pmQty: 0,
    oQty: 0,
    ototQty: 0,
    ototAmt: 0,
    dptAmt: 0,
    stAmt: 0,
    sotAmt: 0,
    sjAmt: 0,
    jAmt: 0,
  };

  rowData.rows.forEach(row => {
    totalRow.itQty += row.itQty || 0;
    totalRow.otQty += row.otQty || 0;
    totalRow.owQty += row.owQty || 0;
    totalRow.owoQty += row.owoQty || 0;
    totalRow.pmQty += row.pmQty || 0;
    totalRow.oQty += row.oQty || 0;
    totalRow.ototQty += row.ototQty || 0;
    totalRow.ototAmt += row.ototAmt || 0;
    totalRow.dptAmt += row.dptAmt || 0;
    totalRow.stAmt += row.stAmt || 0;
    totalRow.sotAmt += row.sotAmt || 0;
    totalRow.sjAmt += row.sjAmt || 0;
    totalRow.jAmt += row.jAmt || 0;
  });

  const hasMeaningfulData =
    totalRow.itQty !== 0 ||
    totalRow.otQty !== 0 ||
    totalRow.owQty !== 0 ||
    totalRow.owoQty !== 0 ||
    totalRow.pmQty !== 0 ||
    totalRow.oQty !== 0 ||
    totalRow.ototQty !== 0 ||
    totalRow.ototAmt !== 0 ||
    totalRow.dptAmt !== 0 ||
    totalRow.stAmt !== 0 ||
    totalRow.sotAmt !== 0 ||
    totalRow.sjAmt !== 0 ||
    totalRow.jAmt !== 0;

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
