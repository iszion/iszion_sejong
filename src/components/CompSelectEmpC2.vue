<template>
  <div v-if="value">
    <q-select
      filled
      dense
      options-dense
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      v-model="value.empCdC2"
      :options="valOptions"
      @filter="handleFilter"
      option-value="empCd"
      option-label="empNm"
      emit-value
      map-options
      @update:model-value="handleUpdate"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> 자료가 없습니다. </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
  <div v-else></div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const value = ref(props.params.data);
const { updateSelectedValue, valueOptions } = props.params;
const valOptions = ref(valueOptions);

const normalizeText = text => {
  return text.normalize('NFC').toLowerCase();
};

const handleUpdate = () => {
  updateSelectedValue(value);
};

const handleFilter = (val, update, abort) => {
  const needle = normalizeText(val);
  update(() => {
    valOptions.value = valueOptions.filter(v => normalizeText(v.empNm).includes(needle));
  });
};
</script>
