import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSortAlt2 } from 'react-icons/bi';

const DATA_URL = '../../data.json';

const fetchAndProcessData = async () => {
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
    const filteredData = data.map((row) => {
      const { url, IMAGE, TITLE, DESCRIPTION, KEYWORDS, Column1, ...filteredRow } = row;
      return filteredRow;
    });
    const headers = Object.keys(filteredData[0]).filter(
      (key) => key !== 'SHELTER ASSISTANCE TYPES' && key !== 'SUPPORT METHODS'
    );
    return { data: filteredData, headers };
  } catch (error) {
    return { error };
  }
};

const DataTable = ({ data, headers }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortDirection, setSortDirection] = useState({});

  const handleSort = (header, index) => {
    const direction = sortDirection[header] === 'asc' ? 'desc' : 'asc';
    setSortDirection({ [header]: direction });
  
    let sortedData;
  
    if (index < 5) {
      sortedData = data.sort((a, b) => {
        if (a[header] === 0 && b[header] !== 0) return direction === 'asc' ? -1 : 1;
        if (a[header] !== 0 && b[header] === 0) return direction === 'asc' ? 1 : -1;
        if (direction === 'asc') {
          return a[header] > b[header] ? 1 : -1;
        } else {
          return a[header] < b[header] ? 1 : -1;
        }
      });
    } else {
      const sortOrder = direction === 'asc' ? ['S', 'SW', 'W', ''] : ['W', 'SW', 'S',''];
      sortedData = data.sort((a, b) => {
        const aValue = a[header] === 0 ? '' : a[header] >= 3 ? 'S' : a[header] < 0 ? 'W' : 'SW';
        const bValue = b[header] === 0 ? '' : b[header] >= 3 ? 'S' : b[header] < 0 ? 'W' : 'SW';
        return sortOrder.indexOf(aValue) - sortOrder.indexOf(bValue);
      });
    }
  
    setSortedData(sortedData);
  };

  useEffect(() => {
    const sortedData = data.slice();
    headers.forEach((header, index) => {
      if (index >= 5) {
        sortedData.sort((a, b) => {
          const aValue = a[header] === 'S' ? 2 : a[header] === 'SW' ? 1 : 0;
          const bValue = b[header] === 'S' ? 2 : b[header] === 'SW' ? 1 : 0;
          return aValue > bValue ? 1 : -1;
        });
      }
    });
    setSortedData(sortedData);
  }, [data, headers]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-6 py-4 border-r text-left font-semibold text-gray-700 ${index >= 5 ? 'font-normal' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {header}
                  <BiSortAlt2
                    size={24}
                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                    onClick={() => handleSort(header, index)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-gray-100 even:bg-gray-50">
              {headers.map((header, index) => (
                <td
                  key={index}
                  className={`px-6 py-4 border border-gray-300 text-sm ${
                    index >= 5 && row[header] >= 3
                      ? 'green font-bold'
                      : row[header] < 0
                      ? 'red font-bold'
                      : row[header] >= 1 && row[header] < 3
                      ? 'orange font-bold'
                      : 'text-gray-700'
                  }`}
                >
                  {index >= 5
                    ? row[header] === 0
                      ? ''
                      : row[header] >= 3
                      ? 'S'
                      : row[header] < 0
                      ? 'W'
                      : 'SW'
                    : row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ErrorComponent = ({ error }) => {
  return <div className="text-red-600 text-lg font-semibold">Error: {error.message}</div>;
};

const DataComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAndProcessData();
        if (result.error) {
          setError(result.error);
        } else {
          setData(result.data);
          setHeaders(result.headers);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return <DataTable data={data} headers={headers} />;
};

export default DataComponent;
