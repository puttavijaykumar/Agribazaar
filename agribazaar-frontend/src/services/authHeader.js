export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('authHeader user:', user);
  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access };
  } else {
    return {};
  }
}
