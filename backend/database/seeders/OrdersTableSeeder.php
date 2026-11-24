<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrdersTableSeeder extends Seeder
{
    /**
     * Seed data pesanan realistis lintas bulan untuk analitik dashboard 100% murni database.
     */
    public function run(): void
    {
        // Bersihkan tabel orders terlebih dahulu
        DB::table('orders')->truncate();

        $customers = [
            ['name' => 'Budi Santoso', 'phone' => '081234567890', 'email' => 'budi.santoso@gmail.com'],
            ['name' => 'Siti Rahma', 'phone' => '085712345678', 'email' => 'siti.rahma@gmail.com'],
            ['name' => 'Dimas Pratama', 'phone' => '087899887766', 'email' => 'dimas.pratama@gmail.com'],
            ['name' => 'Ahmad Fauzi', 'phone' => '081399887711', 'email' => 'ahmad.fauzi@yahoo.com'],
            ['name' => 'Jessica Tanuwijaya', 'phone' => '081288776655', 'email' => 'jessica.t@gmail.com'],
            ['name' => 'Reza Syahputra', 'phone' => '085612349988', 'email' => 'reza.syah@gmail.com'],
            ['name' => 'Nadia Putri', 'phone' => '087788990011', 'email' => 'nadia.putri@gmail.com'],
            ['name' => 'Kevin Sanjaya', 'phone' => '081900112233', 'email' => 'kevin.sanjaya@gmail.com'],
            ['name' => 'Rina Marlina', 'phone' => '082199884433', 'email' => 'rina.marlina@gmail.com'],
            ['name' => 'Fajar Alfian', 'phone' => '081377889900', 'email' => 'fajar.alfian@gmail.com'],
            ['name' => 'Bella Safira', 'phone' => '085811223344', 'email' => 'bella.safira@gmail.com'],
            ['name' => 'Hendro Wijaya', 'phone' => '087855667788', 'email' => 'hendro.w@gmail.com'],
        ];

        $shoes = [
            ['brand' => 'Nike', 'model' => 'Air Jordan 1 High Chicago', 'color' => 'Red / White / Black', 'size' => '42'],
            ['brand' => 'Adidas', 'model' => 'Samba OG Classic', 'color' => 'White / Black Stripes', 'size' => '39'],
            ['brand' => 'New Balance', 'model' => '550 White Grey', 'color' => 'White / Grey', 'size' => '43'],
            ['brand' => 'Nike', 'model' => 'Dunk Low Panda', 'color' => 'Black / White', 'size' => '41'],
            ['brand' => 'Salomon', 'model' => 'XT-6 Black Phantom', 'color' => 'Triple Black', 'size' => '42.5'],
            ['brand' => 'ASICS', 'model' => 'Gel-Kayano 14 Cream', 'color' => 'Cream / Metallic Plum', 'size' => '40'],
            ['brand' => 'Converse', 'model' => 'Chuck 70 High Vintage', 'color' => 'Parchment White', 'size' => '42'],
            ['brand' => 'Dr. Martens', 'model' => '1460 Smooth 8-Eye Boot', 'color' => 'Black Leather', 'size' => '41'],
            ['brand' => 'Vans', 'model' => 'Old Skool Pro Suede', 'color' => 'Black / White', 'size' => '43'],
            ['brand' => 'Nike', 'model' => 'Air Max 97 Silver Bullet', 'color' => 'Metallic Silver', 'size' => '44'],
        ];

        // Service rates: 1: Deep Clean 50k, 2: Fast Clean 30k, 3: Repaint 85k, 4: Unyellowing 45k, 5: Leather Care 60k
        $services = [
            1 => ['name' => 'Deep Cleaning', 'price' => 50000],
            2 => ['name' => 'Fast Cleaning', 'price' => 30000],
            3 => ['name' => 'Repaint & Color Restore', 'price' => 85000],
            4 => ['name' => 'Unyellowing Treatment', 'price' => 45000],
            5 => ['name' => 'Premium Leather Care', 'price' => 60000],
        ];

        $currentYear = now()->year;
        $currentMonth = now()->month;

        $ordersToInsert = [];
        $orderCounter = 1;

        // Buat data pesanan untuk setiap bulan dari Jan s/d bulan sekarang (dengan volume bertumbuh realistis)
        for ($m = 1; $m <= $currentMonth; $m++) {
            // Jumlah pesanan per bulan bertumbuh dari 4 s/d 9 pesanan
            $numOrdersInMonth = min(10, 4 + round($m * 0.6));

            for ($i = 0; $i < $numOrdersInMonth; $i++) {
                $cust = $customers[array_rand($customers)];
                $shoe = $shoes[array_rand($shoes)];
                $serviceId = array_rand($services);
                $service = $services[$serviceId];

                // Tanggal acak di dalam bulan tersebut
                $day = rand(1, 28);
                $hour = rand(9, 20);
                $minute = rand(0, 59);
                $orderDate = Carbon::create($currentYear, $m, $day, $hour, $minute, 0);

                // Jika pesanan di bulan-bulan lalu, statusnya sudah completed
                // Jika di bulan berjalan sekarang, variasikan status (queued, washing, repaint, ready, completed)
                if ($m < $currentMonth) {
                    $status = 'completed';
                    $readyDate = $orderDate->copy()->addDays(rand(2, 3));
                } else {
                    $activeStatuses = ['queued', 'washing', 'repaint', 'ready_for_delivery', 'completed'];
                    $status = $activeStatuses[array_rand($activeStatuses)];
                    $readyDate = $orderDate->copy()->addDays(2);
                }

                $codeDate = $orderDate->format('Ymd');
                $codeSuffix = Str::padLeft($orderCounter, 3, '0');
                $orderCode = "SL-{$codeDate}-{$codeSuffix}";

                $ordersToInsert[] = [
                    'order_code'         => $orderCode,
                    'customer_name'      => $cust['name'],
                    'customer_phone'     => $cust['phone'],
                    'customer_email'     => $cust['email'],
                    'service_id'         => $serviceId,
                    'shoe_brand'         => $shoe['brand'],
                    'shoe_model'         => $shoe['model'],
                    'shoe_color'         => $shoe['color'],
                    'shoe_size'          => $shoe['size'],
                    'shoe_details'       => 'Pembersihan material ' . $shoe['brand'] . ' dengan standar lab shoeVive.',
                    'notes'              => 'Mohon perhatian khusus pada bagian insole & midsole.',
                    'total_price'        => $service['price'],
                    'status'             => $status,
                    'estimated_ready_at' => $readyDate,
                    'created_at'         => $orderDate,
                    'updated_at'         => $orderDate,
                ];

                $orderCounter++;
            }
        }

        DB::table('orders')->insert($ordersToInsert);
    }
}
