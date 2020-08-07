let fs = require('fs')

let ta = document.createElement('textarea')
let filename

function open(name) {
	filename = name
	ta.value = fs.readFileSync(filename, 'utf8')
}

ta.addEventListener('keydown', e => {
	if (e.metaKey && e.key === 's') {
		save()
		alert('file ' + filename + ' saved!')
	}
})

function save() {
	fs.writeFileSync(filename, ta.value, 'utf8')
}


document.body.appendChild(ta)
