"use client"; // Ensure it's a client component

import { usePathname } from "next/navigation";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
// import MovieCreationIcon from "@mui/icons-material/MovieCreation";
// import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";


export default function TopHero() {
    const pathname = usePathname(); // Get current path

    return (
        <div className="flex   css-glass px-3 py-3 rounded-[6px]">
            {[
                { href: "/pinsert-video-downloader", label: "Video", icon: <VideoLibraryIcon style={{ color: "white", fontSize: 18 }} /> },
                { href: "/pinsert-photo-downloader", label: "Photo", icon: <InsertPhotoIcon style={{ color: "white", fontSize: 18 }} /> },
              
            ].map(({ href, label, icon }, index, array) => (
                <a key={href} href={href} className="w-full md:w-auto">
                    <div
                        className={`flex hover:opacity-80 cursor-pointer gap-2 justify-center items-center ${
                            index !== array.length - 1 ? "border-r border-white" : ""
                        } px-4 py-2 md:py-0 ${
                            pathname === href ? "opacity-80" : "" // Highlight active link
                        }`}
                    >
                        <span className={`text-[16px] md:text-[18px] md:block hidden ${pathname === href ? "font-bold text-white" : "text-white"}`}>{label}</span>
                        <div className={` ${pathname === href ? "font-bold" : ""}`}>{icon}</div>
                    </div>
                </a>
            ))}
        </div>
    );
}