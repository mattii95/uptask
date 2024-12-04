import { isAxiosError } from 'axios'
import api from '@/lib/axios'
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from '../types'

export async function findUserByEmail({ projectId, formData }: { projectId: Project['id'], formData: TeamMemberForm }) {
    try {
        const url = `/projects/${projectId}/team/find`
        const data = await api.post(url, formData)
        return data.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function addUserToProject({ projectId, userId }: { projectId: Project['id'], userId: TeamMember['id'] }) {
    try {
        const url = `/projects/${projectId}/team`
        const data = await api.post(url, { 'user_id': userId })
        return data.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectTeam(projectId: Project['id']) {
    try {
        const url = `/projects/${projectId}/team`
        const data = await api(url)
        const result = teamMembersSchema.safeParse(data.data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function removeUserFromProject({ projectId, userId }: { projectId: Project['id'], userId: TeamMember['id'] }) {
    try {
        const url = `/projects/${projectId}/team/${userId}`
        const data = await api.delete(url)
        return data.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}