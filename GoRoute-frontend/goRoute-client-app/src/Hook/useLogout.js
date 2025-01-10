import { useDispatch } from "react-redux";
import { clearUserData } from "../slice/userSlicer";   

const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUserData());

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");

    window.location.href = "/login";
  };

  return { handleLogout };
};

export default useLogout;
