<template>
  <div v-if="btnText">
    <q-btn size="sm" color="primary" @click="alertClick">{{ btnText }}</q-btn>
    <span>{{ value }}</span>
  </div>
  <div v-if="value">
    <q-btn size="sm" color="secondary" @click="alertClick">{{ value }}</q-btn>
  </div>
  <div v-else></div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const emit = defineEmits(['update']);
const value = ref(props.params.value);
const btnText = ref(props.params.btnText);

const alertClick = () => {
  // alert(value.value);
  emit('update', value.value);
};

// console.log('component button data: ', value.value);
</script>
