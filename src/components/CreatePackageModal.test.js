import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { message } from "antd";
import CreatePackageModal from "./CreatePackage";
import { addDoc } from "firebase/firestore";

describe("CreatePackageModal", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("displays the modal when isOpen is true", () => {
    const { getByText } = render(
      <CreatePackageModal isOpen={true} onClose={() => {}} />
    );
    expect(getByText("Create New Package")).toBeInTheDocument();
  });

  it("calls addDoc with the correct data on form submission", async () => {
    const onCloseMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <CreatePackageModal isOpen={true} onClose={onCloseMock} />
    );

    // Simulate user input
    await userEvent.type(getByLabelText("Package Name"), "Test Package");
    await userEvent.type(
      getByLabelText("Description"),
      "This is a test package"
    );
    await userEvent.type(getByLabelText("Package Dimensions"), "10x10x10");
    await userEvent.type(
      getByLabelText("Package Weight"),
      "{selectall}{backspace}5"
    );
    await userEvent.click(getByText("Pending").closest('div[role="combobox"]')); // Opens the select dropdown
    await userEvent.click(getByText("In Transit")); // Select an option
    // Assume the DatePicker interaction is handled correctly; DatePicker testing might require specific mocks or user-event interactions.

    // Submit the form
    fireEvent.click(getByText("Create"));

    await waitFor(() => {
      // Verifies addDoc was called
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Test Package",
          description: "This is a test package",
          packageDimensions: "10x10x10",
          packageWeight: 5,
          status: "In Transit",
          // Additional properties depending on your form state and logic
        })
      );

      // Check if success message was displayed
      expect(message.success).toHaveBeenCalledWith(
        "Package created successfully!"
      );

      // Check if onClose was called to close the modal
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  // Additional tests can include form validation errors, handling Firestore errors, etc.
});
