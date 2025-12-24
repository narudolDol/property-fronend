import type { Property } from '../types/property'
import { PropertyCard } from './PropertyCard'

type Props = {
  properties: Property[]
  isLoading: boolean
  favorites: Set<string>
  favoriteDisabled: boolean
  onToggleFavorite: (propertyId: string) => void
}

export function PropertyList({
  properties,
  isLoading,
  favorites,
  favoriteDisabled,
  onToggleFavorite,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 w-56 rounded bg-zinc-100" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-zinc-100" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-zinc-100">
                <div className="h-56 bg-zinc-100" />
                <div className="p-5">
                  <div className="h-5 w-40 rounded bg-zinc-100" />
                  <div className="mt-2 h-4 w-32 rounded bg-zinc-100" />
                  <div className="mt-6 h-10 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-zinc-900">No properties available</p>
        <p className="mt-2 text-sm text-zinc-500">Please check back soon — we’re adding new listings daily.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          isFavorited={favorites.has(p.id)}
          favoriteDisabled={favoriteDisabled}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}


