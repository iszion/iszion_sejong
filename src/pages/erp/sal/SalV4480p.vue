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
                <span class="text-subtitle1 text-bold self-end">기준년월 : {{ props.messages.searchValue.year }}년</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th rowspan="3" colspan="1">No</th>
                    <th rowspan="3" colspan="1">도서명</th>
                    <th rowspan="3" colspan="1">코드</th>
                    <th rowspan="1" colspan="6">합계</th>
                    <th rowspan="1" colspan="6">1월</th>
                    <th rowspan="1" colspan="6">2월</th>
                    <th rowspan="1" colspan="6">3월</th>
                    <th rowspan="1" colspan="6">4월</th>
                    <th rowspan="1" colspan="6">5월</th>
                    <th rowspan="1" colspan="6">6월</th>
                    <th rowspan="1" colspan="6">7월</th>
                    <th rowspan="1" colspan="6">8월</th>
                    <th rowspan="1" colspan="6">9월</th>
                    <th rowspan="1" colspan="6">10월</th>
                    <th rowspan="1" colspan="6">11월</th>
                    <th rowspan="1" colspan="6">12월</th>
                  </tr>
                  <tr>
                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>

                    <th rowspan="1" colspan="2">출고</th>
                    <th rowspan="1" colspan="2">반품</th>
                    <th rowspan="2" colspan="1">재생</th>
                    <th rowspan="2" colspan="1">폐기</th>
                  </tr>
                  <tr>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>

                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                    <th rowspan="1" colspan="1">수량</th>
                    <th rowspan="1" colspan="1">금액</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(data, index) in props.messages.rowData.rows || []" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ data.prodNm }}</td>
                    <td>{{ data.prodCd }}</td>
                    <td>{{ commUtil.formatComma(data.tOQty) }}</td>
                    <td>{{ commUtil.formatComma(data.tOAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.tObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.tObAmt) }}</td>
                    <td>{{ commUtil.formatComma(data.tOjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.tOxQty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM01Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM01Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM01Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM01Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM01Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM01Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM02Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM02Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM02Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM02Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM02Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM02Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM03Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM03Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM03Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM03Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM03Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM03Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM04Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM04Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM04Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM04Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM04Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM04Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM05Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM05Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM05Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM05Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM05Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM05Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM06Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM06Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM06Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM06Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM06Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM06Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM07Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM07Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM07Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM07Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM07Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM07Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM08Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM08Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM08Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM08Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM08Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM08Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM09Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM09Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM09Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM09Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM09Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM09Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM10Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM10Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM10Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM10Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM10Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM10Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM11Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM11Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM11Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM11Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM11Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM11Qty) }}</td>

                    <td>{{ commUtil.formatComma(data.oM12Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oM12Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.obM12Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.obM12Amt) }}</td>
                    <td>{{ commUtil.formatComma(data.ojM12Qty) }}</td>
                    <td>{{ commUtil.formatComma(data.oxM12Qty) }}</td>
                  </tr>
                  <tr class="bg-grey3">
                    <td></td>
                    <td style="text-align: center">{{ props.messages.rowData.rowsSum[0].custNm }}</td>
                    <td></td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].tOQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].tOAmt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].tObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].tObAmt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].tOjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].tOxQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM01Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM01Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM01Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM01Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM01Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM01Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM02Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM02Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM02Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM02Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM02Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM02Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM03Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM03Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM03Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM03Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM03Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM03Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM04Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM04Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM04Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM04Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM04Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM04Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM05Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM05Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM05Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM05Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM05Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM05Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM06Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM06Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM06Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM06Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM06Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM06Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM07Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM07Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM07Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM07Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM07Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM07Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM08Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM08Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM08Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM08Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM08Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM08Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM09Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM09Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM09Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM09Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM09Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM09Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM10Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM10Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM10Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM10Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM10Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM10Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM11Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM11Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM11Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM11Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM11Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM11Qty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM12Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oM12Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM12Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].obM12Amt) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].ojM12Qty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].oxM12Qty) }}</td>
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
    css: ['/css/print/sal4480.css', '/css/quasar.css'],
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

    'tOQty',
    'tOAmt',
    'tObQty',
    'tObAmt',
    'tOjQty',
    'tOxQty',

    'ojM01Qty',
    'oxM01Qty',
    'obM01Qty',
    'obM01Amt',
    'oM01Qty',
    'oM01Amt',

    'ojM02Qty',
    'oxM02Qty',
    'obM02Qty',
    'obM02Amt',
    'oM02Qty',
    'oM02Amt',

    'ojM03Qty',
    'oxM03Qty',
    'obM03Qty',
    'obM03Amt',
    'oM03Qty',
    'oM03Amt',

    'ojM04Qty',
    'oxM04Qty',
    'obM04Qty',
    'obM04Amt',
    'oM04Qty',
    'oM04Amt',

    'ojM05Qty',
    'oxM05Qty',
    'obM05Qty',
    'obM05Amt',
    'oM05Qty',
    'oM05Amt',

    'ojM06Qty',
    'oxM06Qty',
    'obM06Qty',
    'obM06Amt',
    'oM06Qty',
    'oM06Amt',

    'ojM07Qty',
    'oxM07Qty',
    'obM07Qty',
    'obM07Amt',
    'oM07Qty',
    'oM07Amt',

    'ojM08Qty',
    'oxM08Qty',
    'obM08Qty',
    'obM08Amt',
    'oM08Qty',
    'oM08Amt',

    'ojM09Qty',
    'oxM09Qty',
    'obM09Qty',
    'obM09Amt',
    'oM09Qty',
    'oM09Amt',

    'ojM10Qty',
    'oxM10Qty',
    'obM10Qty',
    'obM10Amt',
    'oM10Qty',
    'oM10Amt',

    'ojM11Qty',
    'oxM11Qty',
    'obM11Qty',
    'obM11Amt',
    'oM11Qty',
    'oM11Amt',

    'ojM12Qty',
    'oxM12Qty',
    'obM12Qty',
    'obM12Amt',
    'oM12Qty',
    'oM12Amt',
  ],
  headRow1: [
    { name: '도서명', rowspan: 3, colspan: 1, key: 'prodNm' },
    { name: '코드', rowspan: 3, colspan: 1, key: 'prodCd' },
    { name: '합계', rowspan: 1, colspan: 6 },
    { name: '1월', rowspan: 1, colspan: 6 },
    { name: '2월', rowspan: 1, colspan: 6 },
    { name: '3월', rowspan: 1, colspan: 6 },
    { name: '4월', rowspan: 1, colspan: 6 },
    { name: '5월', rowspan: 1, colspan: 6 },
    { name: '6월', rowspan: 1, colspan: 6 },
    { name: '7월', rowspan: 1, colspan: 6 },
    { name: '8월', rowspan: 1, colspan: 6 },
    { name: '9월', rowspan: 1, colspan: 6 },
    { name: '10월', rowspan: 1, colspan: 6 },
    { name: '11월', rowspan: 1, colspan: 6 },
    { name: '12월', rowspan: 1, colspan: 6 },
  ],
  headRow2: [
    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'tOjQty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'tOxQty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM01Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM01Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM02Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM02Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM03Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM03Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM04Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM04Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM05Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM05Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM06Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM06Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM07Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM07Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM08Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM08Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM09Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM09Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM10Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM10Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM11Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM11Qty' },

    { name: '출고', rowspan: 1, colspan: 2 },
    { name: '반품', rowspan: 1, colspan: 2 },
    { name: '재생', rowspan: 2, colspan: 1, key: 'ojM12Qty' },
    { name: '폐기', rowspan: 2, colspan: 1, key: 'oxM12Qty' },
  ],
  headRow3: [
    { name: '수량', rowspan: 1, colspan: 1, key: 'tOQty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'tOAmt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'tObQty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'tObAmt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM01Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM01Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM01Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM01Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM02Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM02Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM02Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM02Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM03Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM03Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM03Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM03Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM04Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM04Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM04Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM04Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM05Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM05Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM05Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM05Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM06Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM06Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM06Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM06Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM07Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM07Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM07Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM07Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM08Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM08Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM08Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM08Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM09Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM09Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM09Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM09Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM10Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM10Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM10Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM10Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM11Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM11Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM11Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM11Amt' },

    { name: '수량', rowspan: 1, colspan: 1, key: 'oM12Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'oM12Amt' },
    { name: '수량', rowspan: 1, colspan: 1, key: 'obM12Qty' },
    { name: '금액', rowspan: 1, colspan: 1, key: 'obM12Amt' },
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
@import 'src/css/print/sal4480.css';
</style>
