<template>
  <div>
    <div>프린트 테스트</div>
    <div id="content">
      <!-- Your content here -->
      <div id="print-section">
        <div class="header">
          <span class="text-h5 text-bold text-red"> This will be printed.</span>
        </div>
      </div>
      <div class="no-print">This will not be printed.</div>
    </div>
    <button @click="printOut">Print</button>
    <button @click="printOut1">Print</button>
  </div>
</template>

<script setup>
import print from 'print-js';
const printOut = () => {
  print({
    printable: 'print-section',
    type: 'html',
    css: 'src/css/quasar.css',
    scanStyles: false,
  });
};
const printOut1 = () => {
  const startDate = '2024-01-01';
  const endDate = '2024-02-29';

  const headerHTML = `
    <h3 class="custom-h3">My custom header</h3>
    <p class="custom-title">Start Date: ${startDate} ~ ${endDate}</p>
  `;

  print({
    printable: someJSONdata,
    properties: [
      { field: 'name', displayName: '이름' },
      { field: 'email', displayName: '이메일' },
      { field: 'phone', displayName: '전화번호' },
      { field: 'phone1', displayName: '번호1' },
      { field: 'phone2', displayName: '번호2' },
      { field: 'phone3', displayName: '번호3' },
      { field: 'phone4', displayName: '번호4' },
      { field: 'phone5', displayName: '번호5' },
    ],
    type: 'json',
    gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
    gridStyle: 'border: 2px solid #3971A5;',
    header: headerHTML,
    style: '.custom-h3 { color: red; text-align: center} .custom-title { text-align: right; color: blue}',
  });
};

const someJSONdata = [
  {
    name: 'John Doe',
    email: 'john@doe.com',
    phone: '111-111-1111',
    phone1: '111-111-1111',
    phone2: '111-111-1111',
    phone3: '111-111-1111',
    phone4: '111-111-1111',
    phone5: '111-111-1111',
  },
  {
    name: 'Barry Allen',
    email: 'barry@flash.com',
    phone: '222-222-2222',
    phone1: '111-111-1111',
    phone2: '111-111-1111',
    phone3: '111-111-1111',
    phone4: '111-111-1111',
    phone5: '111-111-1111',
  },
  {
    name: 'Cool Dude',
    email: 'cool@dude.com',
    phone: '333-333-3333',
    phone1: '111-111-1111',
    phone2: '111-111-1111',
    phone3: '111-111-1111',
    phone4: '111-111-1111',
    phone5: '111-111-1111',
  },
];
</script>

<style></style>
