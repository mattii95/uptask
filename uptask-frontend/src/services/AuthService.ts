import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Confirm2FA, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types";


export async function createAccount(formData: UserRegistrationForm) {
    try {
        const url = '/auth/register'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function confirmAccount(formData: Confirm2FA) {
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function requestCode(formData: RequestConfirmationCodeForm) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function login(formData: UserLoginForm) {
    try {
        const url = '/auth/login'
        const { data } = await api.post(url, formData)
        localStorage.setItem('AUTH_TOKEN', data.token)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function validate2FACode(formData: Confirm2FA) {
    try {
        const url = '/auth/validate-2fa-code'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function updatePasswordWithToken({ formData, token }: { formData: NewPasswordForm, token: Confirm2FA['two_factor_code'] }) {
    try {
        const url = `/auth/update-password/${token}`
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function logout() {
    try {
        const url = '/auth/logout'
        const { data } = await api.post(url, null)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api('/user')
        const response = userSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}