import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { GetGoogleInfosReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetGoogleInfosReturnType | { error: string }>
) {
  if (req.method !== 'GET') return res.status(HttpStatus.MethodNotAllowed).json({ error: 'Method not allowed' });

  const { title } = req.query;

  if (!title) return res.status(HttpStatus.BadRequest).json({ error: 'title is required' });

  try {
    // Get Place ID based on title
    const placeIdRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: title,
        key: process.env.NEXT_PRIVATE_GOOGLE_API_KEY,
      },
    });

    const placeId = placeIdRes.data.results[0]?.place_id;
    if (!placeId) return res.status(HttpStatus.BadRequest).json({ error: 'Failed to fetch place ID' });

    // Fetch place details
    const detailsRes = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.NEXT_PRIVATE_GOOGLE_API_KEY,
        fields:
          'address_component,adr_address,business_status,formatted_address,geometry,icon,icon_background_color,icon_mask_base_uri,name,photo,place_id,plus_code,type,url,utc_offset,vicinity,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,reviews,user_ratings_total,scope,permanently_closed,reservable,serves_beer,serves_breakfast,serves_brunch,serves_dinner,serves_lunch,serves_vegetarian_food,takeout',
        language: 'zh-TW',
      },
    });

    const placeData = detailsRes.data.result;

    // Check if placeData is valid
    if (!placeData) return res.status(HttpStatus.BadRequest).json({ error: 'Failed to fetch place details' });

    // Extract all fields with default values if undefined
    const {
      address_components = [],
      adr_address = '',
      business_status = '',
      formatted_address = '',
      geometry = null,
      icon = '',
      icon_background_color = '',
      icon_mask_base_uri = '',
      name = '',
      photos = [],
      place_id: fetchedPlaceId = '',
      plus_code = null,
      types = [],
      url = '',
      utc_offset = 0,
      vicinity = '',
      formatted_phone_number = '',
      international_phone_number = '',
      opening_hours = null,
      website = '',
      price_level = null,
      rating = 0,
      reviews = [],
      user_ratings_total = 0,
      scope = '',
      permanently_closed = false,
      reservable = false,
      serves_beer = false,
      serves_breakfast = false,
      serves_brunch = false,
      serves_dinner = false,
      serves_lunch = false,
      serves_vegetarian_food = false,
      takeout = false,
    } = placeData;

    // Return all requested fields in the response
    return res.status(HttpStatus.Ok).json({
      address_components,
      adr_address,
      business_status,
      formatted_address,
      geometry,
      icon,
      icon_background_color,
      icon_mask_base_uri,
      name,
      photos,
      place_id: fetchedPlaceId,
      plus_code,
      types,
      url,
      utc_offset,
      vicinity,
      formatted_phone_number,
      international_phone_number,
      opening_hours,
      website,
      price_level,
      rating,
      reviews,
      user_ratings_total,
      scope,
      permanently_closed,
      reservable,
      serves_beer,
      serves_breakfast,
      serves_brunch,
      serves_dinner,
      serves_lunch,
      serves_vegetarian_food,
      takeout,
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return res.status(HttpStatus.InternalServerError).json({ error: 'Failed to fetch reviews' });
  }
}
