import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/services/ProjectService';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';
import EditTaskData from '@/components/tasks/EditTaskData';
import TaskModalDetails from '@/components/tasks/TaskModalDetails';

export default function ProjectDetailsView() {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = parseInt(params.projectId!)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if (isLoading) return 'cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data) return (
        <>
            <h1 className='text-5xl font-black'>{data.project_name}</h1>
            <p className='text-2xl font-light text-gray-500 mt-5'>
                {data.description}
            </p>
            <nav className='my-5 flex gap-3'>
                <button
                    type='button'
                    className='bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors'
                    onClick={() => navigate(location.pathname + '?newTask=true')}
                >
                    Agregar Tarea
                </button>
            </nav>
            <TaskList 
                tasks={data.tasks}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
