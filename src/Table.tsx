import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";

type TableProps = {
  data: Response;
  selectedMeasure: string;
  startDate: string;
  endDate: string;
};

type RowProps = {
  id: number;
  appName: string;
  downloads: number | string;
  revenue: number | string;
  rpd: string;
};

const addCommas = (x: number): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const calculateRPD = (revenue: number, downloads: number) => {
  if (downloads === 0 || revenue === 0) return "-";
  else return revenue / downloads;
};

const Table = ({ data, selectedMeasure, startDate, endDate }: TableProps) => {
  if (!data.length) {
    return null;
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
      rpd: `$${rpd}`,
    };
    return row;
  });

  // const rows = data.map((appData) => {
  //   const totalDownloads = appData.data.reduce((total, curr) => {
  //     return total + curr[1];
  //   }, 0);
  //   const formatedDownloads = addCommas(totalDownloads);
  //   const formattedRevenue = addCommas(
  //     appData.data[appData.data.length - 1][2],
  //   );

  //   const row: RowProps = {
  //     id: appData.id,
  //     appName: appData.name,
  //     downloads: formatedDownloads,
  //     revenue: `$${formattedRevenue}`,
  //     rpd: "",
  //   };
  //   return row;
  // });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
