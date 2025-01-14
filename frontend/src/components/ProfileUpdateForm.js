import { useCallback, useState, useMemo } from 'react'
import { isTrue, isStr } from '../helpers/IsType'
import { useUser } from '../lib/User'
import { useApi, getRoleName, parseNetworkError } from '../lib/Api'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'


function ProfileUpdateForm(){

	const api = useApi()
	const { user, setUser } = useUser()


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const [lastName, setLastName] = useState(user.last_name)
	const [lastNameError, setLastNameError] = useState(null)
	const [lastNameValid, setLastNameValid] = useState(true)
	const lastNameValidators = useMemo(() => [Validators.required(true)], [])

	const [firstName, setFirstName] = useState(user.first_name)
	const [firstNameError, setFirstNameError] = useState(null)
	const [firstNameValid, setFirstNameValid] = useState(true)
	const firstNameValidators = useMemo(() => [Validators.required(true)], [])

	const [patronymic, setPatronymic] = useState(user.patronymic)
	const [patronymicError, setPatronymicError] = useState(null)
	const [patronyicValid, setPatronymicValid] = useState(true)

	const [email, setEmail] = useState(user.email)
	const [emailError, setEmailError] = useState(null)
	const [emailValid, setEmailValid] = useState(true)
	const emailValidators = useMemo(() => [Validators.required(true), Validators.email], [])

	const changed = useMemo(() => {
		if(user.last_name !== lastName) return true
		if(user.first_name !== firstName) return true
		if(user.patronymic !== patronymic) return true
		if(user.email !== email) return true
		return false
	}, [user, lastName, firstName, patronymic, email])

	const disabled = useMemo(() => loading || !changed || !isTrue(lastNameValid) || !isTrue(firstNameValid) || !isTrue(patronyicValid) || !isTrue(emailValid), [loading, changed, lastNameValid, firstNameValid, patronyicValid, emailValid])


	const updateHandler = useCallback(e => {
		e.preventDefault()

		setLoading(true)
		setError(null)

		api.Account.update(firstName, lastName, patronymic, email)
		.then(updatedUser => {
			setUser(updatedUser)
			setLastName(updatedUser.last_name)
			setFirstName(updatedUser.first_name)
			setPatronymic(updatedUser.patronymic)
			setEmail(updatedUser.email)
		})
		.catch(e => parseNetworkError(e, { first_name:setFirstNameError, last_name:setLastNameError, patronymic:setPatronymicError, email:setEmailError }, setError))
		.finally(() => setLoading(false))
	}, [api, firstName, lastName, patronymic, email, setUser])


	return (
		<form onSubmit={updateHandler}>
			<div className='form profile-form'>
				<div className='form-field'><div className='t16'>Ваша роль: <span className='color-blue'>{getRoleName(user.role)}</span></div><div className='t12 color-gray2'>вашу роль может изменить только администратор</div></div>
				<div className='form-field form-field-w50'>
					<Field className='xl' label='Фамилия *' value={lastName} setValue={setLastName} err={lastNameError} setErr={setLastNameError} setValid={setLastNameValid} validators={lastNameValidators} disabled={loading} />
				</div>
				<div className='form-field form-field-w50'>
					<Field className='xl' label='Имя *' value={firstName} setValue={setFirstName} err={firstNameError} setErr={setFirstNameError} setValid={setFirstNameValid} validators={firstNameValidators} disabled={loading} />
				</div>
				<div className='form-field form-field-w50'>
					<Field className='xl' label='Отчество' value={patronymic} setValue={setPatronymic} err={patronymicError} setErr={setPatronymicError} setValid={setPatronymicValid} disabled={loading} />
				</div>
				<div className='form-field form-field-w50'>
					<Field className='xl' label='Адрес электронной почты *' value={email} setValue={setEmail} err={emailError} setErr={setEmailError} setValid={setEmailValid} validators={emailValidators} disabled={loading} />
				</div>
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
			</div>
			<div><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : !changed ? 'Сохранено' : 'Обновить данные'}</button></div>
		</form>
	)

}
export default ProfileUpdateForm