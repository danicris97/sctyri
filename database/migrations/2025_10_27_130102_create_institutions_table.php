<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabla de instituciones utilizadas en los convenios o en como causante en expedientes.
     * type es un enum 
     */
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name',150);
            $table->string('type', 50);
            $table->string('cuit', 12)->nullable();
            $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
            $table->foreignId('province_id')->nullable()->constrained('provinces')->nullOnDelete();
            $table->foreignId('locality_id')->nullable()->constrained('localities')->nullOnDelete();
            $table->string('address', 150)->nullable();
            $table->string('phone', 16)->nullable();     
            $table->string('email', 100)->nullable();
            $table->string('web', 150)->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name', 'type']);
            $table->index('name');
            $table->index('country_id');
            $table->index('province_id');
            $table->index('locality_id');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
