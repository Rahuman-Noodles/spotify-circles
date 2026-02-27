"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        const room = await res.json();
        setOpen(false);
        setName("");
        router.push(`/room/${room.id}`);
        router.refresh();
      } else {
        setError("Failed to create room. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setError("");
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-green text-sm">
        + Create Room
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="bg-[#282828] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-bold text-xl">
                Create a Listening Room
              </h3>
              <button
                onClick={handleClose}
                className="text-[#B3B3B3] hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-[#B3B3B3] text-sm mb-6">
              Invite your circle to listen together in real-time
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                abel className="text-[#B3B3B3] text-sm mb-2 block">
                  Room Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Friday Night Vibes"
                  maxLength={50}
                  autoFocus
                  className="w-full bg-[#383838] text-white placeholder-[#535353] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1DB954]"
                />
                <p className="text-[#535353] text-xs mt-1 text-right">
                  {name.length}/50
                </p>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-outline flex-1 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="btn-green flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
