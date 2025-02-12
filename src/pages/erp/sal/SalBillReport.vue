<template>
  <q-page>
    <q-card flat bordered>
      <q-bar>
        <q-icon name="print" />
        <span class="text-subtitle1 q-ml-sm">출력물관리화면</span>
        <q-space />
        <span class="text-bold text-subtitle1"> </span>
        <q-space />
        <q-btn dense flat icon="close" @click="closeDialog">
          <q-tooltip> 닫기 </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card>
        <q-card-actions align="right" :class="$q.dark.isActive ? 'bg-grey-8 text-teal' : 'bg-blue-grey-1 text-teal'">
          <q-btn outline :color="$q.dark.isActive ? 'teal-3' : 'primary'" class="q-px-sm" @click="isExcelDownload">
            <q-icon class="q-mr-xs" name="download" size="xs" /> 엑셀
          </q-btn>
          <q-btn outline :color="$q.dark.isActive ? 'teal-3' : 'primary'" class="q-px-sm" @click="isPrintReport">
            <q-icon class="q-mr-xs" name="print" size="xs" /> 출력
          </q-btn>
          <q-btn outline :color="$q.dark.isActive ? 'teal-3' : 'primary'" class="q-px-sm" @click="closeDialog">
            <q-icon class="q-mr-xs" name="close" size="xs" /> 닫기
          </q-btn>
        </q-card-actions>
        <q-card-section class="q-pt-none">
          <!-- 여기서 rowData.rows를 사용하여 테이블 또는 내용을 표시 -->
          <q-scroll-area style="height: 100vh">
            <div id="printZone">
              <div class="text-h4 text-center">
                거래명세서<q-badge class="bg-white text-black text-subtitle1" align="bottom">(공급받는자용)</q-badge>
              </div>
              <div class="row q-pt-xl">
                <div class="text-subtitle1 text-bold">출고일자 : {{ props.messages.rowData.form.dealDay }}</div>
                <q-space />
                <span class="text-subtitle1 text-bold self-end">전표번호 : {{ props.messages.rowData.form.seq }} </span>
              </div>

              <div class="q-gutter-y-md">
                <div class="row q-col-gutter-x-sm">
                  <div class="col-6">
                    <div class="tit">공급자</div>
                    <div class="row">
                      <div class="bd2 dt1">사업자<br />등록번호</div>
                      <div class="bd3">{{ commUtil.formatCompNo(props.messages.rowData.comp.compBusinNo) }}</div>
                    </div>
                    <div class="row">
                      <div class="bd4 dt1">상호<br />(법인명)</div>
                      <div class="bd5 dv1">{{ props.messages.rowData.comp.compBusinNm }}</div>
                      <div class="bd6 dt1">대표자</div>
                      <div class="bd7 dv1">{{ props.messages.rowData.comp.compOwner }}</div>
                    </div>
                    <div class="row">
                      <div class="bd8 dt1">사업장소재지</div>
                      <div class="bd9 dv1">{{ props.messages.rowData.comp.compAddr1 + ' ' + props.messages.rowData.comp.compAddr1x }}</div>
                    </div>
                    <div class="row">
                      <div class="bd10 dt1">업태</div>
                      <div class="bd11 dv1">{{ props.messages.rowData.comp.compCond }}</div>
                      <div class="bd12 dt1">종목</div>
                      <div class="bd13 dv1">{{ props.messages.rowData.comp.compKind }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="tit">공급받는자</div>
                    <div class="row">
                      <div class="bd2 dt1">사업자<br />등록번호</div>
                      <div class="bd3">{{ commUtil.formatCompNo(props.messages.rowData.form.custBusinNo) }}</div>
                    </div>
                    <div class="row">
                      <div class="bd4 dt1">상호<br />(법인명)</div>
                      <div class="bd5">{{ props.messages.rowData.form.custBusinNm }}</div>
                      <div class="bd6 dt1">대표자</div>
                      <div class="bd7">{{ props.messages.rowData.form.custOwner }}</div>
                    </div>
                    <div class="row">
                      <div class="bd8 dt1">사업장소재지</div>
                      <div class="bd9">{{ props.messages.rowData.form.custAddr1 + ' ' + props.messages.rowData.form.custAddr1x }}</div>
                    </div>
                    <div class="row">
                      <div class="bd10 dt1">업태</div>
                      <div class="bd11">{{ props.messages.rowData.form.custCond }}</div>
                      <div class="bd12 dt1">종목</div>
                      <div class="bd13">{{ props.messages.rowData.form.custKind }}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="row">
                    <div class="bdt1 dt1">No</div>
                    <div class="bdt2 dt1">구분</div>
                    <div class="bdt3 dt1">코드</div>
                    <div class="bdt4 dt1">도서명</div>
                    <div class="bdt5 dt1">부수</div>
                    <div class="bdt6 dt1">정가</div>
                    <div class="bdt7 dt1">%</div>
                    <div class="bdt8 dt1">금액</div>
                    <div class="bdt9 dt1">비고</div>
                  </div>
                  <div class="row" v-for="(data, index) in props.messages.rowData.details || []" :key="index">
                    <div class="bdv1">{{ index + 1 }}</div>
                    <div class="bdv2">{{ data.dealFgNm }}</div>
                    <div class="bdv3">{{ data.prodCd }}</div>
                    <div class="bdv4">{{ data.prodNm }}</div>
                    <div class="bdv5">{{ commUtil.formatComma(data.qty) }}</div>
                    <div class="bdv6">{{ commUtil.formatComma(data.price) }}</div>
                    <div class="bdv7">{{ data.yul }}</div>
                    <div class="bdv8">{{ commUtil.formatComma(data.amt) }}</div>
                    <div class="bdv9">{{ data.remarks }}</div>
                  </div>

                  <div class="row">
                    <div class="bdvt1 bdvt" style="width: 59%; text-align: center">합계</div>
                    <div class="bdvt5 bdvt">{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].qty) }}</div>
                    <div class="bdvt6 bdvt"></div>
                    <div class="bdvt7 bdvt"></div>
                    <div class="bdvt8 bdvt">{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].amt) }}</div>
                    <div class="bdvt9 bdvt"></div>
                  </div>
                  <div class="row">
                    <div class="bdvm" style="width: 100%">※</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <span class="text-subtitle2">주식회사 세종서적</span>
                <q-space />
                <span class="text-subtitle2">Printed {{ commUtil.getTodaytime() }}</span>
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue';
import printJS from 'print-js';
import * as XLSX from 'xlsx';
import { QBtn, QIcon, useQuasar } from 'quasar';
import commUtil from 'src/js_comm/comm-util';
const $q = useQuasar();

