import { useEffect } from 'react'
import { isFunc, isPromise } from '../helpers/IsType'


function LoaderModal({ callback, promise }){

	useEffect(() => {
		if(!isFunc(promise)) return;

		const result = promise()
		if(!isPromise(result)) throw new Error('Promise function must resolve promise')

		result.then(callback)
	}, [promise, callback])

	return <div className='modal-loader__content'><div /></div>

}
export default LoaderModal