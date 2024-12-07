<template>
  <div v-if="value">
    <q-select
      dense
      options-dense
      v-model="value.deptCd"
      :options="options"
      option-value="deptCd"
      option-label="deptNm"
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
import { useYearInfoStore } from 'src/store/setYearInfo';
const storeYear = useYearInfoStore();

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

// ***** 소속코드 자료 가져오기 부분  *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/dept_option_list', { paramSetYear: storeYear.setYear });
    options.value = response.data.data;
    // console.log('getData1: ', JSON.stringify(response.data.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
</script>
