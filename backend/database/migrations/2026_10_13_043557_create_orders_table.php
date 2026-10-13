<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('shoe_brand')->nullable();
            $table->string('shoe_model')->nullable();
            $table->string('shoe_color')->nullable();
            $table->string('shoe_size')->nullable();
            $table->text('shoe_details')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('total_price', 12, 2)->nullable();
            $table->enum('status', [
                'queued',
                'washing',
                'repaint',
                'ready_for_delivery',
                'completed',
                'cancelled'
            ])->default('queued');
            $table->timestamp('estimated_ready_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
