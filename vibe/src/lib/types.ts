export interface TraitScores {
  adventurous: number;
  social: number;
  creative: number;
  chill: number;
  competitive: number;
  foodie: number;
}

export interface GroupMemberUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  archetype: string | null;
  traitScores: TraitScores | null;
  interests: string[];
}

export interface GroupMemberWithUser {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user: GroupMemberUser;
}

export interface RecommendationMetadata {
  price_range: string;
  duration: string;
  energy_level: string;
}

export interface VoteData {
  id: string;
  recommendationId: string;
  userId: string;
  value: number;
}

export interface RecommendationWithVotes {
  id: string;
  groupId: string;
  title: string;
  description: string;
  category: string;
  reasoning: string;
  metadata: RecommendationMetadata | null;
  createdAt: Date;
  votes: VoteData[];
}

export interface GroupWithMembers {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdById: string;
  createdAt: Date;
  members: GroupMemberWithUser[];
  recommendations: RecommendationWithVotes[];
}
