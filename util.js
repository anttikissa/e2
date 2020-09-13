export function el(type) {
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
