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
          <q-scroll-area style="height: 89vh">
            <div id="printZone">
              <div class="row">
                <span class="text-h5">{{ props.messages.titleNm }}</span>
                <q-space />
                <span class="text-subtitle1 text-bold self-end"
                  >기준년월 : {{ props.messages.searchValue.year }}년 {{ props.messages.searchValue.month }}월</span
                >
              </div>

              <table>
                <thead>
                  <tr>
                    <th rowspan="3" colspan="1">No</th>
                    <th rowspan="1" colspan="3">도서정보</th>
                    <th rowspan="3" colspan="1">정가</th>
                    <th rowspan="1" colspan="6">입출고정보</th>
                    <th rowspan="1" colspan="4">정산조건 1단계</th>
                    <th rowspan="1" colspan="4">정산조건 2단계</th>
                    <th rowspan="1" colspan="4">정산조건 3단계</th>
                    <th rowspan="1" colspan="4">정산조건 4단계</th>
                    <th rowspan="1" colspan="4">정산조건 5단계</th>
                    <th rowspan="1" colspan="2">정산합계</th>
                    <th rowspan="3" colspan="1">중간정산액</th>
                    <th rowspan="1" colspan="3">인세정산</th>
                    <th rowspan="3" colspan="1">지급액</th>
                  </tr>
                  <tr>
                    <th rowspan="2" colspan="1">도서명</th>
                    <th rowspan="2" colspan="1">코드</th>
                    <th rowspan="2" colspan="1">작가</th>
                    <th rowspan="2" colspan="1">입고수량</th>
                    <th rowspan="1" colspan="5">출고정보</th>
                    <th rowspan="1" colspan="2">기준치(이상)</th>
                    <th rowspan="1" colspan="2">정산자료</th>
                    <th rowspan="1" colspan="2">기준치(이상)</th>
                    <th rowspan="1" colspan="2">정산자료</th>
                    <th rowspan="1" colspan="2">기준치(이상)</th>
                    <th rowspan="1" colspan="2">정산자료</th>
                    <th rowspan="1" colspan="2">기준치(이상)</th>
                    <th rowspan="1" colspan="2">정산자료</th>
                    <th rowspan="1" colspan="2">기준치(이상)</th>
                    <th rowspan="1" colspan="2">정산자료</th>
                    <th rowspan="2" colspan="1">수량</th>
                    <th rowspan="2" colspan="1">정산액</th>
                    <th rowspan="2" colspan="1">기지급금</th>
                    <th rowspan="2" colspan="1">지급정산인세</th>
                    <th rowspan="2" colspan="1">기지급잔액</th>
                  </tr>
                  <tr>
                    <th rowspan="1" colspan="1">누적수량</th>
                    <th rowspan="1" colspan="1">홍보수량</th>
                    <th rowspan="1" colspan="1">정산수량</th>
                    <th rowspan="1" colspan="1">이월미정산</th>
                    <th rowspan="1" colspan="1">판매부수</th>
                    <th rowspan="1" colspan="1">기준량</th>
                    <th rowspan="1" colspan="1">%</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">정산액</th>
                    <th rowspan="1" colspan="1">기준량</th>
                    <th rowspan="1" colspan="1">%</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">정산액</th>
                    <th rowspan="1" colspan="1">기준량</th>
                    <th rowspan="1" colspan="1">%</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">정산액</th>
                    <th rowspan="1" colspan="1">기준량</th>
                    <th rowspan="1" colspan="1">%</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">정산액</th>
                    <th rowspan="1" colspan="1">기준량</th>
                    <th rowspan="1" colspan="1">%</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">정산액</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(data, index) in props.messages.rowData.rows || []" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ data.prodNm }}</td>
                    <td>{{ data.prodCd }}</td>
                    <td>{{ data.agentNm }}</td>
                    <td>{{ commUtil.formatComma(data.sPrice) }}</td>

                    <td>{{ commUtil.formatComma(data.itQty) }}</td>

                    <td>{{ commUtil.formatComma(data.otQty) }}</td>
                    <td>{{ commUtil.formatComma(data.pmQty) }}</td>
                    <td>{{ commUtil.formatComma(data.owQty) }}</td>
                    <td>{{ commUtil.formatComma(data.owoQty) }}</td>
                    <td>{{ commUtil.formatComma(data.oQty) }}</td>

                    <td>{{ commUtil.formatComma(data.bQ1) }}</td>
                    <td>{{ commUtil.formatComma(data.bY1) }}</td>
                    <td>{{ commUtil.formatComma(data.oQ1) }}</td>
                    <td>{{ commUtil.formatComma(data.oAmt1) }}</td>

                    <td>{{ commUtil.formatComma(data.bQ2) }}</td>
                    <td>{{ commUtil.formatComma(data.bY2) }}</td>
                    <td>{{ commUtil.formatComma(data.oQ2) }}</td>
                    <td>{{ commUtil.formatComma(data.oAmt2) }}</td>

                    <td>{{ commUtil.formatComma(data.bQ3) }}</td>
                    <td>{{ commUtil.formatComma(data.bY3) }}</td>
                    <td>{{ commUtil.formatComma(data.oQ3) }}</td>
                    <td>{{ commUtil.formatComma(data.oAmt3) }}</td>

                    <td>{{ commUtil.formatComma(data.bQ4) }}</td>
                    <td>{{ commUtil.formatComma(data.bY4) }}</td>
                    <td>{{ commUtil.formatComma(data.oQ4) }}</td>
                    <td>{{ commUtil.formatComma(data.oAmt4) }}</td>

                    <td>{{ commUtil.formatComma(data.bQ5) }}</td>
                    <td>{{ commUtil.formatComma(data.bY5) }}</td>
                    <td>{{ commUtil.formatComma(data.oQ5) }}</td>
                    <td>{{ commUtil.formatComma(data.oAmt5) }}</td>

                    <td>{{ commUtil.formatComma(data.ototQty) }}</td>
                    <td>{{ commUtil.formatComma(data.ototAmt) }}</td>

                    <td>{{ commUtil.formatComma(data.dptAmt) }}</td>

                    <td>{{ commUtil.formatComma(data.stAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.sotAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.sjAmt) }}</td>

                    <td>{{ commUtil.formatComma(data.jAmt) }}</td>
                  </tr>
                  <tr class="bg-grey3">
                    <td></td>
                    <td style="text-align: center">{{ props.messages.rowData.rowsSum[0].prodNm }}</td>
                    <td></td>
                    <td></td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].sPrice) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].itQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].otQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].pmQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].owQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].owoQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bQ1) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bY1) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oQ1) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oAmt1) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bQ2) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bY2) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oQ2) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oAmt2) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bQ3) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bY3) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oQ3) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oAmt3) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bQ4) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bY4) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oQ4) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oAmt4) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bQ5) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].bY5) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oQ5) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oAmt5) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ototQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ototAmt) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].dptAmt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].stAmt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].sotAmt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].sjAmt) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].jAmt) }}</td>
                  </tr>
                </tbody>
              </table>
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
    titleNm: String,
    searchValue: Object,
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
    css: ['/css/print/fee4020.css', '/css/quasar.css'],
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
  headProps: [
    'prodNm',
    'prodCd',
    'agentNm',
    'sPrice',
    'itQty',
    'otQty',
    'pmQty',
    'owQty',
    'owoQty',
    'qQty',
    'bQ1',
    'bY1',
    'oQ1',
    'pAmt1',
    'bQ2',
    'bY2',
    'oQ2',
    'pAmt2',
    'bQ3',
    'bY3',
    'oQ3',
    'pAmt3',
    'bQ4',
    'bY4',
    'oQ4',
    'pAmt4',
    'bQ5',
    'bY5',
    'oQ5',
    'pAmt5',
    'otoQty',
    'otoAmt',
    'dptAmt',
    'stAmt',
    'sotAmt',
    'sjAmt',
    'jAmt',
  ],

  headRow1: [
    { rowspan: 1, colspan: 3, name: '도서정보' },
    { rowspan: 3, colspan: 1, name: '정가', key: 'sPrice' },
    { rowspan: 1, colspan: 6, name: '입출고정보' },
    { rowspan: 1, colspan: 4, name: '정산조건 1단계' },
    { rowspan: 1, colspan: 4, name: '정산조건 2단계' },
    { rowspan: 1, colspan: 4, name: '정산조건 3단계' },
    { rowspan: 1, colspan: 4, name: '정산조건 4단계' },
    { rowspan: 1, colspan: 4, name: '정산조건 5단계' },
    { rowspan: 1, colspan: 2, name: '정산합계' },
    { rowspan: 3, colspan: 1, name: '중간정산액', key: 'dptAmt' },
    { rowspan: 1, colspan: 3, name: '인세정산' },
    { rowspan: 3, colspan: 1, name: '지급액', key: 'jAmt' },
  ],
  headRow2: [
    { rowspan: 2, colspan: 1, name: '도서명', key: 'prodNm' },
    { rowspan: 2, colspan: 1, name: '코드', key: 'prodCd' },
    { rowspan: 2, colspan: 1, name: '작가명', key: 'agentNm' },
    { rowspan: 2, colspan: 1, name: '입고수량', key: 'itQty' },
    { rowspan: 1, colspan: 5, name: '출고정보' },
    { rowspan: 1, colspan: 2, name: '기준치(이상)' },
    { rowspan: 1, colspan: 2, name: '정산자료' },
    { rowspan: 1, colspan: 2, name: '기준치(이상)' },
    { rowspan: 1, colspan: 2, name: '정산자료' },
    { rowspan: 1, colspan: 2, name: '기준치(이상)' },
    { rowspan: 1, colspan: 2, name: '정산자료' },
    { rowspan: 1, colspan: 2, name: '기준치(이상)' },
    { rowspan: 1, colspan: 2, name: '정산자료' },
    { rowspan: 1, colspan: 2, name: '기준치(이상)' },
    { rowspan: 1, colspan: 2, name: '정산자료' },
    { rowspan: 2, colspan: 1, name: '수량', key: 'ototQty' },
    { rowspan: 2, colspan: 1, name: '정산액', key: 'ototAmt' },
    { rowspan: 2, colspan: 1, name: '기지급금', key: 'stAmt' },
    { rowspan: 2, colspan: 1, name: '지급정산인세', key: 'sotAmt' },
    { rowspan: 2, colspan: 1, name: '기지급잔액', key: 'sjAmt' },
  ],
  headRow3: [
    { rowspan: 1, colspan: 1, name: '누적수량', key: 'otQty' },
    { rowspan: 1, colspan: 1, name: '홍보수량', key: 'pmQty' },
    { rowspan: 1, colspan: 1, name: '정산수량', key: 'owQty' },
    { rowspan: 1, colspan: 1, name: '이월미정산', key: 'owoQty' },
    { rowspan: 1, colspan: 1, name: '판매부수', key: 'qQty' },

    { rowspan: 1, colspan: 1, name: '기준량', key: 'bQ1' },
    { rowspan: 1, colspan: 1, name: '%', key: 'bY1' },
    { rowspan: 1, colspan: 1, name: '수량', key: 'oQ1' },
    { rowspan: 1, colspan: 1, name: '정산액', key: 'oAmt1' },

    { rowspan: 1, colspan: 1, name: '기준량', key: 'bQ2' },
    { rowspan: 1, colspan: 1, name: '%', key: 'bY2' },
    { rowspan: 1, colspan: 1, name: '수량', key: 'oQ2' },
    { rowspan: 1, colspan: 1, name: '정산액', key: 'oAmt2' },

    { rowspan: 1, colspan: 1, name: '기준량', key: 'bQ3' },
    { rowspan: 1, colspan: 1, name: '%', key: 'bY3' },
    { rowspan: 1, colspan: 1, name: '수량', key: 'oQ3' },
    { rowspan: 1, colspan: 1, name: '정산액', key: 'oAmt3' },

    { rowspan: 1, colspan: 1, name: '기준량', key: 'bQ4' },
    { rowspan: 1, colspan: 1, name: '%', key: 'bY4' },
    { rowspan: 1, colspan: 1, name: '수량', key: 'oQ4' },
    { rowspan: 1, colspan: 1, name: '정산액', key: 'oAmt4' },

    { rowspan: 1, colspan: 1, name: '기준량', key: 'bQ5' },
    { rowspan: 1, colspan: 1, name: '%', key: 'bY5' },
    { rowspan: 1, colspan: 1, name: '수량', key: 'oQ5' },
    { rowspan: 1, colspan: 1, name: '정산액', key: 'oAmt5' },
  ],
});

