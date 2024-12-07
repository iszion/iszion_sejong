<template>
  <div>
    <q-btn dense no-caps rounded outline color="secondary" @click="alertClick" class="text-left text-body2 q-px-sm">
      <q-icon name="search" size="15px" class="q-pt-xs q-mr-sm" />
      {{ value.userId }}
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
const value = ref(props.params.data);

const alertClick = () => {
  updateSelectedValue(value);
};
</script>
