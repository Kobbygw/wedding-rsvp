export interface Wedding {
  id: string;
  couple_name: string;
  date: string;
  location: string;
  story: string;
  rsvp_deadline: string;
  cover_image: string;
  gallery: string[];
  // Gifting fields
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  momo_name?: string;
  momo_number?: string;
  momo_name_2?: string;
  momo_number_2?: string;
}

export type GuestStatus = 'pending' | 'attending' | 'not_attending';

export interface Guest {
  id: string;
  wedding_id: string;
  name: string;
  token: string;
  status: GuestStatus;
  plus_one: boolean;
  message: string;
  response_date: string | null;
}
