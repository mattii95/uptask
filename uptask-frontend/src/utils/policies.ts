import { Project, TeamMember } from "../types"

export const isManager = (userId: Project['user_id'], collaboratorId: TeamMember['id']) => {
    return userId === collaboratorId;
}