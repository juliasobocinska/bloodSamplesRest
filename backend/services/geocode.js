const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

 async function validateAddress(formatted) {
  const url = `${GEOCODE_URL}?address=${encodeURIComponent(formatted)}` +
              `&region=pl&key=${process.env.GMAPS_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding API error')

  const data = await res.json()
  if (data.status !== 'OK' || !data.results.length) {
    return { valid: false }
  }

  const r = data.results[0]
  return {
    valid: true,
    formatted: r.formatted_address,
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
  }
}

module.exports = { validateAddress }