import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from '../lib/Layout'
import IndexPage from '../pages/IndexPage'
import EstimatePage from '../pages/EstimatePage'
import ContactsPage from '../pages/ContactsPage'
import ProfilePage from '../pages/ProfilePage'
import AdminUsersPage from '../pages/AdminUsersPage'


function Router(){

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />} >
					<Route path='/' element={<IndexPage />} />
					<Route path='estimate'>
						<Route index element={<EstimatePage />} />
					</Route>
					<Route path='contacts'>
						<Route index element={<ContactsPage />} />
					</Route>
					<Route path='profile'>
						<Route index element={<ProfilePage />} />
					</Route>
					<Route path='admin'>
						<Route path='users' element={<AdminUsersPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)

}
export default Router