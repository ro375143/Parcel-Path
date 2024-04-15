"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { message } from "antd";
import "../registerpage.css";

export default function AdminSignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFormsMovedUp, setIsFormsMovedUp] = useState(false);

  function moveFormsUp() {
    const firstForm = document.querySelector("form");
    if (firstForm.checkValidity()) {
      const forms = document.querySelectorAll("form");
      forms.forEach((form) => form.classList.add("move-up"));
      setIsFormsMovedUp(true);
    } else {
      console.log("Invalid information in the first form.");
    }
  }

  function resetForms() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.classList.remove("move-up");
      form.classList.add("resetting");
    });
    setIsFormsMovedUp(false);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== passwordRetype) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const creationTimestamp = userCredential.user.metadata.creationTime;
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        username,
        email,
        firstName,
        lastName,
        created_At: creationTimestamp,
        address: {
          street: streetAddress,
          city: city,
          state: state,
          zipCode: zipCode,
        },
        phoneNumber: phoneNumber,
        role: "admin",
      });

      // Sign out the user immediately after account creation
      await signOut(auth); // This line is crucial

      message.success("Sign up successful! Please sign in.", 10);
      // Now redirect to login page
      router.push("/login/admin");
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      className="h-full object-cover"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden flex"
        style={{ backgroundColor: "#5b9c7a" }}
      >
        <div className="w-56 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
            alt="Sign Up"
          />
        </div>
        <div
          className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8"
          style={{ backgroundColor: "#5b9c7a" }}
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <div
                className="inline-block bg-white rounded-lg px-4 py-2 shadow-xl"
                style={{ backgroundColor: "#345454" }}
              >
                <h2 className="text-2xl font-extrabold text-white">
                  Register Customer Account
                </h2>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden">
            <div
              className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 overflow-hidden form-container"
              style={{ height: isFormsMovedUp ? "490px" : "640px" }}
            >
              <form style={{ position: "relative" }}>
                <div className="mb-4">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={firstName}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(
                        /[^A-Za-z '-]/g,
                        ""
                      );
                      setFirstName(inputValue);
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={lastName}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(
                        /[^A-Za-z '-]/g,
                        ""
                      );
                      setLastName(inputValue);
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="passwordRetype"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="passwordRetype"
                      name="passwordRetype"
                      type={showRetypePassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={passwordRetype}
                      onChange={(e) => setPasswordRetype(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRetypePassword(!showRetypePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showRetypePassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <p className="mt-2 text-center text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}

                <div>
                  <button
                    type="button"
                    onClick={moveFormsUp}
                    className="disabled:opacity-40 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    disabled={
                      !firstName ||
                      !lastName ||
                      !username ||
                      !email ||
                      !password ||
                      !passwordRetype
                    }
                    style={{
                      backgroundColor: "#345454",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#a4d7bb")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#345454")
                    }
                  >
                    Next
                  </button>
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {/* Social sign-up options, if any */}
                  </div>
                </div>
              </form>
              <form
                onSubmit={handleSignup}
                className=""
                style={{ position: "relative", marginTop: "80px" }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="streetAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    autoComplete="off"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={streetAddress}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(
                        /[^A-Za-z0-9\s]/g,
                        ""
                      ); // Remove any characters that are not letters, numbers, or whitespace
                      setStreetAddress(inputValue);
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={city}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(
                        /[^A-Za-z\s-]/g, // Allow letters, spaces, and dashes
                        ""
                      );
                      setCity(inputValue);
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    maxLength="2"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={state}
                    onChange={(e) => {
                      const inputValue = e.target.value
                        .replace(/[^A-Za-z]/g, "")
                        .slice(0, 2)
                        .toUpperCase(); // Remove any characters that are not letters, take only the first two characters, and convert to uppercase
                      setState(inputValue);
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Zip Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    autoComplete="zipCode"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={zipCode}
                    onChange={(e) => {
                      const formattedValue = e.target.value.replace(/\D/g, "");
                      if (formattedValue.length <= 5) {
                        setZipCode(formattedValue);
                        setErrorMessage("");
                      } else {
                      }
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      autoComplete="phoneNumber"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={phoneNumber}
                      onChange={(e) => {
                        const formattedValue = e.target.value.replace(
                          /\D/g,
                          ""
                        );
                        if (formattedValue.length <= 10) {
                          setPhoneNumber(formattedValue);
                          setErrorMessage("");
                        } else {
                        }
                      }}
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="mt-2 text-center text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}

                <div className="flex">
                  <button
                    type="button"
                    onClick={resetForms}
                    className="flex mr-2 w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      backgroundColor: "#345454",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#a4d7bb")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#345454")
                    }
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="disabled:opacity-40 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    disabled={
                      !streetAddress ||
                      !city ||
                      !state ||
                      !zipCode ||
                      !phoneNumber
                    }
                    style={{
                      backgroundColor: "#345454",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#a4d7bb")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#345454")
                    }
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p
            className="mt-4 text-center text-sm text-gray-400"
            style={{ color: "#a4d7bb" }}
          >
            Already have an account?{" "}
            <button
              onClick={() => router.push("../login/user")}
              className="font-bold leading-6 text-green-400 hover:text-green-300"
              style={{ color: "#345454" }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
