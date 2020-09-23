let fs = require('fs')

let { log } = console

import { el } from './util.js'
import { SimpleEditor } from './SimpleEditor.js'
import { Editor } from './Editor.js'

let state = {
	currentFiles: [],
	editors: []
}

try {
	let savedState = JSON.parse(fs.readFileSync('.e-state', 'utf8'))
	state = { ...state, ...savedState }
} catch (e) {
}

window.addEventListener('beforeunload', () => {
	let files = editors.map(e => e.filename)
	state.currentFiles = files

	state.editors = editors.map(e => {
		let type = 'unknown'
		if (e instanceof SimpleEditor) {
			type = 'simple'
		} else if (e instanceof Editor) {
			type = 'new'
		}

		return {
			type,
			filename: e.filename
		}
	})

	fs.writeFileSync('.e-state', JSON.stringify(state, null, 4), 'utf8')
})

let windows = el('div.windows')

document.body.appendChild(windows)

window.editors = []

function open(filename) {
	let editor = new SimpleEditor(state)
	window.editors.push(editor)
	windows.appendChild(editor.el)
	editor.open(filename)
}

// Open the new fancy editor
function openNew(filename) {
	let editor = new Editor(state)
	window.editors.push(editor)
	windows.appendChild(editor.el)
	editor.open(filename)
}

for (let e of state.editors) {
	if (e.type === 'simple') {
		open(e.filename)
	} else if (e.type === 'new') {
		openNew(e.filename)
	} else {
		alert('unknown editor ' + e.type)
	}
}

window.addEventListener('keydown', (ev) => {
log('window keydown', ev.metaKey, ev.key, ev.shiftKey)

	if (ev.metaKey && ev.key === 'w') {
		// Prevent window from closing
		ev.preventDefault()
	}

	if (ev.metaKey && ev.key === 'o') {
		if (ev.shiftKey) {
			openNew()
		} else {
			open()
		}
	}
})
