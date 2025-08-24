"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ROLE_OPTIONS } from "@/app/constants/roles";

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  role: string;
  location: string;
  whatsapp: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIGERIA_PHONE_REGEX = /^(?:\+234|0)[789][01]\d{8}$/;

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    role: "student",
    location: "",
    whatsapp: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string => {
    const { email, username, password, whatsapp } = form;

    if (!EMAIL_REGEX.test(email)) return "Invalid email format.";
    if (username.trim().length < 3)
      return "Username must be at least 3 characters.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (whatsapp && !NIGERIA_PHONE_REGEX.test(whatsapp)) {
      return "Enter a valid Nigerian WhatsApp number.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post<RegisterFormData>(
        "http://127.0.0.1:8000/api/accounts/register/",
        form
      );

      setSuccess("Registration successful! Check your email to verify your account.");
      setForm({
        email: "",
        username: "",
        password: "",
        role: "student",
        location: "",
        whatsapp: "",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const messageData = err.response?.data;
        const flatMessage =
          messageData && typeof messageData === "object"
            ? Object.values(messageData)
                .flat()
                .join(" ")
            : "Something went wrong.";
        setError(flatMessage);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 border rounded-xl bg-white shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Role</Label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Location</Label>
        <Input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>WhatsApp Number</Label>
        <Input
          type="text"
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
