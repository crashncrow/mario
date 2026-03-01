import Mushroom from 'components/items/Mushroom'
import { getEnemyTypeConfig } from 'libs/enemies/enemyTypes'

export const renderMushroom = () => <Mushroom />

export const renderEnemy = (enemy, debug) => getEnemyTypeConfig(enemy.type)?.render?.(debug, enemy) ?? null
