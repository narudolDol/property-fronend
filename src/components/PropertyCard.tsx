import type { Property } from '../types/property'
import { Bath, BedDouble, Heart, MapPin, Ruler } from 'lucide-react'

type Props = {
  property: Property
  isFavorited: boolean
  favoriteDisabled: boolean
  onToggleFavorite: (propertyId: string) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(price)
}

export function PropertyCard({ property, isFavorited, favoriteDisabled, onToggleFavorite }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="h-56 w-full object-cover transition group-hover:scale-[1.01]"
          loading="lazy"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm ring-1 ring-black/5 backdrop-blur">
          {formatPrice(property.price)}
        </div>

        <button
          type="button"
          disabled={favoriteDisabled}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => onToggleFavorite(property.id)}
          className={[
            'absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur transition',
            favoriteDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 active:scale-95',
          ].join(' ')}
          title={favoriteDisabled ? 'Select a user to favorite' : undefined}
        >
          <Heart
            aria-hidden="true"
            className={isFavorited ? 'h-5 w-5 text-rose-500' : 'h-5 w-5 text-zinc-500'}
            fill={isFavorited ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-zinc-900">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
          <MapPin aria-hidden="true" className="h-4 w-4 text-zinc-400" />
          {property.location}
        </p>

        <div className="mt-4 border-t border-zinc-100 pt-4">
          <dl className="grid grid-cols-3 gap-3 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <BedDouble aria-hidden="true" className="h-4 w-4 text-zinc-400" />
              <span>{property.beds} beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath aria-hidden="true" className="h-4 w-4 text-zinc-400" />
              <span>{property.baths} baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler aria-hidden="true" className="h-4 w-4 text-zinc-400" />
              <span>{property.sqm.toLocaleString()} sqm</span>
            </div>
          </dl>
        </div>
      </div>
    </article>
  )
}