const emit = defineEmits(['close']);
const props = defineProps({
  messages: {
    rowData: Object,
  },
});

function closeDialog() {
  console.log('closeDialog called');
  emit('close');
}

const isPrintReport = () => {
  printJS({
    printable: 'printZone',
    type: 'html',
    css: ['/css/print/salBillReport.css', '/css/quasar.css'],
    scanStyles: false,
  });
};

/* ************************************************************************* *
 ** Excel저장  처리부분
 ** ************************************************************************* */
const isExcelDownload = () => {
  $q.dialog({
    dark: true,
    title: 'Excel 저장',
    html: true,
    message: '엑셀 파일로 저장 하시겠습니까?',
    // persistent: true,
    ok: {
      label: '저장',
      color: 'primary',
    },
    cancel: {
      label: '닫기',
      color: 'secondary',
    },
  })
    .onOk(() => {
      excelDownload();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
const headerGroup = reactive({
  header: [],
  headProps: ['dealDay', 'seq', 'cnt', 'custNm', 'custCd', 'dealFgNm', 'prodNm', 'prodCd', 'qty', 'price', 'amt', 'yul', 'custsCd', 'remarks'],
  headRow1: [
    { name: '출고일', rowspan: 1, colspan: 1, key: 'dealDay' },
    { name: '전표번호', rowspan: 1, colspan: 1, key: 'seq' },
    { name: 'seq', rowspan: 1, colspan: 1, key: 'cnt' },
    { name: '출고처', rowspan: 1, colspan: 1, key: 'custNm' },
    { name: '코드', rowspan: 1, colspan: 1, key: 'custCd' },
    { name: '구분', rowspan: 1, colspan: 1, key: 'dealFgNm' },
    { name: '도서명', rowspan: 1, colspan: 1, key: 'prodNm' },
    { name: '코드', rowspan: 1, colspan: 1, key: 'prodCd' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'qty' },
    { name: '단가', rowspan: 1, colspan: 1, key: 'price' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'amt' },
    { name: '비율', rowspan: 1, colspan: 1, key: 'yul' },
    { name: '지점명', rowspan: 1, colspan: 1, key: 'custsCd' },
    { name: '기타사항', rowspan: 1, colspan: 1, key: 'remarks' },
  ],
  // headRow2: [
  //   { name: '소속', rowspan: 1, colspan: 1, key: 'deptNm' },
  //   { name: '직급', rowspan: 1, colspan: 1, key: 'titlNm' },
  //   { name: '목표내용', rowspan: 1, colspan: 1, key: 'targetDoc' },
  //   { name: '성과내용', rowspan: 1, colspan: 1, key: 'workDoc' },
  //   { name: '평가점수', rowspan: 1, colspan: 1, key: 'selfPoint' },
  //   { name: '환산점수', rowspan: 1, colspan: 1, key: 'selfPointX' },
  //   { name: '평가점수', rowspan: 1, colspan: 1, key: 'markPoint' },
  //   { name: '환산점수', rowspan: 1, colspan: 1, key: 'markPointX' },
  // ],
});

const excelDownload = () => {
  headerGroup.header = [];
  headerGroup.header.push(headerGroup.headRow1);
  // headerGroup.header.push(headerGroup.headRow2);

  let options = {
    header: headerGroup.header,
    headProps: headerGroup.headProps,
  };
  excelExport(props.messages.rowData, options);
};

const visibleHeadProps = ref([]);
const instance = ref(undefined);
const excelExport = (data, options) => {
  let headProps = [];
  if (Array.isArray(options.headProps)) {
    headProps = options.headProps;
  } else if (options.headProps === 'header') {
    for (let h of headerGroup.header) {
      headProps.push(h.key);
    }
  } else {
    headProps = Object.keys(data[0]);
  }
  visibleHeadProps.value = headerGroup.headProps;

  instance.value = document.createElement('table');

  // Header 세팅
  let headerRows = [];
  if (!Array.isArray(headerGroup.header[0])) {
    headerRows.push(headerGroup.header);
  } else {
    headerRows = headerGroup.header;
  }
  let thead = document.createElement('thead');
  for (let row of headerRows) {
    let tr = document.createElement('tr');
    for (let h of row) {
      let rowspan = h.rowspan || '1';
      let colspan = h.colspan || '1';
      let th = document.createElement('th');
      th.setAttribute('rowspan', rowspan);
      th.setAttribute('colspan', colspan);
      th.innerText = h.name;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  }
  instance.value.appendChild(thead);

  // Body 세팅
  let tbody = document.createElement('tbody');
  for (let row of data) {
    let tr = document.createElement('tr');
    let isExcelWrite = true;
    for (let cellkey of visibleHeadProps.value) {
      // 조건에 맞는 자료는 제외하는 부분
      if (cellkey === 'cnt' && row[cellkey] === undefined) {
        isExcelWrite = false;
        break; // CNT가 undefined인 경우 해당 row를 건너뜀
      }
      // 조건에 맞는 자료는 제외하는 부분 끝

      let td = document.createElement('td');
      td.innerText = row[cellkey];
      tr.appendChild(td);
    }
    if (isExcelWrite) {
      tbody.appendChild(tr);
    }
  }
  instance.value.appendChild(tbody);

  // instance에 만들어진 table을 엑셀파일로 저장
  const config = { raw: true, type: 'string' };
  const ws = XLSX.utils.table_to_sheet(instance.value, config);

  // Set red color to A1 cell
  ws['A1'].s = {
    font: {
      color: { rgb: 'FF0000' }, // Red color
      bold: true,
    },
  };

  // Add borders to all cells
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        border: {
          // top: { style: 'thin', color: { auto: 1 } },
          // bottom: { style: 'thin', color: { auto: 1 } },
          // left: { style: 'thin', color: { auto: 1 } },
          // right: { style: 'thin', color: { auto: 1 } },
          top: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          bottom: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          left: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
          right: { style: 'thin', color: { rgb: '0000FF' } }, // Blue color
        },
      };
    }
  }

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, props.messages.titleNm);
  XLSX.writeFile(wb, props.messages.titleNm + '.xlsx');
};
</script>

<style scoped>
@import 'src/css/print/salBillReport.css';
</style>
