import { useRef, useEffect, useMemo } from 'react'
import { isFunc } from '../helpers/IsType'
import Canvas from '../helpers/Canvas'


function EstimateSelectPreview({ image, imageUrl, imageWidth, imageHeight, selectionType, setSelectionType, selectionOriginal, setSelectionOriginal, selectionTest, setSelectionTest }){


	const containerRef = useRef(null)
	const stateRef = useRef({ image, width:imageWidth, height:imageHeight, selection:selectionType, setSelection:setSelectionType, dropSelection:null, selectionOriginal, setSelectionOriginal, selectionTest, setSelectionTest })
	useEffect(() => {
		const container = containerRef.current
		const body = container.querySelector('.selection-container__body')
		const state = stateRef.current

		let canvas = null
		let canvasEl = null

		let canvasLeft=0, canvasRight=0,
			canvasTop=0,canvasBottom=0

		let firstPointSelectedRect = null
		let nowPointSelectedRect = null

		let nowInitedResizeHandler = null
		let nowInitedMouseDownHandler = null
		let nowInitedMouseMoveHandler = null
		let nowInitedMouseUpHandler = null

		const render = () => {
			if(nowInitedResizeHandler){
				window.removeEventListener('scroll', nowInitedResizeHandler, {passive:true})
				window.removeEventListener('resize', nowInitedResizeHandler, {passive:true})
				nowInitedResizeHandler = null
			}
			if(nowInitedMouseDownHandler){
				document.removeEventListener('mousedown', nowInitedMouseDownHandler, {passive:true})
				nowInitedMouseDownHandler = null
			}
			if(nowInitedMouseMoveHandler){
				document.removeEventListener('mousemove', nowInitedMouseMoveHandler, {passive:true})
				nowInitedMouseMoveHandler = null
			}
			if(nowInitedMouseUpHandler){
				document.removeEventListener('mouseup', nowInitedMouseUpHandler, {passive:true})
				nowInitedMouseUpHandler = null
			}

			const maxWidth = container.clientWidth
			const imageWidth = state.width
			const imageHeight = state.height

			let canvasWidth = maxWidth
			let canvasHeight = parseInt(canvasWidth * imageHeight / imageWidth)
			if(canvasHeight > 850){
				canvasHeight = 850
				canvasWidth = parseInt(canvasHeight * imageWidth / imageHeight)
			}
			const canvasMultiple = 2
			const imageMultiple = imageWidth / canvasWidth

			if(canvas) canvas.remove()
			canvas = new Canvas({ background:'#fff', multiple:canvasMultiple })
			canvasEl = canvas.getCanvas(canvasWidth, canvasHeight)
			body.appendChild(canvasEl)
			canvas.fillImage(state.image)

			const renderCanvasPositions = () => {
				const { x:_canvasLeft, y:_canvasTop } = canvasEl.getBoundingClientRect()
				canvasLeft = _canvasLeft
				canvasTop = _canvasTop
				canvasRight = canvasLeft + canvasWidth
				canvasBottom = canvasTop + canvasHeight
			}
			renderCanvasPositions()

			window.addEventListener('scroll', renderCanvasPositions, {passive:true})
			window.addEventListener('resize', renderCanvasPositions, {passive:true})
			nowInitedResizeHandler = renderCanvasPositions


			const renderLayer = data => {
				const selectionLayer = canvas.getLayer()
				selectionLayer.drawBorder('rgba(255,255,255,.5)', 4, data.x, data.y, data.width, data.height)

				const colors = {original:'#033cab', test:'#ff3b30'}
				selectionLayer.drawBorder(colors[data.type], 2, data.x, data.y, data.width, data.height, [20, 5])
				return selectionLayer
			}
			const renderSelections = () => {
				const layers = []

				if(state.selectionOriginal) layers.push(renderLayer(state.selectionOriginal))
				if(state.selectionTest) layers.push(renderLayer(state.selectionTest))
				
				if(firstPointSelectedRect && nowPointSelectedRect){
					const rectX = firstPointSelectedRect.x < nowPointSelectedRect.x ? firstPointSelectedRect.x : nowPointSelectedRect.x
					const rectY = firstPointSelectedRect.y < nowPointSelectedRect.y ? firstPointSelectedRect.y : nowPointSelectedRect.y
					const rectWidth = Math.abs(firstPointSelectedRect.x - nowPointSelectedRect.x)
					const rectHeight = Math.abs(firstPointSelectedRect.y - nowPointSelectedRect.y)
					layers.push(renderLayer({ x:rectX, y:rectY, width:rectWidth, height:rectHeight, type:state.selection }))
				}
				canvas.reset()
				if(layers.length) canvas.drawLayers(layers)
			}
			state.renderSelections = renderSelections

			state.dropSelection = () => {
				firstPointSelectedRect = null
				nowPointSelectedRect = null
				renderSelections()
			}
			state.setCursor = () => {
				if(['original', 'test'].includes(state.selection)) canvasEl.style.cursor = 'crosshair'
				else canvasEl.style.cursor = 'not-allowed'
			}

			const mouseDownHandler = e => {
				const { x:mouseX, y:mouseY } = e
				//console.log(`mX: ${mouseX}, mY: ${mouseY}`)
				if(!['original', 'test'].includes(state.selection)) return;
				//console.log(`mX:${mouseX}, mY:${mouseY}, canvas:${canvasLeft}-${canvasRight}, ${canvasTop}|${canvasBottom}`)
				if(mouseX < canvasLeft || mouseX > canvasRight || mouseY < canvasTop || mouseY > canvasBottom) return;

				const point = { x:parseInt(mouseX-canvasLeft), y:parseInt(mouseY-canvasTop) }
				firstPointSelectedRect = point
				nowPointSelectedRect = point
				renderSelections()
			}
			const mouseMoveHandler = e => {
				if(!firstPointSelectedRect) return;
				//console.log(`mX:${mouseX}, mY:${mouseY}, canvas:${canvasLeft}-${canvasRight}, ${canvasTop}|${canvasBottom}`)

				const { x:mouseX, y:mouseY } = e
				if(mouseX < canvasLeft || mouseX > canvasRight || mouseY < canvasTop || mouseY > canvasBottom){
					firstPointSelectedRect = null
					nowPointSelectedRect = null
					return renderSelections()
				}

				const point = { x:parseInt(mouseX-canvasLeft), y:parseInt(mouseY-canvasTop) }
				nowPointSelectedRect = point
				renderSelections()
			}
			const mouseUpHandler = e => {
				if(!firstPointSelectedRect && !nowPointSelectedRect) return;
				if(!['original', 'test'].includes(state.selection)){
					firstPointSelectedRect = null
					nowPointSelectedRect = null
					return renderSelections()
				}
				
				const { x:mouseX, y:mouseY } = e
				if(mouseX < canvasLeft || mouseX > canvasRight || mouseY < canvasTop || mouseY > canvasBottom){
					firstPointSelectedRect = null
					nowPointSelectedRect = null
					return renderSelections()
				}

				const point = { x:parseInt(mouseX-canvasLeft), y:parseInt(mouseY-canvasTop) }

				const selectedX = point.x < firstPointSelectedRect.x ? point.x : firstPointSelectedRect.x
				const selectedY = point.y < firstPointSelectedRect.y ? point.y : firstPointSelectedRect.y
				const selectedWidth = Math.abs(parseInt(point.x - firstPointSelectedRect.x))
				const selectedHeight = Math.abs(parseInt(point.y - firstPointSelectedRect.y))
				const objectSelected = { x:selectedX, y:selectedY, width:selectedWidth, height:selectedHeight, type:state.selection, realX:Math.round(selectedX*imageMultiple), realY:Math.round(selectedY*imageMultiple), realWidth:Math.round(selectedWidth*imageMultiple), realHeight:Math.round(selectedHeight*imageMultiple) }
				if(selectedWidth > 4 && selectedHeight > 4 && state.selection === 'original' && isFunc(state.setSelectionOriginal)) state.setSelectionOriginal(objectSelected)
				if(selectedWidth > 4 && selectedHeight > 4 && state.selection === 'test' && isFunc(state.setSelectionTest)) state.setSelectionTest(objectSelected)
				if(isFunc(state.setSelection)) state.setSelection(null)
				firstPointSelectedRect = null
				nowPointSelectedRect = null
				renderSelections()
			}

			document.addEventListener('mousedown', mouseDownHandler, {passive:true})
			nowInitedMouseDownHandler = mouseDownHandler

			document.addEventListener('mousemove', mouseMoveHandler, {passive:true})
			nowInitedMouseMoveHandler = mouseMoveHandler

			document.addEventListener('mouseup', mouseUpHandler, {passive:true})
			nowInitedMouseUpHandler = mouseUpHandler
		}
		render()

		return () => {
			if(canvas) canvas.remove()
			if(nowInitedResizeHandler){
				window.removeEventListener('scroll', nowInitedResizeHandler, {passive:true})
				window.removeEventListener('resize', nowInitedResizeHandler, {passive:true})
				nowInitedResizeHandler = null
			}
			if(nowInitedMouseDownHandler){
				document.removeEventListener('mousedown', nowInitedMouseDownHandler, {passive:true})
				nowInitedMouseDownHandler = null
			}
			if(nowInitedMouseMoveHandler){
				document.removeEventListener('mousemove', nowInitedMouseMoveHandler, {passive:true})
				nowInitedMouseMoveHandler = null
			}
			if(nowInitedMouseUpHandler){
				document.removeEventListener('mouseup', nowInitedMouseUpHandler, {passive:true})
				nowInitedMouseUpHandler = null
			}
		}
	}, [containerRef, stateRef])


	useEffect(() => {
		const state = stateRef.current
		state.selection = selectionType
		state.dropSelection()
		state.setCursor()
	}, [stateRef, selectionType])


	useEffect(() => {
		const state = stateRef.current
		state.setSelection = setSelectionType
		state.selectionOriginal = selectionOriginal
		state.setSelectionOriginal = setSelectionOriginal
		state.selectionTest = selectionTest
		state.setSelectionTest = setSelectionTest
		state.renderSelections()
	}, [stateRef, setSelectionType, selectionOriginal, setSelectionOriginal, selectionTest, setSelectionTest])


	const desriptionContent = useMemo(() => {
		if(selectionType === 'original') return <div>Выберите область с <span className='color-blue'>образцом эталонной пленки</span> на скане</div>
		else if(selectionType === 'test') return <div>Выберите область с <span className='color-red'>лабораторным экспериментальным образцом</span> на скане</div>
		else return null
	}, [selectionType])


	return (
		<div ref={containerRef} className='selection-container__image'>
			<div className='selection-container__legend'>
				<div className='selection-container__legend-left t14'>
					<div className='selection-container__legend-section'><div /><div>область с эталонной пленкой</div></div>
					<div className='selection-container__legend-section'><div /><div>область с лабораторным экспериментальным образцом</div></div>
				</div>
				<div className='selection-container__legend-right t14 lh120'>{desriptionContent}</div>
			</div>
			<div className='selection-container__body'>
			</div>
		</div>
	)

}
export default EstimateSelectPreview