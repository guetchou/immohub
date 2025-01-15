export interface Message {
  id: string;
  content: string;
  sender: string;
}

export interface SupabaseMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
}