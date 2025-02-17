
import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import { AuthProvider } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <AuthProvider>
      {user ? <Dashboard /> : <Login />}
    </AuthProvider>
  );
};

export default Index;
