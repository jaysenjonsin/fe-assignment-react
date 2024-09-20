import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";
import { CircularProgress } from "@mui/material";

type TableProps = {
  data: Response;
  startDate: string;
  endDate: string;
  loading: boolean;
};

type RowProps = {
  id: number;
  appName: string;
  downloads: string;
  revenue: string;
  rpd: string;
};

const addCommas = (x: number): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Table = ({ data, startDate, endDate, loading }: TableProps) => {
  if (loading || !data.length) {
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

  const startMs = dayjsUtc(startDate).valueOf();
  const endMs = dayjsUtc(endDate).valueOf();

  const columns: GridColDef<RowProps>[] = [
    {
      field: "appName",
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
    const formattedRevenue = addCommas(totalRevenue);

    const row: RowProps = {
      id: appData.id,
      appName: appData.name,
      downloads: formattedDownloads,
      revenue: `$${formattedRevenue}`,
      rpd: rpd === "-" ? "-" : `$${rpd}`,
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
