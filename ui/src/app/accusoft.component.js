import React, { useEffect, useState, useRef } from 'react'
import EditorComponent from './accusoft-editor.component'
import './main.css'
import fetch from 'node-fetch'

export default function Accusoft(props) {

  const [submit, setSubmit] = useState()
  const [sessionId, setSessionId] = useState()
  const inputRef = useRef()
  const [documentId, setDocumentId] = useState(localStorage.getItem('documentId') && JSON.parse(localStorage.getItem('documentId')))
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
            .then(res => getDocs() || setSessionId(res.sessionId))
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
        setSessionId(a.sessionId);
        getDocs();
      })
  }

  function setDocLocalStorage(documentId) {
    localStorage.setItem('documentId', JSON.stringify(documentId))
  }

  function getDocs() {
    fetch('http://localhost:3001/docs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(a => setDocList(a.docs))
  }

  function getDoc(doc) {
    fetch(`http://localhost:3001/doc/${doc.rowid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(a => setSessionId(a.sessionId) || setDocLocalStorage(doc.prizmDocId))
  }

  function getUser() {
    fetch(`http://localhost:3001/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(data => setUser(data.user))
  }

  function deleteAll() {
    fetch(`http://localhost:3001/delete-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(() => setDocList([]))
  }

  function deleteDoc(id) {
    fetch('http://localhost:3001/doc', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.ok && setDocList(docList => docList.filter(doc => doc.rowid !== id)))
  }

  function insertText(name) {
    editor.insertText({ text: name });
  }

  return (
    <div className='accusoft'>
      <div className='docs-left'>
        <strong>Docs:</strong><button style={{float: 'right'}} onClick={deleteAll}>delete all</button>
        <div className="doc-container"><hr />
          {docList.map(doc => (
            <div className="doc-item" onClick={() => getDoc(doc)}>
              {doc.title}
              <button style={{float: 'right'}} onClick={e => e.stopPropagation() || deleteDoc(doc.rowid)}>delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className='centered-block'>
        <div className="create-insert">
          <div>
            <input type="text" id='create-new-input' placeholder="enter title" value={title} maxLength={20} onChange={e => setTitle(e.target.value)}/>
            <button onClick={() => createNew(title || 'My cool document')}>create new</button>
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
          <div>
            <button onClick={() => insertText(user.name || '')} disabled={!sessionId}>Insert username</button>
            <button onClick={() => insertText('<<name>>')} disabled={!sessionId}>Insert template name</button>
          </div>
        </div>

        {sessionId && <EditorComponent sessionId={sessionId} setEditor={setEditor} />}
      </div>
    </div>
  )
}