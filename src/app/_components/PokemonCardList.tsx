'use client'
import { InfiniteScrollable } from '@/components/infinite-scrollable'

import { fetchWithOptions } from '../../../utils/apiBase'
import { PokemonCard } from './PokemonCard'

type Pokemon = {
  name: string
  imgUrl: string
}

export const PokemonCardList = () => {
  /**
   * Function to fetch the pokemon data with given the page number.
   * Fetch the API defined in route handler, to do the server-side data fetching.
   */
  const getPokemon = async (page: number) => {
    const offset = (page - 1) * 20
    const url = `/api/sample?offset=${offset}`
    const res = await fetchWithOptions<{ name: string; imgUrl: string }[]>(url, {
      cache: 'force-cache'
    })
    return res.data
  }

  /**
   * Function to render the pokemon card.
   */
  const renderItem = (pokemon: Pokemon) => {
    return <PokemonCard name={pokemon.name} imgUrl={pokemon.imgUrl} />
  }

  /**
   * Render the InfiniteScrollable component with the pokemon data.
   */
  return <InfiniteScrollable<Pokemon> fetcher={getPokemon} renderItem={renderItem} className="grid grid-cols-2 gap-4" />
}
