// sum.test.js
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomButton } from "./index";
import { getDesignTokens } from "../../theme";
import { ThemeProvider } from "../../contexts";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

test("Button showup", () => {
  const theme = getDesignTokens("light");
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <CustomButton>Button</CustomButton>
    </ThemeProvider>
  );
  const button = getByText("Button");
  expect(screen.getByRole("button")).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});

test("Button styling", () => {
  const theme = getDesignTokens("light");
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <CustomButton
        sx={{
          color: "rgb(255, 0, 0)",
        }}
      >
        Button
      </CustomButton>
    </ThemeProvider>
  );
  const button = getByText("Button");
  expect(button).toHaveStyle({ color: "rgb(255, 0, 0)" });
});

test("Button fire onClick", async () => {
  const theme = getDesignTokens("light");
  const title = "Button clicked";
  const onClick = () => {
    return title;
  };
  const mock = vi.fn().mockImplementation(onClick);
  render(
    <ThemeProvider theme={theme}>
      <CustomButton onClick={mock}>Button</CustomButton>
    </ThemeProvider>
  );
  await userEvent.click(screen.getByRole("button"));
  expect(mock).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("button"));
  expect(mock).toHaveBeenCalledTimes(3);
});
