import FireFlower from 'components/items/FireFlower'
import Mushroom from 'components/items/Mushroom'
import { getEnemyTypeConfig } from 'libs/enemies/enemyTypes'

export const renderMushroom = item => {
  if ((item?.type ?? 'mushroom') === 'flower') {
    return <FireFlower />
  }

  return <Mushroom />
}

export const renderEnemy = (enemy, debug) => getEnemyTypeConfig(enemy.type)?.render?.(debug, enemy) ?? null
