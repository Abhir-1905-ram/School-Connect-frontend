"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #312E81 100%)",
      }}
    >
      <LoginForm />
    </div>
  );
}
