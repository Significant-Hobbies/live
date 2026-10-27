import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BookOpen,
  ChefHat,
  Coffee,
  Download,
  Dumbbell,
  Gamepad2,
  Hammer,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Mountain,
  Music,
  Palette,
  PartyPopper,
  Pencil,
  Share2,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
export type Category =
  | 'Creative'
  | 'Physical'
  | 'Outdoor'
  | 'Intellectual'
  | 'Gaming'
  | 'Social'
  | 'Culinary'
  | 'Making'
  | 'Music'
  | 'Collecting';

interface QuizOption {
  icon: LucideIcon;
  label: string;
  categories: Category[];
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    question: "When you have free time, you'd rather...",
    options: [
      { icon: Wrench, label: 'Make something with my hands', categories: ['Creative', 'Making'] },
      { icon: Activity, label: 'Get moving and active', categories: ['Physical', 'Outdoor'] },
      { icon: BookOpen, label: 'Learn something new', categories: ['Intellectual'] },
      { icon: Users, label: 'Hang out with people', categories: ['Social', 'Culinary'] },
    ],
  },
  {
    question: "At a party, you're most likely...",
    options: [
      {
        icon: Pencil,
        label: 'In the corner sketching or people-watching',
        categories: ['Creative'],
      },
      { icon: PartyPopper, label: 'Organizing a group activity', categories: ['Social'] },
      {
        icon: MessageCircle,
        label: 'Deep in conversation about ideas',
        categories: ['Intellectual'],
      },
      {
        icon: Gamepad2,
        label: 'Challenging someone to a game',
        categories: ['Gaming', 'Physical'],
      },
    ],
  },
  {
    question: 'Your ideal weekend involves...',
    options: [
      { icon: Mountain, label: 'A long hike or bike ride', categories: ['Physical', 'Outdoor'] },
      { icon: Palette, label: 'A workshop or class', categories: ['Making', 'Creative'] },
      {
        icon: ChefHat,
        label: 'Cooking a big meal for friends',
        categories: ['Culinary', 'Social'],
      },
      {
        icon: BookOpen,
        label: 'Getting lost in a book or puzzle',
        categories: ['Intellectual', 'Gaming'],
      },
    ],
  },
  {
    question: 'You feel most satisfied when you...',
    options: [
      {
        icon: Lightbulb,
        label: "Create something that didn't exist before",
        categories: ['Creative', 'Making'],
      },
      { icon: Dumbbell, label: 'Push past a physical challenge', categories: ['Physical'] },
      {
        icon: Music,
        label: 'Master a skill through practice',
        categories: ['Music', 'Intellectual'],
      },
      {
        icon: HeartHandshake,
        label: 'Connect with others over shared interests',
        categories: ['Social'],
      },
    ],
  },
  {
    question: 'Your energy level right now...',
    options: [
      { icon: Zap, label: 'High — I want to DO something', categories: ['Physical', 'Outdoor'] },
      {
        icon: Hammer,
        label: 'Medium — I want to create or build',
        categories: ['Creative', 'Making'],
      },
      {
        icon: Coffee,
        label: 'Chill — I want to relax and explore',
        categories: ['Intellectual', 'Gaming', 'Collecting'],
      },
      {
        icon: Users,
        label: 'Social — I want to be around people',
        categories: ['Social', 'Culinary'],
      },
    ],
  },
  {
    question: 'What kind of progress would keep you coming back?',
    options: [
      {
        icon: Palette,
        label: 'Having something tangible I made',
        categories: ['Creative', 'Making'],
      },
      {
        icon: Activity,
        label: 'Feeling stronger or more capable',
        categories: ['Physical', 'Outdoor'],
      },
      {
        icon: Lightbulb,
        label: 'Understanding something at a deeper level',
        categories: ['Intellectual', 'Gaming'],
      },
      {
        icon: Coffee,
        label: 'Building a collection with a point of view',
        categories: ['Collecting'],
      },
    ],
  },
  {
    question: 'Where would you most like this hobby to take you?',
    options: [
      {
        icon: BookOpen,
        label: 'A quiet corner I can make my own',
        categories: ['Collecting', 'Intellectual'],
      },
      {
        icon: Mountain,
        label: 'Outside, away from the usual routine',
        categories: ['Outdoor', 'Physical'],
      },
      {
        icon: Hammer,
        label: 'A workshop, studio, or maker space',
        categories: ['Making', 'Creative'],
      },
      {
        icon: Users,
        label: 'A table, club, or room full of people',
        categories: ['Social', 'Culinary', 'Music'],
      },
    ],
  },
  {
    question: 'How do you enjoy learning something new?',
    options: [
      {
        icon: BookOpen,
        label: 'Following a self-guided rabbit hole',
        categories: ['Intellectual', 'Collecting', 'Gaming'],
      },
      {
        icon: HeartHandshake,
        label: 'Learning alongside other people',
        categories: ['Social', 'Music', 'Culinary'],
      },
      {
        icon: Wrench,
        label: 'Trying, adjusting, and using my hands',
        categories: ['Making', 'Creative'],
      },
      {
        icon: Dumbbell,
        label: 'Repeating a practice until it clicks',
        categories: ['Physical', 'Outdoor', 'Music'],
      },
    ],
  },
  {
    question: 'Six months from now, what would feel most worthwhile?',
    options: [
      {
        icon: Palette,
        label: 'I have a body of work I am proud of',
        categories: ['Creative', 'Making'],
      },
      {
        icon: Zap,
        label: 'I can do something my body could not do before',
        categories: ['Physical', 'Outdoor'],
      },
      {
        icon: Users,
        label: 'I have people and a place I look forward to',
        categories: ['Social', 'Culinary', 'Music'],
      },
      {
        icon: Gamepad2,
        label: 'I have mastered a system or built real knowledge',
        categories: ['Intellectual', 'Gaming', 'Collecting'],
      },
    ],
  },
];
