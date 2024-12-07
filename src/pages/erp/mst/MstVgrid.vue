<template>
  <q-page id="contentZone" class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section class="q-pt-xs">
        <div class="row">
          <div class="col-6">
            <span class="text-h5 text-weight-bold">회사정보관리</span>
          </div>
          <div class="col-6 text-right">
            <q-btn v-if="showDeleteBtn" dense class="q-px-md" color="negative" label="삭제" icon="delete" />
          </div>
        </div>
      </q-card-section>
      <q-separator class="q-mb-md q-pb-xs" />
      <div :style="contentZoneStyle">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
          :columnDefs="columnDefs.columns"
          :rowData="rowData"
          :defaultColDef="defaultColDef"
          :pagination="false"
          :rowSelection="'multiple'"
          :suppressRowClickSelection="true"
          @cell-value-changed="onCellValueChanged"
          @selection-changed="onSelectionChanged"
          @grid-ready="onGridReady"
          :dataTypeDefinitions="dataTypeDefinitions"
        >
        </ag-grid-vue>

        <q-dialog v-model="editDialogVisible">
          <q-card class="q-pa-md" style="max-width: 1280px; width: 100%">
            <q-form class="">
              <q-card class="q-pa-md">
                <q-card-section>
                  <div class="row q-col-gutter-xl">
                    <div class="col-12 col-sm-6 col-lg-4">
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.custCd"
                        mask="XXXXX"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="관리코드"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.custNm"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="상호(가칭명)"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.businNm"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="상호(법인명)"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.businNo"
                        mask="###-##-#####"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="사업자등록번호"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.cojuNo"
                        mask="######-#######"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="법인등록번호"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.repNm"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="대표자"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.businCond"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="업태"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.businKind"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="종목"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.addr1"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="사업장주소"
                        placeholder="검색할 주소를 입력하세요"
                      >
                        <template v-slot:append>
                          <q-icon
                            size="0.8em"
                            v-if="editData.addr1 !== ''"
                            name="close"
                            @click="editData.addr1 = ''"
                            class="cursor-pointer q-pt-md"
                          />
                          <q-icon size="0.8em" name="search" @click="openPostcodeSearch" class="cursor-pointer q-pt-md" />
                        </template>
                      </q-input>
                      <div class="row q-col-gutter-xs">
                        <div class="col-9">
                          <q-input
                            class="q-pb-md-md"
                            id="addr2Input"
                            v-model="editData.addr2"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="상세주소"
                          />
                        </div>
                        <div class="col-3">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.zip"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="우편번호"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-12 col-sm-6 col-lg-4">
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.tel"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="대표전화"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.fax"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="팩스번호"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.email"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="이메일"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.billEmail"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="이메일(계산서용)"
                      />
                      <div class="row q-col-gutter-sm">
                        <div class="col-9">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.salesCd"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="영업담당명"
                            placeholder="검색할 담당자를 입력하세요"
                          >
                            <template v-slot:append>
                              <q-icon
                                size="0.8em"
                                v-if="editData.salesCd !== ''"
                                name="close"
                                @click="editData.salesCd = ''"
                                class="cursor-pointer q-pt-md"
                              />
                              <q-icon size="0.8em" name="search" class="cursor-pointer q-pt-md" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-3">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.salesCd"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="영업담당코드"
                          />
                        </div>
                      </div>
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.mobile"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="휴대번호"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.managerNm"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="담당자명"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.managerDeptNm"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="담당부서"
                      />
                      <div class="row q-col-gutter-sm">
                        <div class="col-9">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.bankCd"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="은행명"
                            placeholder="검색할 은행명을 입력하세요"
                          >
                            <template v-slot:append>
                              <q-icon
                                size="0.8em"
                                v-if="editData.bankCd !== ''"
                                name="close"
                                @click="editData.bankCd = ''"
                                class="cursor-pointer q-pt-md"
                              />
                              <q-icon size="0.8em" name="search" class="cursor-pointer q-pt-md" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-3">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.bankCd"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="은행코드"
                          />
                        </div>
                      </div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.bankAccNo"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="거래계좌번호"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                            class="q-pb-md-md"
                            v-model="editData.bankAccNm"
                            :color="$q.dark.isActive ? 'orange' : 'teal'"
                            :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                            stack-label
                            label="예금주"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-4">
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.openDay"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="거래시작일"
                      />
                      <q-input
                        class="q-pb-md-md"
                        v-model="editData.closeDay"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="거래종료일"
                      />
                      <q-input
                        filled
                        type="textarea"
                        class="q-pb-md-md"
                        v-model="editData.explains"
                        :color="$q.dark.isActive ? 'orange' : 'teal'"
                        :label-color="$q.dark.isActive ? 'orange' : 'teal'"
                        stack-label
                        label="기타사항"
                      />
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn color="primary" icon="save" label=" 저장 " @click="saveEditedRow" />
                  <q-btn color="secondary" icon="close" label=" 닫기 " @click="cancelEditDialog" />
                </q-card-actions>
              </q-card>
            </q-form>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </q-page>

  <q-dialog v-model="postViewVisible">
    <help-post :searchPost="searchPost" @setPostData="setPostData" />
  </q-dialog>
</template>

<script setup>
import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import HelpPost from 'pages/help/HelpPost.vue';

const postViewVisible = ref(false);

const editData = ref(null);
const showDeleteBtn = ref(false);

const searchPost = ref('');
const setPostData = val => {
  console.log('setPostData: ', val);
  editData.value = val;
};

