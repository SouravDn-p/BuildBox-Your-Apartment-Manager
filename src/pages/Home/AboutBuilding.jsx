export default function AboutBuilding() {
  const buildingDetails = {
    name: "Skyline Tower",
    description:
      "Skyline Tower is an architectural marvel standing tall in the heart of the city. Designed with modern elegance, it features state-of-the-art facilities and breathtaking panoramic views. This iconic structure combines luxury, comfort, and sustainability, making it one of the most sought-after addresses in the city.",
    features: [
      "Panoramic city views",
      "24/7 security and concierge services",
      "Rooftop infinity pool",
      "Fully equipped fitness center",
      "LEED-certified sustainable design",
    ],
  };

  return (
    <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8">
          About the Building
        </h2>
        <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg">
          <h3 className="text-3xl font-semibold text-teal-400 mb-4">
            {buildingDetails.name}
          </h3>
          <p className="text-lg leading-relaxed mb-6 text-gray-300">
            {buildingDetails.description}
          </p>
          <h4 className="text-2xl font-semibold text-teal-400 mb-4">
            Key Features
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {buildingDetails.features.map((feature, index) => (
              <li key={index} className="text-lg">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
