import { useEffect, useState } from "react";
import { getUserToken } from "./index";
import fetchResource from "../index";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getUserToken();

    if (!token) {
      setLoading(false);
      return;
    }

    const validateSession = async () => {
      try {
        await fetchResource("GET", "user");
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  return { loading, authenticated };
};

export default useAuth;
