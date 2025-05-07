import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js"
import { executeCode } from "../controllers/execute.controller.js";


const executionRoute =  express.Router();

executionRoute.post("/" ,  authMiddleware, executeCode)

export default executionRoute


