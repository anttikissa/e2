let fs = require('fs')

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
			if (e.metaKey && e.key === 's') {
				this.save()
				alert('file ' + this.filename + ' saved!')
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


