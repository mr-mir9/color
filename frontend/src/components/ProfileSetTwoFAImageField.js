import { useId, useCallback, useState } from 'react'
import { isStr, isNum, isObj } from '../helpers/IsType'
import ProfileSetTwoFAImagePreview from './ProfileSetTwoFAImagePreview'

import { ReactComponent as CloudUploadSvg } from '../icons/CloudUpload.svg'


function ProfileSetTwoFAImageField({ image, setImage, imageWidth, setImageWidth, imageHeight, setImageHeight, dots, setDots, inaccuracy }){

	const id = useId()
	const [error, setError] = useState(null)


	const selectFileHandler = useCallback(e => {
		setError(null)

		try{
			const input = e.target
			const files = input.files
			if(!files.length) return;

			if(files.length !== 1) throw new Error('Выберите 1 изображение')

			const file = files[0]
			input.value = ''
			if(!['image/webp', 'image/png', 'image/jpeg', 'image/bmp'].includes(file.type)) throw new Error('Изображение должно быть JPG, JPEG, PNG, WEBP или BMP')
			if(!isNum(file.size) || file.size > 10000000) throw new Error('Максимальный размер файла 10 Мб')

			const reader = new FileReader()
			reader.onload = function(e) {
			    const blob = new Blob([new Uint8Array(e.target.result)], { type:file.type })
			    setImage({ url:URL.createObjectURL(blob), file })
			}
			reader.onerror = () => { setError('Ошибка загрузки предпросмотра') }
			reader.readAsArrayBuffer(file)
		}catch(e){
			setError(e.message)
		}
	}, [setImage])


	return (
		<div className='form-field profile-2fa-image-form-field'>
			{isObj(image) && isStr(image.url) ? <ProfileSetTwoFAImagePreview url={image.url} setImage={setImage} imageWidth={imageWidth} setImageWidth={setImageWidth} imageHeight={imageHeight} setImageHeight={setImageHeight} dots={dots} setDots={setDots} inaccuracy={inaccuracy} /> : (
				<div className='profile-2fa-image-field'>
					<label className='profile-2fa-image-label' htmlFor={id}>
						<div />
						<div>
							<div className='color-gray t16'>Выберите изображение</div>
							<div className='btn blue'><CloudUploadSvg className='btn-ico__left' /><div>Выбрать файл</div></div>
						</div>
					</label>
					<input type='file' id={id} onChange={selectFileHandler} />
					{isStr(error) && error.length ? <div className='field-error'>{error}</div> : null}
				</div>
			)}
		</div>
	)

}
export default ProfileSetTwoFAImageField