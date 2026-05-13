"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { cn } from "@/lib/utils";

export default function AnalyticsFilters({ accounts }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState(searchParams.get("range") || "this-month");
  const [startDate, setStartDate] = useState(
    searchParams.get("from") ? new Date(searchParams.get("from")) : startOfMonth(new Date())
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("to") ? new Date(searchParams.get("to")) : endOfMonth(new Date())
  );
  const [accountId, setAccountId] = useState(searchParams.get("account") || "all");

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`);
  };

  const handleRangeChange = (range) => {
    setDateRange(range);
    let from, to = endOfMonth(new Date());

    switch (range) {
      case "this-month":
        from = startOfMonth(new Date());
        break;
      case "last-3-months":
        from = startOfMonth(subMonths(new Date(), 2));
        break;
      case "last-6-months":
        from = startOfMonth(subMonths(new Date(), 5));
        break;
      case "this-year":
        from = startOfYear(new Date());
        break;
      case "custom":
        return; // Don't update yet
      default:
        from = startOfMonth(new Date());
    }

    setStartDate(from);
    setEndDate(to);
    updateFilters({
      range,
      from: from.toISOString(),
      to: to.toISOString(),
    });
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b py-4 -mx-4 px-4 mb-8">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select value={dateRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dateRange === "custom" && (
          <div className="flex gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      updateFilters({ from: date.toISOString() });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      updateFilters({ to: date.toISOString() });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select 
            value={accountId} 
            onValueChange={(val) => {
              setAccountId(val);
              updateFilters({ account: val });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
