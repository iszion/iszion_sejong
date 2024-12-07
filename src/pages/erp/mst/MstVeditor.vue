<template>
  <div>
    <!-- Color Picker and Apply Button -->
    <div v-if="editColor" :style="colorPickerStyle" class="color-picker-wrapper">
      <q-btn icon="check" round color="green" @click="applyColor" />
      <q-color v-model="textColor" no-header style="width: 190px" no-footer @change="applyColor" />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ contents }}</pre>
      </q-card-section>
    </q-card>

    <q-editor class="q-editor editor-container" ref="qEditorContents" v-model="contents" :definitions="editorDefinitions" :toolbar="toolbar" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const textColor = ref('#000');
const editColor = ref(false);
const qEditorContents = ref(null);
const colorPickerStyle = ref({ top: '0px', left: '0px', position: 'absolute' });
const contents = ref('안녕하세요');

// Function to apply the selected color
function applyColor() {
  const selection = window.getSelection();
  console.log('select : ', selection);

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (selection.isCollapsed) {
      // If there is no text selected, create a span with the chosen color
      const span = document.createElement('span');
      span.style.color = textColor.value;
      span.appendChild(document.createTextNode('\u200B')); // Zero-width space to allow typing

      range.insertNode(span);
      range.setStart(span.firstChild, 1); // Move the cursor inside the span
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If text is selected, use execCommand to apply the color
      document.execCommand('foreColor', false, textColor.value);
    }
  }

  editColor.value = false;
}

// Handler to show the color picker
function fontColor(event) {
  editColor.value = true;
  const { clientX, clientY } = event;
  colorPickerStyle.value = {
    top: `${clientY + 20}px`, // Position below the button
    left: `${clientX + 20}px`, // Align horizontally with the button
    position: 'absolute',
  };
}

// Editor toolbar and definitions
const editorDefinitions = {
  font_color: {
    tip: 'Change font color',
    icon: 'colorize',
    label: '글색상',
    handler: fontColor,
  },
};

const toolbar = [
  [
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
    },
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify'],
    },
  ],
  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript', 'font_color'],
  ['insert_img'],
  ['hr', 'link'],
  ['fullscreen'],
  ['unordered', 'ordered', 'outdent', 'indent'],
  ['undo', 'redo'],
  ['viewsource'],
];
</script>

<style scoped>
/* Custom styles for the color picker */
.color-picker-wrapper {
  z-index: 1000;
}
</style>
