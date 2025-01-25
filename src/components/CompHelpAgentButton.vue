<template>
  <div>
    <q-btn dense no-caps color="secondary" @click="buttonClick('')" class="text-body2" style="width: 70px">
      <q-icon name="search" size="xs" class="q-pt-xs" />
      {{ value.agentCd }}
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HelpAgent from 'components/subvue/HelpAgent.vue';
import commUtil from 'src/js_comm/comm-util';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps(['params']);
const { updateSelectedValue } = props.params;
// console.log("props: ", props.params);
const value = ref(props.params.data);

const buttonClick = resNm => {
  // Update the selected value using the callback function from props
  // updateSelectedValue(value);
  // openHelpAgentDialog(props.params.data.agentNm);
  openHelpAgentDialog(resNm);
};

const openHelpAgentDialog = resNm => {
  $q.dialog({
    component: HelpAgent,
    componentProps: {
      paramValueNm: resNm,
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
