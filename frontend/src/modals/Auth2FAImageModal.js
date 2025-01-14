import { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import { isStr, isArr, isObj } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import { useUser } from '../lib/User'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function Auth2FAImageModal({ callback, email, password, image }){

	const api = useApi()
	const { setToken, setUser } = useUser()


	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const containerRef = useRef(null)
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)
	useEffect(() => {
		const container = containerRef.current
		const containerWidth = container.getBoundingClientRect().width

		const img = new Image()
		img.onload = e => {
			let width = containerWidth
			let height = width * img.height / img.width
			if(height > 320){
				height = 320
				width = height * img.width / img.height
			}
			setWidth(width)
			setHeight(height)
		}
		img.onerror = () => setError('Ошибка загрузки изображения')
		img.src = image
	}, [containerRef, image])


	const [dots, setDots] = useState([])
	useEffect(() => {
		const container = containerRef.current
		const block = container.querySelector('.modal-2fa-image-block')

		const clickHandler = e => {
			const target = e.target

			const parentBlock = target.closest('.modal-2fa-image-block')
			const isBlock = (target.classList.contains('modal-2fa-image-block') && target === block) || parentBlock === block
			if(!isBlock) return;

			e.preventDefault()
			const size = block.getBoundingClientRect()
			const x = e.x - size.x
			const relativeX = x / width
			const y = e.y - size.y
			const relativeY = y / height
			setDots(state => [...state, { x, y, relativeX, relativeY }])
		}
		window.addEventListener('click', clickHandler)

		return () => {
			window.removeEventListener('click', clickHandler)
		}
	}, [containerRef, width, height])
	useEffect(() => { setError(null) }, [dots])
	

	const content = useMemo(() => {
		const result = []
		for(let index in dots){
			const dot = dots[index]
			index = parseInt(index)
			result.push(<div key={index} className='modal-2fa-image-dot' style={{ left:`${dot.x}px`, top:`${dot.y}px` }}><div><div>{index+1}</div><div /></div></div>)
		}
		return result
	}, [dots])


	const disabled = useMemo(() => {
		if(loading) return true
		if(!isArr(dots) || dots.length < 1) return true
		return false
	}, [loading, dots])


	const submitHandler = useCallback(e => {
		e.preventDefault()

		const dotsArr = []
		for(const dot of dots) dotsArr.push(`${dot.relativeX},${dot.relativeY}`)

		api.Account.login({ email, password, '2fa_image_dots':dotsArr })
		.then(data => {
			if(!isObj(data) || data.object !== 'session') return;
			setToken(data.token)
			setUser(data.user)
			callback()
		})
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [api, callback, setToken, setUser, dots, email, password])


	const clearHander = useCallback(e => {
		e.preventDefault()
		setDots([])
	}, [])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Укажите точки на изображении</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form' onSubmit={submitHandler}>
				<div className='form-field'>
					<div ref={containerRef} className='modal-2fa-image'><div style={{ width:`${width}px`, height:`${height}px`, backgroundImage:`url('${image}')` }} className='modal-2fa-image-block'>{content}</div></div>
				</div>
				{isArr(dots) && dots.length ? <div className='form-field'><div className='modal-2fa-image-clear color-gray2 t14' onClick={clearHander}>Очистить выбранные точки</div></div> : null}
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Войти'}</button></div>
			</form>
		</div>
	)

}
export default Auth2FAImageModal