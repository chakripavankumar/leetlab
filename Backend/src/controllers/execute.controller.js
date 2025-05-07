import { db } from "../libs/db.js";
import {submitBatch, pollBatchResults } from "../libs/judge0.lib.js"

export const executeCode =  async (req,res) =>{
    try {
        const {source_code , language_id,stdin,expected_outputs,problemId} =  req.body
        const userId =  req.user.id
        if(!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) ||  expected_outputs.length !==  stdin.length) {
            return res.status(400).json({error: "Invalid or Missing test cases"})
        }
         const submissions  =  stdin.map((input) => ({
            source_code,
            language_id,
            stdin:input,
         }))

         const submitResponce  =  await submitBatch( submissions)
         const tokens  =   submitResponce.map((resul) =>  resul.token)
         const results =  await pollBatchResults(tokens);
         console.log(results);
         
         
    } catch (error) {
        console.error( "this is the error");
        
    }
}