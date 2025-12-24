import { useId } from 'react'
import { ChevronDown, User as UserIcon } from 'lucide-react'

import type { User } from '../types/user'

type Props = {
  users: User[]
  value: string | null
  onChange: (userId: string | null) => void
}

export function UserSelector({ users, value, onChange }: Props) {
  const selectId = useId()
  const selected = users.find((u) => u.id === value) ?? null

  return (
    <div className="rounded-2xl border border-black/5 bg-white/85 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-100">
            <UserIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Welcome back!</p>
            <p className="text-sm text-zinc-500">
              {selected ? `Browsing as ${selected.name}` : 'Select a user to save favorites'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="hidden text-sm text-zinc-400 sm:block">Your favorites will be saved</p>

          <label className="sr-only" htmlFor={selectId}>
            Select user
          </label>
          <div className="relative">
            <select
              id={selectId}
              className="h-11 w-full min-w-[220px] appearance-none rounded-xl border border-orange-200 bg-white px-4 pr-10 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value || null)}
            >
              <option value="">Select user…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500"
            />
          </div>
        </div>
      </div>

      {selected ? (
        <div className="rounded-b-2xl bg-emerald-50/70 px-5 py-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-100">
          <span className="inline-flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-emerald-700 ring-1 ring-emerald-200">
              {selected.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="font-medium">{selected.name}</span>
          </span>
        </div>
      ) : null}
    </div>
  )
}


