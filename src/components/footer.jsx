import React from "react";

export function Footer() {
  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground max-w-7xl">
        <p>© 2026 Pocket AI. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-green-600 transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
