import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import protoRouter from './routes/prototype.route.js';
import createlistRouter from './routes/createlists.route.js'
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("connected to mongoDB ")
    
})
.catch((err)=>{
    console.log(err);
})

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.listen(3000,()=>{
    console.log("server is running on port no : 3000")
})

// Api route

app.use("/Api/user",userRouter);
app.use("/Api/auth",authRouter);
app.use("/Api",protoRouter);
app.use("/Api/list",createlistRouter);
//midleware

app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || 'internal servar error !';
    return res.status(statuscode).json({
        success : false,
        statuscode,
        message
       });

});