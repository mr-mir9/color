import { useCallback } from 'react'
import { useModal } from '../lib/Modal'
import { useUser } from '../lib/User'
import { isObj } from '../helpers/IsType'
import PasswordModal from '../modals/PasswordModal'
import ProfileSetTwoFAModal from '../modals/ProfileSetTwoFAModal'
import ProfileTwoFAFormImage from './ProfileTwoFAFormImage'


function ProfileTwoFAForm(){

	const modal = useModal()
	const { user, setUser } = useUser()


	const setTwoFA = useCallback(e => {
		e.preventDefault()
		modal.show(<ProfileSetTwoFAModal parentClassName='modal-set-2fa' />)
		.then(updatedUser => {
			if(!isObj(updatedUser) || updatedUser.object !== 'user') return;
			setUser(updatedUser)
		})
	}, [modal, setUser])

	const removeTwoFA = useCallback(e => {
		e.preventDefault()
		modal.show(<PasswordModal />)
		.then(updatedUser => {
			if(!isObj(updatedUser) || updatedUser.object !== 'user') return;
			setUser(updatedUser)
		})
	}, [modal, setUser])


	return (
		<div className='profile-container profile-2fa-container'>
			<div>
				<div className='profile-2fa-title'>
					<div className='m18 color-blue'>Двухфакторная аутентификация</div>
					{!user['2fa'].enabled ? <button className='btn blue' onClick={setTwoFA}>Включить</button> : <button className='btn red' onClick={removeTwoFA}>Отключить</button>}
				</div>
				<div className='profile-2fa-section'>
					<div className='profile-2fa-body'>
						<div className='t16'>Стутус: {user['2fa'].enabled ? <span className='color-green'>Включена</span> : <span className='color-red'>Отключена</span>}</div>
						<div className='t12 color-gray2'>установите двухфакторную аутентификацию, чтобы повысить безопасность вашего аккаунта</div>
						{user['2fa'].enabled && user['2fa'].type === 'image' ? (
							<>
								<div className='t16'>Тип двухфакторной авторизации: <span className='color-blue'>Графический</span></div>
								<div className='t16'>Количество точек на изображении: <span className='color-blue'>{user['2fa'].dots}</span></div>
							</>
						) : null}
					</div>
					{user['2fa'].enabled && user['2fa'].type === 'image' ? <ProfileTwoFAFormImage image={user['2fa'].image} /> : null}
				</div>
			</div>
		</div>
	)

}
export default ProfileTwoFAForm