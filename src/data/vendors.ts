import { Vendor } from '../types';

export const sampleVendors: Vendor[] = [
  {
    id: '1',
    name: 'Eternal Moments Photography',
    category: 'photographer',
    description: 'Professional wedding and event photography with a creative touch. Capturing your special moments with artistic flair.',
    location: 'New York, NY',
    priceRange: '$2,000 - $5,000',
    rating: 4.9,
    reviewCount: 127,
    availability: true,
    eventTypes: ['wedding', 'engagement', 'anniversary'],
    images: ['https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg'],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@eternalmoments.com',
      website: 'www.eternalmoments.com'
    },
    portfolio: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      'https://images.pexels.com/photos/1573666/pexels-photo-1573666.jpeg'
    ],
    specialties: ['Wedding Photography', 'Portrait Sessions', 'Event Coverage']
  },
  {
    id: '2',
    name: 'Gourmet Delights Catering',
    category: 'caterer',
    description: 'Premium catering services offering exquisite cuisine for all types of events. From intimate gatherings to grand celebrations.',
    location: 'Los Angeles, CA',
    priceRange: '$50 - $150 per person',
    rating: 4.7,
    reviewCount: 89,
    availability: true,
    eventTypes: ['wedding', 'corporate', 'birthday', 'anniversary'],
    images: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'],
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'events@gourmetdelights.com',
      website: 'www.gourmetdelights.com'
    },
    portfolio: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg'
    ],
    specialties: ['Fine Dining', 'Cocktail Receptions', 'Dietary Accommodations']
  },
  {
    id: '3',
    name: 'Bloom & Flourish Decorators',
    category: 'decorator',
    description: 'Transform your venue into a magical space with our creative decoration services. Specializing in floral arrangements and themed setups.',
    location: 'Chicago, IL',
    priceRange: '$1,500 - $8,000',
    rating: 4.8,
    reviewCount: 156,
    availability: false,
    eventTypes: ['wedding', 'baby-shower', 'birthday', 'engagement'],
    images: ['https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg'],
    contact: {
      phone: '+1 (555) 456-7890',
      email: 'design@bloomflourish.com'
    },
    portfolio: [
      'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg',
      'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg'
    ],
    specialties: ['Floral Design', 'Theme Decorations', 'Lighting Setup']
  },
  {
    id: '4',
    name: 'Elite Event Organizers',
    category: 'event-organizer',
    description: 'Full-service event planning and management. From concept to execution, we handle every detail of your special day.',
    location: 'Miami, FL',
    priceRange: '$3,000 - $15,000',
    rating: 4.9,
    reviewCount: 203,
    availability: true,
    eventTypes: ['wedding', 'corporate', 'graduation', 'anniversary'],
    images: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'],
    contact: {
      phone: '+1 (555) 321-0987',
      email: 'planning@eliteevents.com',
      website: 'www.eliteevents.com'
    },
    portfolio: [
      'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg'
    ],
    specialties: ['Full Event Planning', 'Vendor Coordination', 'Timeline Management']
  },
  {
    id: '5',
    name: 'Memory Lane Souvenirs',
    category: 'souvenir-provider',
    description: 'Custom souvenirs and gift items to make your event memorable. Personalized keepsakes that guests will treasure forever.',
    location: 'Austin, TX',
    priceRange: '$5 - $50 per item',
    rating: 4.6,
    reviewCount: 94,
    availability: true,
    eventTypes: ['wedding', 'birthday', 'baby-shower', 'graduation'],
    images: ['https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg'],
    contact: {
      phone: '+1 (555) 654-3210',
      email: 'orders@memorylane.com'
    },
    portfolio: [
      'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg',
      'https://images.pexels.com/photos/1729808/pexels-photo-1729808.jpeg'
    ],
    specialties: ['Custom Engraving', 'Personalized Gifts', 'Bulk Orders']
  },
  {
    id: '6',
    name: 'Harmony Entertainment',
    category: 'entertainment',
    description: 'Professional entertainment services including DJs, live bands, and performers to keep your guests entertained throughout the event.',
    location: 'Seattle, WA',
    priceRange: '$800 - $3,500',
    rating: 4.7,
    reviewCount: 112,
    availability: true,
    eventTypes: ['wedding', 'birthday', 'corporate', 'graduation'],
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'],
    contact: {
      phone: '+1 (555) 789-0123',
      email: 'bookings@harmonyent.com',
      website: 'www.harmonyentertainment.com'
    },
    portfolio: [
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'
    ],
    specialties: ['DJ Services', 'Live Music', 'Sound Equipment']
  }
];