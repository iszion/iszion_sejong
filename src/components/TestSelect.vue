<template>
  <div v-if="value">
    <q-select
      v-model="value"
      :options="options"
      option-value="id"
      option-label="name"
      emit-value
    />
  </div>
  <div v-else></div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const value = ref(props.params.value);
console.log('component data: ', value);

const options = [
  { id: '91010000', name: 'Option 1', otherProperty: 'Value 1' },
  { id: '91010010', name: 'Option 2', otherProperty: 'Value 2' },
  { id: '91010020', name: 'Option 3', otherProperty: 'Value 3' },
];
</script>
