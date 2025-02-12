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
                    <th rowspan="1" colspan="7">합계</th>
                    <th rowspan="1" colspan="7">1월</th>
                    <th rowspan="1" colspan="7">2월</th>
                    <th rowspan="1" colspan="7">3월</th>
                    <th rowspan="1" colspan="7">4월</th>
                    <th rowspan="1" colspan="7">5월</th>
                    <th rowspan="1" colspan="7">6월</th>
                    <th rowspan="1" colspan="7">7월</th>
                    <th rowspan="1" colspan="7">8월</th>
                    <th rowspan="1" colspan="7">9월</th>
                    <th rowspan="1" colspan="7">10월</th>
                    <th rowspan="1" colspan="7">11월</th>
                    <th rowspan="1" colspan="7">12월</th>
                  </tr>
                  <tr>
                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>

                    <th rowspan="1" colspan="2">입고</th>
                    <th rowspan="1" colspan="4">출고</th>
                    <th rowspan="2" colspan="1">조정</th>
                  </tr>
                  <tr>
                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>

                    <th rowspan="1" colspan="1">입고</th>
                    <th rowspan="1" colspan="1">입고반품</th>
                    <th rowspan="1" colspan="1">출고</th>
                    <th rowspan="1" colspan="1">증정</th>
                    <th rowspan="1" colspan="1">반품</th>
                    <th rowspan="1" colspan="1">폐기</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(data, index) in props.messages.rowData.rows || []" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ data.prodNm }}</td>
                    <td>{{ data.prodCd }}</td>
                    <td>{{ commUtil.formatComma(data.totIQty) }}</td>
                    <td>{{ commUtil.formatComma(data.totIbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.totOQty) }}</td>
                    <td>{{ commUtil.formatComma(data.totOjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.totObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.totOxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.totOzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m01IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m01IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m01OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m01OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m01ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m01OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m01OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m02IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m02IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m02OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m02OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m02ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m02OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m02OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m03IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m03IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m03OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m03OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m03ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m03OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m03OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m04IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m04IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m04OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m04OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m04ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m04OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m04OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m05IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m05IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m05OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m05OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m05ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m05OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m05OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m06IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m06IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m06OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m06OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m06ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m06OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m06OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m07IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m07IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m07OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m07OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m07ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m07OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m07OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m08IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m08IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m08OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m08OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m08ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m08OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m08OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m09IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m09IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m09OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m09OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m09ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m09OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m09OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m10IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m10IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m10OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m10OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m10ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m10OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m10OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m11IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m11IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m11OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m11OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m11ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m11OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m11OzQty) }}</td>

                    <td>{{ commUtil.formatComma(data.m12IQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m12IbQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m12OQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m12OjQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m12ObQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m12OxQty) }}</td>
                    <td>{{ commUtil.formatComma(data.m12OzQty) }}</td>
                  </tr>
                  <tr class="bg-grey3">
                    <td></td>
                    <td style="text-align: center">{{ props.messages.rowData.rowsSum[0].custNm }}</td>
                    <td></td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totIQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totIbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totOQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totOjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totOxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].totOzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m01OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m02OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m03OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m04OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m05OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m06OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m07OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m08OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m09OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m10OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m11OzQty) }}</td>

                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12IQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12IbQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12OQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12OjQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12ObQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12OxQty) }}</td>
                    <td>{{ commUtil.formatComma(props.messages.rowData.rowsSum[0].m12OzQty) }}</td>
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
    css: ['/css/print/sal4460.css', '/css/quasar.css'],
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

    'totIQty',
    'totIbQty',
    'totOQty',
    'totOjQty',
    'totObQty',
    'totOxQty',
    'totOzQty',

    'm01IQty',
    'm01IbQty',
    'm01OQty',
    'm01OjQty',
    'm01ObQty',
    'm01OxQty',
    'm01OzQty',

    'm02IQty',
    'm02IbQty',
    'm02OQty',
    'm02OjQty',
    'm02ObQty',
    'm02OxQty',
    'm02OzQty',

    'm03IQty',
    'm03IbQty',
    'm03OQty',
    'm03OjQty',
    'm03ObQty',
    'm03OxQty',
    'm03OzQty',

    'm04IQty',
    'm04IbQty',
    'm04OQty',
    'm04OjQty',
    'm04ObQty',
    'm04OxQty',
    'm04OzQty',

    'm05IQty',
    'm05IbQty',
    'm05OQty',
    'm05OjQty',
    'm05ObQty',
    'm05OxQty',
    'm05OzQty',

    'm06IQty',
    'm06IbQty',
    'm06OQty',
    'm06OjQty',
    'm06ObQty',
    'm06OxQty',
    'm06OzQty',

    'm07IQty',
    'm07IbQty',
    'm07OQty',
    'm07OjQty',
    'm07ObQty',
    'm07OxQty',
    'm07OzQty',

    'm08IQty',
    'm08IbQty',
    'm08OQty',
    'm08OjQty',
    'm08ObQty',
    'm08OxQty',
    'm08OzQty',

    'm09IQty',
    'm09IbQty',
    'm09OQty',
    'm09OjQty',
    'm09ObQty',
    'm09OxQty',
    'm09OzQty',

    'm10IQty',
    'm10IbQty',
    'm10OQty',
    'm10OjQty',
    'm10ObQty',
    'm10OxQty',
    'm10OzQty',

    'm11IQty',
    'm11IbQty',
    'm11OQty',
    'm11OjQty',
    'm11ObQty',
    'm11OxQty',
    'm11OzQty',

    'm12IQty',
    'm12IbQty',
    'm12OQty',
    'm12OjQty',
    'm12ObQty',
    'm12OxQty',
    'm12OzQty',
  ],
  headRow1: [
    { name: '도서명', rowspan: 3, colspan: 1, key: 'prodNm' },
    { name: '코드', rowspan: 3, colspan: 1, key: 'prodCd' },
    { name: '합계', rowspan: 1, colspan: 7 },
    { name: '1월', rowspan: 1, colspan: 7 },
    { name: '2월', rowspan: 1, colspan: 7 },
    { name: '3월', rowspan: 1, colspan: 7 },
    { name: '4월', rowspan: 1, colspan: 7 },
    { name: '5월', rowspan: 1, colspan: 7 },
    { name: '6월', rowspan: 1, colspan: 7 },
    { name: '7월', rowspan: 1, colspan: 7 },
    { name: '8월', rowspan: 1, colspan: 7 },
    { name: '9월', rowspan: 1, colspan: 7 },
    { name: '10월', rowspan: 1, colspan: 7 },
    { name: '11월', rowspan: 1, colspan: 7 },
    { name: '12월', rowspan: 1, colspan: 7 },
  ],
  headRow2: [
    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'totOzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm01OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm02OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm03OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm04OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm05OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm06OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm07OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm08OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm09OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm10OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm11OzQty' },

    { name: '입고', rowspan: 1, colspan: 2 },
    { name: '출고', rowspan: 1, colspan: 4 },
    { name: '조정', rowspan: 2, colspan: 1, key: 'm12OzQty' },
  ],
  headRow3: [
    { name: '입고', rowspan: 1, colspan: 1, key: 'm01IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm01IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm01OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm01OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm01ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm01OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm01IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm01IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm01OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm01OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm01ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm01OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm02IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm02IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm02OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm02OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm02ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm02OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm03IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm03IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm03OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm03OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm03ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm03OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm04IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm04IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm04OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm04OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm04ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm04OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm05IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm05IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm05OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm05OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm05ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm05OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm06IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm06IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm06OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm06OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm06ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm06OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm07IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm07IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm07OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm07OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm07ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm07OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm08IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm08IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm08OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm08OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm08ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm08OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm09IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm09IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm09OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm09OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm09ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm09OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm10IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm10IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm10OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm10OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm10ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm10OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm11IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm11IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm11OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm11OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm11ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm11OxQty' },

    { name: '입고', rowspan: 1, colspan: 1, key: 'm12IQty' },
    { name: '입고반품', rowspan: 1, colspan: 1, key: 'm12IbQty' },
    { name: '출고', rowspan: 1, colspan: 1, key: 'm12OQty' },
    { name: '증정', rowspan: 1, colspan: 1, key: 'm12OjQty' },
    { name: '반품', rowspan: 1, colspan: 1, key: 'm12ObQty' },
    { name: '폐기', rowspan: 1, colspan: 1, key: 'm12OxQty' },
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
@import 'src/css/print/sal4460.css';
</style>
