import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 mb-8 bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent leading-tight">
            Delicious Pizzas Delivered
          </h1>
          <p className="text-xl md:text-3xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Fresh, customizable pizzas made with love. Order now and taste the magic!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-bold text-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-bold text-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 bg-blue-300 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-spin"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-16">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🍕</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fresh Ingredients</h3>
              <p className="text-gray-700 text-lg leading-relaxed">We use only the freshest, locally-sourced ingredients for every pizza.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-700 text-lg leading-relaxed">Hot and fresh pizzas delivered to your door in under 30 minutes.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customizable</h3>
              <p className="text-gray-700 text-lg leading-relaxed">Create your perfect pizza with our easy customization options.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-24 px-4 text-center bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-8">Ready to Order?</h2>
          <p className="text-2xl text-white/90 mb-12 leading-relaxed">
            Join thousands of happy customers and experience pizza perfection today!
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-12 py-6 bg-white text-purple-600 rounded-full font-bold text-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-105"
          >
            Start Your Order
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Pizza Delivery System</h3>
          <p className="text-gray-400 mb-8">Delicious pizzas delivered fresh to your door.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
