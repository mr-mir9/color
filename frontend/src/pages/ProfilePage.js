import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../lib/User'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProfileUpdateForm from '../components/ProfileUpdateForm'
import ProfileUpdatePasswordForm from '../components/ProfileUpdatePasswordForm'
import ProfileTwoFAForm from '../components/ProfileTwoFAForm'


function ProfilePage(){

	const navigate = useNavigate()
	const { user } = useUser()
	useEffect(() => {
		if(!user) navigate('/', { replace: true })
	}, [navigate, user])

	if(!user) return null
	return (
		<div className='page'>
			<Navbar />
			<div className='profile-section'>
				<div className='m32 profile-title'>Профиль</div>
				<div className='profile-containers'>
					<div className='profile-container'>
						<div>
							<div className='m18 color-blue'>Данные аккаунта</div>
							<ProfileUpdateForm />
						</div>
					</div>
					<div className='profile-container'>
						<div>
							<div className='m18 color-blue'>Изменить пароль</div>
							<ProfileUpdatePasswordForm />
						</div>
					</div>
					<ProfileTwoFAForm />
				</div>
			</div>
			<Footer />
		</div>
	)

}
export default ProfilePage