import { render, screen } from "@testing-library/react";
import Table from "./Table";
import type { Response } from "./types";

const mockData: Response = [
  {
    id: 1,
    name: "App 1",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 100, 200],
      ["2023-01-02", 200, 300],
    ],
  },
  {
    id: 2,
    name: "App 2",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 150, 250],
      ["2023-01-02", 250, 350],
    ],
  },
];

const mockMeasure = "revenue";
const mockStartDate = "2020-01-01";
const mockEndDate = "2020-01-07";

describe("Table", () => {
  it("renders a table", () => {
    render(
      <Table
        data={mockData}
        selectedMeasure={mockMeasure}
        startDate={mockStartDate}
        endDate={mockEndDate}
      />,
    );

    expect(screen.getByText("App Name")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
  });

  it("does not render a table if data is empty", () => {
    render(<Table data={[]} selectedMeasure="" startDate="" endDate="" />);

    expect(screen.queryByText("App Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Downloads")).not.toBeInTheDocument();
  });
});
