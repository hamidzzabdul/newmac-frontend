const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 mb-4">
            Terms of service
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Mark Prime Meats — Terms & Conditions
          </h1>
          <p className="text-sm text-gray-400">
            Effective date: April 12, 2026 &nbsp;·&nbsp; Nairobi, Kenya
          </p>
        </div>

        {/* Intro */}
        <div className="bg-gray-100 rounded-xl p-5 mb-10">
          <p className="text-sm text-gray-600 leading-relaxed">
            By placing an order with New Mark Prime Meats, you agree to these
            terms. Please read them — they're short and written in plain
            language.
          </p>
        </div>

        <div className="space-y-10">
          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              1. Who we are
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              New Mark Prime Meats is a Nairobi-based online butchery that
              delivers fresh, quality meat and poultry directly to your door. We
              operate within Nairobi and its environs.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              2. Placing an order
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                Orders are placed through our website and are subject to
                availability.
              </li>
              <li>
                Prices are listed in Kenyan Shillings (KSh) and are inclusive of
                applicable taxes.
              </li>
              <li>
                You will receive an order confirmation via email once your order
                is successfully placed.
              </li>
              <li>
                We reserve the right to cancel any order if a product becomes
                unavailable or if there is a pricing error. You will be notified
                and fully refunded.
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              3. Delivery
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                We deliver within Nairobi and surrounding areas. The delivery
                fee will be communicated to you after your order is confirmed.
              </li>
              <li>
                Delivery times are estimates and may vary depending on your
                location and demand.
              </li>
              <li>
                Someone must be available to receive the order at the provided
                address. If no one is available, we will contact you to arrange
                an alternative.
              </li>
              <li>
                New Mark Prime Meats is not liable for delays caused by events
                outside our control (traffic, weather, etc.).
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              4. Product quality
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                All our meat and poultry is fresh and sourced from certified
                suppliers.
              </li>
              <li>
                Products are handled and packaged in hygienic conditions
                throughout delivery.
              </li>
              <li>
                Once delivered and signed for, responsibility for proper storage
                passes to the customer.
              </li>
              <li>
                If you receive a product that is damaged, incorrect, or of poor
                quality, contact us within 2 hours of delivery.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              5. Payment
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                We accept M-Pesa, card payments via Paystack, and cash on
                delivery.
              </li>
              <li>
                For M-Pesa and card payments, your order is confirmed once
                payment is received.
              </li>
              <li>
                Cash on delivery orders are confirmed when our rider arrives.
                Please have the exact amount ready.
              </li>
              <li>
                We do not store your card or M-Pesa details — all payments are
                processed securely by Paystack.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              6. Cancellations & refunds
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                You may cancel your order before it has been dispatched. Contact
                us as soon as possible.
              </li>
              <li>
                Once an order is out for delivery, it cannot be cancelled.
              </li>
              <li>
                Refunds for valid complaints (wrong item, spoiled product) are
                processed within 3–5 business days via the original payment
                method.
              </li>
              <li>
                We do not offer refunds for change of mind after delivery.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              7. Your account
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
              <li>
                You are responsible for keeping your account credentials secure.
              </li>
              <li>
                You must provide accurate contact and delivery information when
                placing orders.
              </li>
              <li>
                We may suspend accounts that misuse the platform or violate
                these terms.
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              8. Changes to these terms
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We may update these terms from time to time. The updated version
              will always be available on our website. Continued use of the
              platform after changes means you accept the new terms.
            </p>
          </section>

          {/* 9 — Contact */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              9. Contact us
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              If you have any questions about these terms, reach out to us:
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                New Mark Prime Meats
              </p>
              <p className="text-sm text-gray-600">
                Email:{" "}
                <a
                  href="mailto:info@newmarkprimemeat.com"
                  className="text-red-600 hover:underline"
                >
                  info@newmarkprimemeat.com
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

export default TermsAndConditions;
