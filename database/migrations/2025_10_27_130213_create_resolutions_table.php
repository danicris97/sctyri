<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Las resoluciones son el documento que da validez a todo tramite universitario
     * lo usan los convenios
     * tiene un expediente, la resolucion valida todo el proceso del expediente
     */
    public function up(): void
    {
        Schema::create('resolutions', function (Blueprint $table) {
            $table->id();
            $table->string('number', 5);                    
            $table->date('date');
            $table->string('type', 50)->nullable();          
            $table->string('matter', 100)->nullable();  //asunto de la resolución
            $table->string('link', 255)->nullable();         
            $table->foreignId('file_id')->constrained('files')->cascadeOnDelete();
            $table->integer('year')->virtualAs('YEAR(date)');
            $table->timestamps();
            $table->softDeletes();
    
            $table->unique(['number', 'year']);
            $table->index(['number', 'year']);
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resolutions');
    }
};
