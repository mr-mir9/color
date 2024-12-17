import { useEffect } from 'react'
import { Outlet } from 'react-router'


function Layout(){

	useEffect(() => {
		document.getElementById('splashscreen').style.display = 'none'
	}, [])

	return <Outlet />

}
export default Layout