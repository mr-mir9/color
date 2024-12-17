import { useCallback, useState, useMemo } from 'react'
import { getRoleName, useApi, parseNetworkError } from '../lib/Api'
import { isStr } from '../helpers/IsType'
import Field from '../helpers/Field'
import Select, { Option } from '../helpers/Select'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function EditUserModal({ callback, user }){

	const api = useApi()

	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback('close')
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const [lastName, setLastName] = useState(isStr(user.last_name) ? user.last_name : '')
	const [lastNameError, setLastNameError] = useState(null)
	const [lastNameValid, setLastNameValid] = useState(true)
	const lastNameValidators = useMemo(() => [Validators.required(true)], [])

	const [firstName, setFirstName] = useState(isStr(user.first_name) ? user.first_name : '')
	const [firstNameError, setFirstNameError] = useState(null)
	const [firstNameValid, setFirstNameValid] = useState(true)
	const firstNameValidators = useMemo(() => [Validators.required(true)], [])

	const [patronymic, setPatronymic] = useState(isStr(user.patronymic) ? user.patronymic : '')
	const [patronymicError, setPatronymicError] = useState(null)
	const [patronymicValid, setPatronymicValid] = useState(true)

	const [role, setRole] = useState(isStr(user.role) ? user.role : '')
	const roleValid = useMemo(() => ['user', 'admin'].includes(role), [role])

	const [email, setEmail] = useState(isStr(user.email) ? user.email : '')
	const [emailError, setEmailError] = useState(null)
	const [emailValid, setEmailValid] = useState(true)
	const emailValidators = useMemo(() => [Validators.required(true), Validators.email], [])


	const submitHandler = useCallback(e => {
		e.preventDefault()

		setLoading(true)
		api.Admin.updateUser(user.id, firstName, lastName, patronymic, role, email)
		.then(callback)
		.catch(e => parseNetworkError(e, { first_name:setFirstNameError, last_name:setLastNameError, patronymic:setPatronymicError, email:setEmailError }, setError))
		.finally(() => setLoading(false))
	}, [api, callback, user, firstName, lastName, patronymic, role, email])

	const disabled = useMemo(() => loading || !lastNameValid || !firstNameValid || !patronymicValid || !roleValid || !emailValid, [loading, lastNameValid, firstNameValid, patronymicValid, roleValid, emailValid])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Редактирование пользователя №{user.id}</div>
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
				{isStr(error) && error.length ? <div className='t14 color-red form-error'>{error}</div> : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Сохранить'}</button></div>
			</form>
		</div>
	)

}
export default EditUserModal