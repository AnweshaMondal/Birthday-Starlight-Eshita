export interface Photo {
  id: number;
  src: string;
  alt: string;
  caption: string;
  date?: string;
}

export interface Memory {
  id: number;
  date: string;
  title: string;
  text: string;
  photo: string;
}

export interface Message {
  greeting: string;
  recipientLine: string;
  salutation: string;
  paragraphs: string[];
  signature: string;
  finalLines: string[];
  secret: string;
  puzzleComplete: string;
}

export interface Compliment { id: number; text: string }

export interface BirthdayModel {
  birthdayDate: string;
  message: Message;
  photos: Photo[];
  secretPhotos: Photo[];
  memories: Memory[];
  reasons: string[];
  compliments: Compliment[];
  music: { src: string; title: string; artist: string };
}
