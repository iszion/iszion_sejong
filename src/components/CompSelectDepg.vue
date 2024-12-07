<template>
  <div v-if="value">
    <q-select
      dense
      options-dense
      v-model="value.depgCd"
      :options="options"
      option-value="commCd"
      option-label="commNm"
      emit-value
      map-options
      @update:model-value="handleUpdate"
    />
  </div>
  <div v-else></div>
</template>

<script setup>
import { api } from '/src/boot/axios';
import { onBeforeMount, ref } from 'vue';

const props = defineProps(['params']);
const value = ref(props.params.data);
const { updateSelectedValue } = props.params;
const options = ref(null);

const handleUpdate = () => {
  updateSelectedValue(value);
};

onBeforeMount(() => {
  getData();
});

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 공통코드(보안레벨) 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: '101' });
    options.value = response.data.data;
    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용정보 선택된 자료 가져오기 부분  *****************************//
</script>
