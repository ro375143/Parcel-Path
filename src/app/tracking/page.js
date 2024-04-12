"use client";
import React from "react";
import GuestPackageTracking from "@/components/GuestTracking";
import { useRouter } from "next/navigation";

const GuestTracking = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Please enter your tracking number:</h1>

      <GuestPackageTracking />
      <div className="sign-up">
        <p>
          if youd like to keep track of all your tracked packages consider
          signing up:
        </p>
        <button onClick={() => router.push("/register/user")}>
          REGISTER NOW
        </button>
      </div>
    </div>
  );
};

export default GuestTracking;
