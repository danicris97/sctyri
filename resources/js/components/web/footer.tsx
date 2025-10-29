import { MapPin, Phone, Mail, Clock } from "lucide-react";
import FacebookIcon from '@/components/icons/facebook';
import InstagramIcon from '@/components/icons/instagram';
import WhatsAppIcon from '@/components/icons/whatsapp';
import { WhatsAppLink } from '@/components/whatsapp-url';

const cooperacionItems = [
    { title: "Guia de telefono", href: "https://obras.unsa.edu.ar/guia/index.php" },
    { title: "Boletin oficial de la UNSa", href: "https://bo.unsa.edu.ar/" },
    { title: "Pagina oficial UNSa", href: "https://www.unsa.edu.ar/" },
    { title: "Instagram de la UNSa", href: "https://www.instagram.com/unsa.salta/" },
  ]

export default function Footer() {

    return ( 
      <footer className="bg-gradient-to-br from-[#0d3b66] to-[#488edf] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
                <h4 className="font-semibold text-lg mb-4">Links Útiles</h4>
                <ul className="space-y-2">
                    {cooperacionItems.map((item, index) => (
                    <li key={index}>
                        <a href={item.href} className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        {item.title}
                        </a>
                    </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-lg mb-4">Redes Sociales</h4>
                <div className="flex space-x-4">
                    <a href="https://www.facebook.com/rriiunsa" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                    <FacebookIcon className="h-5 w-5" />
                    </a>
                    <WhatsAppLink />
                    <a href="https://www.instagram.com/rriiunsa/" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="h-5 w-5" />
                    </a>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-lg mb-4">Contacto</h4>
                <div className="space-y-2 text-blue-100">
                    <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Av. Bolivia 5150, Salta, Edificio Central del Rectorado
                    </p>
                    <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    +54 387 425-5555
                    </p>
                    <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    ctyri@unsa.edu.ar
                    </p>
                    <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    coreinte@unsa.edu.ar
                    </p>
                    <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Lunes a Viernes de 9:00 a 13:00
                    </p>
                    <p className="flex items-center">
                      <WhatsAppIcon className="h-4 w-4 mr-2" />
                       +54 387 539-1627
                    </p>
                </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-blue-100">
              © {new Date().getFullYear()} Universidad Nacional de Salta. Todos los derechos reservados.
            </p>
            <p className="text-blue-100">
              Desarrollado por <a href="https://www.instagram.com/danicris1297/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-100 transition-colors">Cristian Velazquez</a>
            </p>
          </div>
        </div>
      </footer>
    )
}