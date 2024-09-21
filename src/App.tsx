import Chart from "./Chart";
import Table from "./Table";
import useData from "./useData";
import "./App.css";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

const App = () => {
  const { data, loading } = useData();
  const [selectedMeasure, setSelectedMeasure] = useState("downloads");
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState("2020-01-07");

  const handleMeasure = (measure: string) => {
    setSelectedMeasure(measure);
  };

  return (
    <div className="container">
      <div>
        <p>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </p>
        <p>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </p>
        <div className="measures">
          <button
            className={`btn downloads ${selectedMeasure === "downloads" ? "selected" : ""}`}
            onClick={() => handleMeasure("downloads")}
          >
            Downloads
          </button>
          <button
            className={`btn revenue ${selectedMeasure === "revenue" ? "selected" : ""}`}
            onClick={() => setSelectedMeasure("revenue")}
          >
            Revenue
          </button>
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <Chart
            data={data}
            selectedMeasure={selectedMeasure}
            startDate={startDate}
            endDate={endDate}
            loading={loading}
          />
          <Table
            data={data}
            startDate={startDate}
            endDate={endDate}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default App;
