import Link from "next/link";
import { FaLinkedin, FaXTwitter, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

type IContactSection = {
  email: string;
  phoneNumber: string;
  linkedin: string;
  x: string;
};

const ContactSection = ({
  email,
  phoneNumber,
  linkedin,
  x,
}: IContactSection) => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {email && (
            <Link
              href={`mailto:${email}`}
              className="text-gray-600 dark:text-gray-400"
            >
              <div className="flex flex-col items-center text-center">
                <MdEmail className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />

                {email}
              </div>
            </Link>
          )}
          {phoneNumber && (
            <Link
              href={`tel:${phoneNumber}`}
              className="text-gray-600 dark:text-gray-400"
            >
              <div className="flex flex-col items-center text-center">
                <FaPhone className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
                {phoneNumber}
              </div>
            </Link>
          )}
          {linkedin && (
            <Link
              href={linkedin}
              className="text-gray-600 dark:text-gray-400"
              prefetch={false}
            >
              <div className="flex flex-col items-center text-center">
                <FaLinkedin className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />{" "}
              </div>
            </Link>
          )}
          {x && (
            <Link
              href={x}
              className="text-gray-600 dark:text-gray-400"
              prefetch={false}
            >
              <div className="flex flex-col items-center text-center">
                <FaXTwitter className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />{" "}
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
export default ContactSection;
