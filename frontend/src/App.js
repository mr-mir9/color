import { useMemo } from 'react'
import User from './lib/User'
import Modal from './lib/Modal'
import Router from './lib/Router'


function App(){

    const router = useMemo(() => <Router />, [])
    const modal = useMemo(() => <Modal>{router}</Modal>, [router])
    const user = useMemo(() => <User>{modal}</User>, [modal])

    return user

}
export default App