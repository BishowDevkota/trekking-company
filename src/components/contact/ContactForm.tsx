export default function ContactForm() {
  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Your Message"
              rows={4}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}