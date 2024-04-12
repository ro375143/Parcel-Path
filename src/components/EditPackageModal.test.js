import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import EditPackageModal from "./EditPackageModal"; // Update the import path as needed
import dayjs from "dayjs";

describe("EditPackageModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const packageData = {
    id: "123",
    name: "Test Package",
    description: "This is a test package",
    status: "Pending",
    trackingNumber: "TRACK123",
    packageWeight: 5,
    packageDimensions: "10x5x3",
    shipDate: dayjs(),
    deliveryDate: dayjs().add(5, "day"),
  };

  it("populates the form with package data", async () => {
    const { getByLabelText } = render(
      <EditPackageModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        packageData={packageData}
      />
    );

    await waitFor(() => {
      expect(getByLabelText(/Package Name/i)).toHaveValue(packageData.name);
      expect(getByLabelText(/Description/i)).toHaveValue(
        packageData.description
      );
      // Continue for each field...
    });
  });

  it("calls onSave with the right parameters upon form submission", async () => {
    const { getByText, getByLabelText } = render(
      <EditPackageModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        packageData={packageData}
      />
    );

    // Modify a field to test onSave functionality
    const newName = "Updated Test Package";
    userEvent.clear(getByLabelText(/Package Name/i));
    userEvent.type(getByLabelText(/Package Name/i), newName);

    // Simulate form submission
    userEvent.click(getByText(/Save/i));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        packageData.id,
        expect.objectContaining({
          name: newName,
          // Include other fields as needed...
        })
      );
    });
  });

  // Additional tests can be written to cover validation errors, modal close behavior, etc.
});
