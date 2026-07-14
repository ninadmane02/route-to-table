import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Utensils, Wallet, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-secondary py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Travel Hungry? <br />
              <span className="text-primary">Find Your Table</span> on the Go!
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto md:mx-0">
              Discover top-rated restaurants along your route. Pre-book tables, order ahead, and skip the wait effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/discovery" className="btn-primary px-8 py-4 text-lg">
                Start My Journey
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn-secondary px-8 py-4 text-lg border border-gray-700">
                Join as Partner
              </Link>
            </div>
          </div>
          <div className="flex-1">
 <img 
  src="/restaurant.jpg" 
  alt="Restaurant Interior" 
  className="rounded-2xl shadow-2xl border-4 border-gray-800"
/>
</div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">Why RouteToTable?</h2>
          <p className="text-gray-500">The ultimate companion for every traveler's appetite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <MapPin className="w-8 h-8 text-primary" />,
              title: "Route Discovery",
              description: "Simply enter your start and end points. We'll show you every restaurant worth visiting on your path."
            },
            {
              icon: <Clock className="w-8 h-8 text-primary" />,
              title: "Live Waiting Lists",
              description: "No more standing in queues. See real-time wait times and join the list before you even arrive."
            },
            {
              icon: <Utensils className="w-8 h-8 text-primary" />,
              title: "Pre-order Food",
              description: "Order your favorite meals while driving. Your food will be hot and ready as soon as you sit down."
            }
          ].map((feature, idx) => (
            <div key={idx} className="card p-8 hover:transform hover:-translate-y-1 transition-transform">
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Action Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">500+</p>
            <p className="text-gray-600">Routes Covered</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">2k+</p>
            <p className="text-gray-600">Restaurants</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">50k+</p>
            <p className="text-gray-600">Happy Travelers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">15min</p>
            <p className="text-gray-600">Avg Time Saved</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
