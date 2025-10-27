<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cancelacion de convenios
     */
    public function up(): void
    {
        Schema::create('agreement_cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->constrained('agreements')->cascadeOnDelete();
            $table->text('reason')->nullable();
            $table->date('cancellation_date');
            $table->foreignId('resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['agreement_id', 'cancellation_date']);
            $table->index(['agreement_id', 'cancellation_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_cancellations');
    }
};
