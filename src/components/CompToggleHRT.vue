<template>
  <div>
    <q-toggle size="sm" color="blue-14" true-value="Y" false-value="N" v-model="value.gnHrt" @update:model-value="handleUpdate"> </q-toggle>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
const value = ref(props.params.data);
console.log('props :', props.params.data.newYn);
const handleUpdate = () => {
  updateSelectedValue(value);
};
</script>
