import React from 'react';
import { 
  Search,
  Filter,
  Star,
  Sparkles,
  MessageCircle,
  Bot,
  Users,
  Calendar
} from 'lucide-react';

interface PlatformPreviewProps {
  onBrowseVendors: () => void;
  onChooseChat: () => void;
}

const PlatformPreview: React.FC<PlatformPreviewProps> = ({ 
  onBrowseVendors, 
  onChooseChat
}) => {
  const features = [
    {
      icon: Search,
      title: 'Smart Search & Discovery',
      description: 'Find the perfect vendors with our intelligent search that understands your needs and preferences.',
      highlight: 'AI-Powered'
    },
    {
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Filter by location, budget, ratings, availability, and event type to find exactly what you need.',
      highlight: 'Precise Results'
    },
    {
      icon: MessageCircle,
      title: 'AI Event Assistant',
      description: 'Get personalized recommendations, budget estimates, and planning guidance from our virtual consultant.',
      highlight: '24/7 Support'
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Make informed decisions with authentic reviews and ratings from real customers.',
      highlight: 'Trusted Reviews'
    }
  ];

  return (
    <div className="bg-gray-900">
      {/* Platform Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with human expertise to make event planning effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 border border-gray-700 hover:border-purple-500/50"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-600/20 rounded-lg mr-3">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs font-semibold text-purple-300 bg-purple-600/20 px-2 py-1 rounded-full">
                    {feature.highlight}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/20 via-gray-900 to-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-full">
                <Bot className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI-Powered Event Assistant
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Get personalized event planning advice, vendor recommendations, and expert guidance 
              to bring your perfect event to life.
            </p>

            {/* Chat Assistant Card */}
            <div className="max-w-2xl mx-auto">
              <div className="group bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-full group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-all duration-300">
                      <MessageCircle className="w-12 h-12 text-purple-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Chat with AI Assistant
                  </h3>
                  
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Get personalized event planning advice, vendor recommendations, budget estimates, 
                    and expert guidance to clarify your event ideas and requirements.
                  </p>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center text-gray-300">
                      <Users className="w-5 h-5 mr-3 text-purple-400" />
                      <span>Personalized vendor recommendations</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-3 text-purple-400" />
                      <span>Event planning timeline guidance</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                      <Sparkles className="w-5 h-5 mr-3 text-purple-400" />
                      <span>Budget estimation and tips</span>
                    </div>
                  </div>

                  <button
                    onClick={onChooseChat}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Planning Chat
                  </button>

                  <div className="mt-4 text-sm text-gray-400">
                    Perfect for: Event planning, vendor selection, budget planning
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlatformPreview;