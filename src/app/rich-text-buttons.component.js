import React, { useEffect, useState } from 'react'
import { CprButtonIcon } from 'canopy-styleguide'
import BandicootButton from './bandicoot-button.component'
import BandicootFontSizeSelector from './bandicoot-font-size-selector.component'
import { commandMap, tooltipMap, defaultButtons } from './bandicoot.helper'

export default function RichTextButtons(props) {

  return (
    <div className='flex'>
      {props.buttons.map((button, i) => {
        if (button === 'font-size') {
          return <BandicootFontSizeSelector key={i} />
        } else if (button === 'file') {
          return <AddFileButton
            key={i}
            handleFiles={props.handleFiles}
            focusTrap={props.focusTrap}
            contactId={props.contactId}
          />
        } else {
          return <BandicootButton
            key={i}
            icon={button}
            command={commandMap[button] || button}
            tooltip={tooltipMap[button]}
          />
        }
      })}
    </div>
  )
}
RichTextButtons.defaultProps = {
  buttons: defaultButtons
}