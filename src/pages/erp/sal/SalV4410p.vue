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
                  >기준일자 : {{ props.messages.searchValue.period.from }} ~ {{ props.messages.searchValue.period.to }}</span
                >
              </div>

              <table>
                <tr>
                  <th rowspan="3" colspan="1">No</th>
                  <th rowspan="3" colspan="1">도서명</th>
                  <th rowspan="3" colspan="1">코드</th>
                  <th rowspan="3" colspan="1">저자</th>
                  <th rowspan="3" colspan="1">쪽수</th>
                  <th rowspan="3" colspan="1">선인세</th>
                  <th rowspan="3" colspan="1">선서자</th>
                  <th rowspan="3" colspan="1">총제작누계</th>
                  <th rowspan="3" colspan="1">재고</th>
                  <th rowspan="3" colspan="1">정가</th>
                  <th rowspan="1" colspan="4">순출고부수 (배본 수정포함)</th>
                  <th rowspan="3" colspan="1">저작권사</th>
                  <th rowspan="3" colspan="1">에이젠트</th>
                </tr>
                <tr>
                  <th rowspan="1" colspan="1">기간누계</th>
                  <th rowspan="1" colspan="1">6개월누계</th>
                  <th rowspan="1" colspan="1">12개월누계</th>
                  <th rowspan="1" colspan="1">총순출고누계</th>
                </tr>
                <tr>
                  <th rowspan="1" colspan="1">{{ props.messages.searchValue.titleM1 }}</th>
                  <th rowspan="1" colspan="1">{{ props.messages.searchValue.titleM6 }}</th>
                  <th rowspan="1" colspan="1">{{ props.messages.searchValue.titleM12 }}</th>
                  <th rowspan="1" colspan="1">{{ props.messages.searchValue.titleTot }}</th>
                </tr>
                <tr v-for="(data, index) in props.messages.rowData.rows || []" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ data.prodNm }}</td>
                  <td>{{ data.prodCd }}</td>
                  <td>{{ data.authorNm }}</td>
                  <td>{{ data.p1Page }}</td>
                  <td>{{ commUtil.formatComma(data.sAmt) }}</td>
                  <td>{{ data.sunNm }}</td>
                  <td>{{ commUtil.formatComma(data.itotQty) }}</td>
                  <td>{{ commUtil.formatComma(data.stockQty) }}</td>
                  <td>{{ commUtil.formatComma(data.sPrice) }}</td>
                  <td>{{ commUtil.formatComma(data.m1Qty) }}</td>
                  <td>{{ commUtil.formatComma(data.m6Qty) }}</td>
                  <td>{{ commUtil.formatComma(data.m12Qty) }}</td>
                  <td>{{ commUtil.formatComma(data.totQty) }}</td>
                  <td>{{ data.copyrightNm }}</td>
                  <td>{{ data.agentNm }}</td>
                </tr>
                <tr class="bg-grey3">
                  <td></td>
                  <td style="text-align: center">{{ props.messages.rowData.rowsSum[0].prodNm }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].sAmt) }}</td>
                  <td></td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].itotQty) }}</td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].stockQty) }}</td>
                  <td></td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m1Qty) }}</td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m6Qty) }}</td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12Qty) }}</td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totQty) }}</td>
                  <td></td>
                  <td></td>
                </tr>
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
import { defineProps, defineEmits, reactive, ref } from 'vue';
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
    css: ['/css/print/sal4410.css', '/css/quasar.css'],
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
    'authorNm',
    'p1Page',
    'sAmt',
    'sunNm',
    'itotQty',
    'stockQty',
    'sPrice',
    'm1Qty',
    'm6Qty',
    'm12Qty',
    'totQty',
    'copyrightNm',
    'agentNm',
  ],
  headRow1: [
    { name: '도서명', rowspan: 3, colspan: 1, key: 'prodNm' },
    { name: '코드', rowspan: 3, colspan: 1, key: 'prodCd' },
    { name: '저자', rowspan: 3, colspan: 1, key: 'authorNm' },
    { name: '쪽수', rowspan: 3, colspan: 1, key: 'p1Page' },
    { name: '선인세', rowspan: 3, colspan: 1, key: 'sAmt' },
    { name: '선서자', rowspan: 3, colspan: 1, key: 'sunNm' },
    { name: '총제작누계', rowspan: 3, colspan: 1, key: 'itotQty' },
    { name: '재고', rowspan: 3, colspan: 1, key: 'stockQty' },
    { name: '정가', rowspan: 3, colspan: 1, key: 'sPrice' },
    { name: '순 출고부수 (배본수정 포함)', rowspan: 1, colspan: 4 },
    { name: '저작권사', rowspan: 3, colspan: 1, key: 'copyrightNm' },
    { name: '에이젠트', rowspan: 3, colspan: 1, key: 'agentNm' },
  ],
  headRow2: [
    { name: '기간누계', rowspan: 1, colspan: 1 },
    { name: '6개월누계', rowspan: 1, colspan: 1 },
    { name: '12개월누계', rowspan: 1, colspan: 1 },
    { name: '총순출고누계', rowspan: 1, colspan: 1 },
  ],
  headRow3: [
    { name: props.messages.searchValue.titleM1, rowspan: 1, colspan: 1, key: 'M1Qty' },
    { name: props.messages.searchValue.titleM6, rowspan: 1, colspan: 1, key: 'M6Qty' },
    { name: props.messages.searchValue.titleM12, rowspan: 1, colspan: 1, key: 'M12Qty' },
    { name: props.messages.searchValue.titleTot, rowspan: 1, colspan: 1, key: 'totQty' },
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
@import 'src/css/print/sal4410.css';
</style>
