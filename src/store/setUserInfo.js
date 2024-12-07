import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    setEmpCd: '',
    setEmpNm: '',
    setEmpNmx: '',
    setSalesCd: '',
    setDeptCd: '',
    setDeptNm: '',
    setPstnCd: '',
    setPstnNm: '',
    setLevelCd: '',
    setLevelNm: '',
  }),
  getters: {},
  actions: {},
});
