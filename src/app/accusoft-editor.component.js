import React, { useRef, useEffect } from 'react'

export default function Editor(props) {
  const container = useRef()
  const editor = new PrizmDocEditor({
    baseUrl: 'https://prizmdoc-integ.canopy.ninja/',
    sessionId: props.sessionId
  });

  useEffect(() => {
    if (container.current) {
      (async function () {
        const editorApi = await editor.embed({
          container: container.current
        });
        props.setEditor(editorApi);
      })();
    }
  }, [container.current])

  return (
    <div ref={container} style={{ height: '100%' }}>

    </div>
  )
}