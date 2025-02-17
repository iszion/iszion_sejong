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
                    <th rowspan="1" colspan="1">No</th>
                    <th rowspan="1" colspan="1">발행일</th>
                    <th rowspan="1" colspan="1">코드</th>
                    <th rowspan="1" colspan="1">도서명</th>
                    <th rowspan="1" colspan="1">에이젠시명</th>
                    <th rowspan="1" colspan="1">저자</th>
                    <th rowspan="1" colspan="1">선서자</th>
                    <th rowspan="1" colspan="1">저작권료</th>
                    <th rowspan="1" colspan="1">추가인세</th>
                    <th rowspan="1" colspan="1">번역비</th>
                    <th rowspan="1" colspan="1">외주비</th>
                    <th rowspan="1" colspan="1">제작부수</th>
                    <th rowspan="1" colspan="1">용지대</th>
                    <th rowspan="1" colspan="1">인쇄비</th>
                    <th rowspan="1" colspan="1">순출간비용</th>
                    <th rowspan="1" colspan="1">기타(간접비)</th>
                    <th rowspan="1" colspan="1">총제작비용</th>
                    <th rowspan="1" colspan="1">손익분기부수</th>
                    <th rowspan="1" colspan="1">순출고부수</th>
                    <th rowspan="1" colspan="1">매출액</th>
                    <th rowspan="1" colspan="1">순출간비용손익</th>
                    <th rowspan="1" colspan="1">순이익(판관비포함)</th>
                    <th rowspan="1" colspan="1">비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(data, index) in props.messages.rowData.rows || []"
                    :key="index"
                    :class="data.pubDay === '총계' ? 'bg-grey3' : data.prodNm === '합계' ? 'bg-grey2' : ''"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ data.pubDay === '총계' ? data.pubDay : data.prodNm === '합계' ? '' : commUtil.formatDate(data.pubDay) }}</td>
                    <td>{{ data.prodCd }}</td>
                    <td>{{ data.pubDay === '총계' ? '' : data.prodNm }}</td>
                    <td>{{ data.prodNm === '합계' ? '' : data.agentNm }}</td>
                    <td>{{ data.prodNm === '합계' ? '' : data.authorNm }}</td>
                    <td>{{ data.prodNm === '합계' ? '' : data.sunNm }}</td>
                    <td>{{ commUtil.formatComma(data.wAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.wsAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.transAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.expAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.prodQty) }}</td>
                    <td>{{ commUtil.formatComma(data.paperAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.printAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.itAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.otherAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.ittAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.limitQty) }}</td>
                    <td>{{ commUtil.formatComma(data.dealQty) }}</td>
                    <td>{{ commUtil.formatComma(data.dealAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.cos1Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.cos2Amt) }}</td>
                    <td>{{ data.remarks }}</td>
                  </tr>
                  <!--                  <tr class="bg-grey3">-->
                  <!--                    <td></td>-->
                  <!--                    <td></td>-->
                  <!--                    <td></td>-->
                  <!--                    <td style="text-align: center">{{ props.messages.rowData.rowsSum[0].prodNm }}</td>-->
                  <!--                    <td></td>-->
                  <!--                    <td></td>-->
                  <!--                    <td></td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].wAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].wsAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].transAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].expAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].prodQty) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].paperAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].printAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].itAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].otherAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ittAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].limitQty) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].dealQty) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].dealAmt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].cos1Amt) }}</td>-->
                  <!--                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].cos2Amt) }}</td>-->
                  <!--                    <td></td>-->
                  <!--                  </tr>-->
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
    css: ['/css/print/cos4010.css', '/css/quasar.css'],
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
    'pubDay',
    'prodCd',
    'prodNm',
    'agentNm',
    'authorNm',
    'sunNm',
    'wAmt',
    'wsAmt',
    'transAmt',
    'expAmt',
    'prodQty',
    'paperAmt',
    'printAmt',
    'itAmt',
    'otherAmt',
    'ittAmt',
    'limitQty',
    'dealQty',
    'dealAmt',
    'cos1Amt',
    'cos2Amt',

    'remarks',
  ],
  headRow1: [
    { name: '발행일', rowspan: 1, colspan: 1, key: 'pubDay' },
    { name: '코드', rowspan: 1, colspan: 1, key: 'prodCd' },
    { name: '도서명', rowspan: 1, colspan: 1, key: 'prodNm' },
    { name: '에이젠시명', rowspan: 1, colspan: 1, key: 'agentNm' },
    { name: '저자', rowspan: 1, colspan: 1, key: 'authorNm' },
    { name: '선서자', rowspan: 1, colspan: 1, key: 'sunNm' },
    { name: '저작권료', rowspan: 1, colspan: 1, key: 'wAmt' },
    { name: '추가인세', rowspan: 1, colspan: 1, key: 'wsAmt' },
    { name: '번역비', rowspan: 1, colspan: 1, key: 'transAmt' },
    { name: '외주비', rowspan: 1, colspan: 1, key: 'expAmt' },
    { name: '제작부수', rowspan: 1, colspan: 1, key: 'prodQty' },
    { name: '용지대', rowspan: 1, colspan: 1, key: 'paperAmt' },
    { name: '인쇄비', rowspan: 1, colspan: 1, key: 'printAmt' },
    { name: '순수출간비용', rowspan: 1, colspan: 1, key: 'itAmt' },
    { name: '기타(간접비)', rowspan: 1, colspan: 1, key: 'otherAmt' },
    { name: '총제작비용', rowspan: 1, colspan: 1, key: 'ittAmt' },
    { name: '손익분기부수', rowspan: 1, colspan: 1, key: 'limitQty' },
    { name: '순출고부수', rowspan: 1, colspan: 1, key: 'dealQty' },
    { name: '매출액', rowspan: 1, colspan: 1, key: 'dealAmt' },
    { name: '순출간비용손익', rowspan: 1, colspan: 1, key: 'cos1Amt' },
    { name: '순이익(판관립포함)', rowspan: 1, colspan: 1, key: 'cos2Amt' },
    { name: '비고', rowspan: 1, colspan: 1, key: 'remarks' },
  ],
  // headRow2: [
  //   { name: '판매수량', rowspan: 1, colspan: 1, key: 'oQty' },
  //   { name: '판매금액', rowspan: 1, colspan: 1, key: 'oAmt' },
  //   { name: '반품수량', rowspan: 1, colspan: 1, key: 'obQty' },
  //   { name: '반품금액', rowspan: 1, colspan: 1, key: 'obAmt' },
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
@import 'src/css/print/cos4010.css';
</style>
