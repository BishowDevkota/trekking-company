export default function HowMardiTreksHelpsSection() {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">How Mardi Treks Helps</h2>
        <p className="text-lg mb-6">
          Mardi Treks provides expert guidance, personalized itineraries, and top-notch support to ensure your trekking adventure is safe and unforgettable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded shadow">
            <h3 className="text-lg font-semibold">Expert Guides</h3>
            <p>Our experienced guides ensure your safety and enjoyment.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded shadow">
            <h3 className="text-lg font-semibold">Customized Plans</h3>
            <p>Tailored itineraries to match your preferences.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded shadow">
            <h3 className="text-lg font-semibold">24/7 Support</h3>
            <p>Round-the-clock assistance for a worry-free experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}