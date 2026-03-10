import { useEffect, useRef, useCallback } from 'react'
import { EditorView, keymap, placeholder, lineNumbers } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import PanelWrapper from './PanelWrapper'

const proteusTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent',
    color: '#00ff41',
    fontSize: '13px',
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#00ff41',
    fontFamily: "'JetBrains Mono', monospace",
    padding: '4px 0',
  },
  '.cm-cursor': {
    borderLeftColor: '#00ff41',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#003b0060 !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#003b0080 !important',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: '#003b00',
    borderRight: '1px solid #003b0030',
    minWidth: '32px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#00ff4108',
    color: '#00ff4180',
  },
  '.cm-activeLine': {
    backgroundColor: '#00ff4108',
  },
  '.cm-placeholder': {
    color: '#003b00',
    fontStyle: 'italic',
  },
}, { dark: true })

const proteusHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#39ff14' },
  { tag: tags.string, color: '#00ff41' },
  { tag: tags.number, color: '#39ff14' },
  { tag: tags.comment, color: '#003b00' },
  { tag: tags.variableName, color: '#00ff41' },
  { tag: tags.operator, color: '#39ff14' },
])

const placeholderText = `Type your instructions in plain English...

Example:
  Create a variable called name and set it to "World"
  Print "Hello" followed by name
  Create a list of numbers 1 through 5
  Add up all the numbers and print the total`

export default function HumanTerminal({ value, onChange, active }) {
  const editorRef = useRef(null)
  const viewRef = useRef(null)

  const onChangeCallback = useCallback((update) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString())
    }
  }, [onChange])

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        proteusTheme,
        syntaxHighlighting(proteusHighlight),
        placeholder(placeholderText),
        EditorView.updateListener.of(onChangeCallback),
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const currentContent = view.state.doc.toString()
    if (currentContent !== value) {
      view.dispatch({
        changes: { from: 0, to: currentContent.length, insert: value },
      })
    }
  }, [value])

  return (
    <PanelWrapper title="Human Language Terminal" delay={0.1} active={active}>
      <div ref={editorRef} className="h-full w-full" />
    </PanelWrapper>
  )
}
