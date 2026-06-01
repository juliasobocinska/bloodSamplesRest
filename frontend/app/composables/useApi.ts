export const useApi = () => {
  const tokenCookie = useCookie('auth_token')

  const apiFetch = async <T>(
    url: string,
    options: Parameters<typeof $fetch<T>>[1] = {}
  ): Promise<T> => {
    const token = tokenCookie.value

    if (!token) {
      throw new Error('No auth token')
    }

    return $fetch<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return { apiFetch }
}