const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 mb-4">
            Privacy policy
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Mark Prime Meats — Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            Effective date: April 12, 2026 &nbsp;·&nbsp; Nairobi, Kenya
          </p>
        </div>

        {/* Intro */}
        <div className="bg-gray-100 rounded-xl p-5 mb-10">
          <p className="text-sm text-gray-600 leading-relaxed">
            Your privacy matters to us. This policy explains what information we
            collect when you use New Mark Prime Meats, how we use it, and how we
            keep it safe. We don't sell your data — ever.
          </p>
        </div>

        <div className="space-y-10">
          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              1. What information we collect
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              When you create an account or place an order, we collect:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>Your name, email address, and phone number</li>
              <li>Your delivery address and any delivery notes</li>
              <li>Order history and preferences</li>
              <li>
                Payment confirmation details (we never store full card or M-Pesa
                credentials)
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              We may also collect basic usage data (pages visited, device type)
              to help us improve the platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              2. How we use your information
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>To process and deliver your orders</li>
              <li>To send you order confirmations and delivery updates</li>
              <li>To contact you regarding your order if needed</li>
              <li>To improve our products, service, and website experience</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              We will only contact you for marketing purposes if you have opted
              in. You can unsubscribe at any time.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              3. How we share your information
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              We do not sell, rent, or trade your personal information. We only
              share it where necessary:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                With our delivery riders — so they can complete your order
              </li>
              <li>With Paystack — to process your payment securely</li>
              <li>With authorities — if required by law</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              4. Payment security
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              All payments are processed by Paystack, a PCI-DSS compliant
              payment provider. We never see or store your full card details or
              M-Pesa PIN. Your payment data is encrypted and handled entirely by
              Paystack.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              5. How long we keep your data
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We keep your account and order data for as long as your account is
              active, or as required by Kenyan law. If you delete your account,
              we will remove your personal data within 30 days, except where
              retention is required for legal or financial records.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              6. Your rights
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of any inaccurate data</li>
              <li>Request deletion of your account and personal data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              To exercise any of these rights, contact us at the details below.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              7. Cookies
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use essential cookies to keep you logged in and remember your
              cart. We do not use advertising or tracking cookies. You can
              disable cookies in your browser settings, but some parts of the
              site may not work as expected.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              8. Changes to this policy
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We may update this privacy policy from time to time. We will
              notify you of significant changes via email or a notice on our
              website. The latest version will always be available here.
            </p>
          </section>

          {/* 9 — Contact */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              9. Contact us
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              If you have any questions or concerns about your privacy, please
              get in touch:
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                New Mark Prime Meats
              </p>
              <p className="text-sm text-gray-600">
                Email:
                <a
                  href="mailto:newmark.primecuts@gmail.com"
                  className="text-red-600 hover:underline"
                >
                  newmark.primecuts@gmail.com
                </a>
              </p>
              <p className="text-sm text-gray-600">
                Phone: 0700 876 201 / 0701 347 19
              </p>
              <p className="text-sm text-gray-600">Location: Nairobi, Kenya</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
