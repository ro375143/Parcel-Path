import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CustomerSignUp from "./CustomerSignUp"; // Update the import path as needed
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc } from "firebase/firestore";

// Mock Firebase and Next.js router
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("CustomerSignUp Component", () => {
  it("allows a user to sign up", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: {
        uid: "testUID",
        metadata: {
          creationTime: "testCreationTime",
        },
      },
    });
    setDoc.mockResolvedValueOnce(() => Promise.resolve()); // Simulate successful Firestore document creation

    const { getByLabelText, getByRole, getByText } = render(<CustomerSignUp />);

    // Fill out the form
    userEvent.type(getByLabelText(/first name/i), "John");
    userEvent.type(getByLabelText(/last name/i), "Doe");
    userEvent.type(getByLabelText(/username/i), "johndoe");
    userEvent.type(getByLabelText(/email/i), "john.doe@example.com");
    userEvent.type(getByLabelText(/password/i), "password123");
    userEvent.type(getByLabelText(/confirm password/i), "password123");
    // Add more fields as necessary

    // Submit the form
    fireEvent.submit(getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      // Verify that createUserWithEmailAndPassword was called with correct email and password
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // auth object, which we're not checking here
        "john.doe@example.com",
        "password123"
      );

      // Check for navigation to the login page after successful signup
      expect(
        getByText(/sign up successful! please sign in./i)
      ).toBeInTheDocument();
    });
  });

  // Add more tests here for error handling, password mismatch, etc.
});
