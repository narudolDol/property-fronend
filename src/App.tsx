import { useCallback, useEffect, useMemo, useState } from 'react'
import { Heart, Home } from 'lucide-react'
import { PropertyList } from './components/PropertyList'
import { UserSelector } from './components/UserSelector'
import { getFavorites, toggleFavorite } from './services/favorites'
import { getProperties } from './services/properties'
import { getUsers } from './services/users'
import type { Property } from './types/property'
import type { User } from './types/user'

function formatCount(count: number) {
  return new Intl.NumberFormat('en-US').format(count)
}

export default function App() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [favoriteRequestInFlight, setFavoriteRequestInFlight] = useState(false)
  const [favoritesError, setFavoritesError] = useState<string | null>(null)

  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [propertiesData, usersData] = await Promise.all([getProperties(), getUsers()])
      setProperties(propertiesData)
      setUsers(usersData)
    } catch (e) {
      setProperties([])
      setUsers([])
      setLoadError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  useEffect(() => {
    let cancelled = false

    async function loadFavorites() {
      if (!selectedUserId) {
        setFavoritesError(null)
        setFavoriteIds([])
        return
      }

      try {
        setFavoritesError(null)
        const ids = await getFavorites(selectedUserId)
        if (!cancelled) setFavoriteIds(ids)
      } catch (e) {
        if (!cancelled) {
          setFavoriteIds([])
          setFavoritesError(e instanceof Error ? e.message : 'Failed to load favorites')
        }
      }
    }

    void loadFavorites()
    return () => {
      cancelled = true
    }
  }, [selectedUserId])

  const favoritesForSelectedUser = useMemo(() => {
    if (!selectedUserId) return new Set<string>()
    return new Set(favoriteIds)
  }, [favoriteIds, selectedUserId])

  const favoriteDisabled = !selectedUserId || favoriteRequestInFlight

  const onToggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!selectedUserId) return

      try {
        setFavoritesError(null)
        setFavoriteRequestInFlight(true)
        const updated = await toggleFavorite(selectedUserId, propertyId)
        setFavoriteIds(updated)
      } catch (e) {
        setFavoritesError(e instanceof Error ? e.message : 'Failed to update favorites')
      } finally {
        setFavoriteRequestInFlight(false)
      }
    },
    [selectedUserId],
  )

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Top bar */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500 text-white shadow-sm">
            <Home aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold text-zinc-900">DEMO PROPERTY</p>
            <p className="text-xs text-zinc-500">Find your perfect home</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        {loadError ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Backend is not reachable</p>
                <p className="mt-1 text-rose-800/90">{loadError}</p>
              </div>
              <button
                type="button"
                onClick={() => void loadInitialData()}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:bg-rose-800"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        {/* User selector card */}
        <UserSelector users={users} value={selectedUserId} onChange={setSelectedUserId} />
        {!selectedUserId ? (
          <div
            className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900"
            role="status"
          >
            Select a user above to enable favorites.
          </div>
        ) : null}
        {favoritesError && selectedUserId ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-900">
            {favoritesError}
          </div>
        ) : null}

        {/* Section header */}
        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Featured Properties</h2>
              <p className="mt-1 text-sm text-zinc-500">Discover your next home from our curated selection</p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
              <Heart aria-hidden="true" className="h-4 w-4" fill="currentColor" />
              <span>{formatCount(favoritesForSelectedUser.size)} favorites</span>
            </div>
          </div>

          <div className="mt-8">
            <PropertyList
              properties={properties}
              isLoading={isLoading}
              favorites={favoritesForSelectedUser}
              favoriteDisabled={favoriteDisabled}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

        </section>
      </main>
    </div>
  )
}
