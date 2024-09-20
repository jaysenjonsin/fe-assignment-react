import { useState, useEffect } from "react";
import type { Response } from "./types";

const domain = "http://localhost:3000";

const useData = () => {
  const [data, setData] = useState<Response>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate delay with setTimeout
        setTimeout(async () => {
          const response = await fetch(`${domain}/data.json`);
          const jsonData = await response.json();
          setData(jsonData);
        }, 2000);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};

export default useData;
