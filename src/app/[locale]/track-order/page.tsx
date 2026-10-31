import { Suspense } from "react";
import { TrackOrderClient } from "@/components/track-order-client";
export default function TrackOrderPage() {
    return (<Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16"/>}>
      <TrackOrderClient />
    </Suspense>);
}
