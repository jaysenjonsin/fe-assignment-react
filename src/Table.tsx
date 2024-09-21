import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";
import { CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type TableProps = {
  data: Response;
  startDate: string;
  endDate: string;
  loading: boolean;
};

type RowProps = {
  id: number;
  appName: string;
  icon: string;
  downloads: string;
  revenue: string;
  rpd: string;
};

const addCommas = (x: number): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Table = ({ data, startDate, endDate, loading }: TableProps) => {
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validStartDate = dayjsUtc("2020-01-01").valueOf();
  const validEndDate = dayjsUtc("2020-01-07").valueOf();

  const startMs = useMemo(() => dayjsUtc(startDate).valueOf(), [startDate]);
  const endMs = useMemo(() => dayjsUtc(endDate).valueOf(), [endDate]);
  const isValidDate = (dateStr: string): boolean => {
    const date = dayjsUtc(dateStr);
    return (
      date.isValid() &&
      date.valueOf() >= validStartDate &&
      date.valueOf() <= validEndDate
    );
  };

  useEffect(() => {
    setIsLoading(true);
    setShowInvalidMessage(false);

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      const timer = setTimeout(() => {
        setShowInvalidMessage(true);
        setIsLoading(false);
      }, 2000); // 2 seconds delay for user typing

      return () => {
        clearTimeout(timer);
      };
    }

    setIsLoading(false);
  }, [data, startDate, endDate]);

  // Loading spinner
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

  // Render empty fragment if the date is invalid
  if (showInvalidMessage) {
    return <></>;
  }

  const columns: GridColDef<RowProps>[] = [
    {
      field: "appName",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={params.row.icon}
            alt=""
            style={{ width: 35, height: 35, marginRight: 3 }}
          />
          {params.row.appName}
        </div>
      ),
      renderHeader: () => <strong>App Name</strong>,
      width: 150,
      editable: true,
    },
    {
      field: "downloads",
      renderHeader: () => <strong>Downloads</strong>,
      width: 150,
    },
    {
      field: "revenue",
      renderHeader: () => <strong>Revenue</strong>,
      width: 150,
    },
    {
      field: "rpd",
      renderHeader: () => <strong>RPD</strong>,
      width: 150,
    },
  ];

  const rows = data.map((appData) => {
    // Filter based on date
    const filteredData = appData.data.filter(([date]) => {
      const dateMs = dayjsUtc(date).valueOf();
      return dateMs >= startMs && dateMs <= endMs;
    });

    const totalDownloads = filteredData.reduce((total, curr) => {
      return total + curr[1];
    }, 0);

    const totalRevenue = filteredData.reduce((total, curr) => {
      return total + curr[2];
    }, 0);

    const rpd =
      totalRevenue <= 0 || totalDownloads <= 0
        ? "-"
        : (totalRevenue / totalDownloads / 100).toFixed(2);

    const formattedDownloads = addCommas(totalDownloads);
    const formattedRevenue = addCommas(totalRevenue / 100);

    const row: RowProps = {
      id: appData.id,
      appName: appData.name,
      downloads: formattedDownloads,
      revenue: `$${formattedRevenue}`,
      rpd: rpd === "-" ? "-" : `$${rpd}`,
      icon: appData.icon,
    };
    return row;
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
