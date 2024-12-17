import { useCallback, useMemo } from 'react'
import EstimateResultGraph from './EstimateResultGraph'

import { ReactComponent as ArrowLeftSvg } from '../icons/ArrowLeft.svg'


function EstimateResults({ results, setResults }){

	const backHandler = useCallback(e => {
		e.preventDefault()
		setResults(null)
	}, [setResults])


	const [recommendationL, recommendationA, recommendationB, recommendationE] = useMemo(() => {
		const result = []

		if(results.dL.toFixed(1) === 0) result.push('идеальная светлость!')
		else if(results.dL > 0) result.push('больше светлого')
		else result.push('больше темного')

		if(results.dA.toFixed(1) === 0) result.push('идеально!')
		else if(results.dA > 0) result.push('меньше красного, больше зеленого')
		else result.push('меньше зеленого, больше красного')

		if(results.dB.toFixed(1) === 0) result.push('идеально!')
		else if(results.dB > 0) result.push('меньше желтого, больше синего')
		else result.push('меньше синего, больше желтого')

		if(results.e > 5) result.push(<span className='color-red'>недопустимое отклонение</span>)
		else result.push(<span className='color-green'>допустимое отклонение</span>)

		return result
	}, [results.dL, results.dA, results.dB, results.e])


	return (
		<div className='estimate-container'>
			<div className='estimate-container__title color-blue m18'>
				<div className='estimate-container__back' onClick={backHandler}><ArrowLeftSvg /><div>Назад</div></div>
				<div>Оценка цветового отклонения полимерной пленки от эталона</div>
				<div className='color-gray3'>/</div>
				<div className='color-gray'>Результаты оценки цветового отклонения</div>
			</div>
			<div className='results-estimate-container'>
				<div className='result-estimate-container'>
					<div className='result-estimate__example'>
						<div className='color-blue t16'>Эталонная пленка</div>
						<div className='result-estimate__blocks'>
							<div>
								<div className='result-estimate__block'>
									<div className='color-gray2 t14'>Обработанные пиксели</div>
									<div className='color-gray m16'>{results.original.count}</div>
								</div>
								<div className='result-estimate__block'>
									<div className='color-gray2 t14'>Плохие пиксели</div>
									<div className='color-gray m16'>{results.original.count - results.original.countGood}</div>
								</div>
								<div className='result-estimate__block'>
									<div className='color-gray2 t14'>Процент отбраковки (%)</div>
									<div className='color-gray m16'>{Math.floor((results.original.count - results.original.countGood)*100/results.original.count, 2)}</div>
								</div>
							</div>
							<div>
								<div className='color-gray2 t14'>Обработанный (средний) цвет</div>
								<div className='result-estimate__color' style={{ background:`rgb(${results.original.rgb.r}, ${results.original.rgb.g}, ${results.original.rgb.b})` }} />
								<div className='result-estimate__color-value color-gray m16'>R={results.original.rgb.r}, G={results.original.rgb.g}, B={results.original.rgb.b}</div>
								<div className='result-estimate__color-value color-gray m16'>L={results.original.lab.L.toFixed(3)}, a={results.original.lab.a.toFixed(3)}, b={results.original.lab.b.toFixed(3)}</div>
							</div>
						</div>
					</div>
				</div>
				<div className='result-estimate-container'>
					<div className='result-estimate__example'>
						<div className='color-blue t16'>Лабораторный экспериментальный образец</div>
						<div className='result-estimate__blocks'>
							<div>
								<div className='result-estimate__block'>
									<div className='color-gray2 t14'>Обработанные пиксели</div>
									<div className='color-gray m16'>{results.test.count}</div>
								</div>
								<div className='result-estimate__block'>
									<div className='color-gray2 t14'>Плохие пиксели</div>
									<div className='color-gray m16'>{results.test.count - results.test.countGood}</div>
								</div>
								<div className='result-estimate__block'>
									<div className='color-gray2 t14'>Процент отбраковки (%)</div>
									<div className='color-gray m16'>{Math.floor((results.test.count - results.test.countGood)*100/results.test.count, 2)}</div>
								</div>
							</div>
							<div>
								<div className='color-gray2 t14'>Обработанный (средний) цвет</div>
								<div className='result-estimate__color' style={{ background:`rgb(${results.test.rgb.r}, ${results.test.rgb.g}, ${results.test.rgb.b})` }} />
								<div className='result-estimate__color-value color-gray m16'>R={results.test.rgb.r}, G={results.test.rgb.g}, B={results.test.rgb.b}</div>
								<div className='result-estimate__color-value color-gray m16'>L={results.test.lab.L.toFixed(3)}, a={results.test.lab.a.toFixed(3)}, b={results.test.lab.b.toFixed(3)}</div>
							</div>
						</div>
					</div>
				</div>
				<EstimateResultGraph deltaA={results.dA} deltaB={results.dB} deltaL={results.dL} />
				<div className='result-estimate-container'>
					<div>
						<div className='color-blue t16'>Цветовое различие</div>
						<div className='result-estimate__param m16'>ΔL = {results.dL.toFixed(1)} <span className='color-gray3'> - {recommendationL}</span></div>
						<div className='result-estimate__param m16'>Δa = {results.dA.toFixed(1)} <span className='color-gray3'> - {recommendationA}</span></div>
						<div className='result-estimate__param m16'>Δb = {results.dB.toFixed(1)} <span className='color-gray3'> - {recommendationB}</span></div>
						<div className='result-estimate__param m16'>ΔE = {results.e.toFixed(1)} {recommendationE}</div>
					</div>
				</div>
			</div>
		</div>
	)

}
export default EstimateResults