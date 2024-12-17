import { useRef, useEffect } from 'react'
import Canvas from '../helpers/Canvas'


function EstimateSelectPreviewArea({ image, area }){


	const containerRef = useRef(null)
	useEffect(() => {
		const container = containerRef.current

		let canvasWidth = container.clientWidth
		let canvasHeight = canvasWidth * area.realHeight / area.realWidth
		if(canvasHeight > 200){
			canvasHeight = 200
			canvasWidth = canvasHeight * area.realWidth / area.realHeight
		}

		const canvasMultiple = 2
		const canvas = new Canvas({ background:'#fff', multiple:canvasMultiple })
		const canvasEl = canvas.getCanvas(canvasWidth, canvasHeight)
		container.appendChild(canvasEl)
		canvas.fillImagePos(image, area.realX, area.realY, area.realWidth, area.realHeight, 0, 0, canvasWidth, canvasHeight)

		return () => {
			canvas.remove()
		}
	}, [containerRef, image, area])


	return <div ref={containerRef} className='selected-container__canvas' />

}
export default EstimateSelectPreviewArea