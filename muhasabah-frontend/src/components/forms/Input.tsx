// src/components/forms/Input.tsx
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  error,
  register,
  className = "",
  id,
  ...props
}: Props) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      <label
        htmlFor={inputId}
        className="block font-medium mb-1 text-sm text-gray-700"
      >
        {label}
      </label>

      {/* Input */}
      <input
        id={inputId}
        {...register}
        {...props}
        aria-invalid={!!error}
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
