<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Renovacion de convenios
     */
    public function up(): void
    {
        Schema::create('agreement_renewals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->constrained('agreements')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('duration');
            $table->text('observations')->nullable();
            $table->foreignId('resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['agreement_id', 'start_date']);
            $table->index(['agreement_id', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_renewals');
    }
};
