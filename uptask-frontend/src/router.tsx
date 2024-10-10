import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import DashboardView from '@/views/DashboardView'
import CreatePeojectView from '@/views/projects/CreatePeojectView'
import EditProjectView from '@/views/projects/EditProjectView'
import ProjectDetailsView from '@/views/projects/ProjectDetailsView'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<DashboardView />} index />
                    <Route path='/projects/create' element={<CreatePeojectView />} index />
                    <Route path='/projects/:projectId' element={<ProjectDetailsView />} index />
                    <Route path='/projects/:projectId/edit' element={<EditProjectView />} index />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}