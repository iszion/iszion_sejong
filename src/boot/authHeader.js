export default function authHeader() {
  let token = JSON.parse(localStorage.getItem('token'));

  if (token && token.accessToken) {
    return { Authorization: 'Bearer ' + token.accessToken };
  } else {
    return {};
  }
}
