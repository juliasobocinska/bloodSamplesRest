<template>
  <div>
    <label>Adres dostawy próbek:</label>
    <div ref="container"></div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  selected: [address: { formatted: string; lat: number; lng: number }]
}>()

const container = ref<HTMLElement>()
const { load } = useGoogleMaps()

onMounted(async () => {
  const google = await load()
  const { PlaceAutocompleteElement } = await google.maps.importLibrary('places') as any

  const pac = new PlaceAutocompleteElement({
    componentRestrictions: { country: ['pl'] },
    types: ['address'],
  })
  container.value!.appendChild(pac)

  pac.addEventListener('gmp-select', async ({ placePrediction }: any) => {
    const place = placePrediction.toPlace()
    await place.fetchFields({ fields: ['formattedAddress', 'location'] })

    emit('selected', {
      formatted: place.formattedAddress,
      lat: place.location.lat(),
      lng: place.location.lng(),
    })
  })
})
</script>