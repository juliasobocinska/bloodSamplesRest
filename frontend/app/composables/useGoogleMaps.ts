let loadPromise: Promise<typeof google> | null = null

export function useGoogleMaps() {
  const config = useRuntimeConfig()

  function load(): Promise<typeof google> {
    if (loadPromise) return loadPromise

    loadPromise = new Promise((resolve, reject) => {
      if (window.google?.maps) return resolve(window.google)

      const script = document.createElement('script')
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsKey}&libraries=places&v=weekly`
      script.async = true
      script.onload = () => resolve(window.google)
      script.onerror = reject
      document.head.appendChild(script)
    })
    return loadPromise
  }

  return { load }
}