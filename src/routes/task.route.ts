import express from 'express'
import { taskController } from '../controllers/task.controller'
import { auth,roleCheck } from '../middlewares/authMiddleware'
import { taskCreationSchema,getTasksQuerySchema } from '../schemas/task.schema'
import { validateData,validateQuery } from '../middlewares/validationMiddleware'



const router = express.Router()

router.post('/tasks',auth,validateData(taskCreationSchema),taskController.create)
router.get('/task/:id',auth,taskController.getTask)
router.get('/tasks',auth,validateQuery(getTasksQuerySchema),taskController.getTasks)
router.put('/task/:id',auth,taskController.updateTask)
router.delete('/task/:id',auth,roleCheck(['admin']),taskController.deleteTask)

export default router