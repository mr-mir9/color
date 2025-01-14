import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { ReactComponent as EmailSvg } from '../icons/Email.svg'
import { ReactComponent as TelegramSvg } from '../icons/Telegram.svg'


function ContactsPage(){

	return (
		<div className='page'>
			<Navbar />
			<div className='contacts-section'>
				<div className='m32 contacts-title'>Контактная информация</div>
				<div className='contacts-containers'>
					<div className='contacts-container'>
						<div className='t16 color-gray2'>Студент-разработчик:</div>
						<div className='m21'>Владимиров Дмитрий Владимирович</div>
						<div className='t16 color-blue'>студент 413 группы</div>
						<div className='t16 color-gray3 contacts-fields-title'>Контакты</div>
						<div className='t16 contacts-field'>
							<div><EmailSvg /><div>E-mail</div></div>
							<div className='color-blue'>prefect9@yandex.ru</div>
						</div>
						<div className='t16 contacts-field'>
							<div><TelegramSvg /><div>Telegram</div></div>
							<div className='color-blue'>@IT_DEV9</div>
						</div>
					</div>
					<div className='contacts-container'>
						<div className='t16 color-gray2'>Научный руководитель:</div>
						<div className='m21'>Разыграев Александр Сергеевич</div>
						<div className='t16 color-blue'>доцент кафедры САПРиУ</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)

}
export default ContactsPage