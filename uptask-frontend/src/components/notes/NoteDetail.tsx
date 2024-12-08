import { useAuth } from "@/hooks/useAuth"
import { deleteNote } from "@/services/NoteService"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from "react"
import { useParams, useLocation } from 'react-router-dom';
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({ note }: NoteDetailProps) {
    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data?.id === note.user.id, [data])

    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

    const projectId = parseInt(params.projectId!)
    const taskId = parseInt(queryParams.get('viewTask')!)
    
    const querryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            querryClient.invalidateQueries({ queryKey: ['task', taskId] })
        }
    })

    if (isLoading) return <div>Cargando...</div>

    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} por: <span className="font-bold">{note.user.name}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.created_at)}
                </p>
            </div>
            {canDelete && (
                <button
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
                    onClick={() => mutate({ projectId, taskId, noteId: note.id })}
                >
                    Eliminar
                </button>
            )}
        </div>
    )
}
