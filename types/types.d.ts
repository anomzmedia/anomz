export type ConversationType = 'DM' | 'GROUP';

export type ParticipantRole = 'ADMIN' | 'MEMBER';

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO' | 'SYSTEM' | 'SPOTIFY';

export interface User {
  id: string;
  username: string;
  password: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  conversations?: ConversationParticipant[];
  sentMessages?: Message[];
  publicKey: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string | null;
  description: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  participants?: ConversationParticipant[];
  messages?: Message[];
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  conversation?: Conversation;
  user?: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  conversation?: Conversation;
  sender?: User;
  spotifyTrackId: string;
}
