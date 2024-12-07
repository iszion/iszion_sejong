<template>
  <div v-if="useYn">
    <q-toggle v-model="useYn" color="green" />
  </div>
  <div v-else>
    <q-toggle v-model="useYn" color="green" />
  </div>
</template>

<script>
export default {
  setup(props) {
    let { value } = props.params;
    // console.log('component data: ', value);
    let useYn = false;
    if (value === 'Y') {
      useYn = true;
    } else {
      useYn = false;
    }
    // console.log('component value : ', value);
    // console.log('component useYn : ', useYn);
    return { useYn };
  },
};
</script>
