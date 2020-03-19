import React, { useRef, useEffect, useState } from 'react'

export default function Editor(props) {
  const container = useRef()
  const [hasRun, setHasRun] = useState()
  const editor = new PrizmDocEditor({
    baseUrl: 'https://prizmdoc-integ.canopy.ninja/',
    sessionId: props.sessionId
  });

  useEffect(() => {
    if (container.current) {
      setHasRun(true)
      editor.embed({
        container: container.current
      }).then(editor => props.setEditor(editor))
    }
  }, [container.current, hasRun])

  return (
    <div ref={container} style={{ height: '100%' }}>

    </div>
  )
}