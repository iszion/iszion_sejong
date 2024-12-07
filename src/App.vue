<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import router from 'src/router';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'App',
  mounted() {
    console.log('hello: ', this.hello);
  },
  created() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    // window.addEventListener('unload', this.handleUnload);
    // const savedState = localStorage.getItem('myAppState');
    // if (savedState) {
    //   this.$data = JSON.parse(savedState);
    // }
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('unload', this.handleUnload);
  },
  methods: {
    handleBeforeUnload(event) {
      // Logic before the page unloads
      console.log('Page is about to be refreshed or closed');

      // Show confirmation dialog to the user
      // event.preventDefault();
      // event.returnValue = ''; // Standard way to trigger a confirmation dialog

      // const token = sessionStorage.getItem('accessToken');
      // if (!token) {
      //   router.push('/');
      // }
    },
    handleUnload() {
      // Logic when the page unloads
      // This event does not allow preventing the unload, but you can do cleanup here
      console.log('Page has been refreshed or closed');
      // Perform necessary actions like saving state to localStorage, etc.
      // localStorage.setItem('myAppState', JSON.stringify(this.myAppState));
    },
  },
});
</script>
