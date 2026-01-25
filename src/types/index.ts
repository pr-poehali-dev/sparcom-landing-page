export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  role: 'guest' | 'organizer' | 'master';
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface RoleApplication {
  id: number;
  user_id: number;
  requested_role: 'organizer' | 'master';
  status: 'pending' | 'approved' | 'rejected';
  motivation: string;
  portfolio_url?: string;
  created_at: string;
  reviewed_at?: string;
  reviewer_comment?: string;
}

export interface Bathhouse {
  id: number;
  name: string;
  description: string;
  address: string;
  photos: string[];
  capacity: number;
  price_per_hour: number;
  amenities: string[];
  owner_id: number;
  created_at: string;
}

export interface Master {
  id: number;
  user_id: number;
  specialization: string[];
  experience_years: number;
  bio: string;
  portfolio_photos: string[];
  rating: number;
  reviews_count: number;
  price_per_session: number;
  verified: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  bathhouse_id: number;
  bathhouse?: Bathhouse;
  master_id?: number;
  master?: Master;
  organizer_id: number;
  event_date: string;
  duration_hours: number;
  max_participants: number;
  current_participants: number;
  price_per_person: number;
  status: 'draft' | 'published' | 'full' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Booking {
  id: number;
  event_id: number;
  event?: Event;
  user_id: number;
  user?: User;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  total_price: number;
  created_at: string;
  confirmed_at?: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
}
