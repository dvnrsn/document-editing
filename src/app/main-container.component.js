import React, {useState} from 'react'
import {RichTextContainer, RichTextEditor} from 'bandicoot'
import './main.css'
import RichTextButtons from './rich-text-buttons.component'
import {CprButton} from 'canopy-styleguide'
import CkExample from './ckeditor.component'
import { useEffect } from 'react'

export default function MainContainer (props) {

  const [technology, setTechnology] = useState(localStorage.getItem('technology') || 'bandicoot')

  useEffect(() => {
    localStorage.setItem('technology', technology)
  }, [technology])

  return (
    <div className='mainContainer'>
      <div style={{margin: 20}}>
        <CprButton actionType='flat' onClick={() => setTechnology('bandicoot')} disabled={technology === 'bandicoot'}>Bandicoot</CprButton>
        <CprButton actionType='flat' onClick={() => setTechnology('ck')} disabled={technology==='ck'}>CkEditor</CprButton>
        <CprButton actionType='flat' onClick={() => setTechnology('accusoft')} disabled={technology === 'accusoft'}>Accusoft</CprButton>
      </div>
      <div className='centerContainer'>
        {
          technology === 'bandicoot' && (
            <RichTextContainer>
              <RichTextButtons />
              <div className='document'>
                <RichTextEditor
                  className='richTextEditor'
                  sanitizeHTML={a => a}
                />
              </div>
            </RichTextContainer>
          )
        }
        {
          technology === 'ck' && <CkExample />
        }
      </div>
    </div>
  )

}