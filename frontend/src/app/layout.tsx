"use client";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Script from "next/script";
import { useEffect, useState } from "react";
import { client } from "@/app/lib/sanity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [metaData, setMetaData] = useState({
    title: "Instagram Downloader - Download Instagram Reels, Posts, Videos & Carousels",
    description:
      "Download Instagram photos, videos, reels, and stories with SaveFromInsta. Fast, free, and easy-to-use Instagram video downloader with HD quality and no watermarks. No sign-up required.",
  });

  useEffect(() => {
    async function fetchMetaData() {
      const pathParts = pathname.split("/").filter(Boolean);
      const language = pathParts[0]; // e.g., "pt", "en"
      const pageSlug = pathParts.slice(1).join("/");

      let query = "";
      let queryParams: Record<string, string> = { language };

      if (!pageSlug) {
        query = `*[_type == "containSection" && language == $language][0]{metaTitle, metaDescription}`;
      } else if (pageSlug === "instagram-video-downloader") {
        query = `*[_type == "containSectionVideo" && language == $language][0]{metaTitle, metaDescription}`;
      } else if (pageSlug === "instagram-photo-downloader") {
        query = `*[_type == "containSectionPhoto" && language == $language][0]{metaTitle, metaDescription}`;
      } else if (pageSlug === "instagram-reel-downloader") {
        query = `*[_type == "containSectionReel" && language == $language][0]{metaTitle, metaDescription}`;
      } else if (pageSlug === "instagram-carousel-downloader") {
        query = `*[_type == "containSectionCarousel" && language == $language][0]{metaTitle, metaDescription}`;
      } else if (pageSlug.startsWith("blog/")) {
        const slug = pageSlug.split("blog/")[1];
        query = `*[_type == "blog" && slug.current == $slug][0]{metaTitle, metaDescription, language}`;
        queryParams = { slug };
      }

      if (query) {
        try {
          const result = await client.fetch(query, queryParams);
          if (result) {
            setMetaData((prev) => ({
              title: result.metaTitle || prev.title,
              description: result.metaDescription || prev.description,
            }));
          }
        } catch (err) {
          console.error("Error fetching meta:", err);
        }
      }
    }

    fetchMetaData();
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="apple-touch-icon" href="/apple-touch-icon-iphone-60x60.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-ipad-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-iphone-retina-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-ipad-retina-152x152.png" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y7SQ80LMCJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y7SQ80LMCJ');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        <Footer />
      </body>
    </html>
  );
}
