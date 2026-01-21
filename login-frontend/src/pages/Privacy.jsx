export default function Privacy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Last updated: January 2025
          </p>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-gray-700 leading-relaxed">
              HABit IITG ("we", "our", or "us") operates the mobile application
              HABit IITG (the "App").
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              This Privacy Policy explains how we collect, use, and protect your
              information when you use our App.
            </p>
          </div>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Depending on how you use our App, we may collect the following types
            of information:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            Personal Information
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Such as your name, email address, IIT Guwahati institute roll
            number, hostel room number, and mobile number — only if you choose
            to provide them.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We also collect your feedback on the menu served in your hostels.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            Camera and Media Access
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>
              The camera is used only for QR code scanning within the App to
              verify or record certain actions (e.g., attendance,
              authentication, or feedback validation).
            </li>
            <li>
              If you choose to upload a profile picture, it is stored securely
              and used only within the App to display your profile.
            </li>
            <li>
              This image is not shared with any third party or used for any
              purpose outside the App.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            Third-Party Services
          </h3>
          <p className="text-gray-700 leading-relaxed mb-2">
            Our App may use third-party services that collect information
            according to their own privacy policies. Examples include:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Firebase Analytics</li>
            <li>Microsoft Azure</li>
          </ul>
        </section>

        {/* Section 2: How We Use the Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. How We Use the Information
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We may use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Provide and maintain the App</li>
            <li>Improve user experience and app functionality</li>
            <li>Monitor usage, fix bugs, and enhance security</li>
            <li>Communicate updates or important notices</li>
          </ul>
        </section>

        {/* Section 3: Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain collected data only for as long as necessary to provide
            the App's services and fulfill the purposes outlined in this policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may request deletion of your data by contacting us at{" "}
            <a
              href="mailto:codingclub@iitg.ac.in"
              className="text-gray-900 underline"
            >
              codingclub@iitg.ac.in
            </a>
            .
          </p>
        </section>

        {/* Section 4: Sharing of Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Sharing of Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell or rent your personal information.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We may share data only in the following situations:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>To comply with legal obligations</li>
            <li>
              To trusted third-party service providers who help us operate the
              App (under confidentiality agreements)
            </li>
          </ul>
        </section>

        {/* Section 5: Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Security
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use reasonable administrative and technical measures to protect
            your information. However, please note that no method of
            transmission over the Internet or method of electronic storage is
            100% secure.
          </p>
        </section>

        {/* Section 6: Children's Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Children's Privacy
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Our App is not intended for children under the age of 13.</li>
            <li>
              We do not knowingly collect personal information from children.
            </li>
            <li>
              If you believe a child has provided personal data, please contact
              us so we can delete it.
            </li>
          </ul>
        </section>

        {/* Section 7: Changes to This Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated "Last updated" date.
          </p>
        </section>

        {/* Section 8: Contact Us */}
        <section className="mb-12 border-t border-gray-300 pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:
          </p>
          <p className="text-gray-700">
            <a
              href="mailto:codingclub@iitg.ac.in"
              className="text-gray-900 underline"
            >
              codingclub@iitg.ac.in
            </a>
          </p>
        </section>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            This Privacy Policy complies with standard requirements for mobile
            app stores including Google Play Store and Apple App Store.
          </p>
        </div>
      </div>
    </div>
  );
}
