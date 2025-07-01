"use client"; // Ensure it's a client component

import { useState } from "react";
import { usePathname } from "next/navigation";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";

export default function TopHero() {
    const pathname = usePathname(); // Get current path
    const [selectedLabel, setSelectedLabel] = useState(" Content ");

    const options = [
        { href: "/instagram-video-downloader", label: "Video", icon: <VideoLibraryIcon style={{ color: "white", fontSize: 18 }} /> },
        { href: "/instagram-photo-downloader", label: "Photo", icon: <InsertPhotoIcon style={{ color: "white", fontSize: 18 }} /> },
        { href: "/instagram-reel-downloader", label: "Reel", icon: <MovieCreationIcon style={{ color: "white", fontSize: 18 }} /> },
        { href: "/instagram-carousel-downloader", label: "Carousel", icon: <ViewCarouselIcon style={{ color: "white", fontSize: 18 }} /> }
    ];

    return (
        <div>
            <h1 className="md:text-[32px] text-[28px] text-white md:text-start text-center mt-8">
                Instagram {selectedLabel} Downloader
            </h1>
            <div className="flex css-glass px-3 py-3 rounded-[6px]">
            
            {options.map(({ href, label, icon }, index, array) => (
                <div
                    key={href}
                    onClick={() => setSelectedLabel(label)} // Update the selected label on click
                    className={`flex hover:opacity-80 cursor-pointer gap-2 justify-center items-center ${index !== array.length - 1 ? "border-r border-white" : ""} px-4 ${
                        pathname === href ? "opacity-80" : ""
                    }`}
                >
                    <span className={`text-[18px] ${pathname === href ? "font-bold text-white" : "text-white"}`}>{label}</span>
                    <div className={`hidden md:block ${pathname === href ? "font-bold" : ""}`}>{icon}</div>
                </div>
            ))}
        </div>
        </div>
       
    );
}