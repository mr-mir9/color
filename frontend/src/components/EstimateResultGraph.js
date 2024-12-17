import { useRef, useEffect } from 'react'
import Canvas from './CanvasV2'


function EstimateResultGraph({ deltaA, deltaB, deltaL }){

	const containerRef = useRef(null)
	useEffect(() => {
		const container = containerRef.current
		if(!container) return;

		const canvas = Canvas('#fff', 2)
		const el = canvas.element
		container.appendChild(el)


		let width, graphSize
		const resize = () => {
			width = container.clientWidth
			graphSize = (width - 16) / 2
			canvas.setSize(width, graphSize)
			grawAxes()
		}
		const grawAxes = () => {
			//canvas.text('0', graphSize/2+5, graphSize/2+5, 10, 'top left', '#444')

			// a - horizontal
			canvas.arrow(graphSize/2, graphSize/2, 0, graphSize/2)
			canvas.arrow(graphSize/2, graphSize/2, graphSize, graphSize/2)
			canvas.text('+256', graphSize, graphSize/2+10, 10, 'top right', '#444')
			canvas.text('-256', 0, graphSize/2+10, 10, 'top left', '#444')
			canvas.text('-a', 0, graphSize/2-10-12, 12, 'bottom left', '#000', '', 3)
			canvas.text('+a', graphSize, graphSize/2-10-12, 12, 'bottom right', '#000', '', 3)
			canvas.text('зеленый', 0, graphSize/2-10, 11, 'bottom left', '#777')
			canvas.text('красный', graphSize, graphSize/2-10, 11, 'bottom right', '#777')

			// b - vertical
			canvas.arrow(graphSize/2, graphSize/2, graphSize/2, 0)
			canvas.arrow(graphSize/2, graphSize/2, graphSize/2, graphSize)
			canvas.text('+256', graphSize/2+10, 0, 10, 'top left', '#444')
			canvas.text('-256', graphSize/2+10, graphSize, 10, 'bottom left', '#444')
			canvas.text('+b', graphSize/2-10, 0, 12, 'top right', '#000', '', 3)
			canvas.text('-b', graphSize/2-10, graphSize-12, 12, 'bottom right', '#000', '', 3)
			canvas.text('желтый', graphSize/2-10, 13, 11, 'top right', '#777')
			canvas.text('синий', graphSize/2-10, graphSize, 11, 'bottom right', '#777')

			// L - vertical
			const Lx = graphSize + 16 + graphSize/2
			canvas.line(Lx-5, graphSize/2, Lx+5, graphSize/2)
			canvas.arrow(Lx, graphSize/2, Lx, 0)
			canvas.arrow(Lx, graphSize/2, Lx, graphSize)
			canvas.text('+100', Lx+10, 0, 10, 'top left', '#444')
			canvas.text('-100', Lx+10, graphSize, 10, 'bottom left', '#444')
			canvas.text('0', Lx+10, graphSize/2, 10, 'middle left', '#444')
			canvas.text('+L', Lx-10, 0, 12, 'top right', '#000', '', 3)
			canvas.text('-L', Lx-10, graphSize-12, 12, 'bottom right', '#000', '', 3)
			canvas.text('белый', Lx-10, 13, 11, 'top right', '#777')
			canvas.text('черный', Lx-10, graphSize, 11, 'bottom right', '#777')

			drawDots()
		}
		const drawDots = () => {
			const posA = deltaA * graphSize/2 / 256
			const posB = deltaB * graphSize/2 / 256
			const posL = deltaL * graphSize/2 / 100

			canvas.circle(graphSize/2 + posA, graphSize/2 - posB, 4, 'red')

			const Lx = graphSize + 16 + graphSize/2
			canvas.circle(Lx, graphSize/2 - posL, 4, 'red')

			canvas.render()
		}
		resize()


		return () => {
			canvas.destroy()
		}
	}, [deltaA, deltaB, deltaL])


	return (
		<div className='result-estimate-container'>
			<div className='result-estimate__graph'>
				<div className='color-blue t16'>Схема цветового отклонения</div>
				<div ref={containerRef} className='result-estimate__graph-container' />
			</div>
		</div>
	)

}
export default EstimateResultGraph