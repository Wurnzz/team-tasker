
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

// Create a new component that uses the auth context
const AuthenticatedApp = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default Index;
