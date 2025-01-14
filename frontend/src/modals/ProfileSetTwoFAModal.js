import { useCallback, useState, useMemo } from 'react'
import { isStr, isObj } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import Select, { Option } from '../helpers/Select'
import ProfileSetTwoFAImageField from '../components/ProfileSetTwoFAImageField'
import SelectRange from '../helpers/SelectRange'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function ProfileSetTwoFAModal({ callback }){

	const api = useApi()


	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const [type, setType] = useState('')

	const [image, setImage] = useState(null)
	const [imageWidth, setImageWidth] = useState(0)
	const [imageHeight, setImageHeight] = useState(0)

	const [dots, setDots] = useState([])
	const [inaccuracy, setInaccuracy] = useState('5')

	const disabled = useMemo(() => {
		if(loading) return true
		if(!['image'].includes(type)) return true
		if(type === 'image'){
			if(!isObj(image)) return true
			if(!dots.length) return true
		}
		return false
	}, [loading, type, image, dots])


	const submitHandler = useCallback(e => {
		e.preventDefault()

		setLoading(true)
		setError(null)

		const request = { type, image:image.file, inaccuracy, dots:[] }
		for(const dot of dots) request.dots.push(`${dot.relativeX},${dot.relativeY}`)

		api.Account.set2FA(request)
		.then(callback)
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [api, callback, type, image, inaccuracy, dots])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Установить 2FA</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form profile-2fa-form-modal' onSubmit={submitHandler}>
				<div className='form-field'>
					<Select label='Тип двухфакторной авторизации' onChange={setType}>
						<Option value='image' selected={type==='image'}>Графический</Option>
					</Select>
				</div>
				{type === 'image' ? (
					<>
						<ProfileSetTwoFAImageField image={image} setImage={setImage} imageWidth={imageWidth} setImageWidth={setImageWidth} imageHeight={imageHeight} setImageHeight={setImageHeight} dots={dots} setDots={setDots} inaccuracy={inaccuracy} />
						{image ? <div className='form-field form-field-w50 profile-2fa-info-dots'><div className='t16'>Выбрано точек: <span className={dots.length ? 'color-blue' : 'color-gray2'}>{dots.length}</span></div><div className='t12 color-gray2'>минимум 1 точка</div></div> : null}
						{image ? <div className='form-field form-field-w50'><SelectRange from={1} to={15} postfix='%' value={inaccuracy} setValue={setInaccuracy} label='Погрешность' /></div> : null}
					</>
				) : null}
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Установить'}</button></div>
			</form>
		</div>
	)

}
export default ProfileSetTwoFAModal