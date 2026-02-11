export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* About Section */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            About GamePix
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your ultimate source for game information, reviews, and discovery. Find your next favorite game today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Quick Links
                        </h2>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/about.html"
                                    className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact.html"
                                    className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/privacy-policy.html"
                                    className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Legal
                        </h2>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/privacy-policy.html"
                                    className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about.html"
                                    className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 pt-8 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            &copy; {currentYear} GamePix. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a
                                href="/about.html"
                                className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                                About
                            </a>
                            <a
                                href="/contact.html"
                                className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                                Contact
                            </a>
                            <a
                                href="/privacy-policy.html"
                                className="text-sm text-gray-600 transition hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                                Privacy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
