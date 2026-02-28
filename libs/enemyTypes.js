import BuzzyBeetle from 'components/enemies/BuzzyBeetle'
import Goomba from 'components/enemies/Goomba'
import Koopa from 'components/enemies/Koopa'
import { TILE_SIZE } from 'libs/worldConstants'

export const ENEMY_TYPES = {
  goomba: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    speed: 300,
    gravity: 2600,
    score: 100,
    stompable: true,
    render: (debug, enemy) => <Goomba debug={debug} state={enemy?.state ?? 'walk'} />,
  },
  koopa: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    speed: 220,
    gravity: 2600,
    score: 200,
    stompable: true,
    shellLike: true,
    shellSpeed: 480,
    render: (debug, enemy) => <Koopa debug={debug} state={enemy?.state ?? 'walk'} />,
  },
  buzzy: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    speed: 220,
    gravity: 2600,
    score: 300,
    stompable: true,
    shellLike: true,
    shellSpeed: 480,
    render: (debug, enemy) => <BuzzyBeetle debug={debug} state={enemy?.state ?? 'walk'} />,
  },
}

export const getEnemyTypeConfig = type => ENEMY_TYPES[type] ?? null
