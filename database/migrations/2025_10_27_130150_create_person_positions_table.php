<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Esta tabla existe por que una persona puede ser rector hoy pero antes pudo ser alumno
     * Position es un enum
     */
    public function up(): void
    {
        Schema::create('person_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_id')->constrained('people')->cascadeOnDelete();
            $table->string('position', 50);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['person_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('person_positions');
    }
};
