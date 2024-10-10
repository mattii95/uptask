import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getTaskById } from "@/services/TaskService"
import EditTaskModal from "./EditTaskModal"


export default function EditTaskData() {
    const params = useParams()
    const projectId = parseInt(params.projectId!)

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = parseInt(queryParams.get('editTask')!)

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId
    })

    if (isError) return <Navigate to={'/404'} />

    if (data) return <EditTaskModal task={data} />
}
