<template>
  <div>
    <q-btn dense rounded outline color="secondary" @click="alertClick" class="text-bold text-subtitle2 q-px-md">
      <q-icon name="share" size="xs" class="q-pt-xs q-mr-sm" />
      {{ value.workNo }}
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
