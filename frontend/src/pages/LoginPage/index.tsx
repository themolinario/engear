import { SigninForm } from "./components/SigninForm.tsx";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      navigate("/home");
    }
  }, []);

  return (
    <>
      <SigninForm />
    </>
  );
}