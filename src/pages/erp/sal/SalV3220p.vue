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
                <span class="text-subtitle1 text-bold self-end">출고기간 : {{ props.messages.dealDayFrom }} ~ {{ props.messages.dealDayTo }}</span>
              </div>

              <table>
                <tr>
                  <th rowspan="1" colspan="1">No</th>
                  <th rowspan="1" colspan="1">입금일자</th>
                  <th rowspan="1" colspan="1">어음번호</th>
                  <th rowspan="1" colspan="1">유형</th>
                  <th rowspan="1" colspan="1">만기일</th>
                  <th rowspan="1" colspan="1">지급일</th>
                  <th rowspan="1" colspan="1">발행일</th>
                  <th rowspan="1" colspan="1">발행처</th>
                  <th rowspan="1" colspan="1">발행인</th>
                  <th rowspan="1" colspan="1">발행금액</th>
                  <th rowspan="1" colspan="1">할인율</th>
                  <th rowspan="1" colspan="1">항린금액</th>
                  <th rowspan="1" colspan="1">지급지점</th>
                  <th rowspan="1" colspan="1">지급처</th>
                  <th rowspan="1" colspan="1">기타사항</th>
                </tr>
                <tr v-for="(data, index) in props.messages.rowData.rows || []" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ commUtil.formatDate(data.accDay) }}</td>
                  <td>{{ data.billNo }}</td>
                  <td>{{ data.divCdNm }}</td>
                  <td>{{ commUtil.formatDate(data.endDay) }}</td>
                  <td>{{ commUtil.formatDate(data.payDay) }}</td>
                  <td>{{ commUtil.formatDate(data.pubDay) }}</td>
                  <td>{{ data.pubComp }}</td>
                  <td>{{ data.pubNm }}</td>
                  <td>{{ commUtil.formatComma(data.billAmt) }}</td>
                  <td>{{ data.yul }}</td>
                  <td>{{ commUtil.formatComma(data.yulAmt) }}</td>
                  <td>{{ data.payPoint }}</td>
                  <td>{{ data.payComp }}</td>
                  <td>{{ data.remarks }}</td>
                </tr>
                <tr class="bg-grey3">
                  <td></td>
                  <td></td>
                  <td>{{ props.messages.rowData.rowsSum[0].billNo }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].billAmt) }}</td>
                  <td></td>
                  <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].yulAmt) }}</td>
                  <td></td>
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
    buyDayFrom: String,
    buyDayTo: String,
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
    css: ['/css/print/sal3220.css', '/css/quasar.css'],
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
    'accDay',
    'billNo',
    'divCdNm',
    'endDay',
    'payDay',
    'pubDay',
    'pubComp',
    'pubNm',
    'billAmt',
    'yul',
    'yulAmt',
    'payPoint',
    'payComp',
    'remarks',
  ],
  headRow1: [
    { name: '입금일', rowspan: 1, colspan: 1, key: 'accDay' },
    { name: '어음번호', rowspan: 1, colspan: 1, key: 'billNo' },
    { name: '유형', rowspan: 1, colspan: 1, key: 'divCdNm' },
    { name: '만기일', rowspan: 1, colspan: 1, key: 'endDay' },
    { name: '지급일', rowspan: 1, colspan: 1, key: 'payDay' },
    { name: '발행일', rowspan: 1, colspan: 1, key: 'pubDay' },
    { name: '발행처', rowspan: 1, colspan: 1, key: 'pubComp' },
    { name: '발행인', rowspan: 1, colspan: 1, key: 'pubNm' },
    { name: '발행금액', rowspan: 1, colspan: 1, key: 'billAmt' },
    { name: '할인율', rowspan: 1, colspan: 1, key: 'yul' },
    { name: '할인금액', rowspan: 1, colspan: 1, key: 'yulAmt' },
    { name: '지급지점', rowspan: 1, colspan: 1, key: 'payPoint' },
    { name: '지급처', rowspan: 1, colspan: 1, key: 'payComp' },
    { name: '기타사항', rowspan: 1, colspan: 1, key: 'remarks' },
  ],
  // headRow2: [
  //   { name: '출고수량', rowspan: 1, colspan: 1, key: 'oQty' },
  //   { name: '출고금액', rowspan: 1, colspan: 1, key: 'oAmt' },
  //   { name: '증정수량', rowspan: 1, colspan: 1, key: 'ojQty' },
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
@import 'src/css/print/sal3220.css';
</style>
