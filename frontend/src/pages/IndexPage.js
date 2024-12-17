import { Link } from 'react-router'
import { useCallback } from 'react'
import { useModal } from '../lib/Modal'
import { useUser } from '../lib/User'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AlertModal from '../modals/AlertModal'

import { ReactComponent as ArrowRightSvg } from '../icons/ArrowRight.svg'


function IndexPage(){

	const modal = useModal()
	const { user } = useUser()


	const noAccessHandler = useCallback(e => {
		e.preventDefault()
		modal.show(<AlertModal parentClassName='modal-alert' text='Для доступа к разделу авторизируйтесь как Администратор или Инженер-технолог' />)
	}, [modal])


	return (
		<div className='page'>
			<Navbar />
			<div className='about-section'>
				<div className='container'>
					<div className='about-section__text'>
						<div className='color-blue m48'>Описание программного комплекса</div>
						<div className='color-gray2 l20 lh140'>Данный программный комплекс позволяет оптимизировать подбор рецептуры красителя полимерной пленки и получать высокое качество конечного продукта путем оценки цветового отклонения от эталона</div>
					</div>
					<div className='about-section__img' />
				</div>
			</div>
			<div className='tools-section'>
				<div className='container'>
					<div className='color-gray m32'>Выберите инструмент</div>
					<div className='tools-list'>
						<div className='tool-item'>
							<div className='tool-item__content'>
								<div className='tool-item__text'>
									<div className='color-purple m24'>Подбор рецептуры окршивания</div>
									<div className='color-gray2 l18 lh140'>Инструмент, предназначенный для создания оптимальной формулы окрашивания полимерных плёнок, который помогает определить тип и количество красителя, чтобы достичь желаемого цвета продукции</div>
									<button className='btn gray'>В разработке...</button>
								</div>
								<div className='tool-item__img' />
							</div>
						</div>
						<div className='tool-item'>
							{user ? (
								<Link className='tool-item__content' to='/estimate'>
									<div className='tool-item__text'>
										<div className='color-green m24'>Оценка цветового отклонения полимерной пленки от эталона</div>
										<div className='color-gray2 l18 lh140'>Инструмент, предназначенный для оценки цветового отклонения полимерной пленки от эталона в цветовом пространстве CIELab</div>
										<button className='btn blue'><div>Перейти</div><ArrowRightSvg className='btn-ico__right' /></button>
									</div>
									<div className='tool-item__img' />
								</Link>
							) : (
								<div className='tool-item__content' onClick={noAccessHandler}>
									<div className='tool-item__text'>
										<div className='color-green m24'>Оценка цветового отклонения полимерной пленки от эталона</div>
										<div className='color-gray2 l18 lh140'>Инструмент, предназначенный для оценки цветового отклонения полимерной пленки от эталона в цветовом пространстве CIELab</div>
										<button className='btn blue'><div>Перейти</div><ArrowRightSvg className='btn-ico__right' /></button>
									</div>
									<div className='tool-item__img' />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)

}
export default IndexPage