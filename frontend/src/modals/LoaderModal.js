import { useEffect, useRef } from 'react'
import { isFunc, isPromise } from '../helpers/IsType'


function LoaderModal({ callback, promise }){

	const initedRef = useRef(false)
	useEffect(() => {
		if(!isFunc(promise)) return;

		if(initedRef.current) return;
		initedRef.current = true

		const result = promise()
		if(!isPromise(result)) throw new Error('Promise function must resolve promise')

		result.then(callback)
	}, [initedRef, promise, callback])

	return <div className='modal-loader__content'><div /></div>

}
export default LoaderModal