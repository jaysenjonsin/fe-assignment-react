import Chart from "./Chart";
import Table from "./Table";
import useData from "./useData";
import "./App.css";
import { useState } from "react";

const App = () => {
  const data = useData();
  const [selectedMeasure, setSelectedMeasure] = useState("downloads");

  const handleMeasure = (measure: string) => {
    setSelectedMeasure(measure);
  };

  return (
    <div className="container">
      <div>
        <p>
          Start Date: <input value="2020-01-01" />
        </p>
        <p>
          End Date: <input value="2020-01-07" />
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
      <Chart data={data} measure={selectedMeasure} />
      <Table data={data} measure={selectedMeasure} />
    </div>
  );
};

export default App;
