import {z} from "zod"

export const executeCodeSchema = z.object({
    source_code :z.record(
        z.string
    ),
    language_id:z.number(),

    stdin : z.record(
        z.string(),
        z.object({
            input:z.string()
        })
    ),
    expected_outputs : z.record(
        z.string(),
        z.object({
            output:z.string()
        })
    ),
    problemId: z.string
})