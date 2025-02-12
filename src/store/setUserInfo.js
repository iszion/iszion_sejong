import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    userId: '',
    userNm: '',
    userNmx: '',
    compCd: '',
    compNm: '',
    deptCd: '',
    deptNm: '',
    titlCd: '',
    titlNm: '',
    levelCd: '',
  }),
  getters: {},
  actions: {},
});
