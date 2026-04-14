export interface TeamResponseDto {
  id: string;
  name: string;
  inviteCode: string;
  adminId: string;
  memberCount: number;
  createdAt: string;
  isAdmin: boolean;
  isActive: boolean;
  joinedAt: string;
}

/** @deprecated Use TeamResponseDto instead */
export type Team = TeamResponseDto;

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface CreateTeamRequest {
  name: string;
}

export interface JoinTeamRequest {
  inviteCode: string;
}

export interface SwitchTeamRequest {
  teamId: string;
}
