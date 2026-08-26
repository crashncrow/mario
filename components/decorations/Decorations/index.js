import Mountains from 'components/decorations/Mountains'
import Plants from 'components/decorations/Plants'
import Sky from 'components/decorations/Sky'

const DECORATION_RENDERERS = {
  clouds: (items, minPx, maxPx) => (
    <Sky key='clouds' minPx={minPx} maxPx={maxPx} clouds={items} />
  ),
  mountains: (items, minPx, maxPx) => (
    <Mountains key='mountains' minPx={minPx} maxPx={maxPx} mountains={items} />
  ),
  plants: (items, minPx, maxPx) => (
    <Plants key='plants' minPx={minPx} maxPx={maxPx} plants={items} />
  ),
}

const Decorations = ({ decorations = {}, minPx = 0, maxPx = 0 }) => (
  <>
    {Object.entries(decorations).map(([type, items]) => {
      const renderDecoration = DECORATION_RENDERERS[type]
      if (!renderDecoration || items.length === 0) return null

      return renderDecoration(items, minPx, maxPx)
    })}
  </>
)

export default Decorations