const editDialogVisible = ref(false);
const saveEditedRow = () => {
  // Implement your logic to save the edited data
  console.log('Saving edited row:', JSON.stringify(editData.value));

  // Close the dialog after saving
  editDialogVisible.value = false;
  rowData.value = [...rowData.value];
};
const cancelEditDialog = () => {
  // Close the dialog without saving
  console.log('Saving edited row:', JSON.stringify([...rowData.value]));
  editDialogVisible.value = false;
};
// Screen resize
const windowHeight = ref(window.innerHeight);
const contentZoneHeight = ref(500);
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));
const handleResize = () => {
  windowHeight.value = window.innerHeight;
  contentZoneHeight.value = windowHeight.value - 240;
  console.log('windowHeight.value : ', windowHeight.value, contentZoneHeight.value);
};
onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
// End of Screen resize

// 콤보박스 Data 처리부분
window.currencyFormatter = function currencyFormatter(params) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return '';
  }
  return '£' + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

window.numberValueSetter = function numberValueSetter(params) {
  const valueAsNumber = parseFloat(params.newValue);
  if (isNaN(valueAsNumber) || !isFinite(params.newValue)) {
    return false; // don't set invalid numbers!
  }
  params.data.price = valueAsNumber;
  return true;
};

// End of 콤보박스 Data 처리부분

onBeforeMount(() => {
  rowData.value = getData();
});

// Grid Event Section
const onCellValueChanged = event => {
  console.log(`New Cell Value: ${event.value}`);
  console.log('New row data: ', rowData.value);
};

const selectedRows = ref([]);
const onSelectionChanged = event => {
  selectedRows.value = event.api.getSelectedRows();
  showDeleteBtn.value = selectedRows.value.length > 0;
  console.log('Selected Rows:', JSON.stringify(selectedRows.value));
  console.log('row selection event : ', JSON.stringify(rowData.value));
};
// End of Grid Event Section

// Grid 컴럼 설정

const defaultColDef = ref({
  flex: 1,
  minWidth: 180,
  filter: true,
  floatingFilter: true,
});
//editable: true,

const SimpleComp = {
  setup(props) {
    const handleClick = () => {
      // console.log('props: ', props);
      editData.value = props.params.data;
      // const rowData = context.data;
      console.log('Button clicked! : ', editData.value);
      console.log('Button clicked! : ', editData.value.repNm);
      console.log('Button clicked! : ', editData.value.businCond);
      console.log('Button clicked! : ', editData.value.businKind);
      // alert(JSON.stringify(rowData));
      editDialogVisible.value = true;
    };
    console.log('params.data.custCd: ', props.params.data.custCd);
    return props =>
      h(
        'q-btn',
        {
          class: 'q-pa-xs q-px-md bg-secondary text-white',
          onClick: handleClick,
        },
        props.params.data.custCd,
      );
  },
};
const columnDefs = reactive({
  columns: [
    {
      headerName: '',
      field: '',
      maxWidth: 50,
      minWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      filter: false,
      sortable: false,
      pinned: 'left',
    },
    {
      headerName: '관리코드',
      field: 'custCd',
      cellRenderer: SimpleComp,
      maxWidth: 110,
      minWidth: 110,
      editable: false,
      filter: false,
      sortable: false,
      resizable: false,
      pinned: 'left',
    },

    {
      headerName: '상호(가칭명)',
      field: 'custNm',
      pinned: 'left',
    },
    {
      headerName: '상호(법인명)',
      field: 'businNm',
    },
    {
      headerName: '사업자등록번호',
      field: 'businNo',
    },
    {
      headerName: '법인등록번호',
      field: 'cojuNo',
    },
    {
      headerName: '대표자',
      field: 'repNm',
    },
    {
      headerName: '업태',
      field: 'businCond',
    },
    {
      headerName: '종목',
      field: 'businKind',
    },
    {
      headerName: '사업장주소',
      field: 'addr1',
    },
    {
      headerName: '상세주소',
      field: 'addr2',
    },
    {
      headerName: '우편번호',
      field: 'zip',
    },
    {
      headerName: '대표전화',
      field: 'tel',
    },
    {
      headerName: 'Fax',
      field: 'fax',
    },
    {
      headerName: 'email',
      field: 'email',
    },
    {
      headerName: '계산서용Email',
      field: 'billEmail',
    },
    {
      headerName: '영업담당코드',
      field: 'salesCd',
    },
    {
      headerName: '휴대번호',
      field: 'mobile',
    },
    {
      headerName: '담당자명',
      field: 'managerNm',
    },
    {
      headerName: '담당부서',
      field: 'managerDeptNm',
    },
    {
      headerName: '은행코드',
      field: 'bankCd',
    },
    {
      headerName: '거래계좌번호',
      field: 'bankAccNo',
    },
    {
      headerName: '예금주',
      field: 'bankAccNm',
    },
    {
      headerName: '거래시작일자',
      field: 'openDay',
    },
    {
      headerName: '거래종료일자',
      field: 'closeDay',
    },
    {
      headerName: '기타사항',
      field: 'explains',
    },
  ],
});
// End of Grid 컴럼 설정

const gridApi = ref();

const dataTypeDefinitions = ref(null);
const rowData = ref(null);

const onGridReady = params => {
  gridApi.value = params.api;
};

function getData() {
  return msv1020_rowData;
}

//========================
const postcode = ref('');
const selectedAddress = ref('');

const openPostcodeSearch = () => {
  new window.daum.Postcode({
    oncomplete: data => {
      editData.value.zip = data.zonecode;
      editData.value.addr1 = `${data.address} ${data.buildingName || ''}`;
    },
  }).open();
};
</script>
<style lang="sass" scoped>
.ag-theme-alpine,
.ag-theme-alpine-dark
  /* bright green, 10% opacity */
  --ag-selected-row-background-color: rgb(0, 255, 0, 0.1)
</style>
