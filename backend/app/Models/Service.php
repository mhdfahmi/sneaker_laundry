<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'duration',
        'material',
        'icon',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
