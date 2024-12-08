import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import DashboardView from '@/views/DashboardView'
import CreatePeojectView from '@/views/projects/CreatePeojectView'
import EditProjectView from '@/views/projects/EditProjectView'
import ProjectDetailsView from '@/views/projects/ProjectDetailsView'
import AuthLayout from '@/layouts/AuthLayout'
import LoginView from '@/views/auth/LoginView'
import RegisterView from '@/views/auth/RegisterView'
import ConfirmAccountView from '@/views/auth/ConfirmAccountView'
import RequestNewCodeView from './views/auth/RequestNewCodeView'
import ForgotPassworView from './views/auth/ForgotPassworView'
import NewPasswordView from './views/auth/NewPasswordView'
import ProjectTeamView from './views/projects/ProjectTeamView'
import ProfileView from './views/profile/ProfileView'
import ChangePasswordView from './views/profile/ChangePasswordView'
import ProfileLayout from './layouts/ProfileLayout'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<DashboardView />} index />
                    <Route path='/projects/create' element={<CreatePeojectView />} />
                    <Route path='/projects/:projectId' element={<ProjectDetailsView />} />
                    <Route path='/projects/:projectId/edit' element={<EditProjectView />} />
                    <Route path='/projects/:projectId/team' element={<ProjectTeamView />} />
                    <Route element={<ProfileLayout />}>
                        <Route path='/profile' element={<ProfileView />} />
                        <Route path='/profile/change-password' element={<ChangePasswordView />} />
                    </Route>
                </Route>
                <Route element={<AuthLayout />}>
                    <Route path='/auth/login' element={<LoginView />} />
                    <Route path='/auth/register' element={<RegisterView />} />
                    <Route path='/auth/confirm-account' element={<ConfirmAccountView />} />
                    <Route path='/auth/request-code' element={<RequestNewCodeView />} />
                    <Route path='/auth/forgot-password' element={<ForgotPassworView />} />
                    <Route path='/auth/new-password' element={<NewPasswordView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}