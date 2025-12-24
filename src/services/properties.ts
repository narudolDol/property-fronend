import type { Property } from '../types/property'
import apiClient from './apiClient'

export async function getProperties(): Promise<Property[]> {
  const res = await apiClient.get<Property[]>('/properties')
  return res.data
}


