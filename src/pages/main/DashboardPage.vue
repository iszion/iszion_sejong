<template>
  <q-page class="q-gutter-y-md">
    <div class="col-12">
      <!-- 메인 데시보드 -->
      <!--      <aux-page />-->
    </div>
    <div class="row q-col-gutter-sm-x-md q-pa-sm">
      <div class="col-12 col-md-6">
        <!-- 나의일정 -->
        <event-view />
      </div>
      <div class="col-12 col-md-6">
        <!-- 게시글 -->
        <board-list :message="boardParams.dataComp" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue';
import AuxPage from 'pages/main/AuxPage.vue';
import BoardList from 'pages/main/BoardList.vue';
import EventView from 'pages/main/EventView.vue';

import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const boardParams = reactive({
  dataComp: { deptCd: '0000000', deptNm: '전체' },
  dataTeam: { deptCd: '7011002', deptNm: '관리부' },
});
</script>

<style lang="sass" scoped></style>
