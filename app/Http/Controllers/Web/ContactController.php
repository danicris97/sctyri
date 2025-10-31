<?php

namespace App\Http\Controllers\Web;

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
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:50',
            'affair' => 'required|string|max:255',
            'menssege' => 'required|string|max:2000',
            'destinatary' => 'required|in:coope,rrii,ambas',
            'recaptcha_token' => 'required|string',
        ]);

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

        // Determinar destinatarios
        $emails = match ($validated['destinatary']) {
            'coope' => ['ctyri@unsa.edu.ar'],
            'rrii'  => ['coreinte@unsa.edu.ar'],
            'ambas' => ['ctyri@unsa.edu.ar', 'coreinte@unsa.edu.ar'],
        };

        // Enviar correo
        Mail::to($emails)->send(new ContactFormMail($validated));

        return redirect()->route('home')->with('success', 'Mensaje enviado correctamente');
    }
}
