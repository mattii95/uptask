import NewPasswordForm from '@/components/auth/NewPasswordForm'
import NewPasswordToken from '@/components/auth/NewPasswordToken'
import { Confirm2FA } from '@/types/index'
import React, { useState } from 'react'

export default function NewPasswordView() {
    const [token, setToken] = useState<Confirm2FA['two_factor_code']>('')
    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer Contraseña</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que recibiste {''}
                <span className=" text-fuchsia-500 font-bold">por email</span>
            </p>
            {
                !isValidToken
                    ? <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
                    : <NewPasswordForm token={token} />
            }
        </>
    )
}
