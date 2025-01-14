const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: `${__dirname}/../uploads` })
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())




const FilesController = require('../controllers/FilesController')
router.get('/files/*', FilesController.get)




const apiRouter = express.Router()


// V1: Account
const AccountController = require('../controllers/AccountController')
apiRouter.put('/account', AccountController.update)
apiRouter.post('/account/password', AccountController.updatePassword)
apiRouter.post('/account/2fa', upload.single('image'), AccountController.set2FA)
apiRouter.delete('/account/2fa', AccountController.remove2FA)

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