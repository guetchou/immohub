import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useRoleRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const redirectBasedOnRole = () => {
      console.log("Redirecting based on role:", user.role);
      
      switch (user.role) {
        case "TENANT":
          navigate("/tenant-dashboard");
          break;
        case "LANDLORD":
          navigate("/landlord-dashboard");
          break;
        case "AGENCY":
          navigate("/agency-dashboard");
          break;
        case "BROKER":
          navigate("/broker-dashboard");
          break;
        case "CANVASSER":
          navigate("/canvasser-dashboard");
          break;
        case "LAND_OWNER":
          navigate("/land-owner-dashboard");
          break;
        case "INSURANCE":
          navigate("/insurance-dashboard");
          break;
        case "NOTARY":
          navigate("/notary-dashboard");
          break;
        case "ADMIN":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    };

    redirectBasedOnRole();
  }, [user, navigate]);
};