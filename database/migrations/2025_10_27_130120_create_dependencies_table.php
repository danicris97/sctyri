<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Dependencia que forman parte de la Universidad Nacional de Salta
     * se usan en convenios, expedientes como causante
     */
    public function up(): void
    {
        Schema::create('dependencies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('type', 50);
            $table->string('abbreviation', 15)->nullable();
            $table->foreignId('parent_dependency_id')->nullable()->constrained('dependencies')->nullOnDelete();
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
            $table->index('locality_id');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dependencies');
    }
};
