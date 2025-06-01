
import type { LucideIcon } from 'lucide-react';

export interface DialogueLine {
  id: string;
  speaker: 'USER' | 'ASSISTANT';
  text: string;
  sinhalaTranslation?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  iconName: string;
  dialogue: DialogueLine[];
}

export const scenarios: Scenario[] = [
  {
    id: 'grocery-store',
    title: 'At the Grocery Store',
    description: 'Practice buying items at a grocery store.',
    iconName: 'ShoppingBasket',
    dialogue: [
      { id: 'g1', speaker: 'ASSISTANT', text: "Hello! Can I help you find something?", sinhalaTranslation: "හෙලෝ! මට ඔයාට යමක් හොයාගන්න උදව් කරන්න පුලුවන්ද?" },
      { id: 'g2', speaker: 'USER', text: "Yes, I'm looking for apples.", sinhalaTranslation: "ඔව්, මම ඇපල් හොයනවා." },
      { id: 'g3', speaker: 'ASSISTANT', text: "Sure, they are in aisle 3, next to the bananas.", sinhalaTranslation: "හරි, ඒවා අන්තරාල 3 හි, කෙසෙල් ගෙඩි поруч ඇත." },
      { id: 'g4', speaker: 'USER', text: "Great, thank you!", sinhalaTranslation: "නියමයි, ස්තූතියි!" },
      { id: 'g5', speaker: 'ASSISTANT', text: "You're welcome. Is there anything else?", sinhalaTranslation: "සුභ පැතුම්. තව මොනවාහරිද?" },
      { id: 'g6', speaker: 'USER', text: "No, that's all for now.", sinhalaTranslation: "නැහැ, දැනට එච්චරයි." },
    ],
  },
  {
    id: 'ordering-coffee',
    title: 'Ordering Coffee',
    description: 'Practice ordering your favorite coffee.',
    iconName: 'Coffee',
    dialogue: [
      { id: 'c1', speaker: 'ASSISTANT', text: "Hi there! What can I get for you?", sinhalaTranslation: "ආයුබෝවන්! මම ඔයාට මොනවද දෙන්න ඕන?" },
      { id: 'c2', speaker: 'USER', text: "I'd like a medium latte, please.", sinhalaTranslation: "මට මධ්‍යම ලාටේ එකක් ඕන, කරුණාකරලා." },
      { id: 'c3', speaker: 'ASSISTANT', text: "Alright, any milk preference? We have whole, skim, almond, and oat milk.", sinhalaTranslation: "හරි, කිරි වර්ගයක් තෝරගන්නවද? අප దగ్గర සම්පූර්ණ, අඩු මේද, ආමන්ඩ්, සහ ඕට් කිරි තියෙනවා." },
      { id: 'c4', speaker: 'USER', text: "Oat milk would be great.", sinhalaTranslation: "ඕට් කිරි හොඳයි." },
      { id: 'c5', speaker: 'ASSISTANT', text: "Coming right up! That will be $4.50.", sinhalaTranslation: "මෙන්න එනවා! ඒක ඩොලර් 4.50යි." },
      { id: 'c6', speaker: 'USER', text: "Here you go.", sinhalaTranslation: "මෙන්න." },
    ],
  },
  {
    id: 'meeting-someone',
    title: 'Meeting Someone New',
    description: 'Practice introducing yourself and making small talk.',
    iconName: 'Users',
    dialogue: [
      { id: 'm1', speaker: 'ASSISTANT', text: "Hello, I don't think we've met. I'm Alex.", sinhalaTranslation: "හෙලෝ, මම හිතන්නේ අපි මුණගැහිලා නැහැ. මම ඇලෙක්ස්." },
      { id: 'm2', speaker: 'USER', text: "Hi Alex, I'm [Your Name]. Nice to meet you.", sinhalaTranslation: "ආයුබෝවන් ඇලෙක්ස්, මම [ඔබේ නම]. ඔබව හමුවීම සතුටක්." },
      { id: 'm3', speaker: 'ASSISTANT', text: "Nice to meet you too. What do you do?", sinhalaTranslation: "ඔබව හමුවීමත් සතුටක්. ඔයා මොකද කරන්නේ?" },
      { id: 'm4', speaker: 'USER', text: "I am a software engineer.", sinhalaTranslation: "මම මෘදුකාංග ඉංජිනේරුවෙක්." },
      { id: 'm5', speaker: 'ASSISTANT', text: "Oh, interesting! Where do you work?", sinhalaTranslation: "ආ, ඒක හරිම රසවත්! ඔයා කොහෙද වැඩ කරන්නේ?" },
      { id: 'm6', speaker: 'USER', text: "I work at a tech company downtown.", sinhalaTranslation: "මම නගර මධ්‍යයේ තාක්ෂණික සමාගමක වැඩ කරනවා." },
    ],
  },
  {
    id: 'job-interview',
    title: 'Job Interview Basics',
    description: 'Practice common job interview questions.',
    iconName: 'Briefcase',
    dialogue: [
      { id: 'j1', speaker: 'ASSISTANT', text: "Welcome! Please, tell me a little about yourself.", sinhalaTranslation: "පිළිගන්නවා! කරුණාකර, ඔයා ගැන පොඩ්ඩක් කියන්න." },
      { id: 'j2', speaker: 'USER', text: "Thank you. I have five years of experience in project management.", sinhalaTranslation: "ස්තූතියි. මට ව්‍යාපෘති කළමනාකරණය පිළිබඳ අවුරුදු පහක පළපුරුද්දක් තියෙනවා." },
      { id: 'j3', speaker: 'ASSISTANT', text: "Why are you interested in this role?", sinhalaTranslation: "ඔයා මේ තනතුරට කැමති ඇයි?" },
      { id: 'j4', speaker: 'USER', text: "This role aligns perfectly with my skills and career goals.", sinhalaTranslation: "මේ තනතුර මගේ කුසලතා සහ වෘත්තීය ඉලක්ක සමඟ හොඳින් ගැලපෙනවා." },
      { id: 'j5', speaker: 'ASSISTANT', text: "What are your salary expectations?", sinhalaTranslation: "ඔබේ වැටුප් අපේක්ෂාවන් මොනවාද?" },
      { id: 'j6', speaker: 'USER', text: "I am looking for a salary between seventy thousand and eighty thousand dollars.", sinhalaTranslation: "මම ඩොලර් හැත්තෑ දහසත් අසූ දහසත් අතර වැටුපක් බලාපොරොත්තු වෙනවා." },
    ],
  },
  {
    id: 'at-the-airport',
    title: 'At the Airport',
    description: 'Practice navigating check-in and boarding.',
    iconName: 'Plane',
    dialogue: [
      { id: 'a1', speaker: 'ASSISTANT', text: "Good morning! May I see your passport and ticket, please?", sinhalaTranslation: "සුබ උදෑසනක්! කරුණාකර ඔබේ ගමන් බලපත්‍රය සහ ටිකට් පත දෙන්න පුලුවන්ද?" },
      { id: 'a2', speaker: 'USER', text: "Yes, here they are.", sinhalaTranslation: "ඔව්, මෙන්න." },
      { id: 'a3', speaker: 'ASSISTANT', text: "Are you checking any bags today?", sinhalaTranslation: "ඔබ අද බෑග් චෙක් කරනවද?" },
      { id: 'a4', speaker: 'USER', text: "Yes, just this one suitcase.", sinhalaTranslation: "ඔව්, මේ සූට්කේස් එක විතරයි." },
      { id: 'a5', speaker: 'ASSISTANT', text: "Okay. Your boarding gate is B7, and boarding starts at 10:30 AM.", sinhalaTranslation: "හරි. ඔබේ බෝඩිං ගේට්ටුව B7, බෝඩිං වීම උදේ 10:30 ට පටන් ගන්නවා." },
      { id: 'a6', speaker: 'USER', text: "Thank you very much.", sinhalaTranslation: "බොහොම ස්තූතියි." },
    ],
  },
  {
    id: 'asking-directions',
    title: 'Asking for Directions',
    description: 'Learn how to ask for and understand directions.',
    iconName: 'HelpCircle',
    dialogue: [
      { id: 'ad1', speaker: 'USER', text: "Excuse me, how can I get to the museum?", sinhalaTranslation: "සමාවෙන්න, කෞතුකාගාරයට යන්නේ කොහොමද?" },
      { id: 'ad2', speaker: 'ASSISTANT', text: "Go straight for two blocks, then turn left. It's next to the park.", sinhalaTranslation: "බ්ලොක් දෙකක් කෙලින්ම ගිහින් වමට හැරෙන්න. ඒක උද්‍යානය ළඟ." },
      { id: 'ad3', speaker: 'USER', text: "Is it far from here?", sinhalaTranslation: "ඒක මෙතන ඉඳන් දුරද?" },
      { id: 'ad4', speaker: 'ASSISTANT', text: "Not too far, about a 10-minute walk.", sinhalaTranslation: "එච්චර දුර නැහැ, විනාඩි 10ක විතර පයින් යන දුරක්." },
      { id: 'ad5', speaker: 'USER', text: "Thank you for your help.", sinhalaTranslation: "ඔබගේ උදව්වට ස්තූතියි." },
      { id: 'ad6', speaker: 'ASSISTANT', text: "You're welcome!", sinhalaTranslation: "සුභ පැතුම්!" }
    ]
  },
  {
    id: 'restaurant-ordering',
    title: 'Ordering Food at a Restaurant',
    description: 'Practice ordering a meal at a restaurant.',
    iconName: 'Coffee', // Re-using, suitable
    dialogue: [
      { id: 'ro1', speaker: 'ASSISTANT', text: "Welcome! Are you ready to order?", sinhalaTranslation: "පිළිගන්නවා! ඔයා ඕඩර් කරන්න ලෑස්තිද?" },
      { id: 'ro2', speaker: 'USER', text: "Yes, I'll have the chicken pasta, please.", sinhalaTranslation: "ඔව්, මට චිකන් පාස්තා එක දෙන්න, කරුණාකරලා." },
      { id: 'ro3', speaker: 'ASSISTANT', text: "Would you like anything to drink with that?", sinhalaTranslation: "ඒත් එක්ක බොන්න මොනවාහරි ඕනද?" },
      { id: 'ro4', speaker: 'USER', text: "Just a glass of water, thank you.", sinhalaTranslation: "වතුර වීදුරුවක් විතරයි, ස්තූතියි." },
      { id: 'ro5', speaker: 'ASSISTANT', text: "Certainly. Your order will be ready soon.", sinhalaTranslation: "හරි. ඔබේ ඕඩරය ඉක්මනින් ලෑස්ති වේවි." },
      { id: 'ro6', speaker: 'USER', text: "Thanks!", sinhalaTranslation: "ස්තූතියි!" }
    ]
  },
  {
    id: 'talking-hobbies',
    title: 'Talking About Hobbies',
    description: 'Discuss your hobbies and interests.',
    iconName: 'Users', // Re-using, suitable for conversation
    dialogue: [
      { id: 'th1', speaker: 'ASSISTANT', text: "What do you like to do in your free time?", sinhalaTranslation: "ඔයා නිදහස් වෙලාවට මොකද කරන්න කැමති?" },
      { id: 'th2', speaker: 'USER', text: "I enjoy reading books and hiking.", sinhalaTranslation: "මම පොත් කියවන්නයි කඳු නගින්නයි ආසයි." },
      { id: 'th3', speaker: 'ASSISTANT', text: "That sounds fun! Any favorite book?", sinhalaTranslation: "ඒක නම් විනෝදජනකයි වගේ! කැමතිම පොතක් තියෙනවද?" },
      { id: 'th4', speaker: 'USER', text: "Yes, I really liked 'The Little Prince'.", sinhalaTranslation: "ඔව්, මම 'පුංචි කුමාරයා'ට හරිම කැමතියි." },
      { id: 'th5', speaker: 'ASSISTANT', text: "Oh, a classic! I like hiking too.", sinhalaTranslation: "ආ, ඒක පරණ ප්‍රසිද්ධ එකක්! මමත් කඳු නගින්න කැමතියි." },
      { id: 'th6', speaker: 'USER', text: "Maybe we can go hiking together sometime.", sinhalaTranslation: "සමහරවිට අපිට කවදහරි එකට කඳු නගින්න යන්න පුළුවන්." }
    ]
  },
  {
    id: 'doctors-appointment',
    title: "Making a Doctor's Appointment",
    description: "Learn to schedule an appointment with a doctor.",
    iconName: 'Briefcase', // General purpose
    dialogue: [
      { id: 'da1', speaker: 'USER', text: "Hello, I'd like to make an appointment to see Dr. Smith.", sinhalaTranslation: "හෙලෝ, මට දොස්තර ස්මිත්ව හමුවෙන්න වෙලාවක් වෙන්කරගන්න ඕන." },
      { id: 'da2', speaker: 'ASSISTANT', text: "Certainly. What is the reason for your visit?", sinhalaTranslation: "හරි. ඔබ එන්න හේතුව මොකක්ද?" },
      { id: 'da3', speaker: 'USER', text: "I have a persistent cough.", sinhalaTranslation: "මට දිගටම තියෙන කැස්සක් තියෙනවා." },
      { id: 'da4', speaker: 'ASSISTANT', text: "Dr. Smith is available next Tuesday at 10 AM. Would that work?", sinhalaTranslation: "දොස්තර ස්මිත් ලබන අඟහරුවාදා උදේ 10ට ඉන්නවා. ඒක හරියනවද?" },
      { id: 'da5', speaker: 'USER', text: "Yes, that's perfect.", sinhalaTranslation: "ඔව්, ඒක නියමයි." },
      { id: 'da6', speaker: 'ASSISTANT', text: "Great. We'll see you then.", sinhalaTranslation: "නියමයි. එහෙනම් අපි එදාට හමුවෙමු." }
    ]
  },
  {
    id: 'at-the-pharmacy',
    title: 'At the Pharmacy',
    description: 'Practice getting medication from a pharmacy.',
    iconName: 'ShoppingBasket', // Related to buying
    dialogue: [
      { id: 'ap1', speaker: 'USER', text: "Hi, I'm here to pick up a prescription for John Doe.", sinhalaTranslation: "ආයුබෝවන්, මම ජෝන් ඩෝ ගේ බෙහෙත් වට්ටෝරුව ගන්න ආවේ." },
      { id: 'ap2', speaker: 'ASSISTANT', text: "Okay, let me check that for you. One moment.", sinhalaTranslation: "හරි, මම ඒක බලන්නම්. පොඩ්ඩක් ඉන්න." },
      { id: 'ap3', speaker: 'ASSISTANT', text: "Here it is. That will be $15.", sinhalaTranslation: "මෙන්න තියෙනවා. ඒක ඩොලර් 15යි." },
      { id: 'ap4', speaker: 'USER', text: "Can I pay by card?", sinhalaTranslation: "මට කාඩ් එකෙන් ගෙවන්න පුලුවන්ද?" },
      { id: 'ap5', speaker: 'ASSISTANT', text: "Yes, of course. Please sign here.", sinhalaTranslation: "ඔව්, ඇත්තෙන්ම. කරුණාකර මෙතන අත්සන් කරන්න." },
      { id: 'ap6', speaker: 'USER', text: "Thank you.", sinhalaTranslation: "ස්තූතියි." }
    ]
  },
  {
    id: 'weekend-plans',
    title: 'Discussing Weekend Plans',
    description: 'Talk about what you plan to do over the weekend.',
    iconName: 'Users',
    dialogue: [
      { id: 'wp1', speaker: 'ASSISTANT', text: "Any plans for the weekend?", sinhalaTranslation: "සති අන්තෙට මොකුත් සැලසුම් තියෙනවද?" },
      { id: 'wp2', speaker: 'USER', text: "Yes, I'm going to visit my parents.", sinhalaTranslation: "ඔව්, මම මගේ දෙමව්පියන්ව බලන්න යනවා." },
      { id: 'wp3', speaker: 'ASSISTANT', text: "That sounds nice. What about Sunday?", sinhalaTranslation: "ඒක හොඳයි වගේ. ඉරිදාට මොකද කරන්නේ?" },
      { id: 'wp4', speaker: 'USER', text: "I plan to relax at home and watch a movie.", sinhalaTranslation: "මම ගෙදර ඉඳන් විවේක ගන්නයි චිත්‍රපටියක් බලන්නයි හිතාගෙන ඉන්නවා." },
      { id: 'wp5', speaker: 'ASSISTANT', text: "Sounds like a good weekend!", sinhalaTranslation: "හොඳ සති අන්තයක් වගේ!" },
      { id: 'wp6', speaker: 'USER', text: "I hope so! What about you?", sinhalaTranslation: "මම එහෙම බලාපොරොත්තු වෙනවා! ඔයා මොකද කරන්නේ?" }
    ]
  },
  {
    id: 'returning-item',
    title: 'Returning an Item to a Store',
    description: 'Practice how to return a purchased item.',
    iconName: 'ShoppingBasket',
    dialogue: [
      { id: 'ri1', speaker: 'USER', text: "Hello, I'd like to return this shirt.", sinhalaTranslation: "හෙලෝ, මට මේ ෂර්ට් එක ආපහු දෙන්න ඕන." },
      { id: 'ri2', speaker: 'ASSISTANT', text: "Do you have the receipt?", sinhalaTranslation: "ඔබ ළඟ රිසිට්පත තියෙනවද?" },
      { id: 'ri3', speaker: 'USER', text: "Yes, here it is. It's the wrong size.", sinhalaTranslation: "ඔව්, මෙන්න. මේක වැරදි සයිස් එක." },
      { id: 'ri4', speaker: 'ASSISTANT', text: "No problem. Would you like an exchange or a refund?", sinhalaTranslation: "ප්‍රශ්නයක් නැහැ. ඔයාට මාරු කරගන්නද ඕන නැත්නම් මුදල් ආපහු ගන්නද?" },
      { id: 'ri5', speaker: 'USER', text: "A refund, please.", sinhalaTranslation: "මුදල් ආපහු දෙන්න, කරුණාකරලා." },
      { id: 'ri6', speaker: 'ASSISTANT', text: "Okay, I'll process that for you.", sinhalaTranslation: "හරි, මම ඒක ඔයාට කරලා දෙන්නම්." }
    ]
  },
  {
    id: 'asking-time',
    title: 'Asking for the Time',
    description: 'Learn simple ways to ask for the current time.',
    iconName: 'HelpCircle',
    dialogue: [
      { id: 'at1', speaker: 'USER', text: "Excuse me, do you have the time?", sinhalaTranslation: "සමාවෙන්න, ඔයා ළඟ වෙලාව තියෙනවද?" },
      { id: 'at2', speaker: 'ASSISTANT', text: "Sure, it's 3:30 PM.", sinhalaTranslation: "හරි, දැන් හවස 3:30යි." },
      { id: 'at3', speaker: 'USER', text: "Thank you so much.", sinhalaTranslation: "බොහොම ස්තූතියි." },
      { id: 'at4', speaker: 'ASSISTANT', text: "You're welcome.", sinhalaTranslation: "සුභ පැතුම්." },
      { id: 'at5', speaker: 'USER', text: "My watch stopped working.", sinhalaTranslation: "මගේ ඔරලෝසුව වැඩ කරන්නේ නැහැ." },
      { id: 'at6', speaker: 'ASSISTANT', text: "Oh, that happens sometimes.", sinhalaTranslation: "ආ, එහෙම සමහර වෙලාවට වෙනවා." }
    ]
  },
  {
    id: 'hotel-checkin',
    title: 'Checking into a Hotel',
    description: 'Practice the check-in process at a hotel.',
    iconName: 'Briefcase', // Could be Plane too, but Briefcase is general travel
    dialogue: [
      { id: 'hc1', speaker: 'USER', text: "Hello, I have a reservation under the name [Your Name].", sinhalaTranslation: "හෙලෝ, මට [ඔබේ නම] නමින් වෙන් කිරීමක් තියෙනවා." },
      { id: 'hc2', speaker: 'ASSISTANT', text: "Welcome! Let me check that for you. Yes, I see it here.", sinhalaTranslation: "පිළිගන්නවා! මම ඒක බලන්නම්. ඔව්, මට ඒක මෙතන පේනවා." },
      { id: 'hc3', speaker: 'USER', text: "Great. What time is breakfast served?", sinhalaTranslation: "නියමයි. උදේ කෑම දෙන්නේ කීයටද?" },
      { id: 'hc4', speaker: 'ASSISTANT', text: "Breakfast is from 7 AM to 10 AM in our dining hall.", sinhalaTranslation: "උදේ කෑම උදේ 7 ඉඳන් 10 වෙනකම් අපේ කෑම ශාලාවේ." },
      { id: 'hc5', speaker: 'USER', text: "Okay, thank you.", sinhalaTranslation: "හරි, ස්තූතියි." },
      { id: 'hc6', speaker: 'ASSISTANT', text: "Enjoy your stay! Here is your room key.", sinhalaTranslation: "ඔබේ නවාතැන සුවපහසු වේවා! මෙන්න ඔබේ කාමරේ යතුර." }
    ]
  },
  {
    id: 'weather-talk',
    title: 'Talking About the Weather',
    description: 'Practice simple conversations about the weather.',
    iconName: 'HelpCircle', // Generic
    dialogue: [
      { id: 'wt1', speaker: 'ASSISTANT', text: "It's a beautiful day, isn't it?", sinhalaTranslation: "අද හරිම ලස්සන දවසක්, නේද?" },
      { id: 'wt2', speaker: 'USER', text: "Yes, it is! The sun is shining brightly.", sinhalaTranslation: "ඔව්, එහෙමයි! ඉර හොඳට පායලා." },
      { id: 'wt3', speaker: 'ASSISTANT', text: "I hope it stays like this for the weekend.", sinhalaTranslation: "මම හිතනවා සති අන්තෙත් මේ වගේම තියෙයි කියලා." },
      { id: 'wt4', speaker: 'USER', text: "Me too. I heard it might rain tomorrow though.", sinhalaTranslation: "මාත් එහෙමයි. හැබැයි මට ආරංචියි හෙට වහින්න පුළුවන් කියලා." },
      { id: 'wt5', speaker: 'ASSISTANT', text: "Oh, really? Let's hope for the best.", sinhalaTranslation: "ආ, ඇත්තද? අපි හොඳම දේ බලාපොරොත්තු වෙමු." },
      { id: 'wt6', speaker: 'USER', text: "Yes, fingers crossed!", sinhalaTranslation: "ඔව්, ඇඟිලි හරස් කරගෙන ඉමු!" }
    ]
  },
  {
    id: 'at-the-library',
    title: 'At the Library',
    description: 'Practice asking for books and library services.',
    iconName: 'Briefcase', // Using for general service place
    dialogue: [
      { id: 'al1', speaker: 'USER', text: "Excuse me, can you help me find a book on gardening?", sinhalaTranslation: "සමාවෙන්න, මට ගෙවතු වගාව ගැන පොතක් හොයාගන්න උදව් කරන්න පුලුවන්ද?" },
      { id: 'al2', speaker: 'ASSISTANT', text: "Certainly. The gardening section is over there, near the window.", sinhalaTranslation: "හරි. ගෙවතු වගා අංශය අතන, ජනේලය ළඟ." },
      { id: 'al3', speaker: 'USER', text: "How long can I borrow books for?", sinhalaTranslation: "මට කොච්චර කාලයක් පොත් ගන්න පුලුවන්ද?" },
      { id: 'al4', speaker: 'ASSISTANT', text: "You can borrow them for two weeks.", sinhalaTranslation: "ඔබට සති දෙකකට ඒවා ගන්න පුළුවන්." },
      { id: 'al5', speaker: 'USER', text: "Thank you very much.", sinhalaTranslation: "බොහොම ස්තූතියි." },
      { id: 'al6', speaker: 'ASSISTANT', text: "You're welcome. Let me know if you need anything else.", sinhalaTranslation: "සුභ පැතුම්. තව මොනවාහරි ඕන නම් කියන්න." }
    ]
  },
  {
    id: 'buying-train-tickets',
    title: 'Buying Train Tickets',
    description: 'Practice purchasing tickets for train travel.',
    iconName: 'Plane', // Related to travel
    dialogue: [
      { id: 'btt1', speaker: 'USER', text: "I'd like to buy a ticket to Kandy, please.", sinhalaTranslation: "මට නුවරට ටිකට් එකක් ගන්න ඕන, කරුණාකරලා." },
      { id: 'btt2', speaker: 'ASSISTANT', text: "One way or round trip?", sinhalaTranslation: "එක් පැත්තකටද නැත්නම් එහාට මෙහාට දෙකටමද?" },
      { id: 'btt3', speaker: 'USER', text: "Round trip, please. For tomorrow.", sinhalaTranslation: "එහාට මෙහාට දෙකටම, කරුණාකරලා. හෙටට." },
      { id: 'btt4', speaker: 'ASSISTANT', text: "Okay, that will be 500 rupees.", sinhalaTranslation: "හරි, ඒක රුපියල් 500යි." },
      { id: 'btt5', speaker: 'USER', text: "Here you are. Which platform does it leave from?", sinhalaTranslation: "මෙන්න. ඒක පිටත් වෙන්නේ මොන ප්ලැට්ෆෝම් එකෙන්ද?" },
      { id: 'btt6', speaker: 'ASSISTANT', text: "It leaves from platform 2.", sinhalaTranslation: "ඒක ප්ලැට්ෆෝම් 2න් පිටත් වෙනවා." }
    ]
  },
  {
    id: 'visiting-friend',
    title: "Visiting a Friend's House",
    description: 'Practice polite conversation when visiting someone.',
    iconName: 'Users',
    dialogue: [
      { id: 'vf1', speaker: 'ASSISTANT', text: "Hi! Come on in. So glad you could make it.", sinhalaTranslation: "ආයුබෝවන්! ඇතුලට එන්න. ඔයා ආපු එක ගැන හරිම සතුටුයි." },
      { id: 'vf2', speaker: 'USER', text: "Thanks for having me. Your home is lovely.", sinhalaTranslation: "මට ආරාධනා කළාට ස්තූතියි. ඔයාගේ ගෙදර හරිම ලස්සනයි." },
      { id: 'vf3', speaker: 'ASSISTANT', text: "Thank you! Can I get you something to drink?", sinhalaTranslation: "ස්තූතියි! ඔයාට බොන්න මොනවාහරි දෙන්නද?" },
      { id: 'vf4', speaker: 'USER', text: "Water would be great, thank you.", sinhalaTranslation: "වතුර හොඳයි, ස්තූතියි." },
      { id: 'vf5', speaker: 'ASSISTANT', text: "Sure, make yourself comfortable.", sinhalaTranslation: "හරි, සැපපහසුවෙන් ඉන්න." },
      { id: 'vf6', speaker: 'USER', text: "It's been a while since we last met.", sinhalaTranslation: "අපි අන්තිමට හම්බවෙලා ටික කාලයක් වෙනවා." }
    ]
  },
  {
    id: 'daily-greetings',
    title: 'Daily Greetings',
    description: 'Practice common morning and evening greetings.',
    iconName: 'UserCircle2',
    dialogue: [
      { id: 'dg1', speaker: 'USER', text: "Good morning! How are you today?", sinhalaTranslation: "සුබ උදෑසනක්! ඔයාට අද කොහොමද?" },
      { id: 'dg2', speaker: 'ASSISTANT', text: "Good morning! I'm doing well, thank you. And you?", sinhalaTranslation: "සුබ උදෑසනක්! මම හොඳින් ඉන්නවා, ස්තූතියි. ඔයා?" },
      { id: 'dg3', speaker: 'USER', text: "I'm great, thanks. Have a good day!", sinhalaTranslation: "මම නියමෙට ඉන්නවා, ස්තූතියි. සුභ දවසක්!" },
      { id: 'dg4', speaker: 'ASSISTANT', text: "You too! Good evening, did you have a nice day?", sinhalaTranslation: "ඔබටත්! සුබ සන්ධ්‍යාවක්, ඔයාට හොඳ දවසක් තිබුණද?" },
      { id: 'dg5', speaker: 'USER', text: "Good evening! Yes, it was pretty good.", sinhalaTranslation: "සුබ සන්ධ්‍යාවක්! ඔව්, ඒක තරමක් හොඳයි." },
      { id: 'dg6', speaker: 'ASSISTANT', text: "That's good to hear.", sinhalaTranslation: "ඒක අහන්න සතුටුයි." }
    ]
  },
  {
    id: 'at-the-bank',
    title: 'At the Bank',
    description: 'Practice common banking transactions.',
    iconName: 'Briefcase',
    dialogue: [
      { id: 'ab1', speaker: 'USER', text: "Hello, I'd like to deposit this check.", sinhalaTranslation: "හෙලෝ, මට මේ චෙක් එක තැන්පත් කරන්න ඕන." },
      { id: 'ab2', speaker: 'ASSISTANT', text: "Certainly. Can I see your account number, please?", sinhalaTranslation: "හරි. කරුණාකර ඔබේ ගිණුම් අංකය දෙන්න පුලුවන්ද?" },
      { id: 'ab3', speaker: 'USER', text: "Sure, it's [Account Number].", sinhalaTranslation: "හරි, ඒක [ගිණුම් අංකය]." },
      { id: 'ab4', speaker: 'ASSISTANT', text: "Thank you. And how much would you like to withdraw?", sinhalaTranslation: "ස්තූතියි. ඔයාට කොච්චර මුදලක් ආපහු ගන්න ඕනද?" },
      { id: 'ab5', speaker: 'USER', text: "I'd like to withdraw 5000 rupees.", sinhalaTranslation: "මට රුපියල් 5000ක් ආපහු ගන්න ඕන." },
      { id: 'ab6', speaker: 'ASSISTANT', text: "Alright, here is your cash and receipt.", sinhalaTranslation: "හරි, මෙන්න ඔබේ මුදල් සහ රිසිට්පත." }
    ]
  },
  {
    id: 'discussing-movie',
    title: 'Discussing a Movie',
    description: 'Talk about a movie you recently watched.',
    iconName: 'Users',
    dialogue: [
      { id: 'dm1', speaker: 'ASSISTANT', text: "Have you seen any good movies lately?", sinhalaTranslation: "ඔයා මෑතකදී හොඳ චිත්‍රපටි මොනවාහරි බැලුවද?" },
      { id: 'dm2', speaker: 'USER', text: "Yes, I watched 'The Avengers' last night. It was amazing!", sinhalaTranslation: "ඔව්, මම ඊයේ රෑ 'The Avengers' බැලුවා. ඒක නියමයි!" },
      { id: 'dm3', speaker: 'ASSISTANT', text: "Oh, I love that movie! Who is your favorite character?", sinhalaTranslation: "ආ, මම ඒ චිත්‍රපටියට ආසයි! ඔයාගේ කැමතිම චරිතය කවුද?" },
      { id: 'dm4', speaker: 'USER', text: "I think Iron Man is the best.", sinhalaTranslation: "මම හිතන්නේ අයන් මෑන් තමයි හොඳම." },
      { id: 'dm5', speaker: 'ASSISTANT', text: "He's great! We should watch another movie together soon.", sinhalaTranslation: "එයා නියමයි! අපි ඉක්මනින් තව චිත්‍රපටියක් එකට බලමු." },
      { id: 'dm6', speaker: 'USER', text: "That sounds like a plan!", sinhalaTranslation: "ඒක හොඳ අදහසක්!" }
    ]
  },
  {
    id: 'inviting-someone',
    title: 'Inviting Someone to an Event',
    description: 'Practice inviting someone to a party or gathering.',
    iconName: 'Users',
    dialogue: [
      { id: 'is1', speaker: 'USER', text: "Hi [Friend's Name], are you free on Saturday evening?", sinhalaTranslation: "ආයුබෝවන් [මිතුරාගේ නම], ඔයා සෙනසුරාදා හවස නිදහස්ද?" },
      { id: 'is2', speaker: 'ASSISTANT', text: "Yes, I think so. Why, what's up?", sinhalaTranslation: "ඔව්, මම හිතනවා එහෙම. ඇයි, මොකද වෙන්නේ?" },
      { id: 'is3', speaker: 'USER', text: "I'm having a small get-together at my place. Would you like to come?", sinhalaTranslation: "මම මගේ ගෙදර පොඩි එකතුවක් තියනවා. ඔයාට එන්න කැමතිද?" },
      { id: 'is4', speaker: 'ASSISTANT', text: "That sounds lovely! I'd love to. What time?", sinhalaTranslation: "ඒක හරිම හොඳයි! මම එන්න ආසයි. කීයටද?" },
      { id: 'is5', speaker: 'USER', text: "Around 7 PM. See you then!", sinhalaTranslation: "හවස 7ට විතර. එහෙනම් එදාට හමුවෙමු!" },
      { id: 'is6', speaker: 'ASSISTANT', text: "Great, looking forward to it!", sinhalaTranslation: "නියමයි, මම බලාගෙන ඉන්නවා!" }
    ]
  },
  {
    id: 'at-the-park',
    title: 'At the Park',
    description: 'Simple conversations you might have at a park.',
    iconName: 'HelpCircle', // Generic outdoor
    dialogue: [
      { id: 'apark1', speaker: 'ASSISTANT', text: "What a lovely day to be at the park!", sinhalaTranslation: "පාර්ක් එකේ ඉන්න මොනතරම් ලස්සන දවසක්ද!" },
      { id: 'apark2', speaker: 'USER', text: "Yes, it's perfect for a walk.", sinhalaTranslation: "ඔව්, ඇවිදින්න නම් නියමයි." },
      { id: 'apark3', speaker: 'ASSISTANT', text: "Look at those ducks in the pond.", sinhalaTranslation: "අර පොකුණේ ඉන්න තාරාවන් දිහා බලන්න." },
      { id: 'apark4', speaker: 'USER', text: "They are so cute! Do you come here often?", sinhalaTranslation: "ඒගොල්ලෝ හරිම හුරුබුහුටියි! ඔයා මෙහෙ නිතර එනවද?" },
      { id: 'apark5', speaker: 'ASSISTANT', text: "Yes, I try to come every weekend.", sinhalaTranslation: "ඔව්, මම හැම සති අන්තෙම එන්න උත්සාහ කරනවා." },
      { id: 'apark6', speaker: 'USER', text: "It's a great place to relax.", sinhalaTranslation: "විවේක ගන්න නියම තැනක්." }
    ]
  },
  {
    id: 'shopping-clothes',
    title: 'Shopping for Clothes',
    description: 'Practice interactions while shopping for clothes.',
    iconName: 'ShoppingBasket',
    dialogue: [
      { id: 'sc1', speaker: 'USER', text: "Excuse me, do you have this t-shirt in a medium size?", sinhalaTranslation: "සමාවෙන්න, මේ ටී-ෂර්ට් එක මීඩියම් සයිස් එකෙන් තියෙනවද?" },
      { id: 'sc2', speaker: 'ASSISTANT', text: "Let me check for you. Yes, here you go.", sinhalaTranslation: "මම බලන්නම්. ඔව්, මෙන්න." },
      { id: 'sc3', speaker: 'USER', text: "Can I try it on?", sinhalaTranslation: "මට මේක ඇඳලා බලන්න පුලුවන්ද?" },
      { id: 'sc4', speaker: 'ASSISTANT', text: "Sure, the fitting rooms are over there.", sinhalaTranslation: "හරි, ෆිටින් රූම්ස් අතන." },
      { id: 'sc5', speaker: 'USER', text: "This fits perfectly. I'll take it.", sinhalaTranslation: "මේක හරියටම ගැලපෙනවා. මම මේක ගන්නවා." },
      { id: 'sc6', speaker: 'ASSISTANT', text: "Great! You can pay at the counter.", sinhalaTranslation: "නියමයි! ඔයාට කවුන්ටරයෙන් ගෙවන්න පුළුවන්." }
    ]
  },
  {
    id: 'talking-family',
    title: 'Talking About Family',
    description: 'Practice basic conversations about family members.',
    iconName: 'Users',
    dialogue: [
      { id: 'tf1', speaker: 'ASSISTANT', text: "Do you have any siblings?", sinhalaTranslation: "ඔයාට සහෝදර සහෝදරියෝ ඉන්නවද?" },
      { id: 'tf2', speaker: 'USER', text: "Yes, I have one older brother.", sinhalaTranslation: "ඔව්, මට එක වැඩිමල් සහෝදරයෙක් ඉන්නවා." },
      { id: 'tf3', speaker: 'ASSISTANT', text: "What does he do?", sinhalaTranslation: "එයා මොකද කරන්නේ?" },
      { id: 'tf4', speaker: 'USER', text: "He's a doctor. What about your family?", sinhalaTranslation: "එයා දොස්තර කෙනෙක්. ඔයාගේ පවුල ගැන මොකද?" },
      { id: 'tf5', speaker: 'ASSISTANT', text: "I have a younger sister. She's still in school.", sinhalaTranslation: "මට නංගි කෙනෙක් ඉන්නවා. එයා තාම ඉස්කෝලේ යනවා." },
      { id: 'tf6', speaker: 'USER', text: "That's nice. Family is important.", sinhalaTranslation: "ඒක හොඳයි. පවුල කියන්නේ වැදගත් දෙයක්." }
    ]
  },
  // New scenarios start here
  {
    id: 'pharmacy-headache',
    title: 'Pharmacy: Getting Medicine for a Headache',
    description: 'Practice asking for over-the-counter headache medicine.',
    iconName: 'ShoppingBasket',
    dialogue: [
      { id: 'ph1', speaker: 'USER', text: "Hello, I have a bad headache. What can I take for it?", sinhalaTranslation: "හෙලෝ, මට තද හිසරදයක් තියෙනවා. ඒකට මට මොනවද ගන්න පුළුවන්?" },
      { id: 'ph2', speaker: 'ASSISTANT', text: "I'm sorry to hear that. We have paracetamol or ibuprofen. Do you have any allergies?", sinhalaTranslation: "ඒක අහන්න කණගාටුයි. අප ළඟ පැරසිටමෝල් හෝ ඉබියුප්‍රොෆෙන් තියෙනවා. ඔබට අසාත්මිකතා තියෙනවද?" },
      { id: 'ph3', speaker: 'USER', text: "No, I don't have any allergies. Which one is stronger?", sinhalaTranslation: "නැහැ, මට කිසිම අසාත්මිකතාවක් නැහැ. කෝකද සැර වැඩි?" },
      { id: 'ph4', speaker: 'ASSISTANT', text: "Ibuprofen is generally a bit stronger for pain relief. Would you like that?", sinhalaTranslation: "ඉබියුප්‍රොෆෙන් සාමාන්‍යයෙන් වේදනා නාශකයක් ලෙස ටිකක් සැරයි. ඔබ එයට කැමතිද?" },
      { id: 'ph5', speaker: 'USER', text: "Yes, please. How much is it?", sinhalaTranslation: "ඔව්, කරුණාකරලා. ඒක කීයද?" },
      { id: 'ph6', speaker: 'ASSISTANT', text: "That will be 250 rupees for a strip.", sinhalaTranslation: "ඒක තීරුවකට රුපියල් 250ක් වෙනවා." },
      { id: 'ph7', speaker: 'USER', text: "Okay, I'll take it. Thank you.", sinhalaTranslation: "හරි, මම ඒක ගන්නම්. ස්තූතියි." },
      { id: 'ph8', speaker: 'ASSISTANT', text: "You're welcome. I hope you feel better soon.", sinhalaTranslation: "සුභ පැතුම්. ඔබට ඉක්මනින් සනීප වේවායි ප්‍රාර්ථනා කරනවා." }
    ]
  },
  {
    id: 'clothing-store-assistance',
    title: 'Clothing Store: Asking for Help',
    description: 'Practice asking for assistance to find an item or size.',
    iconName: 'ShoppingBasket',
    dialogue: [
      { id: 'csa1', speaker: 'USER', text: "Excuse me, can you help me please?", sinhalaTranslation: "සමාවෙන්න, කරුණාකර මට උදව් කරන්න පුලුවන්ද?" },
      { id: 'csa2', speaker: 'ASSISTANT', text: "Of course, how can I help you?", sinhalaTranslation: "ඇත්තෙන්ම, මම ඔබට උදව් කරන්නේ කොහොමද?" },
      { id: 'csa3', speaker: 'USER', text: "I am looking for a blue sweater. Do you have any?", sinhalaTranslation: "මම නිල් පාට ස්වෙටර් එකක් හොයනවා. ඔබ ළඟ තියෙනවද?" },
      { id: 'csa4', speaker: 'ASSISTANT', text: "Yes, we have some over here. What size are you looking for?", sinhalaTranslation: "ඔව්, අප ළඟ මෙතන තියෙනවා. ඔබ හොයන්නේ මොන සයිස් එකද?" },
      { id: 'csa5', speaker: 'USER', text: "I think I need a large size.", sinhalaTranslation: "මම හිතන්නේ මට ලොකු සයිස් එකක් ඕන." },
      { id: 'csa6', speaker: 'ASSISTANT', text: "Okay, here are our large blue sweaters. This one is very popular.", sinhalaTranslation: "හරි, මෙන්න අපේ ලොකු නිල් ස්වෙටර්. මේක හරිම ජනප්‍රියයි." },
      { id: 'csa7', speaker: 'USER', text: "Oh, that looks nice. How much is it?", sinhalaTranslation: "ආ, ඒක ලස්සනයි වගේ. ඒක කීයද?" },
      { id: 'csa8', speaker: 'ASSISTANT', text: "It's 2000 rupees.", sinhalaTranslation: "ඒක රුපියල් 2000යි." },
      { id: 'csa9', speaker: 'USER', text: "Thank you for your help.", sinhalaTranslation: "ඔබගේ උදව්වට ස්තූතියි." }
    ]
  },
  {
    id: 'post-office-mailing-letter',
    title: 'Post Office: Mailing a Letter',
    description: 'Practice mailing a letter and buying stamps.',
    iconName: 'Briefcase',
    dialogue: [
      { id: 'po1', speaker: 'USER', text: "Hello, I would like to mail this letter to Colombo.", sinhalaTranslation: "හෙලෝ, මට මේ ලියුම කොළඹට යවන්න ඕන." },
      { id: 'po2', speaker: 'ASSISTANT', text: "Okay, do you need a stamp for it?", sinhalaTranslation: "හරි, ඔබට ඒකට මුද්දරයක් ඕනද?" },
      { id: 'po3', speaker: 'USER', text: "Yes, please. How much is a stamp for a local letter?", sinhalaTranslation: "ඔව්, කරුණාකරලා. දේශීය ලියුමකට මුද්දරයක් කීයද?" },
      { id: 'po4', speaker: 'ASSISTANT', text: "It's 50 rupees for a standard local letter.", sinhalaTranslation: "සාමාන්‍ය දේශීය ලියුමකට ඒක රුපියල් 50යි." },
      { id: 'po5', speaker: 'USER', text: "Okay, I'll take one stamp. And can I also buy two extra stamps?", sinhalaTranslation: "හරි, මම එක මුද්දරයක් ගන්නම්. මට තව අමතර මුද්දර දෙකක් ගන්න පුලුවන්ද?" },
      { id: 'po6', speaker: 'ASSISTANT', text: "Certainly. So that's three stamps in total. That will be 150 rupees.", sinhalaTranslation: "ඇත්තෙන්ම. එතකොට ඔක්කොම මුද්දර තුනයි. ඒක රුපියල් 150ක් වෙනවා." },
      { id: 'po7', speaker: 'USER', text: "Here you go. Thank you.", sinhalaTranslation: "මෙන්න. ස්තූතියි." }
    ]
  },
  {
    id: 'simple-phone-call-friend',
    title: 'Phone Call: Catching Up with a Friend',
    description: 'Practice a simple phone call to a friend.',
    iconName: 'Users',
    dialogue: [
      { id: 'pc1', speaker: 'USER', text: "Hi Nimal, it's [Your Name]. How are you?", sinhalaTranslation: "හායි නිමල්, මේ [ඔබේ නම]. කොහොමද ඔයාට?" },
      { id: 'pc2', speaker: 'ASSISTANT', text: "Hey [Your Name]! I'm good, thanks. How about you?", sinhalaTranslation: "හේ [ඔබේ නම]! මම හොඳින්, ස්තූතියි. ඔයා කොහොමද?" },
      { id: 'pc3', speaker: 'USER', text: "I'm doing well. I was wondering if you are free on Saturday.", sinhalaTranslation: "මම හොඳින් ඉන්නවා. මම කල්පනා කරමින් හිටියේ ඔයා සෙනසුරාදා නිදහස්ද කියලා." },
      { id: 'pc4', speaker: 'ASSISTANT', text: "Saturday? Yes, I think I'm free in the afternoon. Why?", sinhalaTranslation: "සෙනසුරාදා? ඔව්, මම හිතන්නේ මම දවල්ට නිදහස්. ඇයි?" },
      { id: 'pc5', speaker: 'USER', text: "Maybe we can go for a coffee or something?", sinhalaTranslation: "සමහරවිට අපිට කෝපි එකකට හරි මොකකට හරි යන්න පුලුවන්ද?" },
      { id: 'pc6', speaker: 'ASSISTANT', text: "That sounds great! Let's do that. What time?", sinhalaTranslation: "ඒක නියම අදහසක්! අපි එහෙම කරමු. කීයටද?" },
      { id: 'pc7', speaker: 'USER', text: "How about 3 PM at the usual cafe?", sinhalaTranslation: "හවස 3ට අපි නිතර යන කැෆේ එකේදී කොහොමද?" },
      { id: 'pc8', speaker: 'ASSISTANT', text: "Perfect! See you then.", sinhalaTranslation: "නියමයි! එහෙනම් එතකොට හමුවෙමු." }
    ]
  },
  {
    id: 'favorite-food-talk',
    title: 'Talking About Favorite Food',
    description: 'Practice describing your favorite food and why you like it.',
    iconName: 'Coffee',
    dialogue: [
      { id: 'ff1', speaker: 'ASSISTANT', text: "What's your favorite food to eat, [Your Name]?", sinhalaTranslation: "[ඔබේ නම], ඔයා කන්න කැමතිම කෑම මොකක්ද?" },
      { id: 'ff2', speaker: 'USER', text: "My favorite food is rice and curry.", sinhalaTranslation: "මගේ කැමතිම කෑම බතුයි ව්‍යංජනයි." },
      { id: 'ff3', speaker: 'ASSISTANT', text: "Oh, that's a classic Sri Lankan dish! Why do you like it so much?", sinhalaTranslation: "ආ, ඒක සම්භාව්‍ය ශ්‍රී ලාංකික කෑමක්! ඔයා ඒකට ඇයි මෙච්චර කැමති?" },
      { id: 'ff4', speaker: 'USER', text: "I like it because it has many different flavors and it's very satisfying.", sinhalaTranslation: "මම ඒකට කැමතියි මොකද ඒකේ විවිධ රස තියෙනවා, ඒ වගේම ඒක හරිම තෘප්තිමත්." },
      { id: 'ff5', speaker: 'ASSISTANT', text: "That's true. Do you have a favorite curry to go with it?", sinhalaTranslation: "ඒක ඇත්ත. ඔයාට ඒත් එක්ක කන්න කැමතිම ව්‍යංජනයක් තියෙනවද?" },
      { id: 'ff6', speaker: 'USER', text: "Yes, I love chicken curry and dhal curry the most.", sinhalaTranslation: "ඔව්, මම වැඩියෙන්ම ආස චිකන් කරියටයි පරිප්පු හොද්දටයි." },
      { id: 'ff7', speaker: 'ASSISTANT', text: "Sounds delicious! Now I'm hungry.", sinhalaTranslation: "රසයි වගේ! දැන් මටත් බඩගිනියි." },
      { id: 'ff8', speaker: 'USER', text: "Me too! Maybe we should get some later.", sinhalaTranslation: "මටත්! සමහරවිට අපි පස්සේ ටිකක් කමු." }
    ]
  },
  {
    id: 'describing-your-day',
    title: 'Describing Your Day (Simple)',
    description: 'Practice talking about your daily routine in simple terms.',
    iconName: 'UserCircle2',
    dialogue: [
      { id: 'dyd1', speaker: 'ASSISTANT', text: "Hi [Your Name]! How was your day today?", sinhalaTranslation: "හායි [ඔබේ නම]! ඔයාගේ දවස අද කොහොමද?" },
      { id: 'dyd2', speaker: 'USER', text: "It was good, thank you. I woke up early this morning.", sinhalaTranslation: "ඒක හොඳයි, ස්තූතියි. මම අද උදේ පාන්දරින් නැගිට්ටා." },
      { id: 'dyd3', speaker: 'ASSISTANT', text: "Oh, really? What did you do after that?", sinhalaTranslation: "ආ, ඇත්තද? ඊට පස්සේ ඔයා මොකද කලේ?" },
      { id: 'dyd4', speaker: 'USER', text: "I had breakfast and then I went to work.", sinhalaTranslation: "මම උදේ කෑම කාලා ඊට පස්සේ වැඩට ගියා." },
      { id: 'dyd5', speaker: 'ASSISTANT', text: "Was work busy today?", sinhalaTranslation: "අද වැඩ අධිකද?" },
      { id: 'dyd6', speaker: 'USER', text: "Yes, it was quite busy. After work, I came home and cooked dinner.", sinhalaTranslation: "ඔව්, ඒක තරමක් කාර්යබහුලයි. වැඩ ඉවර වෙලා මම ගෙදර ඇවිත් රෑ කෑම හැදුවා." },
      { id: 'dyd7', speaker: 'ASSISTANT', text: "Sounds like a productive day! What are you doing now?", sinhalaTranslation: "ඵලදායී දවසක් වගේ! ඔයා දැන් මොකද කරන්නේ?" },
      { id: 'dyd8', speaker: 'USER', text: "Now I am relaxing and talking to you!", sinhalaTranslation: "දැන් මම විවේක ගනිමින් ඔයා එක්ක කතා කරනවා!" }
    ]
  },
  {
    id: 'at-the-bus-stop',
    title: 'At the Bus Stop',
    description: 'Practice asking about bus arrivals and destinations.',
    iconName: 'Plane',
    dialogue: [
      { id: 'bs1', speaker: 'USER', text: "Excuse me, does the number 176 bus stop here?", sinhalaTranslation: "සමාවෙන්න, අංක 176 බස් එක මෙතන නවත්තනවද?" },
      { id: 'bs2', speaker: 'ASSISTANT', text: "Yes, it does. It should be here in about ten minutes.", sinhalaTranslation: "ඔව්, නවත්තනවා. ඒක විනාඩි දහයකින් විතර මෙතනට ඒවි." },
      { id: 'bs3', speaker: 'USER', text: "Great, thank you. Does this bus go to Nugegoda?", sinhalaTranslation: "නියමයි, ස්තූතියි. මේ බස් එක නුගේගොඩට යනවද?" },
      { id: 'bs4', speaker: 'ASSISTANT', text: "Yes, it goes directly to Nugegoda junction.", sinhalaTranslation: "ඔව්, ඒක කෙලින්ම නුගේගොඩ හන්දියට යනවා." },
      { id: 'bs5', speaker: 'USER', text: "Perfect. How much is the fare to Nugegoda?", sinhalaTranslation: "නියමයි. නුගේගොඩට ගාස්තුව කීයද?" },
      { id: 'bs6', speaker: 'ASSISTANT', text: "I think it's around 80 rupees.", sinhalaTranslation: "මම හිතන්නේ ඒක රුපියල් 80ක් විතර." },
      { id: 'bs7', speaker: 'USER', text: "Okay, thank you for the information.", sinhalaTranslation: "හරි, තොරතුරු වලට ස්තූතියි." }
    ]
  },
  {
    id: 'borrowing-book-friend',
    title: 'Borrowing a Book from a Friend',
    description: 'Practice politely asking to borrow something.',
    iconName: 'Users',
    dialogue: [
      { id: 'bbf1', speaker: 'USER', text: "Hi Sita, do you still have that new novel you were reading?", sinhalaTranslation: "හායි සිතා, ඔයා කියවමින් හිටපු අලුත් නවකතාව තාම ඔයා ළඟ තියෙනවද?" },
      { id: 'bbf2', speaker: 'ASSISTANT', text: "Yes, I just finished it yesterday. Why do you ask?", sinhalaTranslation: "ඔව්, මම ඒක ඊයේ ඉවර කලා. ඇයි ඔයා අහන්නේ?" },
      { id: 'bbf3', speaker: 'USER', text: "I was wondering if I could borrow it after you.", sinhalaTranslation: "මම කල්පනා කරමින් හිටියේ ඔයාට පස්සේ මට ඒක ඉල්ලගන්න පුලුවන්ද කියලා." },
      { id: 'bbf4', speaker: 'ASSISTANT', text: "Of course! You'll enjoy it. I can bring it tomorrow.", sinhalaTranslation: "ඇත්තෙන්ම! ඔයා ඒකට කැමති වේවි. මට ඒක හෙට ගේන්න පුළුවන්." },
      { id: 'bbf5', speaker: 'USER', text: "That would be great! Thank you so much. I'll return it quickly.", sinhalaTranslation: "ඒක නියමයි! බොහොම ස්තූතියි. මම ඒක ඉක්මනට ආපහු දෙන්නම්." },
      { id: 'bbf6', speaker: 'ASSISTANT', text: "No problem at all. Enjoy the book!", sinhalaTranslation: "කිසිම ප්‍රශ්නයක් නැහැ. පොත රසවිඳින්න!" }
    ]
  },
  {
    id: 'planning-birthday-simple',
    title: 'Planning a Birthday (Simple)',
    description: 'Practice simple discussions about planning a birthday.',
    iconName: 'Users',
    dialogue: [
      { id: 'pb1', speaker: 'ASSISTANT', text: "My birthday is next week! I need to plan something.", sinhalaTranslation: "මගේ උපන්දිනය ලබන සතියේ! මට මොනවාහරි සැලසුම් කරන්න ඕන." },
      { id: 'pb2', speaker: 'USER', text: "Happy early birthday! What are you thinking of doing?", sinhalaTranslation: "සුබ කලින් උපන්දිනයක්! ඔයා මොකද කරන්න හිතන්නේ?" },
      { id: 'pb3', speaker: 'ASSISTANT', text: "Maybe a small party at home. I need to get a cake.", sinhalaTranslation: "සමහරවිට ගෙදර පොඩි පාටියක්. මට කේක් එකක් ගන්න ඕන." },
      { id: 'pb4', speaker: 'USER', text: "That sounds nice. What kind of cake do you like?", sinhalaTranslation: "ඒක හොඳයි වගේ. ඔයා කැමති මොන වගේ කේක් එකකටද?" },
      { id: 'pb5', speaker: 'ASSISTANT', text: "I love chocolate cake! Should I invite Ravi too?", sinhalaTranslation: "මම චොකලට් කේක් එකට හරිම ආසයි! මම රවීටත් ආරාධනා කරන්නද?" },
      { id: 'pb6', speaker: 'USER', text: "Yes, definitely invite Ravi. He will be happy to come.", sinhalaTranslation: "ඔව්, අනිවාර්යයෙන්ම රවීට ආරාධනා කරන්න. එයා එන්න සතුටු වේවි." },
      { id: 'pb7', speaker: 'ASSISTANT', text: "Okay, great! Thanks for the suggestion.", sinhalaTranslation: "හරි, නියමයි! යෝජනාවට ස්තූතියි." }
    ]
  },
  {
    id: 'likes-dislikes-activities',
    title: 'Likes and Dislikes (Activities)',
    description: 'Practice expressing what activities you like and dislike.',
    iconName: 'HelpCircle',
    dialogue: [
      { id: 'ld1', speaker: 'ASSISTANT', text: "Do you like watching movies, [Your Name]?", sinhalaTranslation: "[ඔබේ නම], ඔයා චිත්‍රපටි බලන්න කැමතිද?" },
      { id: 'ld2', speaker: 'USER', text: "Yes, I like watching movies a lot. Especially comedy movies.", sinhalaTranslation: "ඔව්, මම චිත්‍රපටි බලන්න ගොඩක් කැමතියි. විශේෂයෙන්ම විකට චිත්‍රපටි." },
      { id: 'ld3', speaker: 'ASSISTANT', text: "That's nice. What about sports? Do you like playing sports?", sinhalaTranslation: "ඒක හොඳයි. ක්‍රීඩා ගැන මොකද? ඔයා ක්‍රීඩා කරන්න කැමතිද?" },
      { id: 'ld4', speaker: 'USER', text: "I like watching cricket, but I don't like playing football.", sinhalaTranslation: "මම ක්‍රිකට් බලන්න කැමතියි, ඒත් මම පාපන්දු සෙල්ලම් කරන්න කැමති නැහැ." },
      { id: 'ld5', speaker: 'ASSISTANT', text: "I see. And what about reading? Do you enjoy reading books?", sinhalaTranslation: "මට තේරෙනවා. කියවීම ගැන මොකද? ඔයා පොත් කියවන්න කැමතිද?" },
      { id: 'ld6', speaker: 'USER', text: "Yes, I enjoy reading story books. I don't like reading newspapers much.", sinhalaTranslation: "ඔව්, මම කතා පොත් කියවන්න ආසයි. මම පත්තර කියවන්න එච්චර කැමති නැහැ." },
      { id: 'ld7', speaker: 'ASSISTANT', text: "It's good to know what you like and dislike!", sinhalaTranslation: "ඔයා කැමති මොනවටද අකමැති මොනවටද කියලා දැනගන්න එක හොඳයි!" },
      { id: 'ld8', speaker: 'USER', text: "Yes, it helps to choose activities.", sinhalaTranslation: "ඔව්, ඒක ක්‍රියාකාරකම් තෝරාගන්න උදව් වෙනවා." }
    ]
  }
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};

    
