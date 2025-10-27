<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Registramos los movimientos de un expediente durante un proceso administrativo
     * esta informacion es vital para consultas de estado de un tramite
     */
    public function up(): void
    {
        Schema::create('movement_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained('files')->cascadeOnDelete();
            $table->foreignId('dependency_id')->constrained('dependencies')->cascadeOnDelete();
            $table->string('folios',6);
            $table->date('date');
            $table->text('purpose')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['file_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movement_files');
    }
};
