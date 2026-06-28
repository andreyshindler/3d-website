import ContactForm from "./ContactForm";

export default function ContactPage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const defaultProduct = searchParams.product ?? "";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Interested in one of our prints? Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>
      <ContactForm defaultProduct={defaultProduct} />
    </div>
  );
}
