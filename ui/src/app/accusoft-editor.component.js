import React, { useRef, useEffect, useState } from 'react'

export default function Editor(props) {
  const container = useRef()

  useEffect(() => {
    if (props.sessionId) {
      container.current.innerText = ''
      const editor = new PrizmDocEditor({
        baseUrl: 'https://prizmdoc-integ.canopy.ninja/',
        sessionId: props.sessionId
      });
      editor.embed({
        container: container.current
      }).then(editor => props.setEditor(editor))
    }
  }, [props.sessionId])


  return (
    <div ref={container} style={{ height: '100%' }}>

    </div>
  )
}