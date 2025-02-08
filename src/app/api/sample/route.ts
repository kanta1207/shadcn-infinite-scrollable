import { NextRequest, NextResponse } from 'next/server'

import { fetchWithOptions } from '../../../../utils/apiBase'

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = new URL(BASE_URL)
    if (searchParams.has('offset')) {
      url.searchParams.set('offset', searchParams.get('offset')!)
    }
    const parentRes = await fetchWithOptions<{ results: { name: string; url: string }[] }>(url.toString(), {
      cache: 'force-cache'
    })

    const childRes = await Promise.all(
      parentRes.data.results.map(async (result) => {
        const res = await fetchWithOptions<{ sprites: { front_default: string } }>(result.url, {
          cache: 'force-cache'
        })
        return res.data
      })
    )

    const combinedData = parentRes.data.results.map((result, index) => ({
      name: result.name,
      imgUrl: childRes[index].sprites.front_default
    }))

    return NextResponse.json(combinedData)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
