import React from 'react'
import { CprButtonIcon } from 'canopy-styleguide'
import { performCommand, isActive, useDocumentExecCommand, useDocumentQueryCommandState, useFormatBlock } from 'bandicoot'
import { upperFirst } from 'lodash';

export default function BandicootButton(props) {
  const { command, icon, tooltip } = props

  const { performCommand } = useDocumentExecCommand(command)
  const { isActive } = useDocumentQueryCommandState(command)

  return (
    <div>
      <CprButtonIcon
        icon={`rte-${icon ? icon : command}`}
        tooltip={tooltip ? tooltip : upperFirst(command)}
        customClass={`richTextButton ${isActive ? 'active-control-button' : ''}`}
        onClick={performCommand}
        type='button'
      />
    </div>
  )
}