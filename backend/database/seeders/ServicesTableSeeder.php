<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Deep Cleaning',
                'slug' => 'deep-cleaning',
                'description' => 'Pembersihan menyeluruh seluruh bagian sepatu (upper, insole, midsole, outsole, dan tali) serta sterilisasi anti-bakteri & jamur.',
                'price' => 50000,
                'duration' => '2-3 Hari',
                'material' => 'Semua Bahan (Canvas, Mesh, Suede, Leather)',
                'icon' => 'Sparkles',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fast Cleaning',
                'slug' => 'fast-cleaning',
                'description' => 'Cuci cepat khusus bagian luar (upper dan midsole). Pilihan tepat untuk penyegaran instan sebelum dipakai bepergian.',
                'price' => 30000,
                'duration' => '1 Hari',
                'material' => 'Canvas, Mesh, Synthetic',
                'icon' => 'Zap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Repaint & Color Restore',
                'slug' => 'repaint',
                'description' => 'Pengecatan ulang sepatu yang pudar atau kusam menggunakan cat khusus sneaker fleksibel dan tahan air.',
                'price' => 85000,
                'duration' => '3-5 Hari',
                'material' => 'Leather, Suede, Canvas',
                'icon' => 'Paintbrush',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Unyellowing Treatment',
                'slug' => 'unyellowing',
                'description' => 'Treatment kimia khusus untuk mengangkat noda kuning akibat oksidasi pada midsole karet/foam agar kembali putih cerah.',
                'price' => 45000,
                'duration' => '2-3 Hari',
                'material' => 'Rubber & Foam Midsole',
                'icon' => 'Sun',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium Leather Care',
                'slug' => 'leather-care',
                'description' => 'Perawatan eksklusif untuk sepatu kulit: Deep conditioning, leather balm nourishing, serta waterproofing sealant.',
                'price' => 60000,
                'duration' => '2-3 Hari',
                'material' => 'Genuine & Sintetis Leather',
                'icon' => 'ShieldCheck',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        \Illuminate\Support\Facades\DB::table('services')->insert($services);
    }
}
