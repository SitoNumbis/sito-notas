import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// utils
import { getUserName, logoutUser } from "../../utils/auth";

// contexts
import { useUser } from "../../contexts/UserProvider";

// services
import { signOutUser } from "../../services/auth";

// components
import Loading from "../../components/Loading/Loading";

function SignOut() {
  const navigate = useNavigate();

  const { setUserState } = useUser();

  const signOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error(err);
    }
    setUserState({ type: "logged-out" });
    navigate("/");
  };

  useEffect(() => {
    signOut();
  }, []);

  return <Loading className="w-full h-screen" />;
}

export default SignOut;
