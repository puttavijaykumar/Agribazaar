import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const clientId = "806359710543-50721viene83vcg32pi1utpt3aeobe7k.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
