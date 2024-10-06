import { z } from "zod";

/** Projects */
export const projectSchema = z.object({
    id: z.number(),
    project_name: z.string(),
    client_name: z.string(),
    description: z.string(),
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'project_name' | 'client_name' | 'description'>