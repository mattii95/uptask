import { z } from "zod";

/** Tasks */
export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    status: taskStatusSchema,
    project_id: z.number(),
    created_at: z.string(),
    updated_at: z.string()
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>

/** Projects */
export const projectSchema = z.object({
    id: z.number(),
    project_name: z.string(),
    client_name: z.string(),
    description: z.string(),
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        id: true,
        project_name: true,
        client_name: true,
        description: true,
    })
)


export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'project_name' | 'client_name' | 'description'>