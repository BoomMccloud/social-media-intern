"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError(
          "There was an error sending the magic link. Please try again."
        );
      } else {
        setMessage(
          "Check your email! A magic link has been sent to your inbox."
        );
        setEmail("");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your email"
            className="
              w-full px-3 py-2
              bg-gray-800 
              border border-gray-600
              rounded-md
              text-white
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:opacity-50
            "
          />
        </div>
      </div>

      {message && <div className="text-sm text-green-400 mt-2">{message}</div>}

      {error && <div className="text-sm text-red-400 mt-2">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full px-4 py-2
          bg-blue-600 
          text-white
          rounded-md
          hover:bg-blue-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center
        "
      >
        {isLoading ? (
          <span>Sending magic link...</span>
        ) : (
          <span>Send magic link</span>
        )}
      </button>
    </form>
  );
}
