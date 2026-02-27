import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import NowPlaying from "@/components/NowPlaying";
import SongReactions from "@/components/SongReactions";
import CircleFeed from "@/components/CircleFeed";
import RoomCard from "@/components/RoomCard";
import CreateRoom from "@/components/CreateRoom";
import NowPlayingClient from "@/components/NowPlayingClient";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const rooms = await prisma.room.findMany({
    where: { isLive: true },
    include: {
      host: { select: { id: true, name: true, image: true } },
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-white text-2xl font-bold mb-8">
          Welcome back, {session.user?.name?.split(" ")[0]} 👋
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing + Reactions */}
            <NowPlayingWithReactions />

            {/* Active Rooms */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">
                  Live Listening Rooms
                </h2>
                <CreateRoom />
              </div>
              {rooms.length === 0 ? (
                <div className="card text-center py-10">
                  <p className="text-4xl mb-3">🎧</p>
                  <p className="text-white font-semibold">No active rooms</p>
                  <p className="text-[#B3B3B3] text-sm mt-1">
                    Create one to start listening together
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room as any} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <CircleFeed />
          </div>
        </div>
      </main>
    </div>
  );
}

// Client wrapper to connect NowPlaying → SongReactions
function NowPlayingWithReactions() {
  return <NowPlayingClient />;
}