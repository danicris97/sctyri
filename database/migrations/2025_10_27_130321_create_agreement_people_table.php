<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Convenios x Firmantes
     */
    public function up(): void
    {
        Schema::create('agreement_people', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->constrained('agreements')->cascadeOnDelete();
            $table->foreignId('person_position_id')->constrained('person_positions')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['agreement_id', 'person_position_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_people');
    }
};
