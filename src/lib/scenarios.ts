import type { LucideIcon } from 'lucide-react';

export interface DialogueLine {
  id: string;
  speaker: 'USER' | 'ASSISTANT';
  text: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from icon: LucideIcon
  dialogue: DialogueLine[];
}

export const scenarios: Scenario[] = [
  {
    id: 'grocery-store',
    title: 'At the Grocery Store',
    description: 'Practice buying items at a grocery store.',
    iconName: 'ShoppingBasket',
    dialogue: [
      { id: 'g1', speaker: 'ASSISTANT', text: "Hello! Can I help you find something?" },
      { id: 'g2', speaker: 'USER', text: "Yes, I'm looking for apples." },
      { id: 'g3', speaker: 'ASSISTANT', text: "Sure, they are in aisle 3, next to the bananas." },
      { id: 'g4', speaker: 'USER', text: "Great, thank you!" },
      { id: 'g5', speaker: 'ASSISTANT', text: "You're welcome. Is there anything else?" },
      { id: 'g6', speaker: 'USER', text: "No, that's all for now." },
    ],
  },
  {
    id: 'ordering-coffee',
    title: 'Ordering Coffee',
    description: 'Practice ordering your favorite coffee.',
    iconName: 'Coffee',
    dialogue: [
      { id: 'c1', speaker: 'ASSISTANT', text: "Hi there! What can I get for you?" },
      { id: 'c2', speaker: 'USER', text: "I'd like a medium latte, please." },
      { id: 'c3', speaker: 'ASSISTANT', text: "Alright, any milk preference? We have whole, skim, almond, and oat milk." },
      { id: 'c4', speaker: 'USER', text: "Oat milk would be great." },
      { id: 'c5', speaker: 'ASSISTANT', text: "Coming right up! That will be $4.50." },
      { id: 'c6', speaker: 'USER', text: "Here you go." },
    ],
  },
  {
    id: 'meeting-someone',
    title: 'Meeting Someone New',
    description: 'Practice introducing yourself and making small talk.',
    iconName: 'Users',
    dialogue: [
      { id: 'm1', speaker: 'ASSISTANT', text: "Hello, I don't think we've met. I'm Alex." },
      { id: 'm2', speaker: 'USER', text: "Hi Alex, I'm [Your Name]. Nice to meet you." },
      { id: 'm3', speaker: 'ASSISTANT', text: "Nice to meet you too. What do you do?" },
      { id: 'm4', speaker: 'USER', text: "I am a software engineer." },
      { id: 'm5', speaker: 'ASSISTANT', text: "Oh, interesting! Where do you work?" },
      { id: 'm6', speaker: 'USER', text: "I work at a tech company downtown." },
    ],
  },
  {
    id: 'job-interview',
    title: 'Job Interview Basics',
    description: 'Practice common job interview questions.',
    iconName: 'Briefcase',
    dialogue: [
      { id: 'j1', speaker: 'ASSISTANT', text: "Welcome! Please, tell me a little about yourself." },
      { id: 'j2', speaker: 'USER', text: "Thank you. I have five years of experience in project management." },
      { id: 'j3', speaker: 'ASSISTANT', text: "Why are you interested in this role?" },
      { id: 'j4', speaker: 'USER', text: "This role aligns perfectly with my skills and career goals." },
      { id: 'j5', speaker: 'ASSISTANT', text: "What are your salary expectations?" },
      { id: 'j6', speaker: 'USER', text: "I am looking for a salary between seventy thousand and eighty thousand dollars." },
    ],
  },
  {
    id: 'at-the-airport',
    title: 'At the Airport',
    description: 'Practice navigating check-in and boarding.',
    iconName: 'Plane',
    dialogue: [
      { id: 'a1', speaker: 'ASSISTANT', text: "Good morning! May I see your passport and ticket, please?" },
      { id: 'a2', speaker: 'USER', text: "Yes, here they are." },
      { id: 'a3', speaker: 'ASSISTANT', text: "Are you checking any bags today?" },
      { id: 'a4', speaker: 'USER', text: "Yes, just this one suitcase." },
      { id: 'a5', speaker: 'ASSISTANT', text: "Okay. Your boarding gate is B7, and boarding starts at 10:30 AM." },
      { id: 'a6', speaker: 'USER', text: "Thank you very much." },
    ],
  },
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};
