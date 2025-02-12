<template>
  <div>
    <q-input borderless stack-label readonly v-model="searchValue.period.from" style="width: 230px" class="text-subtitle1">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer q-pt-md" @click.stop="dateCnt = 0" />
      </template>

      <q-popup-proxy v-model="showDatePopup1" transition-show="scale" transition-hide="scale">
        <q-date
          minimal
          v-model="searchValue.period.from"
          mask="YYYY년 MM월"
          type="month"
          color="orange"
          default-view="Years"
          options-override="month"
          navigation-min-year-month="2023/01"
          @navigation="onNavigation('from', $event)"
        />
      </q-popup-proxy>
    </q-input>
  </div>
  <div>
    <q-input borderless stack-label readonly v-model="searchValue.period.to" style="width: 230px" class="text-subtitle1">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer q-pt-md" @click="dateCnt = 0" />
      </template>

      <q-popup-proxy v-model="showDatePopup2" transition-show="scale" transition-hide="scale">
        <q-date
          minimal
          v-model="searchValue.period.to"
          mask="YYYY년 MM월"
          type="month"
          color="orange"
          default-view="Years"
          options-override="month"
          :navigation-min-year-month="searchValue.period.from.substring(0, 4) + '/' + searchValue.period.from.substring(6, 8)"
          @navigation="onNavigation('to', $event)"
        />
      </q-popup-proxy>
    </q-input>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { date, QIcon } from 'quasar';
import commUtil from 'src/js_comm/comm-util';
const showDatePopup1 = ref(false);
const showDatePopup2 = ref(false);
const searchValue = reactive({
  period: {
    from: commUtil.getTodayYear() + '년 ' + commUtil.getTodayMonth() + '월',
    to: commUtil.getTodayYear() + '년 ' + commUtil.getTodayMonth() + '월',
  },
});

const dateCnt = ref(0);
const onNavigation = (fg, date) => {
  dateCnt.value = dateCnt.value + 1;
  console.log('dateCnt :', dateCnt);
  console.log('Navigated to:', fg, date.year, date.month);
  searchValue.period[fg] = date.year + '년 ' + commUtil.getDataWithZero(date.month, 2) + '월';
  if (dateCnt.value === 2) {
    showDatePopup1.value = false;
    showDatePopup2.value = false;
  }
};
</script>

<style scoped>
/* 스타일 커스터마이징 가능 */
</style>
