"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      signOut(auth)
        .then(() =>
          setTimeout(() => {
            router.push("/login");
          }, 3000)
        )
        .catch((error) => console.error("Logout Error", error));
    };

    handleLogout();
  }, [router]);

  return (
    <div>
      <p>You have been successfully logged out.</p>
      <p>Redirecting to login page...</p>
    </div>
  );
};

export default LogoutPage;
