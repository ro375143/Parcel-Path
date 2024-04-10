import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminSignin from "./AdminSignin"; // Adjust the import path as necessary
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Mocking the Firebase auth functions
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mocking Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("AdminSignin Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("displays an error message when credentials are missing", async () => {
    const { getByLabelText, getByRole, findByText } = render(<AdminSignin />);

    fireEvent.click(getByRole("button", { name: /sign in/i }));

    expect(
      await findByText(/please enter both email and password/i)
    ).toBeInTheDocument();
  });

  it("calls signInWithEmailAndPassword with the correct credentials", async () => {
    const testEmail = "admin@example.com";
    const testPassword = "securePassword123";
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } }); // Mocking a successful sign-in

    const { getByLabelText, getByRole } = render(<AdminSignin />);

    fireEvent.change(getByLabelText(/email address/i), {
      target: { value: testEmail },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: testPassword },
    });
    fireEvent.click(getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        testEmail,
        testPassword
      );
    });
  });

  // Additional tests can be written to simulate successful sign-ins, checking the role from Firestore, and handling errors.
});
