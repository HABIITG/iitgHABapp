export default function Hostels() {
  const hostels = [
    { name: "Barak", logo: "/hostel-logos/Barak.png" },
    { name: "Brahmaputra", logo: "/hostel-logos/Brahmaputra.png" },
    { name: "Dhansiri", logo: "/hostel-logos/Dhansiri.png" },
    { name: "Dihing", logo: "/hostel-logos/Dihing.png" },
    { name: "Disang", logo: "/hostel-logos/Disang.png" },
    { name: "Gaurang", logo: "/hostel-logos/Gaurang.png" },
    { name: "Kapili", logo: "/hostel-logos/Kapili.png" },
    { name: "Lohit", logo: "/hostel-logos/Lohit.png" },
    { name: "Manas", logo: "/hostel-logos/Manas.png" },
    { name: "Siang", logo: "/hostel-logos/Siang.png" },
    { name: "Subansiri", logo: "/hostel-logos/Subansiri.png" },
    { name: "Umaim", logo: "/hostel-logos/Umaim.png" },
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Hostels</h1>
          <p className="text-xl text-gray-600">
            IIT Guwahati Hostel Affairs Board manages 12 hostels across the campus
          </p>
        </div>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {hostels.map((hostel) => (
            <div
              key={hostel.name}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-32 h-32 mb-4 flex items-center justify-center bg-white rounded-lg shadow-sm p-4">
                <img
                  src={hostel.logo}
                  alt={`${hostel.name} Hostel Logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div
                  className="hidden w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold"
                  style={{ display: 'none' }}
                >
                  {hostel.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {hostel.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 border-t border-gray-300 pt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              About IIT Guwahati Hostels
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              IIT Guwahati provides accommodation facilities for students across 12 hostels,
              each named after rivers of Northeast India. These hostels offer comfortable
              living spaces, mess facilities, and various amenities to ensure a conducive
              environment for academic and personal growth.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The Hostel Affairs Board (HAB) manages all hostel-related operations,
              including mess management, maintenance, and student welfare activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
