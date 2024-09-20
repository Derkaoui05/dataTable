import axios from 'axios';

const DATA_URL = '../../data.json';

export const fetchData = async () => {
  try {
    const response = await axios.get(DATA_URL);
    const rawData = response.data;

    const processedData = rawData.map(({ url, IMAGE, TITLE, DESCRIPTION, KEYWORDS, Column1, ...filteredRow }) => filteredRow);

    const headers = Object.keys(processedData[0]).filter(
      (key) => key !== 'SHELTER ASSISTANCE TYPES' && key !== 'SUPPORT METHODS'
    );

    return { data: processedData, headers };
  } catch (error) {
    return { error };
  }
};
