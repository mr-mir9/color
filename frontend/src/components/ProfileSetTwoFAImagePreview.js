import { useRef, useEffect, useMemo, useCallback } from 'react'


function ProfileSetTwoFAImagePreview({ url, setImage, imageWidth, setImageWidth, imageHeight, setImageHeight, dots, setDots, inaccuracy }){

	const containerRef = useRef(null)
	useEffect(() => {
		const container = containerRef.current

		const image = new Image()
		image.onload = e => {
			let width = container.clientWidth
			let height = width * image.height / image.width
			if(height > 320){
				height = 320
				width = height * image.width / image.height
			}
			setImageWidth(width)
			setImageHeight(height)
		}
		image.onerror = () => { throw new Error('Ошибка загрузки изображения') }
		image.src = url
	}, [containerRef, url, setImageWidth, setImageHeight])


	const stateRef = useRef({ imageWidth, imageHeight })
	useEffect(() => {
		const state = stateRef.current
		state.imageWidth = imageWidth
		state.imageHeight = imageHeight
	}, [stateRef, imageWidth, imageHeight])


	useEffect(() => {
		const state = stateRef.current

		const container = containerRef.current
		const body = container.querySelector('.profile-2fa-image-preview')

		const clickHandler = e => {
			const bodySize = body.getBoundingClientRect()
			const x = e.x-bodySize.x
			const relativeX = x/state.imageWidth
			const y = e.y-bodySize.y
			const relativeY = y/state.imageHeight
			setDots(state => [...state, { x, relativeX, y, relativeY }])
		}
		body.addEventListener('click', clickHandler)

		return () => {
			body.removeEventListener('click', clickHandler)
		}
	}, [stateRef, containerRef, setDots])


	const deleteHandler = useCallback(e => {
		e.preventDefault()
		setImage(null)
		setDots([])
	}, [setImage, setDots])

	const clearHandler = useCallback(e => {
		e.preventDefault()
		setDots([])
	}, [setDots])


	const content = useMemo(() => {
		let inaccuracySize = 0
		if(imageWidth > imageHeight) inaccuracySize = imageWidth * parseFloat(inaccuracy) / 100
		else inaccuracySize = imageHeight * parseFloat(inaccuracy) / 100

		const result = []
		for(let index in dots){
			const dot = dots[index]
			index = parseInt(index)
			result.push(
				<div key={index} className='profile-2fa-image-preview-dot' style={{ top:`${dot.y}px`, left:`${dot.x}px` }}>
					<div className='profile-2fa-image-preview-dot-container'>
						<div>{index+1}</div>
						<div style={{ width:`${inaccuracySize}px`, height:`${inaccuracySize}px` }} />
					</div>
				</div>
			)
		}
		return result
	}, [imageWidth, imageHeight, inaccuracy, dots])


	return (
		<div ref={containerRef} className='profile-2fa-image-preview-container'>
			<div className='t14 color-blue profile-2fa-image-preview-title'>Установите точки на изображении</div>
			<div className='profile-2fa-image-preview' style={{ backgroundImage:`url(${url})`, width:`${imageWidth}px`, height:`${imageHeight}px` }}>{content}</div>
			<div className='profile-2fa-image-preview-buttons t14'>
				<div className='color-red' onClick={deleteHandler}>Удалить изображение</div>
				<div className='color-gray2' onClick={clearHandler}>Сбросить точки</div>
			</div>
		</div>
	)

}
export default ProfileSetTwoFAImagePreview