import express from 'express';
import { Createlist, updatelist ,getuser ,getlistss} from '../controllers/createlists.controller.js';
import { verifytoken } from '../utils/VerifyUser.js';
import { deletelist ,getlist  } from '../controllers/createlists.controller.js';

//make sure you write spified route below of the less spesified route un our case 
// '/serach' is less spesified and  '/delete/:id' is more spesified or lets say more spesfied than '/search' route
const router = express.Router();

router.get('/search',getlistss);
router.post('/create', Createlist);
router.delete('/delete/:id',verifytoken,deletelist);
router.post('/update/:id',verifytoken,updatelist);
router.get('/get/:id',getlist);
router.get('/:id',verifytoken,getuser);


export default router;
