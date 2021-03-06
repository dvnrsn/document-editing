import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

export default function CkExample (props) {

  return (
    <div className="App">
      <h2>Using CKEditor 5</h2>
      <CKEditor
        onInit={editor => {
          console.log('Editor is ready to use!', editor);

          // Insert the toolbar before the editable area.
          editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
          );
        }}
        onChange={(event, editor) => console.log({ event, editor })}
        editor={DecoupledEditor}
        data="<p>Canopy automates busywork and connects your entire tax practice so you can focus on what’s important.</p>"
      />
    </div>
  )
}