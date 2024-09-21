import { useCallback, useEffect, useRef, useState } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";
import { CircularProgress } from "@mui/material";

type ChartProps = {
  data: Response;
  selectedMeasure: string;
  startDate: string;
  endDate: string;
  loading: boolean;
};

const Chart = ({
  data,
  selectedMeasure,
  startDate,
  endDate,
  loading,
}: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [seriesData, setSeriesData] = useState<Highcharts.SeriesOptionsType[]>(
    [],
  );
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validStartDate = dayjsUtc("2020-01-01").valueOf();
  const validEndDate = dayjsUtc("2020-01-07").valueOf();

  const isValidDate = useCallback(
    (dateStr: string): boolean => {
      const date = dayjsUtc(dateStr);
      return (
        date.isValid() &&
        date.valueOf() >= validStartDate &&
        date.valueOf() <= validEndDate
      );
    },
    [validStartDate, validEndDate],
  );

  useEffect(() => {
    setIsLoading(true);
    setShowInvalidMessage(false);

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      const timer = setTimeout(() => {
        setShowInvalidMessage(true);
        setIsLoading(false);
        setSeriesData([]);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const startMs = dayjsUtc(startDate).valueOf();
    const endMs = dayjsUtc(endDate).valueOf();

    const filteredData: Highcharts.SeriesOptionsType[] = data.map((series) => {
      const filteredSeries = series.data.filter(([date]) => {
        const dateMs = dayjsUtc(date).valueOf();
        return dateMs >= startMs && dateMs <= endMs;
      });

      return {
        name: series.name,
        type: "line",
        data: filteredSeries.map(([date, downloads, revenue]) => ({
          x: dayjsUtc(date).valueOf(),
          y: selectedMeasure === "downloads" ? downloads : revenue,
        })),
      };
    });

    setSeriesData(filteredData);
    setIsLoading(false);
  }, [data, startDate, endDate, selectedMeasure, isValidDate]);

  if (loading || isLoading) {
    return (
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
    );
  }

  if (showInvalidMessage) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
          fontSize: "20px",
        }}
      >
        Not a valid date. Please select a date between 01-01-2020 and
        01-07-2020.
      </div>
    );
  }

  const options: Highcharts.Options = {
    title: {
      text: `${selectedMeasure === "downloads" ? "Downloads" : "Revenue"} by App`,
    },
    subtitle: {
      text: `${dayjsUtc(startDate).format("MMM DD, YYYY")} - ${dayjsUtc(endDate).format("MMM DD, YYYY")}`,
    },
    yAxis: {
      title: {
        text: selectedMeasure === "downloads" ? "Downloads" : "Revenue ($)",
      },
    },
    xAxis: {
      type: "datetime",
      labels: { format: "{value:%b %d, %y}" },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    plotOptions: {
      series: {
        marker: { enabled: false, states: { hover: { enabled: false } } },
      },
    },
    series: seriesData,
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
    />
  );
};

export default Chart;
