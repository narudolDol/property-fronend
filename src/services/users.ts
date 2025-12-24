import type { User } from '../types/user'
import apiClient from './apiClient'

export async function getUsers(): Promise<User[]> {
  const res = await apiClient.get<User[]>('/users')
  return res.data
}


