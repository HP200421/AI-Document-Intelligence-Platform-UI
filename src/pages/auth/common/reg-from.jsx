import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { axiosFireApi } from "../../../services/config";
import { toast } from "react-toastify";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter a password"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();

const RegForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosFireApi("register", "post", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        toast.success("Account created. Please sign in.");
        navigate("/");
      } else {
        const detail = response.error?.detail;
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).filter(Boolean).join(". ")
          : detail;
        toast.error(message || response.error?.message || "Unable to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Textinput
        name="name"
        label="Name"
        type="text"
        placeholder="Your name"
        id="register-name"
        autoComplete="name"
        register={register}
        error={errors.name}
        classLabel="mb-2 block text-sm font-medium normal-case text-slate-700"
        className="!h-12 !rounded-xl !border-slate-200 !bg-white !px-4 !text-sm !shadow-sm focus:!border-primary-400 focus:!ring-4 focus:!ring-primary-100"
      />
      <Textinput
        name="email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        id="register-email"
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
        placeholder="8–20 characters"
        id="register-password"
        autoComplete="new-password"
        register={register}
        error={errors.password}
        hasicon
        classLabel="mb-2 block text-sm font-medium normal-case text-slate-700"
        className="!h-12 !rounded-xl !border-slate-200 !bg-white !px-4 !text-sm !shadow-sm focus:!border-primary-400 focus:!ring-4 focus:!ring-primary-100"
      />
      <Textinput
        name="confirmpassword"
        label="Confirm password"
        type="password"
        placeholder="Repeat password"
        id="register-confirm-password"
        autoComplete="new-password"
        register={register}
        error={errors.confirmpassword}
        hasicon
        classLabel="mb-2 block text-sm font-medium normal-case text-slate-700"
        className="!h-12 !rounded-xl !border-slate-200 !bg-white !px-4 !text-sm !shadow-sm focus:!border-primary-400 focus:!ring-4 focus:!ring-primary-100"
      />
      <button
        type="submit"
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#292723] px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-900/15 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Creating your account…
          </>
        ) : (
          <>
            Create your account
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>
      <p className="pt-1 text-center text-xs text-slate-400">
        By continuing, you agree to keep your workspace secure.
      </p>
    </form>
  );
};

export default RegForm;
