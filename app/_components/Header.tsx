import Link from "next/link";

const Header = () => (
  <header className="bg-gray-100 dark:bg-gray-900 py-4 fixed top-0 z-10 w-full">
    <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
      <Link
        href="/"
        className="text-2xl font-bold text-gray-900 dark:text-white"
        prefetch={false}
      >
        Dr. Nicholas Dimonaco
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/publications"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 after:dark:bg-white hover:after:w-full after:transition-all after:ease-in-out after:duration-300"
              prefetch={false}
            >
              Publications
            </Link>
          </li>
          <li>
            <Link
              href="/tools"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 after:dark:bg-white hover:after:w-full after:transition-all after:ease-in-out after:duration-300"
              prefetch={false}
            >
              Tools
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <div className="border border-gray-500" style={{ width: "100%" }} />
  </header>
);
export default Header;
