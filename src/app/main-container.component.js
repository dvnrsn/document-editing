import React from 'react'
import {RichTextContainer, RichTextEditor} from 'bandicoot'
import './main.css'
import RichTextButtons from './rich-text-buttons.component'

export default function MainContainer (props) {

  return (
    <div className='mainContainer'>
      <div className='centerContainer'>
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
    </div>
  )

}