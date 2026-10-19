<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    /**
     * Daftar status yang valid (harus sama dengan enum di tabel orders).
     */
    private const STATUSES = [
        'queued',
        'washing',
        'repaint',
        'ready_for_delivery',
        'completed',
        'cancelled',
    ];

    /**
     * GET /api/admin/orders
     * Query opsional: status, search, page
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('service')->latest();

        if ($request->filled('status') && in_array($request->input('status'), self::STATUSES, true)) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'LIKE', "%{$search}%")
                  ->orWhere('customer_name', 'LIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'LIKE', "%{$search}%");
            });
        }

        $paginator = $query->paginate(10);

        // Jumlah pesanan per status (untuk badge di tab filter)
        $counts = Order::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'success' => true,
            'data'    => $paginator->items(),
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
            'counts'  => $counts,
        ]);
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);
        $order->load('service');

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui',
            'data'    => $order,
        ]);
    }
}
