// =====================================================
// CHILLD COFFEE — Cafe Locations
// =====================================================

export const LOCATIONS = [
  {
    id: 'loc001',
    name: 'Chilld Coffee — Indiranagar',
    shortName: 'Indiranagar',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    pincode: '560038',
    lat: 12.9784,
    lng: 77.6408,
    phone: '+91 98765 43210',
    hours: '7:00 AM – 10:00 PM',
    tablesCount: 16,
    hasDineIn: true,
    hasTakeaway: true,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=85&auto=format&fit=crop',
    tags: ['flagship', 'pet-friendly'],
  },
  {
    id: 'loc002',
    name: 'Chilld Coffee — Koramangala',
    shortName: 'Koramangala',
    address: '5th Block, 80 Feet Road, Koramangala, Bengaluru',
    city: 'Bengaluru',
    pincode: '560034',
    lat: 12.9352,
    lng: 77.6245,
    phone: '+91 98765 43211',
    hours: '7:00 AM – 11:00 PM',
    tablesCount: 20,
    hasDineIn: true,
    hasTakeaway: true,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=85&auto=format&fit=crop',
    tags: ['late-night', 'co-working'],
  },
  {
    id: 'loc003',
    name: 'Chilld Coffee — HSR Layout',
    shortName: 'HSR Layout',
    address: '27th Main, Sector 2, HSR Layout, Bengaluru',
    city: 'Bengaluru',
    pincode: '560102',
    lat: 12.9116,
    lng: 77.6412,
    phone: '+91 98765 43212',
    hours: '7:30 AM – 10:00 PM',
    tablesCount: 12,
    hasDineIn: true,
    hasTakeaway: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85&auto=format&fit=crop',
    tags: ['cozy', 'rooftop'],
  },
  {
    id: 'loc004',
    name: 'Chilld Coffee — Whitefield',
    shortName: 'Whitefield',
    address: 'ITPL Main Road, Whitefield, Bengaluru',
    city: 'Bengaluru',
    pincode: '560066',
    lat: 12.9698,
    lng: 77.7499,
    phone: '+91 98765 43213',
    hours: '7:00 AM – 9:30 PM',
    tablesCount: 18,
    hasDineIn: true,
    hasTakeaway: true,
    image: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=85&auto=format&fit=crop',
    tags: ['tech-hub', 'spacious'],
  },
  {
    id: 'loc005',
    name: 'Chilld Coffee — MG Road',
    shortName: 'MG Road',
    address: 'Trinity Circle, MG Road, Bengaluru',
    city: 'Bengaluru',
    pincode: '560001',
    lat: 12.9762,
    lng: 77.6033,
    phone: '+91 98765 43214',
    hours: '8:00 AM – 10:00 PM',
    tablesCount: 14,
    hasDineIn: true,
    hasTakeaway: true,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85&auto=format&fit=crop',
    tags: ['central', 'busy'],
  },
];

// Calculate distance between two lat/lng points (Haversine formula)
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getLocationsWithDistance(userLat, userLng) {
  return LOCATIONS.map((loc) => ({
    ...loc,
    distance: getDistance(userLat, userLng, loc.lat, loc.lng),
  })).sort((a, b) => a.distance - b.distance);
}

export const getLocationById = (id) => LOCATIONS.find((l) => l.id === id);
