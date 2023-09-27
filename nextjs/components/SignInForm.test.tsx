import {
  getByLabelText,
  render,
  screen,
  queryByAttribute,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "./SignInForm";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

const getByName = queryByAttribute.bind(null, "name");

describe("SignInForm", () => {
  describe("Render", () => {
    it("Should render a disabled button at the beginning", () => {
      const { container } = render(<SignInForm></SignInForm>);
      const button = screen.getByRole("button", {});
      expect(button).toBeDisabled();
    });

    it("Should render email and password inputs", () => {
      const { container } = render(<SignInForm></SignInForm>);
      const emailInput = getByName(container, "email");
      expect(emailInput).toBeTruthy();
      const passwordInput = getByName(container, "password");
      expect(passwordInput).toBeTruthy();
    });
  });

  describe("Behavior", () => {
    it("Should have button enabled if email and password are valid", async () => {
      const { container } = render(<SignInForm></SignInForm>);
      const user = userEvent.setup();

      const emailInput = getByName(container, "email");
      await user.type(emailInput!, "cesarclarosns@gmail.com");
      const passwordInput = getByName(container, "password");
      await user.type(passwordInput!, "cesarclarosns@gmail.com");
      const button = screen.getByRole("button", {});

      expect(button).toBeEnabled();
    });

    it("Should have button disabled if email is invalid", async () => {
      const { container } = render(<SignInForm></SignInForm>);
      const user = userEvent.setup();

      const emailInput = getByName(container, "email");
      await user.type(emailInput!, "123");
      const passwordInput = getByName(container, "password");
      await user.type(passwordInput!, "cesarclarosns@gmail.com");
      const button = screen.getByRole("button", {});

      expect(button).toBeDisabled();
    });
  });
});
