import Mountains from 'components/decorations/Mountains'
import Plants from 'components/decorations/Plants'
import Sky from 'components/decorations/Sky'

const DECORATION_RENDERERS = {
  clouds: (items, cameraX) => (
    <Sky key='clouds' cameraX={cameraX} clouds={items} />
  ),
  mountains: (items, cameraX) => (
    <Mountains key='mountains' cameraX={cameraX} mountains={items} />
  ),
  plants: (items, cameraX) => (
    <Plants key='plants' cameraX={cameraX} plants={items} />
  ),
}

const Decorations = ({ decorations = {}, cameraX = null }) => (
  <>
    {Object.entries(decorations).map(([type, items]) => {
      const renderDecoration = DECORATION_RENDERERS[type]
      if (!renderDecoration || items.length === 0) return null

      return renderDecoration(items, cameraX)
    })}
  </>
)

export default Decorations
