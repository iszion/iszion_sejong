<template>
  <div>
    <q-checkbox v-model="value" @click="handleUpdate">{{ params.displayName }}</q-checkbox>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
// console.log('props1: ', JSON.stringify(props.params.headerCheckYn));
const { updateSelectedValue } = props.params;
const value = ref(props.params.headerCheckYn);
const handleUpdate = () => {
  updateSelectedValue(value);
};
</script>
