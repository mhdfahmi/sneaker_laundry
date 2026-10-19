<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Membuat akun admin. Aman dijalankan berkali-kali.
     * Segera ganti password ini kalau web dipakai sungguhan.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'     => 'Admin shoeVive',
                'password' => 'admin12345',
            ]
        );
    }
}
