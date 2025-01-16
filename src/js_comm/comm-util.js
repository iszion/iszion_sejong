export default {
  formatDateYm(rawDate) {
    if (rawDate) {
      return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}`;
    } else {
      return '';
    }
  },

  formatDate(rawDate) {
    if (rawDate) {
      return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6)}`;
    } else {
      return '';
    }
  },

  formatDateSel(rawDate, sel) {
    if (rawDate) {
      return `${rawDate.slice(0, 4)}${sel}${rawDate.slice(4, 6)}${sel}${rawDate.slice(6)}`;
    } else {
      return '';
    }
  },

  unFormatDate(rawDate) {
    return rawDate ? rawDate.replace(/\D/g, '') : '';
  },

  formatTime(rawTime) {
    if (rawTime) {
      return `${rawTime.slice(0, 2)}:${rawTime.slice(2, 4)}:${rawTime.slice(4)}`;
    } else {
      return '';
    }
  },

  unFormatTime(rawTime) {
    return rawTime ? rawTime.replace(/-/g, '') : '';
  },

  formatComma(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return ''; // 숫자가 아니면 공백 반환
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  removeComma(value) {
    if (typeof value !== 'string') {
      // handle non-string values, maybe throw an error or return default value
      return value;
    }
    return value.replace(',', '');
  },

  getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  getTodayYear() {
    const today = new Date();
    return today.getFullYear();
  },
  getTodayMonth() {
    const today = new Date();
    return String(today.getMonth() + 1).padStart(2, '0');
  },
  getTodayDay() {
    const today = new Date();
    return String(today.getDate()).padStart(2, '0');
  },

  getLastMonthDay(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  // 숫자앞에 0 붙이기
  getDataWithZero(obj, len) {
    return String(obj).padStart(len, '0');
  },

  getTodaytime(datetime) {
    const now = new Date();

    const year = now.getFullYear(); // 연도
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1 필요)
    const date = String(now.getDate()).padStart(2, '0'); // 일
    const hours = String(now.getHours()).padStart(2, '0'); // 시간
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 분
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 초

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  },

  formatDatetime(datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  formatWeekDate(dateString) {
    // Convert the date string 'YYYYMMDD' into a JavaScript Date object
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6) - 1;
    const day = dateString.slice(6, 8);

    const date = new Date(year, month, day);

    // Create an array for weekday and month names
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const monthsOfYear = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    // Format the output string
    const formattedDate = `${year}년 ${monthsOfYear[month]}월 ${day}일  (${daysOfWeek[date.getDay()]})`;

    return formattedDate;
  },

  textByteLength(str) {
    let strLength1 = 0;
    let strLength2 = 0;
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    const matches1 = str.match(koreanRegex);
    const generalRegex = /[^\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/g;
    const matches2 = str.match(generalRegex);
    if (matches1) {
      strLength1 = matches1.length * 2;
    }
    if (matches2) {
      strLength2 = matches2.length;
    }
    // console.log('matches1 : ', matches1);
    // console.log('matches2 : ', matches2);
    return strLength1 + strLength2;
  },

  // 파일 크기 형식 변환 함수
  formatFileSize(size) {
    if (size < 1024) return `${size} B`;
    if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1073741824) return `${(size / 1048576).toFixed(2)} MB`;
    return `${(size / 1073741824).toFixed(2)} GB`;
  },
};
