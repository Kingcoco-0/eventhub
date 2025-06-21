import { EventPlan, EventType, Vendor } from '../types';
import { sampleVendors } from '../data/vendors';

export class EventPlannerBot {
  private conversations: Map<string, any[]> = new Map();

  generateResponse(message: string, sessionId: string = 'default'): string {
    const lowerMessage = message.toLowerCase();
    
    // Get or create conversation history
    const history = this.conversations.get(sessionId) || [];
    history.push({ type: 'user', message: lowerMessage, timestamp: new Date() });
    this.conversations.set(sessionId, history);

    // Greeting responses
    if (this.containsWords(lowerMessage, ['hello', 'hi', 'hey', 'start'])) {
      return "Hello! I'm your AI event planning assistant. I'm here to help you plan the perfect event! 🎉\n\nTo get started, could you tell me:\n• What type of event are you planning?\n• What's your approximate budget?\n• How many guests will attend?\n• Do you have a specific date in mind?";
    }

    // Event type detection
    if (this.containsWords(lowerMessage, ['wedding', 'marry', 'bride', 'groom'])) {
      return "A wedding! How exciting! 💒 Weddings are special celebrations that deserve careful planning.\n\nFor wedding planning, I typically recommend:\n• Photographer ($2,000-$5,000)\n• Caterer ($50-$150 per person)\n• Decorator ($1,500-$8,000)\n• Event Organizer ($3,000-$15,000)\n\nWhat's your budget range, and how many guests are you expecting?";
    }

    if (this.containsWords(lowerMessage, ['birthday', 'bday', 'celebration'])) {
      return "A birthday celebration! 🎂 Let's make it memorable!\n\nFor birthdays, popular vendors include:\n• Caterers for delicious food\n• Decorators for themed setups\n• Entertainment (DJ, performers)\n• Souvenir providers for party favors\n\nWhat's the age of the birthday person and your budget range?";
    }

    if (this.containsWords(lowerMessage, ['corporate', 'business', 'company', 'office'])) {
      return "A corporate event! 🏢 Professional events require careful coordination.\n\nFor corporate events, I recommend:\n• Event Organizers for seamless execution\n• Caterers for professional dining\n• Entertainment suitable for business settings\n• Custom souvenirs with company branding\n\nWhat type of corporate event is this, and what's your budget?";
    }

    // Budget discussions
    if (this.containsWords(lowerMessage, ['budget', '$', 'cost', 'price', 'expensive', 'cheap'])) {
      return "Great question about budget! 💰 Event costs can vary significantly:\n\n**Small Events** (20-50 guests): $2,000-$8,000\n**Medium Events** (50-150 guests): $8,000-$25,000\n**Large Events** (150+ guests): $25,000+\n\nThis includes venue, catering, decoration, and entertainment. Would you like me to create a detailed budget breakdown for your specific event?";
    }

    // Vendor recommendations
    if (this.containsWords(lowerMessage, ['photographer', 'photo', 'pictures'])) {
      return "For photography, I highly recommend checking out our featured photographers! 📸\n\n**Eternal Moments Photography** is particularly popular:\n• Rating: 4.9/5 stars\n• Price: $2,000-$5,000\n• Specializes in weddings and engagements\n• Based in New York\n\nWould you like me to show you more photographers or help you compare options?";
    }

    if (this.containsWords(lowerMessage, ['catering', 'food', 'menu', 'dinner', 'lunch'])) {
      return "Food is such an important part of any event! 🍽️\n\n**Gourmet Delights Catering** is one of our top-rated caterers:\n• Rating: 4.7/5 stars\n• Price: $50-$150 per person\n• Specializes in fine dining and dietary accommodations\n• Based in Los Angeles\n\nThey offer everything from cocktail receptions to full-course meals. What type of dining experience are you looking for?";
    }

    // Timeline questions
    if (this.containsWords(lowerMessage, ['when', 'timeline', 'schedule', 'planning'])) {
      return "Event planning timeline is crucial! ⏰ Here's a general guide:\n\n**6-12 months before:**\n• Book venue and major vendors\n• Send save-the-dates\n\n**3-6 months before:**\n• Finalize menu and decorations\n• Send invitations\n\n**1-3 months before:**\n• Confirm all details\n• Final headcount\n\n**1 week before:**\n• Final preparations and setup\n\nWhen is your event date?";
    }

    // Tips and advice
    if (this.containsWords(lowerMessage, ['tips', 'advice', 'help', 'suggestions'])) {
      return "Here are my top event planning tips! ✨\n\n1. **Start early** - Book popular vendors 6+ months ahead\n2. **Set a realistic budget** - Include 10-15% buffer for unexpected costs\n3. **Prioritize your must-haves** - Allocate more budget to what matters most\n4. **Read reviews** - Check vendor ratings and past client feedback\n5. **Have a backup plan** - Weather and other factors can change\n\nWhat specific aspect of planning would you like more tips on?";
    }

    // Default responses for unclear queries
    const defaultResponses = [
      "I'd love to help you plan your event! Could you tell me more about what type of event you're planning?",
      "That's interesting! To give you the best recommendations, could you share more details about your event vision?",
      "I'm here to help with all aspects of event planning! What specific information are you looking for?",
      "Let me assist you with that! Could you be more specific about what you'd like to know?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private containsWords(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  generateEventPlan(eventType: EventType, budget: string, guestCount: number): EventPlan {
    const relevantVendors = sampleVendors.filter(vendor => 
      vendor.eventTypes.includes(eventType) && vendor.availability
    );

    return {
      eventType,
      budget,
      guestCount,
      timeline: this.generateTimeline(eventType),
      recommendedVendors: relevantVendors.slice(0, 4),
      estimatedCost: this.calculateEstimatedCost(guestCount, eventType),
      tips: this.generateTips(eventType)
    };
  }

  private generateTimeline(eventType: EventType): string {
    const timelines = {
      wedding: "6-12 months: Book venue, photographer, caterer\n3-6 months: Decorations, invitations\n1 month: Final details",
      birthday: "2-3 months: Book venue and entertainment\n1 month: Decorations and catering\n1 week: Final setup",
      corporate: "3-6 months: Venue and catering\n1-2 months: Entertainment and logistics\n2 weeks: Final confirmations"
    };
    
    return timelines[eventType] || "Plan 2-6 months in advance depending on event size";
  }

  private calculateEstimatedCost(guestCount: number, eventType: EventType): string {
    const baseCosts = {
      wedding: 200,
      birthday: 75,
      corporate: 100,
      anniversary: 150,
      graduation: 60,
      'baby-shower': 50,
      engagement: 125
    };

    const costPerPerson = baseCosts[eventType] || 75;
    const totalCost = guestCount * costPerPerson;
    
    return `$${totalCost.toLocaleString()} - $${(totalCost * 1.5).toLocaleString()}`;
  }

  private generateTips(eventType: EventType): string[] {
    const commonTips = [
      "Book popular vendors early to ensure availability",
      "Set aside 10-15% of your budget for unexpected costs",
      "Create a detailed timeline and share it with all vendors"
    ];

    const specificTips = {
      wedding: ["Consider the season for better pricing", "Book your photographer first - they're in high demand"],
      birthday: ["Choose a theme that reflects the person's interests", "Consider dietary restrictions for all ages"],
      corporate: ["Ensure the venue has proper AV equipment", "Plan for networking opportunities"]
    };

    return [...commonTips, ...(specificTips[eventType] || [])];
  }
}