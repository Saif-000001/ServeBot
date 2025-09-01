import img from "../assets/img.png";
/**
 * Header Component
 * ----------------
 * - Displays a header bar for the chatbot interface
 * - Includes:
 *    • Bot avatar (circular image with white border)
 *    • Title: "Medical Assistant"
 *    • Subtitle/description: "AI-powered medical information assistant"
 * - Uses gradient background and shadow for a modern look
 */
const Header = () => (
  <div className="bg-gradient-to-br from-gray-300 to-gray-300 px-6 py-4 shadow-md">
    <div className="flex items-center space-x-4">
      {/* Bot avatar container */}
      <div className="p-1 rounded-full bg-white shadow-lg">
        <img
          src={img} // Bot logo / avatar image
          alt="Bot"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      {/* Text section: Title + Subtitle */}
      <div>
        {/* Main heading */}
        <h1 className="text-xl font-semibold text-black">Customer Service</h1>
        {/* Subtitle / tagline */}
        <p className="text-sm text-gray-500">AI-powered customer service</p>
      </div>
    </div>
  </div>
);
export default Header;
