<template>
  <div>
    <q-input v-model="dateRange" label="Select Date Range" readonly outlined @click="showDateRangeDialog = true" />

    <q-dialog v-model="showDateRangeDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Select Date Range</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-date
            v-model="dateRangeModel"
            minimal
            range
            emit-immediately
            :default-year-month="defaultYearMonth"
            @update:model-value="updateDateRange"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="cancelDateRange" />
          <q-btn flat label="OK" color="primary" @click="confirmDateRange" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { date } from 'quasar'; // Quasar 날짜 유틸리티

// 기본 날짜 설정
const defaultFrom = '2024-12-01';
const defaultTo = '2024-12-01';

const showDateRangeDialog = ref(false);
const format = 'YYYY-MM-DD';

// 기본 날짜 모델 값 초기화
const dateRangeModel = ref({
  from: defaultFrom,
  to: defaultTo,
});

// 기본 날짜 범위를 읽기 전용 입력에 초기화
const dateRange = ref(`${defaultFrom} ~ ${defaultTo}`);

// 기본 년/월 설정
const defaultYearMonth = '2024/12';

function updateDateRange(value) {
  const { from, to } = value;

  if (from && to) {
    // 날짜를 원하는 형식으로 포맷
    const formattedFrom = date.formatDate(from, format);
    const formattedTo = date.formatDate(to, format);
    dateRange.value = `${formattedFrom} ~ ${formattedTo}`;
  }
}

function cancelDateRange() {
  // 날짜 선택 취소 시 기본 값으로 초기화
  dateRangeModel.value = { from: defaultFrom, to: defaultTo };
  dateRange.value = `${defaultFrom} ~ ${defaultTo}`;
  showDateRangeDialog.value = false;
}

function confirmDateRange() {
  showDateRangeDialog.value = false;
}
</script>

<style scoped>
/* 스타일 커스터마이징 가능 */
</style>
