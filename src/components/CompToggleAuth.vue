<template>
  <div>
    <q-toggle size="sm" color="blue-14" true-value="Y" false-value="N" v-model="value.targetYn" @update:model-value="handleUpdate"> </q-toggle>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { isEmpty } from 'lodash';
import { useQuasar } from 'quasar';
const $q = useQuasar();

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
const value = ref(props.params.data);

const handleUpdate = () => {
  // console.log('props: ', props.params.paramSourceUserId);
  // if (isEmpty(value.value.paramSourceUserId)) {
  //   value.value.targetYn = 'N';
  //   $q.dialog({
  //     dark: true,
  //     title: '안내',
  //     message: '주는쪽을 먼저 선택하세요',
  //   });
  // }
  updateSelectedValue(value);
};
</script>
