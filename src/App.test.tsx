import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders start and end date inputs", () => {
    render(<App />);

    expect(screen.getByText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/end date/i)).toBeInTheDocument();
  });
});
