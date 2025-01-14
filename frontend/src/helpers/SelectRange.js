import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import { isStr } from './IsType'


function SelectRange({ from, to, postfix, value, setValue, label }){

	const fieldRef = useRef(null)
	const [valuePx, setValuePx] = useState(0)
	useLayoutEffect(() => {
		const field = fieldRef.current
		const line = field.querySelector('.select-range-line')
		const lineWidth = line.getBoundingClientRect().width

		const delta = to - from
		const valueNum = parseInt(value)
		const deltaValue = valueNum - from

		setValuePx(deltaValue * lineWidth / delta)
	}, [fieldRef, value, from, to])


	const stateRef = useRef({ hover:false, selecting:false, from, to })
	useEffect(() => {
		const state = stateRef.current
		state.from = from
		state.to = to
		state.delta = to - from
	}, [stateRef, from, to])


	const [hover, setHover] = useState(false)
	const [selecting, setSelecting] = useState(false)
	const [valuePxSelecting, setValuePxSelecting] = useState(0)
	useEffect(() => {
		const state = stateRef.current

		const field = fieldRef.current
		const line = field.querySelector('.select-range-line')
		const dot = field.querySelector('.select-range-dot')

		const hover = value => {
			if(state.hover === value) return;
			state.hover = value
			setHover(value)
		}
		const hoverHandler = e => {
			hover(true)
		}
		dot.addEventListener('mouseenter', hoverHandler, { passive:true })
		const unhoverHandler = e => {
			hover(false)
		}
		dot.addEventListener('mouseleave', unhoverHandler, { passive:true })


		let width = 0
		let left = 0
		const render = () => {
			const size = line.getBoundingClientRect()
			width = size.width
			left = size.left
		}
		render()


		let started = false
		const startSelect = () => {
			started = true
		}
		const endSelect = () => {
			if(!state.selecting) return;
			state.selecting = false
			setSelecting(false)
			started = false
		}
		const moveSelect = (x, y) => {
			let deltaLeft = x - left
			if(deltaLeft < 0) deltaLeft = 0
			if(deltaLeft > width) deltaLeft = width
			setValuePxSelecting(deltaLeft)
			setValue(parseInt(deltaLeft * state.delta / width) + state.from)

			if(!state.selecting){
				state.selecting = true
				setSelecting(true)
			}
		}


		const mouseDownHandler = e => {
			const target = e.target

			const parentField = target.closest('.select-range')
			const isField = (target.classList.contains('select-range') && target === field) || parentField === field
			if(!isField) return endSelect()

			const parentDot = target.closest('.select-range-dot')
			const isDot = target.classList.contains('select-range-dot') || parentDot
			if(!isDot) return endSelect()

			e.preventDefault()
			startSelect()
		}
		window.addEventListener('mousedown', mouseDownHandler)

		const mouseMoveHandler = e => {
			if(!started) return;

			e.preventDefault()
			moveSelect(e.x, e.y)
		}
		window.addEventListener('mousemove', mouseMoveHandler)

		const mouseUpHandler = e => {
			if(!started) return;

			e.preventDefault()
			endSelect()
		}
		window.addEventListener('mouseup', mouseUpHandler)


		return () => {
			dot.removeEventListener('mouseenter', hoverHandler, { passive:true })
			dot.removeEventListener('mouseleave', unhoverHandler, { passive:true })
			window.removeEventListener('mousedown', mouseDownHandler)
			window.removeEventListener('mousemove', mouseMoveHandler)
			window.removeEventListener('mouseup', mouseUpHandler)
		}
	}, [stateRef, fieldRef, setValue])


	const padding = useMemo(() => {
		if(selecting) return valuePxSelecting
		return valuePx
	}, [selecting, valuePxSelecting, valuePx])


	return (
		<div ref={fieldRef} className={`select-range ${hover ? 'hover' : ''}`}>
			<div className='select-range-label'>
				<div className='color-gray3 t12'>{isStr(label) && label.length ? label : ''}</div>
				<div className='color-gray t14'>{`${value}${isStr(postfix) && postfix.length ? postfix : ''}`}</div>
			</div>
			<div className='select-range-line'>
				<div className='select-range-bar' style={{ width:`${padding}px` }} />
				<div className='select-range-dot' style={{ left:`${padding}px` }}><div /></div>
				<div className='select-range-values'>
					<div>{`${from}${isStr(postfix) && postfix.length ? postfix : ''}`}</div>
					<div>{`${to}${isStr(postfix) && postfix.length ? postfix : ''}`}</div>
				</div>
			</div>
		</div>
	)

}
export default SelectRange