import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import RGB_TO_LAB from '../helpers/RGB_TO_LAB'
import Field from '../helpers/Field'
import EstimateSelectPreview from '../components/EstimateSelectPreview'
import EstimateSelectPreviewArea from '../components/EstimateSelectPreviewArea'

import { ReactComponent as ArrowLeftSvg } from '../icons/ArrowLeft.svg'
import { ReactComponent as FullScreenSvg } from '../icons/FullScreen.svg'

function EstimateSelect({ image, setImage, imageData, setImageData, selectionType, setSelectionType, selectionOriginal, setSelectionOriginal, selectionTest, setSelectionTest, percentDeviation, setPercentDeviation, setResults }){

	const backHandler = useCallback(e => {
		e.preventDefault()
		setImage(null)
		setImageData(null)
		setSelectionType(null)
		setSelectionOriginal(null)
		setSelectionTest(null)
	}, [setImage, setImageData, setSelectionType, setSelectionOriginal, setSelectionTest])


	const [loading, setLoading] = useState(true)


	const loadingImageRef = useRef(null)
	useEffect(() => {
		const loadingImage = loadingImageRef.current
		if(loadingImage === image) return;
		loadingImageRef.current = image
		setLoading(true)

		const reader = new FileReader()
		reader.addEventListener('load', e => {
			const blob = new Blob([new Uint8Array(e.target.result)], {type: image.type})
			const url = URL.createObjectURL(blob)
			const img = new Image()
			img.onload = () => {
				const { width, height } = img
				setImageData({ obj:img, url, width, height })
				setLoading(false)
			}
			img.src = url
		})
		reader.readAsArrayBuffer(image)
	}, [loadingImageRef, image, setImageData])


	const originalContent = useMemo(() => {
		const unselectHandler = e => {
			e.preventDefault()
			setSelectionType(null)
			setSelectionOriginal(null)
		}
		const startSelectHandler = e => {
			e.preventDefault()
			setSelectionType('original')
			setSelectionOriginal(null)
		}

		if(selectionOriginal) return (
			<>
				<EstimateSelectPreviewArea image={imageData.obj} area={selectionOriginal} />
				<button className='btn gray' disabled={loading} onClick={unselectHandler}>Сбросить</button>
			</>
		)
		if(selectionType === 'original') return (
			<>
				<div className='selected-container__empty-text color-gray m16 lh120 center'>Выделение области с эталонной пленкой на скане...</div>
				<button className='btn red' disabled={loading} onClick={unselectHandler}>Отменить</button>
			</>
		)
		return (
			<>
				<div className='selected-container__empty-text color-gray m16 lh120 center'>Необходимо выделить область с цветом данного образца на загруженном скане</div>
				<button className='btn blue' disabled={loading} onClick={startSelectHandler}><FullScreenSvg className='btn-ico__left' /><div>Выделить</div></button>
			</>
		)
	}, [selectionOriginal, selectionType, setSelectionType, setSelectionOriginal, loading, imageData])

	const testContent = useMemo(() => {
		const unselectHandler = e => {
			e.preventDefault()
			setSelectionType(null)
			setSelectionTest(null)
		}
		const startSelectHandler = e => {
			e.preventDefault()
			setSelectionType('test')
			setSelectionTest(null)
		}

		if(selectionTest) return (
			<>
				<EstimateSelectPreviewArea image={imageData.obj} area={selectionTest} />
				<button className='btn gray' disabled={loading} onClick={unselectHandler}>Сбросить</button>
			</>
		)
		if(selectionType === 'test') return (
			<>
				<div className='selected-container__empty-text color-gray m16 lh120 center'>Выделение области с лабораторным экспериментальным образцом на скане...</div>
				<button className='btn red' disabled={loading} onClick={unselectHandler}>Отменить</button>
			</>
		)
		return (
			<>
				<div className='selected-container__empty-text color-gray m16 lh120 center'>Необходимо выделить область с цветом данного образца на загруженном скане</div>
				<button className='btn blue' disabled={loading} onClick={startSelectHandler}><FullScreenSvg className='btn-ico__left' /><div>Выделить</div></button>
			</>
		)
	}, [selectionTest, selectionType, setSelectionType, setSelectionTest, loading, imageData])



	const calcRgbSelection = useCallback(data => {
		const percentDeviationNum = parseInt(percentDeviation)
		const deviation = 255*percentDeviationNum/100

		const canvas = document.createElement('canvas')
		canvas.width = data.realWidth
		canvas.height = data.realHeight
		const ctx = canvas.getContext('2d')
		ctx.drawImage(imageData.obj, data.realX, data.realY, data.realWidth, data.realHeight, 0, 0, data.realWidth, data.realHeight)

		const imageBuffer = ctx.getImageData(0, 0, data.realWidth, data.realHeight, {colorSpace:'srgb'})
		const { data:pixels } = imageBuffer
		const dump = {}
		let count=0
		const sum = { r:0, g:0, b:0 }
		for(let i = 0; i < pixels.length; i+=4){
			const key = `rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})`

			if(!dump[key]) dump[key] = { total:0, valid:false }
			dump[key].total++

			count++
			sum.r += pixels[i]
			sum.g += pixels[i+1]
			sum.b += pixels[i+2]
		}

		const average = { r:sum.r/count, g:sum.g/count, b:sum.b/count }

		const normalizeRgb = data => {
			const r = data.r > 255 ? 255 : data.r < 0 ? 0 : parseInt(data.r)
			const g = data.g > 255 ? 255 : data.g < 0 ? 0 : parseInt(data.g)
			const b = data.b > 255 ? 255 : data.b < 0 ? 0 : parseInt(data.b)
			return { r, g, b }
		}
		const min = normalizeRgb({ r:average.r-deviation, g:average.g-deviation, b:average.b-deviation })
		const max = normalizeRgb({ r:average.r+deviation, g:average.g+deviation, b:average.b+deviation })
		
		let countGood = 0
		const sumGood = { r:0, g:0, b:0 }
		for(let i = 0; i < pixels.length; i+=4){
			const r = pixels[i], g = pixels[i+1], b = pixels[i+2]
			const valid = r >= min.r && r <= max.r && g >= min.g && g <= max.g && b >= min.b && b <= max.b
			const key = `rgb(${r},${g},${b})`
			dump[key].valid = valid
			if(!valid) continue;

			countGood++
			sumGood.r += r
			sumGood.g += g
			sumGood.b += b
		}

		const averageGood = normalizeRgb({ r:sumGood.r/countGood, g:sumGood.g/countGood, b:sumGood.b/countGood })
		return { count, countGood, rgb:averageGood, lab:RGB_TO_LAB(averageGood), dump }
	}, [imageData, percentDeviation])
	const submitHandler = useCallback(e => {
		e.preventDefault()
		try{
			if(!selectionOriginal) throw new Error('Выделите область с эталонной пленкой')
			if(!selectionTest) throw new Error('Выделите область с лабораторным экспериментальным образцом')
			if(!/^[0-9]{1,3}$/.test(percentDeviation)) throw new Error('Введите процент погрешности сканера')

			const percentDeviationNum = parseInt(percentDeviation)
			if(percentDeviationNum < 0 || percentDeviationNum > 100) throw new Error('Введите корректный процент погрешности сканера')

			const resultOriginal = calcRgbSelection(selectionOriginal)
			//console.log('>>> DUMP эталон:')
			//console.table(resultOriginal.dump)

			const resultTest = calcRgbSelection(selectionTest)
			//console.log('>>> DUMP экспериментальный образец:')
			//console.table(resultTest.dump)

			const e = Math.sqrt(Math.pow(resultOriginal.lab.L - resultTest.lab.L, 2) + Math.pow(resultOriginal.lab.a - resultTest.lab.a, 2) + Math.pow(resultOriginal.lab.b - resultTest.lab.b, 2))
			setResults({ e, dL:resultTest.lab.L-resultOriginal.lab.L, dA:resultTest.lab.a-resultOriginal.lab.a, dB:resultTest.lab.b-resultOriginal.lab.b, original:resultOriginal, test:resultTest })
		}catch(e){
			alert(e.message)
		}
	}, [calcRgbSelection, selectionOriginal, selectionTest, percentDeviation, setResults])


	return (
		<div className='estimate-container'>
			<div className='estimate-container__title color-blue m18'>
				<div className='estimate-container__back' onClick={backHandler}><ArrowLeftSvg /><div>Назад</div></div>
				<div>Оценка цветового отклонения полимерной пленки от эталона</div>
				<div className='color-gray3'>/</div>
				<div className='color-gray'>Выделение областей с образцами</div>
			</div>
			<div className='selection-container'>
				{loading ? (
					<div className='selection-container__image-loader'>
						<div />
						<div className='t16 color-gray2'>Загрузка предпросмотра изображения...</div>
					</div>
				): <EstimateSelectPreview image={imageData.obj} imageUrl={imageData.url} imageWidth={imageData.width} imageHeight={imageData.height} selectionType={selectionType} setSelectionType={setSelectionType} selectionOriginal={selectionOriginal} setSelectionOriginal={setSelectionOriginal} selectionTest={selectionTest} setSelectionTest={setSelectionTest} />}
				<div className='selection-container__right'>
					<div className='selected-container'>
						<div className='color-blue t14 center'>Эталонная пленка</div>
						{originalContent}
					</div>
					<div className='selected-container'>
						<div className='color-blue t14 center'>Лабораторный экспериментальный образец</div>
						{testContent}
					</div>
					{/*<Field value={percent} setValue={setPercent} validator={/^(0(,[0-9]{0,3})?)?$/i} />*/}
					<Field label='Погрешность расчётов (%)' value={percentDeviation} setValue={setPercentDeviation} pattern={/^(100|([1-9]{1}[0-9]{1})|([0-9]{1}))$/i} />
					<button className='btn blue' disabled={loading} onClick={submitHandler}>Оценить цветовое отклонение</button>
				</div>
			</div>
		</div>
	)

}
export default EstimateSelect