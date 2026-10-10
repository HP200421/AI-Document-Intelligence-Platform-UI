import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const Error = lazy(() => import("./pages/404"));
const Documents = lazy(() => import("./pages/documents"));

import Layout from "./layout/Layout";
import Loading from "@/components/Loading";

function App() {
  return (
    <main className="App relative">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loading />}>
              <Register />
            </Suspense>
          }
        />
        <Route path="/*" element={<Layout />}>
          <Route path="home" element={<Documents />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
        <Route
          path="/404"
          element={
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
