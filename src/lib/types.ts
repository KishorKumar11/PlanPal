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
  mbtiType: string | null;
  traitScores: TraitScores | null;
  interests: string[];
}

export interface GroupMemberWithUser {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  availabilitySubmittedAt: Date | null;
  user: GroupMemberUser;
}

export type PlanStatus = "idle" | "voting" | "locked";

export interface AvailabilityData {
  userId: string;
  date: string; // ISO date (yyyy-mm-dd)
}

export interface PastPlan {
  id: string;
  title: string;
  category: string;
  description: string;
  reasoning: string;
  metadata: RecommendationMetadata | null;
  lockedDate: string | null;
  notes: string | null;
  completedAt: string;
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
  batchId?: string | null;
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
  planStatus: PlanStatus;
  lockedRecommendationId: string | null;
  dateWindowStart: string | null;
  dateWindowEnd: string | null;
  lockedDate: string | null;
  planNotes: string | null;
  createdAt: Date;
  members: GroupMemberWithUser[];
  recommendations: RecommendationWithVotes[];
  availabilities: AvailabilityData[];
  plans: PastPlan[];
}
