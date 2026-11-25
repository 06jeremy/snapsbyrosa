// How people reach and book SNAPSBYROSA. WhatsApp is the single booking route
// (wa.me deep link, no backend). Number: international format, digits only.
export const WHATSAPP_NUMBER = '31641592658';
export const EMAIL = 'info@snapsbyrosa.com';
export const INSTAGRAM = 'https://instagram.com/snapsbyrosa';

export const whatsapp = (text = 'Hi Jeremy, I’d like to book a session.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Booking terms shared by every session.
export const TERMS = {
  deliveryDays: 7,      // turnaround after the shoot
  depositPercent: 50,   // paid to hold the date
};

// The two offers. Edit a number here and the page follows.
export const OFFERS = {
  birthday: {
    price: 225,         // euro, 1 hour of shooting
    hours: 1,
    photos: 10,
    clips: 1,
  },
  content: {
    price: 400,
    photos: 15,
    clips: 3,
  },
};
