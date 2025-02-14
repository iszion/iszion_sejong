import { boot } from 'quasar/wrappers';
import { Quasar, LocalStorage } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
  const val = LocalStorage.getItem('lang') || Quasar.lang.isoName;
  console.log('boot lang: ', val);
  import(`../../node_modules/quasar/lang/${val}.js`).then(lang => {
    Quasar.lang.set(lang.default);
  });
});
