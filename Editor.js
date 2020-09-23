let fs = require('fs')

import { el } from './util.js'

let { log } = console

export class Editor {
	constructor(globalState) {
		this.globalState = globalState
		this.filename = null
		// empty buffer equals no file, fine for most purposes?
		this.fileOnDisk = ''

		this.el = el('div.editor.new')

		this.input = el('input')

		this.el.appendChild(this.input)
		this.input.addEventListener('keydown', (ev) => {
			if (ev.key === 'Enter') {
				ev.preventDefault()
				this.open(this.input.value)
			}

			if (ev.key === 'Tab') {
				ev.preventDefault()
				let files = fs.readdirSync('.')
				let matches = files.filter(file =>
					file.toLowerCase().startsWith(
						this.input.value.toLowerCase()
					)
				)
				if (matches.length) {
					this.input.value = matches[0]
				}
			}
		})

		this.content = el('div.content')
		this.content.tabIndex = 0
		this.el.appendChild(this.content)

		// TODO how to do this?
		//this.ta.addEventListener('input', ev => {
		//	this.updateUnsaved()
		//})

		this.el.addEventListener('keydown', ev => {
			if (ev.metaKey && ev.key === 'w') {
				ev.preventDefault()
				this.close()
			}
		})

		this.content.addEventListener('keydown', e => {
			log('keydown', e.key)

			if (e.metaKey && e.key === 's') {
// TODO
//				this.save()
			}

//			if (e.key === 'Tab') {
//				e.preventDefault()
//				let before = this.ta.value.substring(0, this.ta.selectionStart)
//				let endPos = this.ta.selectionEnd
//				let after = this.ta.value.substring(this.ta.selectionEnd)
//				this.ta.value = before + '\t' + after
//				this.ta.selectionStart = this.ta.selectionEnd = endPos + 1
//			}
		})
	}

	updateUnsaved() {
		// TODO it's fileOnDisk

//		this.el.classList.toggle('unsaved', this.ta.value !== this.fileContent)
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
			this.fileOnDisk = file

			// Take away final newline
			file = file.replace(/\n$/, '')
			this.lines = file.split('\n')

			log('!!! Editor lines', this.lines)

//			this.fileContent = file
			this.updateUnsaved()
		} catch (e) {
			alert(`Could not open ${this.filename}. Save to create it.`)
			log('open failed', e)
//			this.ta.value = ''
		}

		this.content.focus()
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
			editorToFocus.focus && editorToFocus.focus()
		}
	}

	focus() {
		this.content.focus()
	}

	save() {
		if (!this.filename) {
			return
		}

//		fs.writeFileSync(this.filename, this.ta.value, 'utf8')
//		this.fileContent = this.ta.value
		// it's this.fileOnDisk

		this.updateUnsaved()

		alert('file ' + this.filename + ' saved!')
	}
}
