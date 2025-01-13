import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <AppRoutes />
          <Toaster />
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;