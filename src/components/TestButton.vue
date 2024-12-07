<template>
  <div>
    <q-btn dense no-caps rounded outline color="secondary" @click="alertClick" style="min-width: 95px; max-width: 95px" class="text-body2">
      <q-icon name="search" size="14px" class="q-pt-xs" />
      {{ value.progId }}
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
// console.log("props: ", props.params);
const value = ref(props.params.data);

const alertClick = () => {
  // Update the selected value using the callback function from props
  updateSelectedValue(value);
};
</script>
