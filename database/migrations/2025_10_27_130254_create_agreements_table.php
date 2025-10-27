<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Datos de un convenio para buscar, iniciar otros tramites basandose en el convenio
     * Usamos el field international para diferenciar entre convenios nacionales e internacionales
     */
    public function up(): void
    {
        Schema::create('agreements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('type', 60);
            $table->date('date_signature');
            $table->date('date_end')->nullable();
            $table->date('date_renewal')->nullable();
            $table->integer('duration');
            $table->string('type_renewal', 30)->nullable();
            $table->boolean('international')->default(false);
            $table->foreignId('resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->text('object')->nullable();
            $table->text('summary')->nullable();
            $table->text('observations')->nullable();
            $table->string('status', 30)->default('Vigente');
            $table->timestamps();
            $table->softDeletes();

            $table->index('date_signature');
            $table->index('date_end');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreements');
    }
};
