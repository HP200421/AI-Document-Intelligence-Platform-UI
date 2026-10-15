import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { axiosFireApi, setAccessToken } from "../../../services/config";
import { toast } from "react-toastify";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosFireApi("login", "post", {
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        if (response.data?.access_token) {
          setAccessToken(response.data.access_token);
        }
        dispatch(
          handleLogin({
            ...(response.data && typeof response.data === "object"
              ? response.data
              : {}),
            email: response.data?.email || data.email,
          })
        );
        toast.success("Welcome back");
        navigate("/home");
      } else {
        const detail = response.error?.detail;
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).filter(Boolean).join(". ")
          : detail;
        toast.error(message || response.error?.message || "Unable to sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Textinput
        name="email"
        label="Email"
        placeholder="you@company.com"
        type="email"
        id="login-email"
        autoComplete="email"
        register={register}
        error={errors.email}
        classLabel="mb-2 block text-sm font-medium normal-case text-slate-700"
        className="!h-12 !rounded-xl !border-slate-200 !bg-white !px-4 !text-sm !shadow-sm focus:!border-primary-400 focus:!ring-4 focus:!ring-primary-100"
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        placeholder="Your password"
        id="login-password"
        autoComplete="current-password"
        register={register}
        error={errors.password}
        hasicon
        classLabel="mb-2 block text-sm font-medium normal-case text-slate-700"
        className="!h-12 !rounded-xl !border-slate-200 !bg-white !px-4 !text-sm !shadow-sm focus:!border-primary-400 focus:!ring-4 focus:!ring-primary-100"
      />

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#292723] px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-900/15 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Signing you in…
          </>
        ) : (
          <>
            Sign in to workspace
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>
      <p className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Your workspace is protected with secure sign-in
      </p>
    </form>
  );
};

export default LoginForm;
