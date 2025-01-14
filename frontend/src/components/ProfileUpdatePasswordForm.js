import { useState, useMemo, useCallback, useEffect } from 'react'
import { isTrue, isStr } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'


function ProfileUpdatePasswordForm(){

	const api = useApi()


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	useEffect(() => {
		if(!isStr(success) || !success.length) return;
		setTimeout(() => setSuccess(null), 2000)
	}, [success])

	const [previousPassword, setPreviousPassword] = useState('')
	const [previousPasswordValid, setPreviousPasswordValid] = useState(false)
	const [previousPasswordError, setPreviousPasswordError] = useState(null)
	const previousPasswordValidators = useMemo(() => [Validators.required()], [])

	const [password, setPassword] = useState('')
	const [passwordValid, setPasswordValid] = useState(false)
	const [passwordError, setPasswordError] = useState(null)
	const passwordValidators = useMemo(() => [Validators.required()], [])

	const [repeatPassword, setRepeatPassword] = useState('')
	const [repeatPasswordValid, setRepeatPasswordValid] = useState(false)
	const [repeatPasswordError, setRepeatPasswordError] = useState(null)
	const repeatPasswordValidators = useMemo(() => [Validators.required()], [])

	const disabled = useMemo(() => {
		if(loading) return true
		if(!isTrue(previousPasswordValid) || !isTrue(passwordValid) || !isTrue(repeatPasswordValid)) return true
		return false
	}, [loading, previousPasswordValid, passwordValid, repeatPasswordValid])


	const updateHandler = useCallback(e => {
		e.preventDefault()

		if(password !== repeatPassword){
			setRepeatPasswordError('Пароли не совпадают')
			return;
		}

		setLoading(true)
		setError(null)
		setSuccess(null)

		api.Account.updatePassword(previousPassword, password)
		.then(() => {
			setPreviousPassword('')
			setPassword('')
			setRepeatPassword('')
			setSuccess('Пароль успешно обновлен')
		})
		.catch(e => parseNetworkError(e, { now_password:setPreviousPasswordError, new_password:setPasswordError }, setError))
		.finally(() => setLoading(false))
	}, [api, previousPassword, password, repeatPassword])


	return (
		<form className='form profile-password-form' onSubmit={updateHandler}>
			<div className='form-field'>
				<Field className='xl' type='password' label='Введите текущий пароль *' value={previousPassword} setValue={setPreviousPassword} err={previousPasswordError} setErr={setPreviousPasswordError} setValid={setPreviousPasswordValid} validators={previousPasswordValidators} disabled={loading} />
			</div>
			<div className='form-field'>
				<Field className='xl' type='password' label='Введите новый пароль *' value={password} setValue={setPassword} err={passwordError} setErr={setPasswordError} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} />
			</div>
			<div className='form-field'>
				<Field className='xl' type='password' label='Повторите пароль *' value={repeatPassword} setValue={setRepeatPassword} err={repeatPasswordError} setErr={setRepeatPasswordError} setValid={setRepeatPasswordValid} validators={repeatPasswordValidators} disabled={loading} />
			</div>
			{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
			{isStr(success) && success.length ? <div className='t14 color-green form-error'>{success}</div> : null}
			<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Обновить пароль'}</button></div>
		</form>
	)

}
export default ProfileUpdatePasswordForm