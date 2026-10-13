<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = [
            [
                'order_code' => 'SL-20241013-001',
                'customer_name' => 'Budi Santoso',
                'customer_phone' => '081234567890',
                'customer_email' => 'budi.santoso@gmail.com',
                'service_id' => 1,
                'shoe_brand' => 'Nike',
                'shoe_model' => 'Air Jordan 1 High Chicago',
                'shoe_color' => 'Red / White / Black',
                'shoe_size' => '42',
                'shoe_details' => 'Noda lumpur pekat di midsole dan insole berdebu',
                'notes' => 'Tolong hati-hati dengan leather toe-box',
                'total_price' => 50000,
                'status' => 'washing',
                'estimated_ready_at' => now()->addDays(2),
                'created_at' => now()->subDay(),
                'updated_at' => now(),
            ],
            [
                'order_code' => 'SL-20241013-002',
                'customer_name' => 'Siti Rahma',
                'customer_phone' => '085712345678',
                'customer_email' => 'siti.rahma@gmail.com',
                'service_id' => 3,
                'shoe_brand' => 'Adidas',
                'shoe_model' => 'Samba OG White Black',
                'shoe_color' => 'White / Black Stripes',
                'shoe_size' => '39',
                'shoe_details' => 'Suede toe cap kusam dan cat tumit pudar',
                'notes' => 'Repaint bagian tumit hitam dan deep clean suede',
                'total_price' => 85000,
                'status' => 'repaint',
                'estimated_ready_at' => now()->addDays(3),
                'created_at' => now()->subDays(2),
                'updated_at' => now(),
            ],
            [
                'order_code' => 'SL-20241013-003',
                'customer_name' => 'Dimas Pratama',
                'customer_phone' => '087899887766',
                'customer_email' => 'dimas.pratama@gmail.com',
                'service_id' => 4,
                'shoe_brand' => 'New Balance',
                'shoe_model' => '550 White Grey',
                'shoe_color' => 'White / Grey',
                'shoe_size' => '43',
                'shoe_details' => 'Midsole menguning parah karena oksidasi',
                'notes' => 'Sudah selesai unyellowing & siap diambil / diantar',
                'total_price' => 45000,
                'status' => 'ready_for_delivery',
                'estimated_ready_at' => now(),
                'created_at' => now()->subDays(3),
                'updated_at' => now(),
            ],
        ];

        \Illuminate\Support\Facades\DB::table('orders')->insert($orders);
    }
}
