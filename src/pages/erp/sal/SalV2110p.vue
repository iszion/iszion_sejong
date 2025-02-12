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
              <div class="row">
                <span class="text-h5">{{ props.messages.titleNm }}</span>
                <q-space />
                <span class="text-subtitle1 text-bold self-end">출고기간 : {{ props.messages.dealDayFrom }} ~ {{ props.messages.dealDayTo }}</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th rowspan="1" colspan="1">No</th>
                    <th rowspan="1" colspan="1">출고일</th>
                    <th rowspan="1" colspan="1">출고처</th>
                    <th rowspan="1" colspan="1">전표번호</th>
                    <th rowspan="1" colspan="1">구분</th>
                    <th rowspan="1" colspan="1">도서명</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">단가</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">비율</th>
                    <th rowspan="1" colspan="1">지점명</th>
                    <th rowspan="1" colspan="1">기타사항</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(data, index) in props.messages.rowData || []" :key="index">
                    <td>{{ data.rowNum }}</td>
                    <td>{{ commUtil.formatDate(data.dealDay) }}</td>
                    <td>{{ data.custNm }}</td>
                    <td>{{ data.seq }} - {{ data.cnt }}</td>
                    <td>{{ data.dealFgNm }}</td>
                    <td>{{ data.prodNm }}</td>
                    <td>{{ commUtil.formatComma(data.qty) }}</td>
                    <td>{{ commUtil.formatComma(data.price) }}</td>
                    <td>{{ commUtil.formatComma(data.amt) }}</td>
                    <td>{{ data.buyYul }}</td>
                    <td>{{ data.custsCd }}</td>
                    <td>{{ data.remarks }}</td>
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
    rowData: Array,
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
    css: ['/css/print/sal2110.css', '/css/quasar.css'],
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
@import 'src/css/print/sal2110.css';
</style>
