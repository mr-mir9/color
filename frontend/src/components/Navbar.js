import { useCallback } from 'react'
import { NavLink } from 'react-router'
import { useModal } from '../lib/Modal'
import { getRoleName, getUserName } from '../lib/Api'
import { useUser } from '../lib/User'
import AuthModal from '../modals/AuthModal'

import { ReactComponent as LogOutSvg } from '../icons/LogOut.svg'


function Navbar(){

	const modal = useModal()
	const { user, exit } = useUser()

	const authHandler = useCallback(e => {
		e.preventDefault()
		modal.show(<AuthModal />)
	}, [modal])

	const logOutHandler = useCallback(e => {
		e.preventDefault()
		exit()
	}, [exit])


	return (
		<div className='navbar'>
			<div className='navbar-name'>
				<div className='navbar-icon' />
				<div className='t18 lh120'><div>Обработка инфорации и оценка цветового</div><div>отклонения полимерной пленки от эталона</div></div>
			</div>
			<div className='navbar-links'>
				<NavLink to='/' className={({ isActive }) => `navbar-link m16 ${isActive ? 'active' : ''}`}>Главная</NavLink>
				<NavLink to='/contacts' className={({ isActive }) => `navbar-link m16 ${isActive ? 'active' : ''}`}>Контакты</NavLink>
				{user && user.role === 'admin' ? <NavLink to='/admin/users' className={({ isActive }) => `navbar-link m16 ${isActive ? 'active' : ''}`}>Администрирование пользователей</NavLink> : null}
			</div>
			{user ? (
				<div className='navbar-user'>
					<div>
						<div className='t12 color-gray2'>{getRoleName(user.role)}</div>
						<div className='m16'>{getUserName(user)}</div>
					</div>
					<LogOutSvg onClick={logOutHandler} />
				</div>
			) : <button className='btn blue' onClick={authHandler}>Авторизация</button>}
		</div>
	)

}
export default Navbar