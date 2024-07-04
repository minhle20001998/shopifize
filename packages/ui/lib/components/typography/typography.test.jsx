// sum.test.js
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomTypography } from "./index";
import { getDesignTokens } from "../../theme";
import { ThemeProvider } from "../../contexts";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

test("Input showup", () => {
  const theme = getDesignTokens("light");
  const { getByTestId } = render(
    <ThemeProvider theme={theme}>
      <CustomTypography data-testid="custom-element"/>
    </ThemeProvider>
  );
  const select = getByTestId("custom-element");
  expect(select).toBeInTheDocument();
});