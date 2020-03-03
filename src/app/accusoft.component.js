import React, { useEffect, useState, useRef } from 'react'
import EditorComponent from './accusoft-editor.component'
import './main.css'

export default function Accusoft(props) {

  const [submit, setSubmit] = useState()
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'))
  const inputRef = useRef()
  const [documentIDs, setDocumentIDs] = useState(localStorage.getItem('documentIds') ? JSON.parse(localStorage.getItem('documentIds')) : [])

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId)
    }
  }, [sessionId])

  useEffect(() => {
    if (submit && inputRef.current.files.length) {
      setSubmit()
      fetch('https://prizmdoc-integ.canopy.ninja/api/v1/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        body: inputRef.current.files[0],
      })
        .then((response) => {
          return response.json();
        })
        .then(res => {
          fetch('https://prizmdoc-integ.canopy.ninja/api/v1/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "documentId": res.documentId
            })
          }).then(res => res.json())
            .then(res => console.log(res) || setSessionId(res.sessionId))
        });
    }

  }, [submit, inputRef.current])

  const handleSubmit = e => e.preventDefault() || setSubmit(true)
  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="file">Choose file to upload</label>
          <input ref={inputRef} type="file" id="file" name="file" />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
      {sessionId && <EditorComponent sessionId={sessionId} />}
    </>
  )
}