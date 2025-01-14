import { useCallback, useState, useMemo } from 'react'
import { useApi, parseNetworkError } from '../lib/Api'
import { isTrue, isStr } from '../helpers/IsType'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function PasswordModal({ callback }){

	const api = useApi()

	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const [password, setPassword] = useState('')
	const [passwordValid, setPasswordValid] = useState(false)
	const [passwordError, setPasswordError] = useState(null)
	const passwordValidators = useMemo(() => [Validators.required()], [])


	const disabled = useMemo(() => {
		if(loading) return true
		if(!isTrue(passwordValid)) return true
		return false
	}, [loading, passwordValid])


	const submitHandler = useCallback(e => {
		e.preventDefault()

		setLoading(true)
		setError(null)

		api.Account.off2FA(password)
		.then(callback)
		.catch(e => parseNetworkError(e, { password:setPasswordError }, setError))
		.finally(() => setLoading(false))
	}, [api, password, callback])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Отключить двухфакторную аутентификацию</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form' onSubmit={submitHandler}>
				<div className='form-field'><Field type='password' className='xl' label='Введите пароль *' value={password} setValue={setPassword} err={passwordError} setErr={setPasswordError} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} /></div>
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Продолжить'}</button></div>
			</form>
		</div>
	)

}
export default PasswordModal