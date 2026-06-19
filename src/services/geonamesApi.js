// GeoNames API Service
// Free account: https://www.geonames.org/login
// Replace 'demo' with your username after registering
const GEONAMES_USER = 'demo';
const BASE_URL = 'http://api.geonames.org';

// Search cities by name or country
export const searchCities = async (query, country = '') => {
  try {
    const params = new URLSearchParams({
      q: query,
      maxRows: 20,
      username: GEONAMES_USER,
      featureClass: 'P',
      orderby: 'population',
      style: 'FULL',
    });

    if (country) params.append('country', country);

    const response = await fetch(`${BASE_URL}/searchJSON?${params}`);
    const data = await response.json();

    if (data.geonames) {
      return data.geonames.map(formatCity);
    }
    return [];
  } catch (error) {
    console.error('Error searching cities:', error);
    // Return mock data as fallback for demo
    return getMockCities(query);
  }
};

// Get city details by geonameId
export const getCityDetails = async (geonameId) => {
  try {
    const params = new URLSearchParams({
      geonameId,
      username: GEONAMES_USER,
    });

    const response = await fetch(`${BASE_URL}/getJSON?${params}`);
    const data = await response.json();
    return formatCity(data);
  } catch (error) {
    console.error('Error fetching city details:', error);
    return null;
  }
};

// Get nearby places / points of interest
export const getNearbyPOI = async (lat, lng) => {
  try {
    const params = new URLSearchParams({
      lat,
      lng,
      radius: 10,
      maxRows: 10,
      username: GEONAMES_USER,
    });

    const response = await fetch(`${BASE_URL}/findNearbyWikipediaJSON?${params}`);
    const data = await response.json();
    return data.geonames || [];
  } catch (error) {
    console.error('Error fetching POI:', error);
    return getMockPOI();
  }
};

// Get popular cities (featured)
export const getPopularCities = async () => {
  try {
    const popularNames = ['Paris', 'Tokyo', 'New York', 'London', 'Sydney', 'Dubai'];
    const promises = popularNames.map(name =>
      searchCities(name).then(results => results[0]).catch(() => null)
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (error) {
    return getMockCities('');
  }
};

const formatCity = (city) => ({
  id: city.geonameId?.toString() || Math.random().toString(36).substr(2, 9),
  name: city.name || city.toponymName,
  country: city.countryName || city.countryCode,
  countryCode: city.countryCode,
  population: city.population || 0,
  lat: city.lat,
  lng: city.lng,
  timezone: city.timezone?.timeZoneId || '',
  adminName: city.adminName1 || '',
  continent: city.continentCode || '',
  elevation: city.elevation || 0,
  flag: getCountryFlag(city.countryCode),
});

const getCountryFlag = (countryCode) => {
  if (!countryCode) return '🌍';
  const codePoints = [...countryCode.toUpperCase()].map(
    char => 127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
};

// Mock data fallback
const getMockCities = (query) => [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    population: 2161000,
    lat: '48.8534',
    lng: '2.3488',
    timezone: 'Europe/Paris',
    adminName: 'Île-de-France',
    continent: 'EU',
    elevation: 42,
    flag: '🇫🇷',
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    population: 13960000,
    lat: '35.6895',
    lng: '139.6917',
    timezone: 'Asia/Tokyo',
    adminName: 'Tokyo-to',
    continent: 'AS',
    elevation: 44,
    flag: '🇯🇵',
  },
  {
    id: '3',
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    population: 8175133,
    lat: '40.7143',
    lng: '-74.006',
    timezone: 'America/New_York',
    adminName: 'New York',
    continent: 'NA',
    elevation: 10,
    flag: '🇺🇸',
  },
  {
    id: '4',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    population: 7556900,
    lat: '51.5085',
    lng: '-0.1257',
    timezone: 'Europe/London',
    adminName: 'England',
    continent: 'EU',
    elevation: 25,
    flag: '🇬🇧',
  },
  {
    id: '5',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    population: 4627345,
    lat: '-33.8678',
    lng: '151.2073',
    timezone: 'Australia/Sydney',
    adminName: 'New South Wales',
    continent: 'OC',
    elevation: 58,
    flag: '🇦🇺',
  },
  {
    id: '6',
    name: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    population: 2106177,
    lat: '25.0657',
    lng: '55.1713',
    timezone: 'Asia/Dubai',
    adminName: 'Dubai',
    continent: 'AS',
    elevation: 5,
    flag: '🇦🇪',
  },
  {
    id: '7',
    name: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    population: 1615448,
    lat: '41.3825',
    lng: '2.1769',
    timezone: 'Europe/Madrid',
    adminName: 'Catalonia',
    continent: 'EU',
    elevation: 12,
    flag: '🇪🇸',
  },
  {
    id: '8',
    name: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    population: 11895893,
    lat: '-23.5475',
    lng: '-46.6361',
    timezone: 'America/Sao_Paulo',
    adminName: 'São Paulo',
    continent: 'SA',
    elevation: 769,
    flag: '🇧🇷',
  },
];

const getMockPOI = () => [
  { title: 'Eiffel Tower', summary: 'Iconic iron lattice tower on the Champ de Mars', lat: '48.8584', lng: '2.2945' },
  { title: 'Louvre Museum', summary: 'World\'s largest art museum', lat: '48.8606', lng: '2.3376' },
  { title: 'Notre-Dame Cathedral', summary: 'Medieval Catholic cathedral', lat: '48.853', lng: '2.3499' },
];
