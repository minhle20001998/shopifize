// sum.test.js
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomSelect } from "./index";
import { getDesignTokens } from "../../theme";
import { ThemeProvider } from "../../contexts";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

test("Select showup", () => {
  const theme = getDesignTokens("light");
  const { getByTestId } = render(
    <ThemeProvider theme={theme}>
      <CustomSelect data-testid="custom-element"/>
    </ThemeProvider>
  );
  const select = getByTestId("custom-element");
  expect(select).toBeInTheDocument();
});