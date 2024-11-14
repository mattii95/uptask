
import api from "@/lib/axios";
import { dashboardProjectSchema, Project, ProjectFormData } from "../types";
import { isAxiosError } from "axios";

export async function createProject(formData: ProjectFormData) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }
    try {
        const { data } = await api.post('/projects', formData, config)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function getProjects() {
    const token = localStorage.getItem('AUTH_TOKEN');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }
    try {
        const { data } = await api('/projects', config)
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
    const token = localStorage.getItem('AUTH_TOKEN');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }
    try {
        const { data } = await api(`/projects/${id}`, config)
        return data.project
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

type ProjectServiceType = {
    formData: ProjectFormData,
    projectId: Project['id']
}

export async function updateProject({ formData, projectId }: ProjectServiceType) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }
    try {
        const { data } = await api.put(`/projects/${projectId}`, formData, config)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function deleteProject(id: Project['id']) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }
    try {
        const { data } = await api.delete(`/projects/${id}`, config)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}