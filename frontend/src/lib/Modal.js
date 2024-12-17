import { createContext, useContext, useMemo, useState, useCallback, cloneElement } from 'react'
import { isObj, isStr } from '../helpers/IsType'


const ModalContext = createContext(null)

function Modal({ children }){

	const [modalClassName, setModalClassName] = useState(null)
	const [modal, setModal] = useState(null)

	const show = useCallback(modal => {
		if(!isObj(modal) || !isObj(modal.props)) throw new Error('Modal must be React element')

		let callback
		const promise = new Promise(resolve => {
			callback = data => {
				setModal(null)
				setModalClassName(null)
				resolve(data)
			}
		})

		setModal(cloneElement(modal, {...modal.props, callback}))
		setModalClassName(isStr(modal.props.parentClassName) ? modal.props.parentClassName : null)
		return promise
	}, [])


	const content = useMemo(() => ({ show }), [show])
	return (
		<ModalContext.Provider value={content}>
			{children}
			<div className={`modal ${modal ? 'show' : ''} ${isStr(modalClassName) ? modalClassName : ''}`}><div>{modal ?? null}</div></div>
		</ModalContext.Provider>
	)

}

function useModal(){
	return useContext(ModalContext)
}

export default Modal
export { useModal }