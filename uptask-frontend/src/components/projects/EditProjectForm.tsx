import { Link, useNavigate } from "react-router-dom";
import ProjectForm from '@/components/projects/ProjectForm';
import { useForm } from 'react-hook-form';
import { Project, ProjectFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from "@/services/ProjectService";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData,
    projectId: Project['id']
}

export default function EditProjectForm({ data, projectId }: EditProjectFormProps) {
    const navigate = useNavigate()
    const initialValues: ProjectFormData = {
        project_name: data.project_name,
        client_name: data.client_name,
        description: data.description
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
            toast.success(data.message)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }
    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light to-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>

                <nav className="my-5">
                    <Link
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to={'/'}
                    >
                        Volver
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />
                    <input
                        type="submit"
                        value='Guardar Cambios'
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>

        </>
    )
}