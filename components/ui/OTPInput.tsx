"use client";

import { useEffect, useMemo, useRef } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  autoFocus = true,
  disabled = false,
  error = false,
}: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const safeValue = useMemo(() => {
    return value.replace(/\D/g, "").slice(0, length);
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
      inputsRef.current[index]?.select();
    }
  };

  const updateValueAtIndex = (index: number, digit: string) => {
    const chars = Array.from({ length }, (_, i) => safeValue[i] || "");
    chars[index] = digit;
    onChange(chars.join(""));
  };

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");

    if (!cleaned) {
      updateValueAtIndex(index, "");
      return;
    }

    if (cleaned.length === 1) {
      updateValueAtIndex(index, cleaned);
      if (index < length - 1) focusInput(index + 1);
      return;
    }

    const chars = Array.from({ length }, (_, i) => safeValue[i] || "");
    let cursor = index;

    for (const digit of cleaned) {
      if (cursor >= length) break;
      chars[cursor] = digit;
      cursor += 1;
    }

    onChange(chars.join(""));
    focusInput(Math.min(cursor, length - 1));
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (safeValue[index]) {
        updateValueAtIndex(index, "");
        return;
      }

      if (index > 0) {
        updateValueAtIndex(index - 1, "");
        focusInput(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    const chars = Array.from({ length }, () => "");
    pasted.split("").forEach((digit, index) => {
      chars[index] = digit;
    });

    onChange(chars.join(""));
    focusInput(Math.min(pasted.length, length) - 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">
          Verification Code
        </label>
        <span className="text-xs text-gray-400">{length} digits</span>
      </div>

      <div
        onPaste={handlePaste}
        className={`rounded-2xl border bg-gray-50 p-4 shadow-sm transition-all focus-within:ring-2 ${
          error
            ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-100"
            : "border-gray-100 focus-within:border-red-500 focus-within:ring-red-100"
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={length}
              disabled={disabled}
              value={safeValue[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              className={`h-14 w-12 rounded-xl border text-center text-lg font-bold outline-none transition-all duration-200 cursor-text sm:w-14 ${
                error
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-900 hover:border-red-300"
              } focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60`}
            />
          ))}
        </div>
      </div>

      <p className="pl-1 text-xs text-gray-400">
        Enter the code sent to your email
      </p>
    </div>
  );
}
