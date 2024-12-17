import { useCallback, useMemo, useId, useState, useLayoutEffect } from 'react'
import { isStr, isFunc, ofArr } from '../helpers/IsType'

import { ReactComponent as EyeSvg } from '../icons/Eye.svg'
import { ReactComponent as EyeSlashSvg } from '../icons/EyeSlash.svg'


function Field({ className, type, inputMode, label, value, setValue, err, setErr, setValid, validators, pattern, disabled }){


	const id = useId()


	const editHandler = useCallback(e => {
		const value = e.target.value
		console.log(pattern)
		if(isFunc(setValue)) setValue(value)
		if(isFunc(setErr)) setErr(null)
	}, [pattern, setValue, setErr])

	useLayoutEffect(() => {
		let valid = true
		if(isStr(err) && err.length) valid = false
		for(const validator of ofArr(validators)){
			const result = validator(value)
			if(result === true) continue;
			valid = false
			break;
		}
		if(isFunc(setValid)) setValid(valid)
	}, [validators, value, err, setValid])


	const [showPassword, setShowPassword] = useState(false)
	const togglePasswordHandler = useCallback(e => {
		e.preventDefault()
		setShowPassword(state => !state)
	}, [])

	const typeContent = useMemo(() => {
		if(!isStr(type)) return 'text'
		if(type === 'password' && showPassword) return 'text'
		if(['text', 'password', 'email'].includes(type.toLowerCase())) return type.toLowerCase()
		return 'text'
	}, [type, showPassword])

	const inputModeContent = useMemo(() => {
		if(!isStr(inputMode)) return 'text'
		if(['text', 'email', 'decimal', 'numeric'].includes(inputMode.toLowerCase())) return inputMode.toLowerCase()
		return 'text'
	}, [inputMode])

	const filled = useMemo(() => isStr(value) && value.length, [value])


	return (
		<div className={`field ${filled ? 'filled' : ''} ${isStr(className) && className.length ? className : ''} ${type === 'password' ? 'password' : ''} ${type === 'password' && showPassword ? 'password-show' : ''} ${isStr(err) && err.length ? 'invalid' : ''}`}>
			<div className='field-container'>
				{isStr(label) && label.length ? <label className='field-label' htmlFor={id}>{label}</label> : null}
				<input type={typeContent} inputMode={inputModeContent} value={value} onInput={editHandler} id={id} autoComplete='off' disabled={disabled} />
				{type === 'password' ? (showPassword ? <EyeSlashSvg onClick={togglePasswordHandler} /> : <EyeSvg onClick={togglePasswordHandler} />) : null}
			</div>
			{isStr(err) && err.length ? <div className='field-error'>{err}</div> : null}
		</div>
	)

}
export default Field