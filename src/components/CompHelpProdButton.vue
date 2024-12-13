<template>
  <div>
    <q-btn dense no-caps color="secondary" @click="buttonClick" class="text-body2" style="width: 70px">
      <q-icon name="search" size="xs" class="q-pt-xs" />
      {{ value.prodCd }}
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HelpProd from 'components/subvue/HelpProd.vue';
import commUtil from 'src/js_comm/comm-util';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
// console.log("props: ", props.params);
const value = ref(props.params.data);

const buttonClick = () => {
  // Update the selected value using the callback function from props
  // updateSelectedValue(value);
  openHelpProdDialog();
};

const openHelpProdDialog = () => {
  $q.dialog({
    component: HelpProd,
    componentProps: {
      paramValueNm: props.params.data.prodNm,
      paramUseYn: 'N',
      paramCloseDay: '00000000',
    },
  })
    .onOk(res => {
      console.log('res : ', JSON.stringify(res));
      updateSelectedValue(res);
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};
</script>
