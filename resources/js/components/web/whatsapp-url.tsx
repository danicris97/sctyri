import { getWhatsAppLink } from "@/helpers/whatsapp-helper"
import WhatsAppIcon from "@/components/icons/whatsapp"

type WhatsAppLinkProps = {
  className?: string
}

export const WhatsAppLink = ({ className }: WhatsAppLinkProps) => {
  const phoneNumber = "5493875391627"
  const message = "Hola! Me gustaría obtener más información."

  const whatsappUrl = getWhatsAppLink(phoneNumber, message)

  return (
    <a
      href={whatsappUrl}
      className={className ?? "transition-colors duration-300 text-blue-100 hover:text-white"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="h-5 w-5" />
    </a>
  )
}
