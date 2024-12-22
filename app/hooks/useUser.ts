import { useState, useEffect } from "react";
import { auth, authAction } from "@/helper/auth";

const useUser = () => {
  const [user, setUser] = useState(auth.getUserInfo()?.username || null);

  useEffect(() => {
    // Function to handle authentication changes
    const handleAuthChange = () => {
      setUser(auth.getUserInfo()?.username || null);
    };
    // Add event listeners or subscribe to auth state changes here
    authAction.change(handleAuthChange);

    return () => {
      authAction.change(handleAuthChange, true);
    };
  }, []);

  return user;
};

export default useUser;
