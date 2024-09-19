import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    } catch (err) {
        return { error: err };
    }
};

const DataTable = ({ data, headers }) => {
    return (
    <div className='mb-8'>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-8 py-4 border border-gray-400 ${index >= 5 ? 'rotate-[-68deg] font-normal ' : ''
                  }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-gray-700 odd:bg-gray-100">
              {headers.map((header, index) => (
                <td
                  key={index}
                  className={`px-4 py-3  border border-gray-400 ${index >= 5 && row[header] >= 3 ? 'green' :
                    row[header] < 0 ? 'red' :
                      row[header] >= 1 && row[header] < 3 ? 'orange' : ''
                  }`}
                >
                  {index >= 5 ? (
                    row[header] === 0 ? '' : (
                      row[header] >= 3 ? 'S' :
                        row[header] < 0 ? 'W' :
                          'SW'
                    )
                  ) : (
                    row[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  };


const Other = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [headers, setHeaders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAndProcessData();
            if (result.error) {
                setError(result.error);
            } else {
                setData(result.data);
                setHeaders(result.headers);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <ErrorComponent error={error} />;
    }

    return <DataTable data={data} headers={headers} />;
};

const ErrorComponent = ({ error }) => {
    return <div>Error: {error.message}</div>;
};

export default Other;




