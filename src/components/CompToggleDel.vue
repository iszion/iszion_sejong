<template>
  <div>
    <q-toggle
      v-if="params.data.delYn"
      size="sm"
      color="blue-14"
      true-value="Y"
      false-value="N"
      v-model="value.delYn"
      @update:model-value="handleUpdate"
    >
    </q-toggle>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
const value = ref(props.params.data);
const handleUpdate = () => {
  updateSelectedValue(value);
};
</script>
