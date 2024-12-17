import { useCallback } from 'react'

import { ReactComponent as QuestionCircleSvg } from '../icons/QuestionCircle.svg'


function ConfirmModal({ callback, text }){

	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])

	const confirmHandler = useCallback(e => {
		e.preventDefault()
		callback('confirmed')
	}, [callback])


	return (
		<div className='modal-content modal-confirm__content'>
			<QuestionCircleSvg />
			<div className='m16 lh140'>{text}</div>
			<div className='btns'>
				<button className='btn blue' onClick={confirmHandler}>ОК</button>
				<button className='btn red' onClick={closeHandler}>Отмена</button>
			</div>
		</div>
	)

}
export default ConfirmModal