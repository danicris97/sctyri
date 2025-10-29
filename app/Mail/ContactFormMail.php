<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $data;

    /**
     * Create a new message instance.
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // El asunto del correo se toma de los datos validados del formulario.
        // Se añade un prefijo para identificarlo fácilmente.
        return new Envelope(
            subject: 'Contacto desde el sitio web: ' . $this->data['asunto'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Se define la vista que contendrá el cuerpo del correo.
        // La vista debe estar en resources/views/emails/contact-form.blade.php
        // Y se pasan los datos del formulario a esa vista.
        return new Content(
            view: 'email.contact-form', // Asegúrate de que esta vista exista
            with: [
                'formData' => $this->data,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}