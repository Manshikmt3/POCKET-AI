"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scanReceipt } from "@/actions/gemini";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsScanning(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        const res = await scanReceipt(base64Image);
        
        if (res.success) {
          onScanComplete(res.data);
        } else {
          alert(res.error);
        }
        setIsScanning(false);
      };
    } catch (error) {
      console.error(error);
      setIsScanning(false);
      alert("Failed to read the file.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Scanning Receipt...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-5 w-5" />
            Scan Receipt with AI
          </>
        )}
      </Button>

    </div>
  );
}
