<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Convenios x Instituciones
     */
    public function up(): void
    {
        Schema::create('agreement_institutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->constrained('agreements')->cascadeOnDelete();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['agreement_id', 'institution_id']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_institutions');
    }
};
