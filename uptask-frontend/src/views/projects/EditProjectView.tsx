import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/services/ProjectService";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {

    const params = useParams()
    const projectId = parseInt(params.projectId!)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if (isLoading) return 'cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditProjectForm data={data} projectId={projectId} />
}
