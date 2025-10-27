<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabla para expedientes, las resoluciones tienen un expediente, la marca internacional es para marcar
     * un tramite del area de internacionales
     */
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('number', 7);
            $table->year('year');
            //causante polimorifco
            $table->unsignedBigInteger('causative_id');
            $table->string('causative_type', 50);
            //
            $table->text('statement')->nullable();      //extracto
            $table->string('type', 50)->nullable();
            $table->foreignId('dependency_id')->nullable()->constrained('dependencies')->nullOnDelete();    //quien abrio el expediente
            $table->date('opening_date')->nullable();    // Fecha de apertura del expediente
            $table->date('closing_date')->nullable();    // Fecha de cierre, si aplica
            $table->text('observations')->nullable();
            $table->boolean('international')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['number', 'year']);
            $table->index(['number', 'year']);
            $table->index(['causative_id','causative_type']);
            $table->index('dependency_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
