<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_code',
        'customer_name',
        'customer_phone',
        'customer_email',
        'service_id',
        'shoe_brand',
        'shoe_model',
        'shoe_color',
        'shoe_size',
        'shoe_details',
        'notes',
        'total_price',
        'status',
        'estimated_ready_at',
    ];

    protected $casts = [
        'total_price' => 'float',
        'estimated_ready_at' => 'datetime',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
