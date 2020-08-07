let fs = require('fs')

let state = {
  currentFile: ''
}

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
	this.ta.value = fs.readFileSync(this.filename, 'utf8')
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

editor.open('editor.js')



