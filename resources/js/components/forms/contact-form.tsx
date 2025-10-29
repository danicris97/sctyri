import { useForm } from '@inertiajs/react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Mail, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '6LfMsOwrAAAAAHL3f5z6purb90JNJ_D0spb6A6Pq'
const isLocalEnv = import.meta.env.DEV

function ContactFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    destinatario: '',
    recaptcha_token: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let recaptchaToken = data.recaptcha_token

    if (executeRecaptcha) {
      recaptchaToken = (await executeRecaptcha('contact_form')) ?? ''
    } else if (isLocalEnv) {
      recaptchaToken = 'local-bypass'
    } else {
      return
    }

    transform((formData) => ({
      ...formData,
      recaptcha_token: recaptchaToken,
    }))

    post(route('contacto.submit'), {
      onSuccess: () => reset(),
      onFinish: () => {
        transform((formData) => formData)
      },
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <Mail className="w-16 h-16 text-gray-600" />
        <p className="text-gray-600 text-lg">Completa el formulario y nos pondremos en contacto contigo pronto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destinatario */}
        <div className="space-y-2">
          <Label htmlFor="destinatario">Destinatario *</Label>
          <Select
            value={data.destinatario || undefined}
            onValueChange={(value) => setData('destinatario', value)}
            disabled={processing}
          >
            <SelectTrigger id="destinatario" aria-invalid={Boolean(errors.destinatario)}>
              <SelectValue placeholder="Seleccione destinatario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coope">Cooperación Tecnica</SelectItem>
              <SelectItem value="rrii">Relaciones Internacionales</SelectItem>
              <SelectItem value="ambas">Ambos</SelectItem>
            </SelectContent>
          </Select>
          {errors.destinatario && (
            <p className="text-sm text-red-600 mt-1">{errors.destinatario}</p>
          )}
        </div>

        {/* Nombre y Email en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
              aria-invalid={Boolean(errors.nombre)}
            />
            {errors.nombre && (
              <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Teléfono y Asunto en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="+54 9 11 1234-5678"
              value={data.telefono}
              onChange={(e) => setData('telefono', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asunto">Asunto *</Label>
            <Input
              id="asunto"
              type="text"
              placeholder="Motivo de tu consulta"
              value={data.asunto}
              onChange={(e) => setData('asunto', e.target.value)}
              aria-invalid={Boolean(errors.asunto)}
            />
            {errors.asunto && (
              <p className="text-sm text-red-600 mt-1">{errors.asunto}</p>
            )}
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <Label htmlFor="mensaje">Mensaje *</Label>
          <Textarea
            id="mensaje"
            rows={5}
            placeholder="Describe tu consulta o mensaje en detalle..."
            value={data.mensaje}
            onChange={(e) => setData('mensaje', e.target.value)}
            aria-invalid={Boolean(errors.mensaje)}
            className="resize-none"
          />
          {errors.mensaje && (
            <p className="text-sm text-red-600 mt-1">{errors.mensaje}</p>
          )}
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <Button type="submit" disabled={processing} size="lg" className="w-full md:w-auto bg-[#0e3b64] hover:bg-[#0e3b64]/80">
            <Send className="w-4 h-4" />
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              'Enviar mensaje'
            )}
          </Button>
        </div>

        {/* Nota sobre campos requeridos */}
        <p className="text-xs text-gray-500 mt-4">
          Los campos marcados con * son obligatorios
        </p>
      </form>
    </div>
  )
}

// Proveedor en tu layout o página
export default function ContactPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} scriptProps={{ defer: true }}>
      <div className="min-h-screen bg-gray-50 py-12">
        <ContactFormInner />
      </div>
    </GoogleReCaptchaProvider>
  )
}
