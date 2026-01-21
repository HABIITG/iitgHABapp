export default function ContactSupport() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Support
          </h1>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-gray-700 leading-relaxed">
              Need help? We're here to assist you with any questions or issues you may have.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-gray-700 mb-2">
                For general inquiries, technical support, or feedback, please contact us at:
              </p>
              <a
                href="mailto:codingclub@iitg.ac.in"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                codingclub@iitg.ac.in
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Response Time
              </h3>
              <p className="text-gray-700">
                We typically respond to inquiries within 24-48 hours during business days.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What to Include
              </h3>
              <p className="text-gray-700 mb-2">
                When contacting support, please include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Your roll number (if applicable)</li>
                <li>A clear description of your issue or question</li>
                <li>Steps to reproduce the issue (if reporting a bug)</li>
                <li>Screenshots (if applicable)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-12 border-t border-gray-300 pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Additional Resources
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Before contacting support, you may find answers in our:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

