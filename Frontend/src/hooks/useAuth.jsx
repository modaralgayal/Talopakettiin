import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setUserType } from "../redux/slices/userSlice";
import { logOut } from "../controllers/userController";
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.setItem("authStatus", false);
      dispatch(setUserType(null));
      navigate("/");
    } catch (error) {
      navigate("/");
      dispatch(setUserType(null));
      console.error("Logout failed:", error);
    }
  };

  return { handleLogout };
};
