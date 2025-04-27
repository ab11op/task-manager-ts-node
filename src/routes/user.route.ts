import express from 'express'
import { userController } from '../controllers/user.controller'
import { validateData } from '../middlewares/validationMiddleware';
import { userRegistrationSchema, userLoginSchema } from '../schemas/userSchema';


const router = express.Router()

router.post('/register',validateData(userRegistrationSchema),userController.register)
router.post('/login',validateData(userLoginSchema),userController.login)

export default router