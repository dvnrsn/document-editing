import React, { useRef, useState, useEffect } from 'react'
import { useFontSize } from 'bandicoot'
import { CprButton, CprTooltip } from 'canopy-styleguide'
import { defaultFontSizes } from './bandicoot.helper.js'

export default function BandicootFontSizeSelector(props) {
  const fontSizes = props.fontSizes && props.fontSizes.length ? props.fontSizes : defaultFontSizes
  const { currentlySelectedFontSize, setSize } = useFontSize({ defaultFontSize: '14px', fontSizes: fontSizes.map(fontSize => `${fontSize}px`) })
  const fontSizeRef = useRef(null)
  const [popupOpen, setPopupOpen] = useState(false)
  // useClickToClose(fontSizeRef, () => setPopupOpen(false))

  useEffect(() => {
    if (fontSizeRef.current) {
      const click = document.addEventListener('click', e => {
        if (!fontSizeRef.current.contains(e.target)) {
          setPopupOpen(false)
        } else {
          console.log('clicked outside')
        }
      })
      return () => document.removeEventListener(click)
    }
  },[fontSizeRef])

  return (
    <CprTooltip html="Font size">
      <div className='fontSizeContainer' >
        <div ref={fontSizeRef}>
          <CprButton
            className={'fontSizeIcon'}
            actionType="unstyled"
            onClick={toggleOpen}
            tooltip="Font size"
            type='button'
          >
            {currentlySelectedFontSize.replace('px', '')}
          </CprButton>
        </div>
        <div className={`cps-dropdown ${popupOpen ? 'cps-open' : ''}`}>
          <ul className="cps-dropdown-menu">
            {fontSizes.map(fontSize => fontSizeOption(fontSize, `${fontSize}px`))}
          </ul>
        </div>
      </div>
    </CprTooltip >
  )

  function toggleOpen() {
    setPopupOpen(!popupOpen)
  }

  function fontSizeOption(label, size) {
    return (
      <li key={label}>
        <CprButton actionType="unstyled" onClick={() => setSize(size)} type='button'>
          {label}
        </CprButton>
      </li>
    )
  }
}