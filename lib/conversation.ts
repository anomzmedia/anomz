import { User } from "@/api/prisma/generated";
import { AuthState, useAuth } from "@/store/auth";
import { Conversation } from "@/types/types";

export const getConversationName = (user:AuthState["user"],conversation:Conversation) => conversation.type == "DM" ? (conversation.participants?.find((e) => e.user?.id != user?.id)?.user?.username) : (conversation.name);