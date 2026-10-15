import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "./common/login-form";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuth) navigate("/home");
  }, [isAuth, navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <AuthLayout
        eyebrow="Welcome back"
        title="Sign in to your workspace"
        description="Pick up where you left off. Your documents and conversations are waiting."
        footer={
          <>
            New to the platform?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-700 transition hover:text-primary-500"
            >
              Create an account
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;
