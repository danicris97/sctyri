<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nuevo Mensaje de Contacto</title>
    <style>
        body { font-family: sans-serif; }
        .container { padding: 20px; }
        .header { background-color: #f0f0f0; padding: 10px; }
        .content { padding: 20px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nuevo Mensaje de Contacto</h2>
        </div>
        <div class="content">
            <p><strong>De:</strong> {{ $formData['nombre'] }}</p>
            <p><strong>Email:</strong> {{ $formData['email'] }}</p>
            <p><strong>Teléfono:</strong> {{ $formData['telefono'] }}</p>
            <p><strong>Asunto:</strong> {{ $formData['asunto'] }}</p>
            <hr>
            <p><strong>Mensaje:</strong></p>
            <p>{{ $formData['mensaje'] }}</p>
        </div>
        <p><strong>Destinatario original:</strong> {{ $formData['destinatario'] }}</p>
    </div>
</body>
</html>