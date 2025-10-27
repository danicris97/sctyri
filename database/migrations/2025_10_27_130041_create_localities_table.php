<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Localidad utilizado por dependencias e instituciones
     */
    public function up(): void
    {
        Schema::create('localities', function (Blueprint $table) {
            $table->id();
            $table->string('name',100);
            $table->foreignId('province_id')->constrained('provinces')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name','province_id']);
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localities');
    }
};
