export interface Database {
  public: {
    Tables: {
      family_relationships: {
        Row: {
          id: string;
          parent_id: string;
          child_id: string;
          child_email: string;
          child_name: string;
          relationship_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          child_id?: string;
          child_email: string;
          child_name: string;
          relationship_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      family_invitations: {
        Row: {
          id: string;
          inviter_id: string;
          invitee_email: string;
          inviter_role: string;
          status: 'pending' | 'accepted' | 'rejected';
          invitation_code?: string;
          created_at: string;
          updated_at: string;
          expires_at?: string;
        };
        Insert: {
          id?: string;
          inviter_id: string;
          invitee_email: string;
          inviter_role: string;
          status?: 'pending' | 'accepted' | 'rejected';
          invitation_code?: string;
          created_at?: string;
          updated_at?: string;
          expires_at?: string;
        };
      };
    };
  };
}
