/* Team — ALL disabled pending confirmation. Not rendered until the current
   relationship, spelling, role, and name/photo publication permission are all
   confirmed. Never generate portraits or biographies. */
export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  photo: string | null; // only a real, permitted photograph
  relationshipConfirmed: boolean;
  namePublicationPermitted: boolean;
  photoPublicationPermitted: boolean;
  enabled: boolean;
}

export const team: TeamMember[] = [
  {
    id: "akshay-maru",
    name: "Akshay Maru",
    role: null,
    photo: null,
    relationshipConfirmed: false,
    namePublicationPermitted: false,
    photoPublicationPermitted: false,
    enabled: false,
  },
  {
    id: "gopal-vasane",
    name: "Gopal Vasane",
    role: null,
    photo: null,
    relationshipConfirmed: false,
    namePublicationPermitted: false,
    photoPublicationPermitted: false,
    enabled: false,
  },
];

export const publishedTeam = team.filter(
  (m) => m.enabled && m.relationshipConfirmed && m.namePublicationPermitted,
);
