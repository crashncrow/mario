import Mushroom from 'components/Mushroom'
import { getEnemyTypeConfig } from 'libs/enemyTypes'

export const renderMushroom = () => <Mushroom />

export const renderEnemy = (enemy, debug) => getEnemyTypeConfig(enemy.type)?.render?.(debug, enemy) ?? null
