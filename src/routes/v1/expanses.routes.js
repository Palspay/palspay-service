import express from 'express';
import expanseController from '../../controllers/expanse.controller.js';
import { auth } from '../../middlewares/auth.js';
const router = express.Router();

router.post('/createExpanse', auth, expanseController.addExpanse);
router.put('/updateExpanse/:id', auth, expanseController.updateExpanse);
router.delete('/deleteExpanse/:id', auth, expanseController.deleteExpanse);
router.get('/fetchExpanse', auth, expanseController.fetchExpanse);
router.get('/getexpanse', auth, expanseController.getExpanse); // by getExpanse by group id
router.get('/individualExpanse', auth, expanseController.individualExpanse);

export default router;