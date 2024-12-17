import { useCallback, useState, useMemo } from 'react'
import { useApi, parseNetworkError } from '../lib/Api'
import { isStr } from '../helpers/IsType'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function EditUserPasswordModal({ callback, user }){

	const api = useApi()

	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState(null)
	const [passwordValid, setPasswordValid] = useState(null)
	const passwordValidators = useMemo(() => [Validators.required()], [])

	const [repeatPassword, setRepeatPassword] = useState('')
	const [repeatPasswordError, setRepeatPasswordError] = useState(null)
	const [repeatPasswordValid, setRepeatPasswordValid] = useState(null)
	const repeatPasswordValidators = useMemo(() => [Validators.required()], [])


	const submitHandler = useCallback(e => {
		e.preventDefault()

		if(repeatPassword !== password){
			setRepeatPasswordError('Пароли не совпадают')
			return;
		}

		setLoading(true)
		api.Admin.updateUserPassword(user.id, password)
		.then(callback)
		.catch(e => parseNetworkError(e, { password:setPasswordError }, setError))
		.finally(() => setLoading(false))
	}, [api, callback, user, password, repeatPassword])

	const disabled = useMemo(() => loading || !passwordValid || !repeatPasswordValid, [loading, passwordValid, repeatPasswordValid])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Изменить пароль</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form' onSubmit={submitHandler}>
				<div className='form-field'><Field type='password' className='xl' label='Введите пароль' value={password} setValue={setPassword} err={passwordError} setErr={setPasswordError} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} /></div>
				<div className='form-field'><Field type='password' className='xl' label='Повторите пароль' value={repeatPassword} setValue={setRepeatPassword} err={repeatPasswordError} setErr={setRepeatPasswordError} setValid={setRepeatPasswordValid} validators={repeatPasswordValidators} disabled={loading} /></div>
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Создать'}</button></div>
			</form>
		</div>
	)

}
export default EditUserPasswordModal