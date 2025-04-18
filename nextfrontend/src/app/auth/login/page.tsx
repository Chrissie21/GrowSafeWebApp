"use client";
import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { AxiosError, isAxiosError } from "axios";

// Define the shape of the error response from the backend
interface ErrorResponse {
  error?: string;
}

// Def the types of error states
interface Errors {
  usernameOrEmail: string;
  password: string;
  general: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Errors>({
    usernameOrEmail: "",
    password: "",
    general: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { usernameOrEmail: "", password: "", general: "" };

    // check if username or email is provided
    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = "Email or Username is required";
      isValid = false;
    } else if (formData.usernameOrEmail.includes("@")) {
      // Input contains '@', treat as Email
      if (!/\S+@\S+\.\S+/.test(formData.usernameOrEmail)) {
        newErrors.usernameOrEmail = "Please enter a valid email address";
        isValid = false;
      }
    } else {
      // Input doesn't contain '@', treat as Username
      if (formData.usernameOrEmail.length < 3) {
        newErrors.usernameOrEmail =
          "Username must be at least 3 characters long";
        isValid = false;
      }
    }

    // check password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await api.post("login/", {
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        });

        const { access, refresh } = response.data;

        // Store token in localStorage or sessionStorage based on rememberMe
        if (formData.rememberMe) {
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);
        } else {
          sessionStorage.setItem("access_token", access);
          sessionStorage.setItem("refresh_token", refresh);
        }

        // Redirect to Dashboard
        router.push("../dashboard");
      } catch (error) {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          setErrors({
            ...errors,
            general:
              axiosError.response?.data?.error ||
              "Login failed. Please try again",
          });
        } else {
          setErrors({
            ...errors,
            general: "An unexpected error occurred. Please try again.",
          });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Head>
        <title>Login | GrowSafe Page</title>
        <meta
          name="description"
          content="Log in to your GrowSafe Page account"
        />
      </Head>

      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="../" className="text-green-700 font-bold text-xl">
            GrowSafe
          </Link>
          <div>
            <Link href="/auth/signup">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Log in to access your investments
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="usernameOrEmail"
                className="block text-gray-700 font-medium mb-2"
              >
                Username or Email Address
              </label>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded border ${
                  errors.usernameOrEmail ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500 text-black`}
                placeholder="Username or you@example.com"
              />
              {errors.usernameOrEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.usernameOrEmail}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500 text-black`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
                Remember me
              </label>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-green-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} GrowSafe Page. All rights
            reserved.
          </p>
          <div className="mt-2">
            <Link
              href="/terms"
              className="text-green-200 mx-2 hover:underline text-sm"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-green-200 mx-2 hover:underline text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-green-200 mx-2 hover:underline text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
