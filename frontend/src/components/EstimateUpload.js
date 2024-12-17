import { useId, useRef, useEffect } from 'react'
import { isNum, isFunc } from '../helpers/IsType'

import { ReactComponent as CloudUploadSvg } from '../icons/CloudUpload.svg'


function EstimateUpload({ setImage }){

	const id = useId()


	const inputRef = useRef(null)
	useEffect(() => {
		const input = inputRef.current
		if(!input) return;

		const uploadHandler = e => {
			try{
				const files = input.files
				if(!files.length) return;
				if(files.length !== 1) throw new Error('Выберите 1 изображение')

				const file = files[0]
				input.value = ''
				if(!['image/webp', 'image/png', 'image/jpeg', 'image/bmp'].includes(file.type)) throw new Error('Изображение должно быть JPG, JPEG, PNG, WEBP или BMP')
				if(!isNum(file.size) || file.size > 10000000) throw new Error('максимальный размер файла 10 Мб')

				if(isFunc(setImage)) setImage(file)
			}catch(e){
				alert(e.message)
			}
		}
		input.addEventListener('change', uploadHandler)

		return () => {
			input.removeEventListener('change', uploadHandler)
		}
	}, [inputRef, setImage])

	return (
		<div className='estimate-container upload-image-container'>
			<div className='color-blue m18 center'>Оценка цветового отклонения полимерной пленки от эталона</div>
			<label className='upload-image-body' htmlFor={id}>
				<div className='upload-image-body__icon' />
				<div className='color-gray t16'>Загрузите изображение со сканера</div>
				<button className='btn blue' onClick={() => inputRef.current.click()}><CloudUploadSvg className='btn-ico__left' /><div>Выбрать файл</div></button>
			</label>
			<input ref={inputRef} type='file' id={id} />
		</div>
	)

}
export default EstimateUpload