import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DriverSignin from "./DriverSignin"; // Adjust the import path as needed
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Mocking Firebase Authentication
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mocking Next.js Router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("DriverSignin Component", () => {
  // Setup a helper function for filling in the form
  const setup = () => {
    const utils = render(<DriverSignin />);
    const emailInput = utils.getByLabelText("Email address");
    const passwordInput = utils.getByLabelText("Password");
    const submitButton = utils.getByRole("button", { name: /sign in/i });
    return {
      emailInput,
      passwordInput,
      submitButton,
      ...utils,
    };
  };

  it("renders correctly", () => {
    const { getByText } = render(<DriverSignin />);
    expect(getByText(/driver login/i)).toBeInTheDocument();
  });

  it("shows an error message when email and password are not provided", async () => {
    const { submitButton, findByText } = setup();
    fireEvent.click(submitButton);

    expect(
      await findByText(/please enter both email and password./i)
    ).toBeInTheDocument();
  });

  it("submits the form with email and password", async () => {
    const { emailInput, passwordInput, submitButton } = setup();

    // Mock successful sign in
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: {
        uid: "testUID",
      },
    });

    fireEvent.change(emailInput, { target: { value: "test@driver.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@driver.com",
        "password"
      )
    );
  });

  // Add more tests here to cover other functionalities
});
