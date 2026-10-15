import React from "react";
import { Link } from "react-router-dom";
import RegForm from "./common/reg-from";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./AuthLayout";

const Register = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <AuthLayout
        eyebrow="Get started for free"
        title="Create your account"
        description="Set up your secure workspace and start getting more from every document."
        footer={
          <>
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-primary-700 transition hover:text-primary-500"
            >
              Sign in
            </Link>
          </>
        }
      >
        <RegForm />
      </AuthLayout>
    </>
  );
};

export default Register;
