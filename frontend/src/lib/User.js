import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { isStr } from '../helpers/IsType'
import { useApi } from './Api'
import { getCookie, setCookie, deleteCookie } from '../helpers/Cookie'


const UserContext = createContext(null)

function User({ children }){

	const [loading, setLoading] = useState(true)
	const [token, setToken] = useState(null)
	const [user, setUser] = useState(null)

	const api = useApi()

	const setTokenHandler = useCallback(newToken => {
		setToken(newToken)
		if(isStr(newToken) && newToken.length) setCookie('tkn', newToken)
		else deleteCookie('tkn')
	}, [])
	useEffect(() => {
		const token = getCookie('tkn')
		if(!isStr(token) || token.length !== 128){
			setLoading(false)
			return;
		}

		api.Account.getSession(token)
		.then(data => {
			setToken(token)
			setUser(data.user)
		})
		.catch(() => setTokenHandler(null))
		.finally(() => setLoading(false))
	}, [api, setTokenHandler])


	const exitHandler = useCallback(() => {
		setTokenHandler(null)
		setUser(null)
	}, [setTokenHandler])


	const content = useMemo(() => ({ token, setToken:setTokenHandler, user, setUser, exit:exitHandler }), [token, setTokenHandler, user, exitHandler])
	if(loading) return null
	return <UserContext.Provider value={content}>{children}</UserContext.Provider>

}


function useUser(){
	return useContext(UserContext)
}


export default User
export { useUser }