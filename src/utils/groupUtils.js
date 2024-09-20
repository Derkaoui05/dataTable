export const groupDataByHeader = (data, firstHeader) => {
    return data.reduce((acc, row) => {
      const value = row[firstHeader];
      if (!acc[value]) {
        acc[value] = [];
      }
      acc[value].push(row);
      return acc;
    }, {});
  };
  