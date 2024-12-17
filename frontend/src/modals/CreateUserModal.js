import { useCallback, useState, useMemo } from 'react'
import { getRoleName, useApi, parseNetworkError } from '../lib/Api'
import { isStr } from '../helpers/IsType'
import Field from '../helpers/Field'
import Select, { Option } from '../helpers/Select'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function CreateUserModal({ callback }){

	const api = useApi()

	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const [lastName, setLastName] = useState('')
	const [lastNameError, setLastNameError] = useState(null)
	const [lastNameValid, setLastNameValid] = useState(null)
	const lastNameValidators = useMemo(() => [Validators.required(true)], [])

	const [firstName, setFirstName] = useState('')
	const [firstNameError, setFirstNameError] = useState(null)
	const [firstNameValid, setFirstNameValid] = useState(null)
	const firstNameValidators = useMemo(() => [Validators.required(true)], [])

	const [patronymic, setPatronymic] = useState('')
	const [patronymicError, setPatronymicError] = useState(null)
	const [patronymicValid, setPatronymicValid] = useState(true)

	const [role, setRole] = useState(null)
	const roleValid = useMemo(() => ['user', 'admin'].includes(role), [role])

	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(null)
	const [emailValid, setEmailValid] = useState(null)
	const emailValidators = useMemo(() => [Validators.required(true), Validators.email], [])

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
		api.Admin.createUser(firstName, lastName, patronymic, role, email, password)
		.then(callback)
		.catch(e => parseNetworkError(e, { first_name:setFirstNameError, last_name:setLastNameError, patronymic:setPatronymicError, email:setEmailError, password:setPasswordError }, setError))
		.finally(() => setLoading(false))
	}, [api, callback, password, repeatPassword, firstName, lastName, patronymic, role, email])

	const disabled = useMemo(() => loading || !lastNameValid || !firstNameValid || !patronymicValid || !roleValid || !emailValid || !passwordValid || !repeatPasswordValid, [loading, lastNameValid, firstNameValid, patronymicValid, roleValid, emailValid, passwordValid, repeatPasswordValid])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Новый пользователь</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form edit-user__form' onSubmit={submitHandler}>
				<div className='form-field'><Field className='xl' label='Фамилия' value={lastName} setValue={setLastName} err={lastNameError} setErr={setLastNameError} setValid={setLastNameValid} validators={lastNameValidators} disabled={loading} /></div>
				<div className='form-field'><Field className='xl' label='Имя' value={firstName} setValue={setFirstName} err={firstNameError} setErr={setFirstNameError} setValid={setFirstNameValid} validators={firstNameValidators} disabled={loading} /></div>
				<div className='form-field'><Field className='xl' label='Отчество' value={patronymic} setValue={setPatronymic} err={patronymicError} setErr={setPatronymicError} setValid={setPatronymicValid} disabled={loading} /></div>
				<div className='form-field'>
					<Select label='Роль пользователя' onChange={setRole}>
						<Option value='admin' selected={role==='admin'}>{getRoleName('admin')}</Option>
						<Option value='user' selected={role==='user'}>{getRoleName('user')}</Option>
					</Select>
				</div>
				<div className='form-field'><Field className='xl' label='Адрес электронной почты' value={email} setValue={setEmail} err={emailError} setErr={setEmailError} setValid={setEmailValid} validators={emailValidators} disabled={loading} /></div>
				<div className='form-field'><Field type='password' className='xl' label='Введите пароль' value={password} setValue={setPassword} err={passwordError} setErr={setPasswordError} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} /></div>
				<div className='form-field'><Field type='password' className='xl' label='Повторите пароль' value={repeatPassword} setValue={setRepeatPassword} err={repeatPasswordError} setErr={setRepeatPasswordError} setValid={setRepeatPasswordValid} validators={repeatPasswordValidators} disabled={loading} /></div>
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Создать'}</button></div>
			</form>
		</div>
	)

}
export default CreateUserModal