import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/dataUtils';
import DataTable from './DataTable';
import ErrorComponent from './ErrorComponent';

const DataComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result.error) {
        setError(result.error);
      } else {
        console.log("Data: ", result.data);
        console.log("Headers: ", result.headers);
        setData(result.data);
        setHeaders(result.headers);
      }
    };
    loadData();
  }, []);
  

  if (error) return <ErrorComponent error={error} />;

  return <DataTable data={data} headers={headers} />;
};

export default DataComponent;
