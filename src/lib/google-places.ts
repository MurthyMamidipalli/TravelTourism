
'use server';

/**
 * @fileOverview Service for interacting with the Google Places API (New).
 * Fetches attractions and place details dynamically.
 */

export async function getCityAttractions(cityName: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // Fallback for development if no API key is provided
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.warn('GOOGLE_PLACES_API_KEY is missing. Using fallback mock data.');
    return [
      {
        id: 'fallback-1',
        displayName: { text: `Top Landmark in ${cityName}` },
        rating: 4.9,
        editorialSummary: { text: 'A breathtaking historical site known for its unique architecture and vibrant history.' },
        formattedAddress: `${cityName}, Center District`,
        types: ['tourist_attraction', 'historical_landmark'],
      },
      {
        id: 'fallback-2',
        displayName: { text: `${cityName} Grand Park` },
        rating: 4.7,
        editorialSummary: { text: 'The largest green space in the city, perfect for afternoon walks and photography.' },
        formattedAddress: `${cityName}, East Side`,
        types: ['park', 'tourist_attraction'],
      },
      {
        id: 'fallback-3',
        displayName: { text: 'Central Museum of Art' },
        rating: 4.8,
        editorialSummary: { text: 'Housing some of the worlds most famous contemporary and classical art pieces.' },
        formattedAddress: `${cityName}, Museum Row`,
        types: ['museum', 'tourist_attraction'],
      }
    ];
  }

  try {
    // Using the Text Search (New) endpoint
    // https://developers.google.com/maps/documentation/places/web-service/text-search
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.types,places.editorialSummary,places.photos',
      },
      body: JSON.stringify({
        textQuery: `top tourist attractions and landmarks in ${cityName}`,
        maxResultCount: 12,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Places API Error:', errorData);
      throw new Error('Failed to fetch from Google Places');
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Places API Integration Error:', error);
    return [];
  }
}

/**
 * Fetches specific details for a place using its ID, as requested by the user.
 */
export async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY') return null;

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=addressComponents,displayName,formattedAddress,location,rating,editorialSummary&key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}
