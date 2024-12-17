import { Children, useMemo, cloneElement, useRef, useEffect } from 'react'
import { isStr, isObj, isFunc } from './IsType'

import { ReactComponent as ArrowBottomSvg } from '../icons/ArrowBottom.svg'


function Select({ label, children, onChange }){

	const options = useMemo(() => {
		const result = []
		const elements = Children.toArray(children)
		for(const el of elements){
			if(!isObj(el) || el.type !== Option || !isObj(el.props)) throw new Error('Child element of Select must be a Option')

			const { value, selected } = el.props
			if(!isStr(value) || !value.length) throw new Error('Option must have a value')

			result.push({ value, selected, el })
		}
		return result
	}, [children])

	const content = useMemo(() => {
		const result = []
		for(const index in options) result.push(cloneElement(options[index].el, {...options[index].el.props, key:index}))
		return result
	}, [options])

	const contentSelected = useMemo(() => {
		for(const option of options){
			if(!option.selected) continue;
			return option.el
		}
		return false
	}, [options])


	const selectRef = useRef(null)
	useEffect(() => {
		const select = selectRef.current
		if(!select) return;

		let showed = false
		const show = () => {
			if(showed) return;
			showed = true
			select.classList.add('show')
		}
		const hide = () => {
			if(!showed) return;
			showed = false
			select.classList.remove('show')
		}
		const toggle = () => {
			if(showed) hide()
			else show()
		}

		const clickHandler = e => {
			const target = e.target

			const parentSelect = target.closest('.select')
			const isSelect = (target.classList.contains('select') && target===select) || parentSelect===select

			if(isSelect){

				const parentField = target.closest('.select-field')
				const isField = target.classList.contains('select-field') || parentField
				if(isField) toggle()

				const parentModal = target.closest('.select-modal')
				const isModal = target.classList.contains('select-modal') || parentModal
				if(isModal){

					const parentOption = target.closest('.select-option')
					const isOption = target.classList.contains('select-option') || parentOption
					if(isOption){
						const option = parentOption ?? target
						const value = option.getAttribute('data-value')
						if(isFunc(onChange)) onChange(value)
						hide()
					}

				}

			}else hide()
		}
		window.addEventListener('click', clickHandler)

		return () => {
			window.removeEventListener('click', clickHandler)
		}
	}, [selectRef, onChange])


	return (
		<div ref={selectRef} className='select'>
			<div className={`select-field ${contentSelected ? 'filled' : ''}`}>
				{isStr(label) && label.length ? <div className='select-label'>{label}</div> : null}
				{contentSelected}
				<ArrowBottomSvg className='select-field-arrow' />
			</div>
			<div className='select-modal'>{content}</div>
		</div>
	)

}

function Option({ value, children, selected }){

	return <div className={`select-option ${selected ? 'selected' : ''}`} data-value={value}>{children}</div>

}

export default Select
export { Option }