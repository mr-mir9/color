const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())




const apiRouter = express.Router()


// V1: Session
const SessionController = require('../controllers/SessionController')
apiRouter.get('/session', SessionController.get)
apiRouter.post('/session', SessionController.login)

// V1: Admin - Account
const AccountAdminController = require('../controllers/AccountAdminController')
apiRouter.get('/admin/account', AccountAdminController.getAll)
apiRouter.post('/admin/account', AccountAdminController.new)
apiRouter.put('/admin/account/:userId', AccountAdminController.update)
apiRouter.delete('/admin/account/:userId', AccountAdminController.delete)
apiRouter.put('/admin/account/:userId/password', AccountAdminController.updatePassword)


router.use('/api/v1', apiRouter)




module.exports = router