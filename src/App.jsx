
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";
import ContactFormModal from "./components/ContactFormModal";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <LoginModal />
      {/* <ContactFormModal /> */}
    </AuthProvider>
  );
}

export default App;
