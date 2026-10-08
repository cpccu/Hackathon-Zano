"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scanner.render(
      async (text) => {
        scanner.pause(true);
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: text }),
        });
        setResult(await res.json());
        setTimeout(() => scanner.resume(), 2500);
      },
      () => {}
    );
    return () => { scanner.clear().catch(() => {}); };
  }, []);

  const msg = {
    ok: ["bg-green-100 text-green-800", "Checked in"],
    already: ["bg-yellow-100 text-yellow-800", "Already checked in"],
    invalid: ["bg-red-100 text-red-800", "Invalid QR"],
    forbidden: ["bg-red-100 text-red-800", "Admins only"],
  };

  return (
    <div>
      <div id="reader" />
      {result && (
        <div className={`mt-4 p-3 rounded ${msg[result.status][0]}`}>
          <b>{msg[result.status][1]}</b>
          {result.name && <p>{result.name}, {result.event}</p>}
        </div>
      )}
    </div>
  );
}