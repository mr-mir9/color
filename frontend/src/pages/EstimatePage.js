import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { isObj } from '../helpers/IsType'
import { useUser } from '../lib/User'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EstimateUpload from '../components/EstimateUpload'
import EstimateSelect from '../components/EstimateSelect'
import EstimateResults from '../components/EstimateResults'


function EstimatePage(){

	const navigate = useNavigate()
	const { user } = useUser()
	useEffect(() => {
		if(!user) navigate('/', { replace: true })
	}, [user, navigate])


	/* ЭТАП 1: Загрузка скана */
	const [image, setImage] = useState(null)




	/* ЭТАП 2: Выбор областей */
	const [imageData, setImageData] = useState(null)
	const [selectionType, setSelectionType] = useState(null)
	const [selectionOriginal, setSelectionOriginal] = useState(null)
	const [selectionTest, setSelectionTest] = useState(null)
	const [percentDeviation, setPercentDeviation] = useState('5')




	/* ЭТАП 3: Рассчеты */
	const [results, setResults] = useState(null)




	const content = useMemo(() => {
		if(!isObj(image)) return <EstimateUpload setImage={setImage} />
		else if(results) return <EstimateResults results={results} setResults={setResults} />
		else return <EstimateSelect image={image} setImage={setImage} imageData={imageData} setImageData={setImageData} selectionType={selectionType} setSelectionType={setSelectionType} selectionOriginal={selectionOriginal} setSelectionOriginal={setSelectionOriginal} selectionTest={selectionTest} setSelectionTest={setSelectionTest} percentDeviation={percentDeviation} setPercentDeviation={setPercentDeviation} setResults={setResults} />
	}, [image, imageData, selectionType, selectionOriginal, selectionTest, percentDeviation, results])


	if(!user) return null
	return (
		<div className='page'>
			<Navbar />
			<div className='estimate-section'>
				{content}
			</div>
			<Footer />
		</div>
	)

}
export default EstimatePage
export { EstimatePage as Component }