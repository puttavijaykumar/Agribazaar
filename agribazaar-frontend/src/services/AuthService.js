const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function registerUser(data) {
  return fetch(`${API_BASE_URL}/api/register/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
}

export async function sendOtp(email) {
  return fetch(`${API_BASE_URL}/api/otp/generate/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email, otp) {
  return fetch(`${API_BASE_URL}/api/otp/verify/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, otp }),
  });
}

export async function loginUser(credentials) {
  return fetch(`${API_BASE_URL}/api/login/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials),
  });
}

export async function loginWithGoogle(token) {
  return fetch(`${API_BASE_URL}/api/google-login/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ token }),
  });
}

export async function updateUserType(userType) {
  const token = localStorage.getItem('access_token');
  return fetch(`${API_BASE_URL}/api/user-type/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_type: userType }),
  });
}
