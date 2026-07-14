import { ref } from 'vue'

export function useUrlShortener() {
  const shortUrl = ref('')
  const isLoading = ref(false)
  const error = ref('')

  async function shortenUrl(longUrl: string): Promise<string | null> {
    if (!longUrl) {
      error.value = 'URL tidak boleh kosong'
      return null
    }

    isLoading.value = true
    error.value = ''
    shortUrl.value = ''

    try {
      const encoded = encodeURIComponent(longUrl)
      const response = await fetch(
        `https://is.gd/create.php?format=json&url=${encoded}`
      )
      const data = await response.json()

      if (data.errorcode) {
        error.value = data.errormessage || 'Gagal memperpendek URL'
        return null
      } else {
        shortUrl.value = data.shorturl
        return data.shorturl
      }
    } catch (err) {
      error.value = 'Network error. Coba lagi.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    shortUrl.value = ''
    error.value = ''
    isLoading.value = false
  }

  return {
    shortUrl,
    isLoading,
    error,
    shortenUrl,
    reset
  }
}
