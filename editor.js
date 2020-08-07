let fs = require('fs')

let { log } = console

let state = {
	currentFile: null
}

try {
	state = JSON.parse(fs.readFileSync('.e-state', 'utf8'))
} catch (e) {
}

window.addEventListener('beforeunload', () => {
	fs.writeFileSync('.e-state', JSON.stringify(state, null, 4), 'utf8')
})

class SimpleEditor {
	constructor(globalState) {
		this.globalState = globalState
		this.filename = null
		this.ta = document.createElement('textarea')
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
		this.globalState.currentFile = name
		try {
			let file = fs.readFileSync(this.filename, 'utf8')
			this.ta.value = file.replace(/( )( )/g, '\t')
		} catch (e) {
			this.ta.value = ''
		}
	}

	save() {
		fs.writeFileSync(this.filename, this.ta.value, 'utf8')
	}
}

let editor = new SimpleEditor(state)

document.body.appendChild(editor.ta)

if (state.currentFile) {
	editor.open(state.currentFile)
}

function o(name) {
	editor.open(name)
}


		