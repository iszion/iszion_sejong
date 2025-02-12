<template>
  <q-page padding>
    <section class="row q-col-gutter-x-xl q-py-xs">
      <div class="col-12 col-sm-auto q-py-md flex flex-center">
        <q-avatar square size="150px"> <q-img :src="`https://www.iszion.com/images/${userImageName}?${new Date().getTime()}`" /></q-avatar>
      </div>
      <div class="col-12 col-sm-grow column justify-between">
        <div class="row items-center">
          <span class="text-h6 text-weight-bold">feelkbt</span>
          <q-space />
          <div class="q-gutter-x-sm">
            <q-btn outline color="secondary" label="이미지 수정" />
            <q-btn outline color="secondary" label="프로필 수정" />
            <q-btn outline color="secondary" label="패스워드 변경" />
          </div>
        </div>
        <div class="q-gutter-x-lg">
          <span>게시물 정보</span>
          <span>팔로워 2,000</span>
          <span>팔로우 3,000</span>
        </div>
        <div>
          <div>관리부</div>
          <div>부장</div>
          <div>feelkbt@gmail.com</div>
        </div>
      </div>
    </section>
    <q-separator spaced />
    <section>
      <div class="row no-wrap scroll q-col-gutter-x-lg">
        <div class="col-auto" v-for="n in 15" :key="n">
          <article>
            <q-avatar size="70px"> <q-img src="/iszion_logo.png" /></q-avatar>
            <div class="text-center q-mt-sm">제목</div>
          </article>
        </div>
      </div>
    </section>
    <q-separator spaced />
    <section class="q-mt-md">
      <q-tabs v-model="tab" inline-label switch-indicator indicator-color="primary" class="text-dark q-mb-xs">
        <q-route-tab :ripple="false" icon="edit" label="게시글" to="/main/profile" />
        <q-route-tab :ripple="false" icon="bookmark_border" label="저장됨!" to="/main/profile/saved" />
        <q-route-tab :ripple="false" icon="local_offer" label="게시됨" to="/main/profile/tagged" />
      </q-tabs>
      <router-view />
    </section>
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { api } from 'boot/axios';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const tab = ref('mails');

onBeforeMount(() => {
  getData();
});
// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 유저정보 처리 부분 *****************************//
const userImageName = ref(null);
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1010_select', { paramStdYear: storeYear.setYear, paramEmpCd: storeUser.userId });
    userImageName.value = response.data.data[0].imageFileNm;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 유저정보 처리 부분 끝 *****************************//
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #fafafa;
}
</style>
