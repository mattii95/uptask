import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFullProjectDetailsById } from '@/services/ProjectService';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';
import EditTaskData from '@/components/tasks/EditTaskData';
import TaskModalDetails from '@/components/tasks/TaskModalDetails';
import { useAuth } from '@/hooks/useAuth';
import { isManager } from '@/utils/policies';
import { useMemo } from 'react';

export default function ProjectDetailsView() {
    const { data: user, isLoading: isLoadingUser } = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const projectId = parseInt(params.projectId!)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProjectDetailsById(projectId),
        retry: false
    })

    const canEdit = useMemo(() => data?.user_id === user?.id, [data, user])

    if (isLoading && isLoadingUser) return 'cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data && user) return (
        <>
            <h1 className='text-5xl font-black'>{data.project_name}</h1>
            <p className='text-2xl font-light text-gray-500 mt-5'>
                {data.description}
            </p>
            {isManager(data.user_id, user.id) && (
                <nav className='my-5 flex gap-3'>
                    <button
                        type='button'
                        className='bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors'
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >
                        Agregar Tarea
                    </button>
                    <Link
                        to={'team'}
                        className='bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors'
                    >
                        Colaboradores
                    </Link>
                </nav>
            )}
            <TaskList
                tasks={data.tasks}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
