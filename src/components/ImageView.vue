<template>
  <div v-if="rowData.imageFileNm">
    <q-avatar size="35px" class="cursor-pointer">
      <q-img
        :src="`https://www.iszion.com/images/thumb/${rowData.imageFileNm}`"
        style="object-fit: cover; width: 100%; height: 100%"
        class="cursor-pointer"
        @click="imageDetailView()"
      />
    </q-avatar>
  </div>
  <div v-else>
    <q-icon name="face" color="teal" size="md" />
  </div>

  <!-- 이미지 원본보기 Dialog -->
  <q-dialog v-model="dialogOpen">
    <q-card bordered style="max-width: 450px; width: 100%">
      <q-img :src="`https://www.iszion.com/images/${rowData.imageFileNm}`" style="max-width: 100%; max-height: 100vh" />
      <q-card-section>
        <div class="row q-pa-none">
          <div class="col text-h6 ellipsis">{{ rowData.empNm }}</div>
          <div class="q-gutter-x-sm">
            <span class="text-subtitle1">{{ rowData.deptNm }}</span>
            <span class="text-subtitle2">{{ rowData.pstnNm }}</span>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="닫기" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QBtn } from 'quasar';
import { ref } from 'vue';

const props = defineProps({
  params: Object,
});

let { rowData } = props.params;
// console.log('component data: ', JSON.stringify(rowData));
// console.log('image data: ', rowData.imageFileNm);

const dialogOpen = ref(false);
const imageDetailView = () => {
  dialogOpen.value = true;
};
</script>
