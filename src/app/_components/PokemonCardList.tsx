'use client'
import { InfiniteScrollable } from '@/components/ui/infinite-scrollable'

import { fetchWithOptions } from '../../../utils/apiBase'
import { PokemonCard } from './PokemonCard'

type Pokemon = {
  name: string
  imgUrl: string
}

export const PokemonCardList = () => {
  const getPokemon = async (page: number) => {
    console.log('getPokemon', page)
    const offset = (page - 1) * 20
    const url = `/api/sample?offset=${offset}`
    const res = await fetchWithOptions<{ name: string; imgUrl: string }[]>(url, {
      cache: 'force-cache'
    })
    console.log('res', res)
    return res.data
  }

  const renderItem = (pokemon: Pokemon) => {
    return <PokemonCard name={pokemon.name} imgUrl={pokemon.imgUrl} />
  }

  return <InfiniteScrollable<Pokemon> fetcher={getPokemon} renderItem={renderItem} className="grid grid-cols-2 gap-4" />
}
