<?php

namespace App\Http\Controllers\website;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'telefono' => 'nullable|string|max:50',
            'asunto' => 'required|string|max:255',
            'mensaje' => 'required|string|max:2000',
            'destinatario' => 'required|in:coope,rrii,ambas',
            'recaptcha_token' => 'required|string',
        ]);

        \Log::info('Validando captcha');

        $recaptchaSecret = config('services.recaptcha.secret_key');
        $minimumScore = config('services.recaptcha.minimum_score', 0.5);
        $shouldValidateRecaptcha = !app()->environment('local') && !empty($recaptchaSecret);

        if ($shouldValidateRecaptcha) {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => $recaptchaSecret,
                'response' => $validated['recaptcha_token'],
                'remoteip' => $request->ip(),
            ]);

            if ($response->failed()) {
                return back()->withErrors(['recaptcha_token' => 'No se pudo validar el captcha, intente nuevamente'])->withInput();
            }

            $body = $response->json();

            if (!($body['success'] ?? false) || ($body['score'] ?? 0) < $minimumScore) {
                return back()->withErrors(['recaptcha_token' => 'Captcha invalido, intente de nuevo'])->withInput();
            }
        }

        \Log::info('Captcha validado correctamente');

        // Determinar destinatarios
        $emails = match ($validated['destinatario']) {
            'coope' => ['ctyri@unsa.edu.ar'],
            'rrii'  => ['coreinte@unsa.edu.ar'],
            'ambas' => ['ctyri@unsa.edu.ar', 'coreinte@unsa.edu.ar'],
        };

        \Log::info('Enviando correo a: ' . implode(', ', $emails));

        // Enviar correo
        Mail::to($emails)->send(new ContactFormMail($validated));

        \Log::info('Correo enviado correctamente');

        return redirect()->route('home')->with('success', 'Mensaje enviado correctamente');
    }
}
