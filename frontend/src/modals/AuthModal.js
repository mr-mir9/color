import { useCallback, useState, useMemo, useEffect } from 'react'
import { useApi, parseNetworkError } from '../lib/Api'
import { isStr } from '../helpers/IsType'
import { useUser } from '../lib/User'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function AuthModal({ callback }){

	const api = useApi()
	const { setToken, setUser } = useUser()


	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const [email, setEmail] = useState('')
	useEffect(() => { setPasswordError(null) }, [email])
	const [emailError, setEmailError] = useState(null)
	const [emailValid, setEmailValid] = useState(false)
	const emailValidators = useMemo(() => [Validators.required(true), Validators.email], [])

	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState(null)
	const [passwordValid, setPasswordValid] = useState(false)
	const passwordValidators = useMemo(() => [Validators.required(), Validators.minLength(5)], [])

	const submitHandler = useCallback(e => {
		e.preventDefault()
		setLoading(true)

		setError(null)
		setEmailError(null)
		setPasswordError(null)

		api.Account.login(email, password)
		.then(data => {
			setToken(data.token)
			setUser(data.user)
			callback()
		})
		.catch(e => parseNetworkError(e, { email:setEmailError, password:setPasswordError }, setError))
		.finally(() => setLoading(false))
	}, [api, email, password, setToken, setUser, callback])

	const disabled = useMemo(() => loading || !emailValid || !passwordValid, [loading, emailValid, passwordValid])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Авторизация</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form' onSubmit={submitHandler}>
				<div className='form-field'><Field className='xl' label='Адрес электронной почты' value={email} setValue={setEmail} err={emailError} setErr={setEmailError} setValid={setEmailValid} validators={emailValidators} disabled={loading} /></div>
				<div className='form-field'><Field className='xl' type='password' label='Пароль' value={password} setValue={setPassword} err={passwordError} setErr={setPasswordError} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} /></div>
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Войти'}</button></div>
			</form>
		</div>
	)

}
export default AuthModal