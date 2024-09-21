import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";
import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

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
      }, 2000);
      return () => clearTimeout(timer);
    }

    setIsLoading(false);
  }, [data, startDate, endDate, isValidDate]);

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

  if (showInvalidMessage) return null;

  const columns: GridColDef<RowProps>[] = [
    {
      field: "appName",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={row.icon}
            alt={row.appName}
            style={{ width: 35, height: 35, marginRight: 3 }}
          />
          {row.appName}
        </div>
      ),
      renderHeader: () => <strong>App Name</strong>,
      width: 150,
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
    { field: "rpd", renderHeader: () => <strong>RPD</strong>, width: 150 },
  ];

  const rows = data.map((appData) => {
    const filteredData = appData.data.filter(([date]) => {
      const dateMs = dayjsUtc(date).valueOf();
      return dateMs >= startMs && dateMs <= endMs;
    });

    const totalDownloads = filteredData.reduce(
      (total, curr) => total + curr[1],
      0,
    );
    const totalRevenue = filteredData.reduce(
      (total, curr) => total + curr[2],
      0,
    );
    const rpd =
      totalRevenue <= 0 || totalDownloads <= 0
        ? "-"
        : `$${(totalRevenue / totalDownloads / 100).toFixed(2)}`;

    return {
      id: appData.id,
      appName: appData.name,
      downloads: addCommas(totalDownloads),
      revenue: `$${addCommas(totalRevenue / 100)}`,
      rpd,
      icon: appData.icon,
    };
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
