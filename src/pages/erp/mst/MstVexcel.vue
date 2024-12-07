<template>
  <div>
    <div>엑셀 다운로드</div>
    <div id="content">
      <!-- Your content here -->
      <table id="table-sheet" style="border: 2px solid; border-collapse: collapse; text-align: center">
        <thead>
          <tr style="background-color: teal; padding: 10px 5px">
            <th style="border: 1px solid">구분</th>
            <th style="border: 1px solid">id</th>
            <th style="border: 1px solid">name</th>
            <th style="border: 1px solid">age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid" rowspan="3">abc</td>
            <td style="border: 1px solid">1</td>
            <td style="border: 1px solid">aa</td>
            <td style="border: 1px solid">24</td>
          </tr>
          <tr>
            <td style="border: 1px solid">2</td>
            <td style="border: 1px solid">bb</td>
            <td style="border: 1px solid">46</td>
          </tr>
          <tr>
            <td style="border: 1px solid">3</td>
            <td style="border: 1px solid">cc</td>
            <td style="border: 1px solid">84</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button @click="makeExcelFile5">Excel5</button>
  </div>
</template>
<style scoped></style>
<script setup>
import * as XLSX from 'xlsx';
import { ref } from 'vue';

const data1 = ref([
  {
    mode: 1,
    affinity: 0.5,
    lb: 1.34,
    ub: 2.53,
    pUrl: 'purl1',
    qUrl: 'qurl1',
  },
  {
    mode: 2,
    affinity: 1.5,
    lb: 13.34,
    ub: 2.453,
    pUrl: 'purl2',
    qUrl: 'qurl2',
  },
]);
const data2 = ref([
  {
    mode: 3,
    affinity: 0.5,
    lb: 1.34,
    ub: 2.53,
    pUrl: 'purl1',
    qUrl: 'qurl1',
  },
  {
    mode: 4,
    affinity: 1.5,
    lb: 13.34,
    ub: 2.453,
    pUrl: 'purl2',
    qUrl: 'qurl2',
  },
]);

const makeExcelFile5 = () => {
  const workBook = XLSX.utils.book_new();
  const workSheet1 = XLSX.utils.json_to_sheet(data1.value);
  const workSheet2 = XLSX.utils.json_to_sheet(data2.value);
  const workSheet3 = XLSX.utils.table_to_sheet(document.getElementById('table-sheet'));

  XLSX.utils.book_append_sheet(workBook, workSheet1, 'example11');
  XLSX.utils.book_append_sheet(workBook, workSheet2, 'example22');
  XLSX.utils.book_append_sheet(workBook, workSheet3, 'example33');
  XLSX.writeFile(workBook, 'example.xlsx');
};
</script>
