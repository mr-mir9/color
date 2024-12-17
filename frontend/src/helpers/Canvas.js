function Canvas({ background, multiple }){
	const that = this
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d', { alpha: false })
	let mainLayer = null

	let originalWidth=0, width=0,
		originalHeight=0, height = 0

	// depricated
	const getCanvas = (_width, _height) => {
		originalWidth = _width
		width = _width*multiple
		originalHeight = _height
		height = _height*multiple

		canvas.style.width = `${originalWidth}px`
		canvas.width = width
		canvas.style.height = `${originalHeight}px`
		canvas.height = height

		ctx.fillStyle = background
		ctx.fillRect(0, 0, width, height)

		mainLayer = new CanvasLayer(originalWidth, originalHeight, multiple)
		drawMainLayer()

		return canvas
	}
	that.getCanvas = getCanvas

	const drawMainLayer = () => {
		ctx.drawImage(mainLayer.canvas, 0, 0, width, height)
	}

	const drawLayers = layers => {
		drawMainLayer()
		for(const layer of layers) ctx.drawImage(layer.canvas, 0, 0, width, height)
	}
	that.drawLayers = drawLayers

	const fillImage = image => {
		if(!mainLayer) throw new Error('Mail layer not defined')
		mainLayer.fillImage(image)
		drawMainLayer()
	}
	that.fillImage = fillImage

	const fillImagePos = (image, ix, iy, iw, ih, cx, cy, cw, ch) => {
		if(!mainLayer) throw new Error('Mail layer not defined')
		mainLayer.fillImagePos(image, ix, iy, iw, ih, cx, cy, cw, ch)
		drawMainLayer()
	}
	that.fillImagePos = fillImagePos

	const getLayer = () => {
		return new CanvasLayer(originalWidth, originalHeight, multiple)
	}
	that.getLayer = getLayer

	const reset = () => {
		drawMainLayer()
	}
	that.reset = reset

	const remove = () => {
		canvas.remove()
	}
	that.remove = remove
}
function CanvasLayer(originalWidth, originalHeight, multiple){
	const that = this

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d', { alpha: true })
	that.canvas = canvas

	const width = originalWidth*multiple
	const height = originalHeight*multiple

	canvas.style.width = `${originalWidth}px`
	canvas.width = width
	canvas.style.height = `${originalHeight}px`
	canvas.height = height

	const fillImage = image => {
		ctx.drawImage(image, 0, 0, width, height)
	}
	that.fillImage = fillImage

	const fillImagePos = (image, ix, iy, iw, ih, cx, cy, cw, ch) => {
		ctx.drawImage(image, ix, iy, iw, ih, cx*multiple, cy*multiple, cw*multiple, ch*multiple)
	}
	that.fillImagePos = fillImagePos

	const drawBorder = (color, size, x, y, width, height, dash=[]) => {
		ctx.strokeStyle = color
		ctx.lineWidth = size*multiple

		dash = dash.map(v => v*multiple)
		ctx.setLineDash(dash)

		ctx.strokeRect(x*multiple, y*multiple, width*multiple, height*multiple)
	}
	that.drawBorder = drawBorder
}
export default Canvas