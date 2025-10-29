import { Link } from "@inertiajs/react";
import { ChevronDown, Menu, X, CircleUser } from "lucide-react";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { type SharedData } from '@/types'; // Asegúrate de que esta ruta sea correcta
import { WhatsAppLink } from '@/components/whatsapp-url';
import FacebookIcon from '@/components/icons/facebook';
import InstagramIcon from '@/components/icons/instagram';

const cooperacionItems = [
    { title: "Información General", href: "/coope/info-general" },
    { title: "U.V.T. (Unidad de Vinculación Tecnológica)", href: "/coope/uvt" },
    { title: "C.U.E.P.O. (Centro Universitario de Educación Profesional y Oficios)", href: "/coope/cuepo" },
];

const rriiItems = [
    { title: "Información General", href: "/rrii/info-general" },
    { title: "Ingresantes", href: "/rrii/ingresantes" },
    { title: "Salientes", href: "/rrii/salientes" },
];

export default function Navbar() {
    const { auth, url } = usePage<SharedData>().props; // Obtén la URL actual
    const isHomePage = url === '/'; // Comprueba si la URL es la raíz

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [navHeight, setNavHeight] = useState(100); // Initial height percentage
    const [cooperacionOpen, setCooperacionOpen] = useState(false);
    const [rriiOpen, setRriiOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);

            const newHeight = Math.max(70, 100 - scrollPosition * 0.6);
            setNavHeight(newHeight);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        handleResize(); // Check on initial load

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Effect to scroll to hash after Inertia navigation
    useEffect(() => {
      const handleHashScroll = () => {
          if (window.location.hash) {
              const id = window.location.hash.substring(1);
              const element = document.getElementById(id);
              if (element) {
                  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                  window.scrollTo({
                      top: element.offsetTop - navbarHeight - 20,
                      behavior: 'smooth'
                  });
              }
          }
      };

      const timer = setTimeout(handleHashScroll, 100);
      return () => clearTimeout(timer);
    }, [url]); // Se re-ejecuta cuando la URL de Inertia cambia

    const showScrolledStyle = isScrolled || isMobile;

    // Helper function to get the correct href for internal sections
    const getSectionHref = (sectionId: string) => {
        return isHomePage ? `#${sectionId}` : `/#${sectionId}`;
    };

    // Helper function to render common link styles
    const renderNavLink = (href: string, text: string) => (
        <Link
            href={href}
            className={`transition-colors duration-300 font-medium ${
                showScrolledStyle ? "text-[#0d3b66] hover:text-[#488edf]" : "text-white hover:text-white/80"
            }`}
            onClick={(e) => {
                if (href.startsWith("#") && isHomePage) {
                    e.preventDefault(); // Prevent Inertia from handling pure hash links on the same page
                    const id = href.substring(1);
                    const element = document.getElementById(id);
                    if (element) {
                        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                        window.scrollTo({
                            top: element.offsetTop - navbarHeight - 20,
                            behavior: 'smooth'
                        });
                        // Update URL hash without causing full page reload
                        window.history.pushState(null, '', href);
                    }
                }
                // Inertia Link handles non-hash or cross-page hash navigation
            }}
        >
            {text}
        </Link>
    );

    // Helper function for mobile links (they don't need the onClick logic if they also rely on the useEffect for hash scroll)
    const renderMobileNavLink = (href: string, text: string) => (
        <Link href={href} className="block py-2 text-[#0d3b66] hover:text-[#488edf] transition-colors">
            {text}
        </Link>
    );


    return (
        <nav
            id="navbar" // Add ID for height calculation
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                showScrolledStyle ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
            }`}
            style={{
                height: showScrolledStyle ? "80px" : "100px",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    {showScrolledStyle ? (
                        <div className="flex items-center space-x-3">
                            <div className="h-full flex items-center justify-center">
                                <img src="/images/logo-unsa-azul.png" alt="UNSa Logo" className="h-[60px] w-auto object-contain" />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-[#0d3b66]">SCTRI - UNSa</h1>
                                <p className="text-xs text-gray-600">Cooperación Técnica y <br/>Relaciones Internacionales</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-5">
                            <div className="h-full flex items-center justify-center">
                                <img src="/images/logo-unsa-blanco.png" alt="UNSa Logo" className="h-[60px] w-auto object-contain" />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-[#ffffff]">SCTRI - UNSa</h1>
                            </div>
                        </div>
                    )}

                    {!showScrolledStyle && <div></div>}

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {renderNavLink("/", "Inicio")}
                        {renderNavLink(getSectionHref("autoridades"), "Autoridades")}
                        {renderNavLink(route("busqueda"), "Búsqueda")}

                        {/* Cooperación Técnica Dropdown */}
                        <div className="relative group">
                            <button
                                className={`flex items-center transition-colors duration-300 font-medium ${
                                    showScrolledStyle ? "text-[#0d3b66] hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            >
                                Cooperación Técnica <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="py-2">
                                    {cooperacionItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#488edf] transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RR.II Dropdown */}
                        <div className="relative group">
                            <button
                                className={`flex items-center transition-colors duration-300 font-medium ${
                                    showScrolledStyle ? "text-[#0d3b66] hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            >
                                RR.II. <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="py-2">
                                    {rriiItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#488edf] transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {renderNavLink("/contacto", "Contacto")}
                    </div>

                    {/* Social Media & Login - Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <a
                                href="https://www.facebook.com/rriiunsa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle ? "text-gray-600 hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            >
                                <FacebookIcon className="h-5 w-5" />
                            </a>
                            <WhatsAppLink
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle ? "text-gray-600 hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            />
                            <a
                                href="https://www.instagram.com/rriiunsa/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle ? "text-gray-600 hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            >
                                <InstagramIcon className="h-5 w-5" />
                            </a>
                        </div>

                        {/* Login Icon */}
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle
                                        ? "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-gray-600 hover:text-[#488edf]"
                                        : "text-white hover:text-white/80"
                                }`}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className={`inline-flex items-center justify-center rounded-full p-2 transition-colors duration-300 ${
                                        showScrolledStyle ? "text-[#0d3b66] hover:bg-gray-100" : "text-white hover:bg-white/10"
                                    }`}
                                >
                                    <CircleUser className="h-6 w-6" />
                                    <span className="sr-only">Log in</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Social Media & Login + Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <div className="flex items-center space-x-2 mr-2">
                            <a
                                href="https://www.facebook.com/rriiunsa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle ? "text-[#0d3b66] hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            >
                                <FacebookIcon className="h-5 w-5" />
                            </a>
                            <WhatsAppLink
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle ? "text-[#0d3b66] hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            />
                            <a
                                href="https://www.instagram.com/rriiunsa/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transition-colors duration-300 ${
                                    showScrolledStyle ? "text-[#0d3b66] hover:text-[#488edf]" : "text-white hover:text-white/80"
                                }`}
                            >
                                <InstagramIcon className="h-5 w-5" />
                            </a>
                        </div>

                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="inline-block rounded-sm border border-[#104d86] px-5 py-1.5 text-sm leading-normal text-[#0d3b66] hover:border-[#1915014a] dark:border-[#416a90] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className={`inline-flex items-center justify-center rounded-full p-2 transition-colors duration-300 ${
                                    showScrolledStyle ? "text-[#0d3b66] hover:bg-gray-100" : "text-white hover:bg-white/10"
                                }`}
                            >
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Log in</span>
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="ml-2 p-2 rounded-md text-[#0d3b66] hover:text-[#488edf] transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t shadow-lg">
                    <div className="px-4 py-2 space-y-2">
                        {renderMobileNavLink("/", "Inicio")}
                        {renderMobileNavLink(getSectionHref("autoridades"), "Autoridades")}
                        {renderMobileNavLink(route("busqueda"), "Búsqueda")}

                        {/* Cooperación Técnica Mobile Dropdown */}
                        <div className="py-2">
                            <button
                                onClick={() => setCooperacionOpen(!cooperacionOpen)}
                                className="flex items-center justify-between w-full text-[#0d3b66] hover:text-[#488edf] transition-colors"
                            >
                                <span className="font-medium">Cooperación Técnica</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${cooperacionOpen ? "rotate-180" : ""}`} />
                            </button>
                            {cooperacionOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {cooperacionItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="block py-1 text-sm text-[#0d3b66] hover:text-[#488edf] transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RR.II Mobile Dropdown */}
                        <div className="py-2">
                            <button
                                onClick={() => setRriiOpen(!rriiOpen)}
                                className="flex items-center justify-between w-full text-[#0d3b66] hover:text-[#488edf] transition-colors"
                            >
                                <span className="font-medium">RR.II</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${rriiOpen ? "rotate-180" : ""}`} />
                            </button>
                            {rriiOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {rriiItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="block py-1 text-sm text-[#0d3b66] hover:text-[#488edf] transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {renderMobileNavLink("/contacto", "Contacto")}
                    </div>
                </div>
            )}
        </nav>
    );
}