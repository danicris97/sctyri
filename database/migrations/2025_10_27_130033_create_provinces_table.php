<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * //
     * Tabla de provincias para Instituciones
     */
    public function up(): void
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name', 'country_id']);
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provinces');
    }
};
