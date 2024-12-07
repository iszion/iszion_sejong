import { Notify } from 'quasar';

Notify.registerType('my-notify', {
  icon: 'announcement',
  // progress: false,
  color: 'brown',
  textColor: 'white',
  classes: 'glossy',
});

const notifyAlerts = [
  {
    color: 'positive',
    message: '자료를 저장하였습니다',
    caption: '자료저장',
    icon: 'thumb_up',
    type: 'positive',
    textColor: 'dark',
  },
  {
    color: 'negative',
    message: '비정상 처리되었습니다',
    caption: '처리실패',
    icon: 'thumb_up',
    type: 'positive',
    textColor: 'white',
  },
  {
    color: 'info',
    message: '자료를 저장하였습니다',
    caption: '선택된 자료삭제',
    icon: 'thumb_up',
    type: 'positive',
    textColor: 'red',
  },
  { color: 'negative', message: '저장실패!', caption: 'error', icon: 'warning', type: 'negative', textColor: '' },
  { color: 'teal', message: '관리자에게 문의하세요!', caption: 'error', icon: 'tag_faces', type: 'warning', textColor: '' },
  {
    multiLine: true,
    message:
      'Lorem ipsum dolor sit amet, consecrate radicalising elite. Hic squamous non ad sit assume consequent ease inventory official. Corrupt cisgendered impeded vel, fugit edit squamous qua poor excitation event quasi.',
  },
];

export default {
  notifyView(res) {
    // console.log('res: ', JSON.stringify(res));
    Notify.create({
      type: 'my-notify',
      position: 'top-right',
      color: notifyAlerts[res.rtn].color,
      textColor: notifyAlerts[res.rtn].textColor,
      caption: notifyAlerts[res.rtn].caption,
      message: res.rtnMsg,
      group: true,
      actions: [
        {
          label: '닫기',
          color: 'dark',
          handler: () => {
            /* ... */
          },
        },
      ],
      timeout: 3000,
    });
  },
  notifyView1(res, resTime) {
    // console.log('res: ', JSON.stringify(res));
    Notify.create({
      type: 'my-notify',
      position: 'center',
      color: notifyAlerts[res.rtn].color,
      textColor: notifyAlerts[res.rtn].textColor,
      message: res.rtnMsg,
      group: true,
      html: true,
      actions: [
        {
          label: '닫기',
          color: 'dark',
          handler: () => {
            /* ... */
          },
        },
      ],
      timeout: resTime,
    });
  },
  notifyUserView(res, resTime) {
    Notify.create({
      type: 'my-notify',
      position: 'top-right',
      color: res.msgColor,
      textColor: res.msgTextColor,
      caption: res.msgCaption,
      message: res.msgMessage,
      group: true,
      html: true,
      actions: [
        {
          label: '닫기',
          color: 'dark',
          handler: () => {
            /* ... */
          },
        },
      ],
      timeout: resTime,
    });
  },
};
