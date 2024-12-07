<template>
  <q-page id="contentZone" class="q-pa-md">
    <q-card class="q-pa-md">
      <div class="text-center">
        <q-btn @click="getLocation" label="Get GPS Location" color="primary" />
      </div>
      <div v-if="location">
        <p><strong>Latitude:</strong> {{ location.latitude }}</p>
        <p><strong>Longitude:</strong> {{ location.longitude }}</p>
        <p><strong>Accuracy:</strong> {{ location.accuracy }} meters</p>
      </div>
      <div v-if="errorMessage" class="text-red">
        <p>{{ errorMessage }}</p>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const location = ref(null);
const errorMessage = ref(null);

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        errorMessage.value = null;
      },
      error => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage.value = '사용자가 지리적 위치 요청을 거부했습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage.value = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage.value = '사용자 위치를 가져오려는 요청이 시간 초과되었습니다.';
            break;
          case error.UNKNOWN_ERROR:
            errorMessage.value = '알 수 없는 오류가 발생했습니다.';
            break;
        }
      },
    );
  } else {
    errorMessage.value = '이 브라우저에서는 지리적 위치가 지원되지 않습니다.';
  }
};
</script>
<style lang="sass" scoped></style>
