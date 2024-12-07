import { boot } from 'quasar/wrappers';
import { Loading } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
  // 이곳에서 설정한 경우에는 반드시 quasar.config.js boot 에 등록해 주어야 한다.
  Loading.setDefaults({
    delay: 0,
    message: '로딩중...!!',
    spinnerSize: 40,
  });
});
