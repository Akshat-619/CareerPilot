const GEOAPIFY_URL =
  'https://api.geoapify.com/v1/geocode/autocomplete';

export const searchLocations = async (
  query,
  signal
) => {
  const apiKey =
    import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error(
      'VITE_GEOAPIFY_API_KEY is missing.'
    );
  }

  const cleanQuery = query?.trim();

  if (!cleanQuery || cleanQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    text: cleanQuery,
    type: 'city',
    limit: '6',
    lang: 'en',
    format: 'json',
    apiKey,
  });

  const response = await fetch(
    `${GEOAPIFY_URL}?${params.toString()}`,
    {
      method: 'GET',
      signal,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Geoapify request failed: ${response.status}`
    );
  }

  let results = [];

  if (Array.isArray(data.results)) {
    results = data.results;
  }

  if (Array.isArray(data.features)) {
    results = data.features.map(
      (feature) => feature.properties || {}
    );
  }

  return results
    .map((location) => ({
      id:
        location.place_id ||
        `${location.lat}-${location.lon}-${location.formatted}`,

      city:
        location.city ||
        location.name ||
        '',

      state:
        location.state ||
        '',

      country:
        location.country ||
        '',

      countryCode:
        location.country_code ||
        '',

      lat: location.lat,

      lon: location.lon,

      formatted:
        location.formatted ||
        [
          location.city ||
            location.name,
          location.state,
          location.country,
        ]
          .filter(Boolean)
          .join(', '),
    }))
    .filter(
      (location) =>
        location.city ||
        location.formatted
    );
};