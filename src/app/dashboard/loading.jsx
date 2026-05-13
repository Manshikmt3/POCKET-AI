import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-10">
        <Skeleton className="h-16 w-64" />
      </div>

      <div className="mb-10">
        <Card className="rounded-2xl border-gray-100 h-32">
          <CardHeader className="pb-2">
             <Skeleton className="h-4 w-48" />
             <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
             <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <Card className="h-[400px]">
           <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
           <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
        <Card className="h-[400px]">
           <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
           <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-[200px]">
             <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
             <CardContent><Skeleton className="h-12 w-24" /></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
