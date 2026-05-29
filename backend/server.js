import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import incomeRouter from "./routes/incomeRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";

const app=express();
const port=4000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// DB
connectDB();


// ROUTES
app.use('/api/users', userRouter);
app.use('/api/incomes', incomeRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/',(req,res)=>{
    res.send("API working");
})

app.listen(port, ()=>{
    console.log(`server started on http://localhost:${port}`)
})