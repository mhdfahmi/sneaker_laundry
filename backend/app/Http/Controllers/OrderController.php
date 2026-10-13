<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * POST /api/orders
     * Membuat pesanan cuci sepatu baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name'  => 'required|string|max:255',
            'customer_phone' => 'required|string|max:30',
            'customer_email' => 'nullable|email|max:255',
            'service_id'     => 'required|exists:services,id',
            'shoe_brand'     => 'nullable|string|max:100',
            'shoe_model'     => 'nullable|string|max:100',
            'shoe_color'     => 'nullable|string|max:100',
            'shoe_size'      => 'nullable|string|max:20',
            'shoe_details'   => 'nullable|string',
            'notes'          => 'nullable|string',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        // Generate unique Order Code: SL-YYYYMMDD-XXXX
        $dateCode = now()->format('Ymd');
        $randomSuffix = Str::upper(Str::random(4));
        $orderCode = "SL-{$dateCode}-{$randomSuffix}";

        // Estimate ready date (default +2 days)
        $estimatedReadyAt = now()->addDays(2);

        $order = Order::create([
            'order_code'         => $orderCode,
            'customer_name'      => $validated['customer_name'],
            'customer_phone'     => $validated['customer_phone'],
            'customer_email'     => $validated['customer_email'] ?? null,
            'service_id'         => $service->id,
            'shoe_brand'         => $validated['shoe_brand'] ?? null,
            'shoe_model'         => $validated['shoe_model'] ?? null,
            'shoe_color'         => $validated['shoe_color'] ?? null,
            'shoe_size'          => $validated['shoe_size'] ?? null,
            'shoe_details'       => $validated['shoe_details'] ?? null,
            'notes'              => $validated['notes'] ?? null,
            'total_price'        => $service->price,
            'status'             => 'queued',
            'estimated_ready_at' => $estimatedReadyAt,
        ]);

        $order->load('service');

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat dengan kode ' . $orderCode,
            'data'    => $order,
        ], 201);
    }

    /**
     * GET /api/orders/{identifier}
     * Melacak pesanan berdasarkan Kode Pesanan atau ID atau Nomor HP.
     */
    public function show(Request $request, string $identifier): JsonResponse
    {
        $query = Order::with('service');

        // Cari berdasarkan order_code (case-insensitive) atau id
        $order = $query->where(function ($q) use ($identifier) {
            $q->where('order_code', 'LIKE', $identifier)
              ->orWhere('id', $identifier)
              ->orWhere('customer_phone', $identifier);
        })->latest()->first();

        // Jika ada filter phone tambahan
        if ($order && $request->filled('phone')) {
            $cleanedInputPhone = preg_replace('/[^0-9]/', '', $request->input('phone'));
            $cleanedOrderPhone = preg_replace('/[^0-9]/', '', $order->customer_phone);

            if (!str_ends_with($cleanedOrderPhone, substr($cleanedInputPhone, -8))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nomor HP tidak cocok dengan data pesanan.',
                ], 403);
            }
        }

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "Pesanan dengan kode/nomor '{$identifier}' tidak ditemukan. Pastikan kode pesanan Anda benar.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data pesanan berhasil ditemukan',
            'data'    => $order,
        ]);
    }
}
