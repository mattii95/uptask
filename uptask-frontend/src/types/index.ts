import { z } from "zod";

/** Auth & Users */
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password_confirmation: z.string(),
    two_factor_code: z.string(),
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type Confirm2FA = Pick<Auth, 'two_factor_code'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>

/** Users */
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    id: z.number()
})

export type User = z.infer<typeof userSchema>

/** Tasks */
export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    project_id: z.number(),
    status: taskStatusSchema,
    created_at: z.string(),
    updated_at: z.string(),
    completed_by_user: userSchema.or(z.null()).optional(),
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>

/** Projects */
export const projectSchema = z.object({
    id: z.number(),
    project_name: z.string(),
    client_name: z.string(),
    description: z.string(),
    user_id: z.number(),
    tasks: z.array(taskSchema)
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        id: true,
        project_name: true,
        client_name: true,
        description: true,
        user_id: true,
    })
)

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'project_name' | 'client_name' | 'description'>

/** Team */
export const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>