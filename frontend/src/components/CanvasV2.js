import { isNum } from '../helpers/IsType'


function Canvas(background, multiple){
	let result = {}

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d', { alpha: false })
	result.element = canvas


	const [mainLayerPublic, mainLayerPrivate] = Layer(multiple)


	let inited = false
	let width, height

	const clear = () => {
		ctx.fillStyle = background
		ctx.fillRect(0, 0, width*multiple, height*multiple)
	}

	const setSize = (newWidth, newHeight) => {
		if(!isNum(newWidth) || !isNum(newHeight)) throw new Error('Width and Height must be numbers')

		width = newWidth
		canvas.style.width = `${width}px`
		canvas.width = width*multiple

		height = newHeight
		canvas.style.height = `${height}px`
		canvas.height = height*multiple

		if(newWidth > 0 && newHeight > 0){
			inited = true
			clear()
		}
		mainLayerPrivate.setSize(width, height)
	}
	result.setSize = setSize
	setSize(0, 0)


	const render = () => {
		if(!inited) throw new Error('Cannot render canvas before initialization')
		ctx.drawImage(mainLayerPrivate.element, 0, 0, width*multiple, height*multiple)
	}
	result.render = render


	const destroy = () => {
		canvas.remove()
	}
	result.destroy = destroy

	result = {...result, ...mainLayerPublic}
	return result
}


function Layer(multiple){
	const publicMethods = {}
	const privateMethods = {}

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d', { alpha: true })
	privateMethods.element = canvas

	let width, height

	const clear = () => {
		ctx.clearRect(0, 0, width*multiple, height*multiple)
	}

	const setSize = (newWidth, newHeight) => {
		width = newWidth
		canvas.style.width = `${width}px`
		canvas.width = width*multiple

		height = newHeight
		canvas.style.height = `${height}px`
		canvas.height = height*multiple

		if(newWidth > 0 && newHeight > 0) clear()
	}
	privateMethods.setSize = setSize


	const line = (fromX, fromY, toX, toY, color='#000', width=1) => {
		ctx.strokeStyle = color
		ctx.lineWidth = width*multiple
		ctx.beginPath()
		ctx.moveTo(fromX*multiple, fromY*multiple)
		ctx.lineTo(toX*multiple, toY*multiple)
		ctx.stroke()
	}
	publicMethods.line = line

	const arrow = (fromX, fromY, toX, toY, color='#000', width=1) => {
		let headlen = 8*multiple
		const dx = toX*multiple - fromX*multiple
		const dy = toY*multiple - fromY*multiple
		const angle = Math.atan2(dy, dx)

		ctx.strokeStyle = color
		ctx.lineWidth = width*multiple
		ctx.beginPath()
		ctx.moveTo(fromX*multiple, fromY*multiple)
		ctx.lineTo(toX*multiple, toY*multiple)
		ctx.lineTo(toX*multiple - headlen * Math.cos(angle - Math.PI / 6), toY*multiple - headlen * Math.sin(angle - Math.PI / 6))
		ctx.moveTo(toX*multiple, toY*multiple)
		ctx.lineTo(toX*multiple - headlen * Math.cos(angle + Math.PI / 6), toY*multiple - headlen * Math.sin(angle + Math.PI / 6))
		ctx.stroke()
	}
	publicMethods.arrow = arrow

	const text = (text, x, y, fontSize=14, align='top left', color='#000', style='', letterSpacing=0) => {
		align = align.split(' ')
		ctx.textBaseline = align[0]
		ctx.textAlign = align[1]

		ctx.letterSpacing = `${letterSpacing}px`
		ctx.fillStyle = color
		ctx.font = `${style.length ? `${style} ` : ''}${fontSize*multiple}px sans-serif`
		ctx.textRendering = 'geometricPrecision'
		ctx.fillText(text, x*multiple, y*multiple)
		return ctx.measureText(text)
	}
	publicMethods.text = text

	const circle = (x, y, radius, color) => {
		ctx.beginPath()
		ctx.arc(x*multiple, y*multiple, radius*multiple, 0, 2 * Math.PI, false)
		ctx.fillStyle = color
		ctx.fill()
	}
	publicMethods.circle = circle


	return [publicMethods, privateMethods]
}


export default Canvas