// app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
        <Image
          src="/logo.svg"
          alt="Muhasabah Logo"
          width={80}
          height={80}
          className="mb-6"
          priority
        />

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Muhasabah
        </h1>
        <p className="text-gray-600 max-w-xl mb-8">
          Track your progress, manage your daily check-ins, complete todos, and
          stay accountable with role-based dashboards for Students, Sitting
          Heads, and Overall Heads.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Create Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Muhasabah. All rights reserved.
      </footer>
    </div>
  );
}
