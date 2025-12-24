import apiClient from './apiClient'

export async function getFavorites(userId: string): Promise<string[]> {
  const res = await apiClient.get(`/favorites/${encodeURIComponent(userId)}`)
  return res.data
}

export async function toggleFavorite(userId: string, propertyId: string): Promise<string[]> {
  const res = await apiClient.post(`/favorites/${encodeURIComponent(userId)}`, { propertyId })
  return res.data
}


