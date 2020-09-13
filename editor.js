let fs = require('fs')

let { log } = console

import { el } from './util.js'
import { SimpleEditor } from './SimpleEditor.js'

let state = {
	currentFiles: []
}

try {
	let savedState = JSON.parse(fs.readFileSync('.e-state', 'utf8'))
	state = { ...state, ...savedState }
} catch (e) {
}

window.addEventListener('beforeunload', () => {
	let files = editors.map(e => e.filename)
	state.currentFiles = files

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

for (let filename of state.currentFiles) {
	open(filename)
}

window.addEventListener('keydown', (ev) => {
	if (ev.metaKey && ev.key === 'w') {
		// Prevent window from closing
		ev.preventDefault()
	}

	if (ev.metaKey && ev.key === 'o') {
		open()
	}
})
