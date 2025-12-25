"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function BillingCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        if (reference) {
            // Redirect to billing page with reference for verification
            router.replace(`/dashboard/billing?reference=${reference}`);
        } else {
            router.replace('/dashboard/billing');
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600">Processing payment...</p>
            </div>
        </div>
    );
}
