let fs = require('fs')

let { log } = console

import { el } from './util.js'

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

class SimpleEditor {
	constructor(globalState) {
		this.globalState = globalState
		this.filename = null

		this.el = el('div.editor')

		this.input = el('input')

		this.el.appendChild(this.input)
		this.input.addEventListener('keydown', (ev) => {
			if (ev.key === 'Enter') {
				this.open(this.input.value)
			}

			if (ev.key === 'Tab') {
				ev.preventDefault()
				let files = fs.readdirSync('.')
				let matches = files.filter(file => file.startsWith(this.input.value))
				if (matches.length) {
					this.input.value = matches[0]
				}
			}
		})

		this.ta = document.createElement('textarea')
		this.el.appendChild(this.ta)

		this.ta.setAttribute('spellcheck', 'false')

		this.el.addEventListener('keydown', ev => {
			if (ev.metaKey && ev.key === 'w') {
				ev.preventDefault()
				this.close()
			}
		})

		this.ta.addEventListener('keydown', e => {
			log('keydown', e.key)

			if (e.metaKey && e.key === 's') {
				this.save()
			}

			if (e.key === 'Tab') {
				e.preventDefault()
				let before = this.ta.value.substring(0, this.ta.selectionStart)
				let endPos = this.ta.selectionEnd
				let after = this.ta.value.substring(this.ta.selectionEnd)
				this.ta.value = before + '\t' + after
				this.ta.selectionStart = this.ta.selectionEnd = endPos + 1
			}
		})
	}

	open(name = '') {
		this.filename = name
		this.input.value = name

		if (!name) {
			this.input.focus()
			return
		}

		try {
			let file = fs.readFileSync(this.filename, 'utf8')
			this.ta.value = file.replace(/( )( )/g, '\t')
			this.ta.focus()
		} catch (e) {
			log('open failed', e)
			this.ta.value = ''
		}
	}

	close() {
		let findPreviousEditor = (editors) => {
			let previousEditor = null
			for (let editor of editors) {
				if (editor === this) {
					break
				}
				previousEditor = editor
			}

			return previousEditor
		}

		let editorToLeft = findPreviousEditor(window.editors)
		let editorToRight = findPreviousEditor([...window.editors].reverse())
		let editorToFocus = editorToLeft || editorToRight

		window.editors = window.editors.filter(editor => editor !== this)
		this.el.remove()

		if (editorToFocus) {
			editorToFocus.ta.focus()
		}
	}

	save() {
		if (!this.filename) {
			return
		}
		fs.writeFileSync(this.filename, this.ta.value, 'utf8')
		alert('file ' + this.filename + ' saved!')
	}
}


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
		ev.preventDefault()
	}

	if (ev.metaKey && ev.key === 'o') {
		open()
	}
})

