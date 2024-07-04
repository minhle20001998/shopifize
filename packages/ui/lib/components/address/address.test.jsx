// sum.test.js
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomAddress } from "./index";
import { getDesignTokens } from "../../theme";
import { ThemeProvider } from "../../contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

const TestComponent = () => {
  const theme = getDesignTokens("light");
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 0 } } })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CustomAddress/>
          abc
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

test("Address input showup", () => {
  const { getByText } = render(<TestComponent/>);
  const addressInput = getByText("abc");
  expect(addressInput).toBeInTheDocument();
});
