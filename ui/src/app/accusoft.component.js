import React, { useEffect, useState, useRef } from 'react'
import EditorComponent from './accusoft-editor.component'
import './main.css'

export default function Accusoft(props) {

  const [submit, setSubmit] = useState()
  const [sessionId, setSessionId] = useState()
  const inputRef = useRef()
  const [documentId, setDocumentId] = useState(localStorage.getItem('documentId') ? JSON.parse(localStorage.getItem('documentId')) : [])
  const [docList, setDocList] = useState([]);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState({});
  const [editor, setEditor] = useState();

  useEffect(() => {
    if (documentId) {
      fetch('https://prizmdoc-integ.canopy.ninja/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "documentId": documentId
        })
      }).then(res => res.json())
        .then(res => console.log(res) || setSessionId(res.sessionId))
    }
  }, [])

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
          localStorage.setItem('documentId', JSON.stringify(res.documentId));
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

  useEffect(() => {
    getDocs();
    getUser();
  }, []);

  const handleSubmit = e => e.preventDefault() || setSubmit(true)

  const createNew = (title) => {
    fetch('http://localhost:3001/doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      })
      .then(res => res.json())
      .then(a => {
        setSessionId(a.id);
        getDocs();
      })
  }

  function getDocs() {
    fetch('http://localhost:3001/doc', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(a => setDocList(a))
  }

  function getDoc(id) {
    fetch(`http://localhost:3001/doc/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(a => setSessionId(a.id))
  }

  function getUser() {
    fetch(`http://localhost:3001/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(user => setUser(user))
  }

  function insertText(name) {
    editor.insertText({ text: name });
  }

  return (
    <>
      <strong>Docs:</strong>
      <div className="doc-container">
        {docList.map(doc => (
          <div className="doc-item" onClick={() => getDoc(doc.id)}>
            {doc.title}
          </div>
        ))}
      </div>
      <div className="create-insert">
        <div>
          <button onClick={() => createNew(title || 'My cool document')}>create new</button>
          <input type="text" placeholder="My cool document" value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div>
          <button onClick={() => insertText(user.name || '')}>Insert username</button>
          <button onClick={() => insertText('<<name>>')}>Insert template name</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="file">Choose file to upload</label>
          <input ref={inputRef} type="file" id="file" name="file" />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
      {sessionId && <EditorComponent sessionId={sessionId} setEditor={setEditor} />}
    </>
  )
}