const excelDownload = () => {
  headerGroup.header = [];
  headerGroup.header.push(headerGroup.headRow1);
  headerGroup.header.push(headerGroup.headRow2);
  headerGroup.header.push(headerGroup.headRow3);

  let options = {
    header: headerGroup.header,
    headProps: headerGroup.headProps,
  };
  excelExport(props.messages.rowData.rows, props.messages.rowData.rowsSum, options);
};

const visibleHeadProps = ref([]);
const instance = ref(undefined);

const excelExport = (data, dataSum, options) => {
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
  let headerRows = Array.isArray(headerGroup.header[0]) ? headerGroup.header : [headerGroup.header];
  let thead = document.createElement('thead');
  headerRows.forEach(row => {
    let tr = document.createElement('tr');
    row.forEach(h => {
      let th = document.createElement('th');
      th.setAttribute('rowspan', h.rowspan || '1');
      th.setAttribute('colspan', h.colspan || '1');
      th.innerText = h.name;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
  });
  instance.value.appendChild(thead);

  // Body 세팅 (rowData 처리)
  let tbody = document.createElement('tbody');
  processDataRows(data, tbody);

  // 합계 데이터 처리 (dataSum)
  processDataRows(dataSum, tbody);

  instance.value.appendChild(tbody);

  // 테이블을 엑셀로 변환 및 저장
  saveAsExcel(instance.value, props.messages.titleNm);
};

const processDataRows = (rows, tbody) => {
  rows.forEach(row => {
    let tr = document.createElement('tr');
    visibleHeadProps.value.forEach(key => {
      let td = document.createElement('td');
      td.innerText = row[key] || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
};

const saveAsExcel = (tableElement, title) => {
  const config = { raw: true, type: 'string' };
  const ws = XLSX.utils.table_to_sheet(tableElement, config);

  // 스타일 및 테두리 추가
  applyExcelStyles(ws);

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, `${title}.xlsx`);
};

const applyExcelStyles = worksheet => {
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        border: {
          top: { style: 'thin', color: { rgb: '0000FF' } },
          bottom: { style: 'thin', color: { rgb: '0000FF' } },
          left: { style: 'thin', color: { rgb: '0000FF' } },
          right: { style: 'thin', color: { rgb: '0000FF' } },
        },
      };
    }
  }
};
</script>

<style scoped>
@import 'src/css/print/fee4020.css';
</style>
