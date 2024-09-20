export const sortData = (data, header, direction, index) => {
  return [...data].sort((a, b) => {
    const aValue = a[header] ?? '';
    const bValue = b[header] ?? '';

    if (index < 5) {
      if (typeof aValue === 'string' || typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    } else {
      const order = direction === 'asc' ? ['S', 'SW', 'W', ''] : ['W', 'SW', 'S', ''];
      const getOrderValue = (val) => (val === 0 ? '' : val >= 3 ? 'S' : val < 0 ? 'W' : 'SW');
      const aSortValue = getOrderValue(aValue);
      const bSortValue = getOrderValue(bValue);
      return order.indexOf(aSortValue) - order.indexOf(bSortValue);
    }
  });
};
