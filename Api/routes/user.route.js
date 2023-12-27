import express  from "express";
import { test, userlisting } from "../controllers/user.controller.js";
import { verifytoken } from "../utils/VerifyUser.js";
import { UpdateUser } from "../controllers/user.controller.js";
const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifytoken,UpdateUser);
router.get('/listings/:id',verifytoken,userlisting)


 export default router;