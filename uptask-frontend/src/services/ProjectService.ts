import api from "@/lib/axios";
import { dashboardProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { isAxiosError } from "axios";

type ProjectServiceType = {
    formData: ProjectFormData,
    projectId: Project['id']
}

export async function createProject(formData: ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function getProjects() {
    try {
        const { data } = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data.data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function getProjectById(id: Project['id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data.data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function updateProject({ formData, projectId }: ProjectServiceType) {
    try {
        const { data } = await api.put(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function deleteProject(id: Project['id']) {
    try {
        const { data } = await api.delete(`/projects/${id}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}