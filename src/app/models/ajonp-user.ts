import { AjonpNotification } from '@ajonp-models/ajonp-notification';
export interface AjonpUser {
  uid: string;
  token?: string;
  email?: string;
  emailVerified?: boolean;
  roles?: AjonpRoles;
  notifications?: AjonpNotification;
  lastActive?: number;
  created?: number;
  photoURL?: string;
  phoneNumber?: string;
  displayName?: string;
  favoriteColor?: string;
  website?: string;
  aboutYou?: string;
  untappd?: {
    access_token?: string;
  };
}

export interface AjonpRoles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}
