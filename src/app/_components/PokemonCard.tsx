import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import Image from 'next/image'

type PokemonCardProps = {
  name: string
  imgUrl: string
}

export const PokemonCard = ({ name, imgUrl }: PokemonCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center capitalize">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image src={imgUrl} alt={name} width={150} height={150} className="object-contain" />
      </CardContent>
    </Card>
  )
}
