import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../lib/User'
import { useApi, parseNetworkError, getRoleName } from '../lib/Api'
import { useModal } from '../lib/Modal'
import { isObj, ofArr } from '../helpers/IsType'
import { numWord } from '../helpers/Helper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AlertModal from '../modals/AlertModal'
import ConfirmModal from '../modals/ConfirmModal'
import CreateUserModal from '../modals/CreateUserModal'
import EditUserModal from '../modals/EditUserModal'
import LoaderModal from '../modals/LoaderModal'
import EditUserPasswordModal from '../modals/EditUserPasswordModal'
import LoaderSection from '../components/LoaderSection'

import { ReactComponent as KeySvg } from '../icons/Key.svg'
import { ReactComponent as EditSvg } from '../icons/Edit.svg'
import { ReactComponent as CloseSvg } from '../icons/Close.svg'


function AdminUsersPage(){

	const navigate = useNavigate()
	const modal = useModal()
	const api = useApi()
	const { user, setUser } = useUser()
	useEffect(() => {
		if(!user || user.role !== 'admin') navigate('/', { replace: true })
	}, [user, navigate])


	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])

	const refresh = useCallback(() => {
		if(!user || user.role !== 'admin') return;

		api.Admin.getUsers()
		.then(data => {
			setData(ofArr(data.list))
			setLoading(false)
		})
		.catch(e => {
			let error = ''
			parseNetworkError(e, null, errorText => error=errorText)
			modal.show(<AlertModal parentClassName='modal-alert' text={error} />)
		})
	}, [user, api, modal])

	const stateRef = useRef({ inited:false })
	useEffect(() => {
		const state = stateRef.current
		if(state.inited === true) return;
		state.inited = true
		refresh()
	}, [stateRef, refresh])


	const createUserHandler = useCallback(e => {
		e.preventDefault()
		modal.show(<CreateUserModal parentClassName='edit-user' />)
		.then(result => {
			if(!isObj(result) || result.object !== 'user') return;
			
			let pushTo = 0
			for(let index in data){
				const user = data[index]
				index = parseInt(index)
				if(result.role === 'admin' && user.role === 'admin') pushTo = index+1
				else if(result.role === 'user') pushTo = index+1
			}
			setData(data.toSpliced(pushTo, 0, result))
		})
	}, [modal, data])

	const editUserHandler = useCallback(updateUser => {
		modal.show(<EditUserModal parentClassName='edit-user' user={updateUser} />)
		.then(updatedUser => {
			if(!isObj(updatedUser) || updatedUser.object !== 'user') return;

			setData(state => {
				const result = []
				for(const line of state){
					if(line.id === updatedUser.id) result.push(updatedUser)
					else result.push(line)
				}
				return result
			})

			if(user.id === updatedUser.id) setUser(updatedUser)
		})
	}, [modal, user, setUser])

	const editUserPasswordHandler = useCallback(user => {
		modal.show(<EditUserPasswordModal user={user} />)
	}, [modal])

	const deleteUserHandler = useCallback(user => {
		modal.show(<ConfirmModal parentClassName='modal-confirm' text='Вы уверены, что хотите удалить пользователя? Отменить это действие будет невозможно' />)
		.then(result => {
			if(result !== 'confirmed') return;

			modal.show(<LoaderModal parentClassName='modal-loader' promise={() => api.Admin.deleteUser(user.id)} />)
			.then(() => setData(state => {
				const result = []
				for(const line of state){
					if(line.id === user.id) continue;
					result.push(line)
				}
				return result
			}))
		})
	}, [modal, api])


	const content = useMemo(() => {
		const result = []
		for(const line of data){
			const editHandler = e => {
				e.preventDefault()
				editUserHandler(line)
			}
			const editPasswordHandler = e => {
				e.preventDefault()
				editUserPasswordHandler(line)
			}
			const deleteHandler = e => {
				e.preventDefault()
				deleteUserHandler(line)
			}
			result.push(
				<div key={line.id} className='t14 admin-users-line'>
					<div>{line.id}</div>
					<div><div>{line.last_name} {line.first_name} {line.patronymic}</div></div>
					<div><div>{line.email}</div></div>
					<div>{getRoleName(line.role)}</div>
					<div>
						<div className='btn btn-ico gray-outline' onClick={editPasswordHandler}><KeySvg /></div>
						<div className='btn btn-ico blue-outline' onClick={editHandler}><EditSvg /></div>
						<div className='btn btn-ico red-outline' onClick={deleteHandler}><CloseSvg /></div>
					</div>
				</div>
			)
		}

		if(!result.length) return <div className='t14 color-gray2 admin-users-empty'>Пользователи не найдены</div>

		result.push(
			<div key='footer' className='admin-users-footer'>
				<div className='t14 color-gray2'>Показано с 1 по {result.length} из {result.length} {numWord(result.length, ['записи', 'записей', 'записей'])}</div>
			</div>
		)
		return result
	}, [data, editUserHandler, editUserPasswordHandler, deleteUserHandler])


	if(!user || user.role !== 'admin') return null
	return (
		<div className='page'>
			<Navbar />
			<div className='admin-users-section'>
				{loading ? <LoaderSection /> : (
					<div className='admin-users-container'>
						<div className='color-blue m18 admin-users-title'>
							<div>Список пользователей</div>
							<button className='btn blue-outline' onClick={createUserHandler}>Добавить пользователя</button>
						</div>
						<div className='t14 color-gray2 admin-users-head'>
							<div>Идентификатор</div>
							<div>ФИО</div>
							<div>Email</div>
							<div>Роль</div>
							<div>Действия</div>
						</div>
						{content}
					</div>
				)}
			</div>
			<Footer />
		</div>
	)

}
export default AdminUsersPage