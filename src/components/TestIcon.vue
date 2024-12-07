<template>
  <div v-if="value">
    <q-icon :name="value" color="teal" size="xs" />
  </div>
  <div v-else>
    <q-icon :name="value" color="teal" size="xs" />
  </div>
</template>

<script>
export default {
  setup(props) {
    let { value } = props.params;
    // console.log('component data: ', value);
    return { value };
  },
};
</script>
