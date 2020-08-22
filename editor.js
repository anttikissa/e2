let fs = require('fs')

let { log } = console

function el(type) {
	let classes = []
	type = type.replace(/\.([^.]*)/g, (_, className) => {
		classes.push(className)
		return ''
	})
	let result = document.createElement(type)
	if (classes.length) {
		result.className = classes.join(' ')
	}
	return result
}

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
		})

		this.ta = document.createElement('textarea')
		this.el.appendChild(this.ta)

		this.ta.setAttribute('spellcheck', 'false')

		this.ta.addEventListener('keydown', e => {
			log('keydown', e.key)

			if (e.metaKey && e.key === 's') {
				this.save()
				alert('file ' + this.filename + ' saved!')
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

	open(name) {
		this.filename = name
		this.input.value = name
		try {
			let file = fs.readFileSync(this.filename, 'utf8')
			this.ta.value = file.replace(/( )( )/g, '\t')
		} catch (e) {
			log('open failed', e)
			this.ta.value = ''
		}
	}

	save() {
		fs.writeFileSync(this.filename, this.ta.value, 'utf8')
	}
}


let windows = el('div.windows')

document.body.appendChild(windows)

let editors = []

for (let file of state.currentFiles) {
	let editor = new SimpleEditor(state)
	editors.push(editor)
	windows.appendChild(editor.el)
	editor.open(file)
}
