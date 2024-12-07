import { boot } from 'quasar/wrappers';

import Quill from 'quill/core';
import { QuillEditor } from 'vue3-quill';

import Toolbar from 'quill/modules/toolbar';
import Snow from 'quill/themes/snow';

// Register Quill modules
Quill.register({
  'modules/toolbar': Toolbar,
  'themes/snow': Snow,
});

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // something to do
  app.config.globalProperties.$quillConfig = {
    /* your default options here */
  };

  // Optionally, you can register the Quill editor component globally
  app.component('QuillEditor', QuillEditor);
});
