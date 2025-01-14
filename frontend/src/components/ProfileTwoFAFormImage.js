import { useState, useEffect } from 'react'


function ProfileTwoFAFormImage({ image }){

	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)
	useEffect(() => {
		const img = new Image()
		img.onload = e => {
			let width = 320
			let height = width * img.height / img.width
			if(height > 320){
				height = 320
				width = height * img.width / img.height
			}
			setWidth(width)
			setHeight(height)
		}
		img.src = image
	}, [image])

console.log(`url(${image})`)
	return (
		<div className='profile-2fa-form-image'>
			<div style={{ width:`${width}px`, height:`${height}px`, backgroundImage:`url('${image}')` }} />
		</div>
	)

}
export default ProfileTwoFAFormImage