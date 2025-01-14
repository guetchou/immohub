import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/chat/FloatingChatButton";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <FloatingChatButton />
          </div>
          <Toaster />
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;