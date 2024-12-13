export default {
  dataJsonParse(resTag, resIud, resFormData) {
    // form json data 를 json data 파싱
    let jsonFormData = JSON.stringify(resFormData);

    let data = []; // 신규,수정 데이타 저장 변수
    let dataDel = []; // 삭제 데이타 저장 변수

    if (resIud === 'I') {
      data[0] = '{"mode":"I","data":' + jsonFormData + '}';
    } else if (resIud === 'C') {
      data[0] = '{"mode":"C","data":' + jsonFormData + '}';
    } else if (resIud === 'U') {
      data[0] = '{"mode":"U","data":' + jsonFormData + '}';
    } else if (resIud === 'A') {
      data[0] = '{"mode":"A","data":' + jsonFormData + '}';
    } else if (resIud === 'S') {
      data[0] = '{"mode":"S","data":' + jsonFormData + '}';
    } else if (resIud === 'R') {
      data[0] = '{"mode":"R","data":' + jsonFormData + '}';
    } else if (resIud === 'N') {
      data[0] = '{"mode":"N","data":' + jsonFormData + '}';
    } else if (resIud === 'D') {
      dataDel[0] = '{"mode":"D","data":' + jsonFormData + '}';
    }
    let obj = this.jsonFiller(resTag, data, dataDel);
    return JSON.stringify(obj).replace(/null/gi, '');
  },

  jsonFiller(resTag, resObj, resObjDel) {
    let jsonData = {};

    // 신규, 수정 자료 정리 부분
    let tmpDataI = []; // 신규저장
    let tmpDataC = []; // 업로드용
    let tmpDataU = []; // 수정
    let tmpDataN = []; //
    let tmpDataA = []; //
    let tmpDataS = []; // 승인
    let tmpDataR = []; // 리턴
    let tmpDataD = []; // 삭제

    if (resObj.length > 0) {
      for (let i = 0; i < resObj.length; i++) {
        let objTmp = JSON.parse(resObj[i]);
        if (objTmp.mode === 'I') {
          // Check if key value is null and replace with empty string
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataI.push(objTmp.data);
        } else if (objTmp.mode === 'C') {
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataC.push(objTmp.data);
        } else if (objTmp.mode === 'U') {
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataU.push(objTmp.data);
        } else if (objTmp.mode === 'N') {
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataN.push(objTmp.data);
        } else if (objTmp.mode === 'R') {
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataR.push(objTmp.data);
        } else if (objTmp.mode === 'A') {
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataA.push(objTmp.data);
        } else if (objTmp.mode === 'S') {
          Object.keys(objTmp.data).forEach(key => {
            objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
          });
          tmpDataS.push(objTmp.data);
        } else {
        }
      }
      jsonData.I = tmpDataI;
      jsonData.C = tmpDataC;
      jsonData.U = tmpDataU;
      jsonData.N = tmpDataN;
      jsonData.A = tmpDataA;
      jsonData.S = tmpDataS;
      jsonData.R = tmpDataR;
    } else {
      jsonData.I = [];
      jsonData.C = [];
      jsonData.U = [];
      jsonData.N = [];
      jsonData.A = [];
      jsonData.S = [];
      jsonData.R = [];
    }

    // 삭제 자료 정리 부분
    tmpDataD = [];
    if (resObjDel.length > 0) {
      for (let i = 0; i < resObjDel.length; i++) {
        let objTmp = JSON.parse(resObjDel[i]);
        Object.keys(objTmp.data).forEach(key => {
          objTmp.data[key] = objTmp.data[key] === null ? '' : objTmp.data[key];
        });
        tmpDataD.push(objTmp.data);
      }
      jsonData.D = tmpDataD;
    } else {
      jsonData.D = [];
    }

    let jsonReturnData = {};
    jsonReturnData[resTag] = jsonData;

    return jsonReturnData;
  },
};
