import React, { useState, useEffect } from 'react';
import { BiSortAlt2, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { sortData } from '../utils/sortUtils';
import { groupDataByHeader } from '../utils/groupUtils';

const DataTable = ({ data, headers }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortDirection, setSortDirection] = useState({});
  const [groupedData, setGroupedData] = useState({});
  const [expandedRows, setExpandedRows] = useState(
    Object.keys(data).reduce((acc, groupValue) => {
      acc[groupValue] = false;
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firstHeader = headers[0];
    const grouped = groupDataByHeader(data, firstHeader);
    setGroupedData(grouped);
    setSortedData(data);
    setLoading(false);
  }, [data, headers]);

  const handleSort = (header, index) => {
    const direction = sortDirection[header] === 'asc' ? 'desc' : 'asc';
    setSortDirection({ [header]: direction });
    const sorted = sortData(sortedData, header, direction, index);
    setSortedData(sorted);
    const grouped = groupDataByHeader(sorted, headers[0]);
    setGroupedData(grouped);
  };

  const handleExpand = (value) => {
    setExpandedRows((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
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
          {loading ? (
            <tr>
              <td colSpan={headers.length}>Loading...</td>
            </tr>
          ) : (
            Object.keys(groupedData).map((groupValue) => (
              <React.Fragment key={groupValue}>
                <tr className="odd:bg-gray-100 even:bg-gray-50">
                  <td colSpan={headers.length} className="px-6 py-4 border border-gray-300 text-sm">
                    <span className="font-bold">{groupValue}</span> ({groupedData[groupValue].length} items)
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900"
                      onClick={() => handleExpand(groupValue)}
                    >
                      {expandedRows[groupValue] ? (
                        <BiChevronUp size={20} />
                      ) : (
                        <BiChevronDown size={20} />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRows[groupValue] &&
                  groupedData[groupValue].map((row, rowIndex) => (
                    <tr key={rowIndex} className="odd:bg-gray-100 even:bg-gray-50">
                      {headers.map((headerKey, idx) => (
                        <td
                          key={idx}
                          className={`px-6 py-4 border border-gray-300 text-sm ${idx >= 5 && row[headerKey] >= 3
                            ? 'green font-bold'
                            : row[headerKey] < 0
                              ? 'red font-bold'
                              : row[headerKey] >= 1 && row[headerKey] < 3
                                ? 'orange font-bold'
                                : 'text-gray-700'
                          }`}
                        >
                          {idx >= 5
                            ? row[headerKey] === 0
                              ? ''
                              : row[headerKey] >= 3
                                ? 'S'
                                : row[headerKey] < 0
                                  ? 'W'
                                  : 'SW'
                            : row[headerKey]}
                        </td>
                      ))}
                    </tr>
                  ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;