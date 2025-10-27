<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabla para guardar personas que firmaron el convenios, becarios, pasantes, causante de expediente.
     */
    public function up(): void
    {
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('surname', 100);
            $table->string('dni', 10)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('phone', 16)->nullable();
            $table->string('address', 150)->nullable();
            $table->foreignId('nationality')->nullable()->constrained('countries')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name', 'surname', 'dni']);
            $table->index('name');
            $table->index('surname');
            $table->index('dni');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
