import React, {useState} from 'react'
import {RichTextContainer, RichTextEditor} from 'bandicoot'
import './main.css'
import RichTextButtons from './rich-text-buttons.component'
import {CprButton} from 'canopy-styleguide'
import CkExample from './ckeditor.component'
import { useEffect } from 'react'
import Accusoft from './accusoft.component'

export default function MainContainer (props) {

  const [technology, setTechnology] = useState('accusoft')

  useEffect(() => {
    localStorage.setItem('technology', technology)
  }, [technology])

  return (
    <div className='mainContainer'>
      <div className='centerContainer'>
        {
          technology === 'bandicoot' && (
            <div style={{width: '814px',  margin: 'auto'}}>
              <RichTextContainer>
                <RichTextButtons />
                <div className='document'>
                  <RichTextEditor
                    className='richTextEditor'
                    sanitizeHTML={a => a}
                  />
                </div>
              </RichTextContainer>
            </div>
          )
        }
        {
          technology === 'accusoft' && (
            <Accusoft />
          )
        }
        {
          technology === 'ck' && <CkExample />
        }
      </div>
    </div>
  )

}