import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamMember } from "@/types/index";
import { addUserToProject } from "@/services/TeamService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {
    const params = useParams()
    const projectId = parseInt(params.projectId!)
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            userId: user.id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
                    onClick={handleAddUserToProject}
                >
                    Agregar al proyecto
                </button>
            </div>
        </>
    )
}
