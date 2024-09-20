import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
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
        data: filteredSeries.map(([date, downloads, revenue]) => {
          const dateMs = dayjsUtc(date).valueOf();
          const yValue = selectedMeasure === "downloads" ? downloads : revenue;
          return {
            x: dateMs,
            y: yValue,
          };
        }),
      };
    });

    setSeriesData(filteredData);
  }, [data, startDate, endDate, selectedMeasure]);

  if (loading || !seriesData.length) {
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
      labels: {
        format: "{value:%b %d, '%y}",
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
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
