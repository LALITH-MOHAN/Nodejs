import { fetchusers,fetchuserbyid } from "../controller/userController.js";
import express from 'express';

const router=express.Router();

router.get('/',fetchusers);
router.get('/:id',fetchuserbyid);

export default router;

