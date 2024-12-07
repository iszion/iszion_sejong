<template>
  <div>
    <q-input
      type="textarea"
      v-model="inputValue"
      @keydown.enter.prevent="onEnter"
      label="Voice Input"
      filled
      @focus="startRecognition"
      @blur="stopRecognition"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');
let recognition;

const startRecognition = () => {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported in this browser.');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true; // Keep listening
  recognition.interimResults = false; // Only final results

  recognition.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ')
      .trim();
    inputValue.value += transcript + '\n'; // Add transcript with a new line
  };

  recognition.onerror = event => {
    console.error('Speech recognition error', event.error);
  };

  recognition.onend = () => {
    console.log('Speech recognition service disconnected');
  };

  recognition.start();
};

const stopRecognition = () => {
  if (recognition) {
    recognition.stop();
  }
};

const onEnter = () => {
  inputValue.value += '\n'; // Allow skipping lines with Enter key
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
