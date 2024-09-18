import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('../../data.json');
        const newData = response.data;
        const filteredData = newData.map((row) => {
          const { url, IMAGE, TITLE, DESCRIPTION, KEYWORDS, ...filteredRow } = row;
          return filteredRow;
        });
        setData(filteredData);
        const newHeaders = Object.keys(filteredData[0]).filter(
          (key) => key !== 'SHELTER ASSISTANCE TYPES' && key !== 'SUPPORT METHODS'
        );
        setHeaders(newHeaders);
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {/* device */}
      <div className="block md:hidden">
        <table className="min-w-full divide-y-2  divide-slate-200 bg-gray-200">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className='whitespace-nowrap  px-2 py-2 font-bold text-sm text-gray-900 md:text-lg'>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs md:text-sm">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-gray-50">
                {headers.map((header, index) => (
                  <td className='whitespace-nowrap px-2 py-2 text-gray-700' key={index}>
                    {row[header] ?? 'notFound'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* desktopp */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="max-w-full divide-y-2  divide-slate-200 bg-gray-200">
            <thead>
              <tr> 
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`whitespace-nowrap border-r border-r-slate-500 px-2 py-2 font-bold text-sm text-gray-900 md:text-lg ${index >= 5 ? 'another' : ''}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs md:text-sm">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-gray-50">
                  {headers.map((header, index) => (
                    <td
                      key={index}
                      className={`whitespace-nowrap  border-r border-r-slate-500 px-2 py-2 text-gray-700`}>
                      {row[header] ?? 'notFound'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DataTable;