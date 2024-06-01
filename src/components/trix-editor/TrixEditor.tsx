import 'trix/dist/trix.esm'
import { TrixEditor } from 'react-trix'

const Component = (props: any): JSX.Element => {
  const { onChange, onEditorReady } = props

  return (
    <TrixEditor
      mergeTags={[]}
      onChange={onChange}
      onEditorReady={onEditorReady}
      {...props}
    />
  )
}

export default Component
