import { useCallback } from 'react'

import { ReactComponent as AlertCircleSvg } from '../icons/AlertCircle.svg'


function AlertModal({ callback, text }){

	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	return (
		<div className='modal-content modal-alert__content'>
			<AlertCircleSvg />
			<div className='m16 lh140'>{text}</div>
			<button className='btn blue' onClick={closeHandler}>ОК</button>
		</div>
	)

}
export default AlertModal