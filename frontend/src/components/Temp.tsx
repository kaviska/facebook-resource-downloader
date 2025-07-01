"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import GetAppIcon from "@mui/icons-material/GetApp";

import CircularProgress from "@mui/material/CircularProgress";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import TempTopHero from '@/components/TempTopHero';

export default function Temp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [fetchedId, setFetchedId] = useState<string | null>(null); // Prevent duplicate API calls
  const [isReel, setIsReel] = useState<boolean>(false);
  const [multipleImages, setMultipleImages] = useState<{ url: string; isVideo: boolean; videoUrl?: string }[] | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pogress, setPogress] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  

  const [copiedText, setCopiedText] = useState(""); // Store copied text
  const [isPasted, setIsPasted] = useState(false); // Track if something is pasted
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Track button disabled state

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setCopiedText(text);
        setIsPasted(true); // Change button to "Clear"
        if (inputRef.current) {
          inputRef.current.value = text;
        }
      })
      .catch((err) => console.error("Failed to read clipboard:", err));
  };

  const handleClear = () => {
    console.log(copiedText);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setCopiedText("");
    setIsPasted(false); // Change button back to "Paste"
  };

  const dissableButton = () => {
    // Disable the button for 3 seconds
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  };

  const handleStreamDownload = async (videoUrl: string, filename: string) => {
    try {
      console.log(fetchedId);
      const response = await fetch(
        `https://api.savefrominsta.app/api/download-reel?url=${encodeURIComponent(
          videoUrl
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;
      downloadLink.click();
    } catch (error) {
      window.alert("Error downloading the Content. Please try again later.");
      console.error("Error downloading the video:", error);
    }
  };

  const sendData = () => {
    const data = inputRef.current?.value.trim();
    setIsPasted(true)
    if (!data) return;

    //check url is valid or not url should have www.instagram.com
    if (!data.includes("www.instagram.com")) {
      alert("Invalid URL. Please enter a valid Instagram URL.");
      return;
    }

    setVideoUrl(null);
    setThumbnail(null);
    setFetchedId(null); // Reset fetchedId to allow new fetch request
    setMultipleImages(null);
    setImageUrl(null);
    setPogress(true);
    setIsLoad(false);

    try {
      const parsedUrl = new URL(data);
      const parts = parsedUrl.pathname.split("/").filter(Boolean); // Remove empty strings
      for (let i = 0; i < parts.length; i++) {
        console.log("Parts:", parts[i]);
      }

      if (
        parts.length < 2 ||
        (parts[0] !== "p" &&
          parts[0] !== "reel" &&
          parts[1] !== "p" &&
          parts[1] !== "reel")
      ) {
        alert("Invalid URL. Please enter a valid Instagram URL.");
        return;
      }

      const newId =
        parts[0] === "p" || parts[0] === "reel" ? parts[1] : parts[2]; // Extract shortcode
      setIsReel(parts[0] === "reel" || parts[1] === "reel");
      setId(newId);
    } catch (error) {
      console.error("Invalid URL", error);
      alert("Invalid URL. Please enter a valid Instagram URL.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Prevent unnecessary API calls

      console.log("ID", id);
      console.log("Is Reel", isReel);

      const url = isReel
        ? `https://instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com/reel_by_shortcode?shortcode=${id}`
        : `https://instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com/post_by_shortcode?shortcode=${id}`;

      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "3b718006b9msh2d5d11044458229p18a7aejsn27634b6c412a",
          "x-rapidapi-host":
            "instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log("API Result:", result);
        setId(null); // Reset ID after successful fetch
        setPogress(false);

        if (isReel) {
          setThumbnail(
            result.image_versions2?.additional_candidates?.first_frame?.url ||
              null
          );
         
          setVideoUrl(result.video_versions?.[0]?.url || null);
          console.log("Video Url"+videoUrl);
        } 
        if(result.has_audio !== undefined && result.has_audio === true){
          setThumbnail(
            result.image_versions2?.additional_candidates?.first_frame?.url ||
              null
          );
          setVideoUrl(result.video_versions?.[0]?.url || null);
          setIsReel(true)
          console.log("Video Url"+videoUrl);
        }
        else {
          console.log("Its a post");
          if (result.carousel_media) {
            for (let i = 0; i < result.carousel_media.length; i++) {
              console.log(
                "Carousel Media:",
                result.carousel_media[i].image_versions2.candidates[0].url
              );
              if (result.carousel_media[i].video_versions) {
                setMultipleImages((prevImages) => [
                  ...(prevImages || []),
                  {
                    url: result.carousel_media[i].image_versions2.candidates[0].url,
                    isVideo: true,
                    videoUrl: result.carousel_media[i].video_versions[0].url,
                  },
                ]);
              } else {
                setMultipleImages((prevImages) => [
                  ...(prevImages || []),
                  {
                    url: result.carousel_media[i].image_versions2.candidates[0].url,
                    isVideo: false,
                  },
                ]);
              }
            }
          } else {
            console.log(
              "Single Image:",
              result.image_versions2?.candidates[0]?.url
            );
            setImageUrl(result.image_versions2?.candidates[0]?.url || null);
          }
        }

        setFetchedId(id); // Update fetchedId only after successful fetch
      } catch (error) {
        console.error("API Fetch Error:", error);
        alert("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, [id, isReel]);

  return (
    <div>
      <div className="bg-[#DA08C9] flex flex-col justify-center items-center px-5 py-16 ">
        <TempTopHero />

      

        <div className="flex md:flex-row flex-col md:gap-3 gap-5 mt-4">
          <div className="flex items-center border mt-4 h-12 md:pr-1 pr-1  md:py-2 text-black bg-white rounded-[10px] overflow-hidden md:w-[700px] w-[340px]">
            <input
              ref={inputRef}
              className="outline-none flex-1 h-12 px-3 py-2 "
              placeholder="Paste Instagram link here"
            />

            <button
              className="bg-[#AEAEAE] md:px-6 px-2  md:text-[18px] text-[15px] flex gap-3 items-center justify-center text-white py-2 rounded-[10px]"
              onClick={isPasted ? handleClear : handlePaste} // Toggle function
            >
              {isPasted ? (
                <>
                  <ClearIcon style={{ color: "white", fontSize: "18px" }} />
                  <span>Clear</span>
                </>
              ) : (
                <>
                  <ContentPasteIcon
                    style={{ color: "white", fontSize: "18px" }}
                  />
                  <span>Paste</span>
                </>
              )}
            </button>
          </div>

          <button
            className={`h-12 px-6 text-[18px] mt-4 flex gap-3 items-center justify-center py-2 rounded-[10px] ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
            onClick={() => {
              sendData();
              dissableButton();
            }}
            disabled={isButtonDisabled} // Disable button based on state
          >
            <GetAppIcon style={{ color: "white", fontSize: "24px" }} />
            <span>Download</span>
            {pogress && <CircularProgress color="inherit" size={18} />}
          </button>
        </div>
      </div>









      <div className='container md:max-w-7xl max-w-4xl px-6 py-10 mx-auto'>
      {videoUrl && (
        <div className="mt-12 flex justify-center">
          <div className="flex flex-col   items-center shadow-sm pb-4">
            {thumbnail && (
                <div className="relative">
               {isLoad === false && (
                  <div>
                    <div
                      role="status"
                      className="flex w-[300px] h-[375px] object-cover   bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                    >
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  width={300}
                  height={375}
                  className="min-h-[300px] min-w-[375px] max-w-[320px] object-cover max-h-[400px] "
                  onLoad={() => setIsLoad(true)}
                />
                <MovieCreationIcon
                  style={{
                  color: "white",
                  fontSize: 24,
                  position: "absolute",
                  top: 10,
                  right: 10,
                  }}
                />
                </div>
            )}

            <a
              href={`https://api.savefrominsta.app/api/download-reel?url=${encodeURIComponent(
                videoUrl
              )}`}
              download="video.mp4"
              className="bg-blue-500 px-3 text-white py-[10px] rounded-[10px] my-4 justify-self-center inline-block"
            >
              Download Video
            </a>
          </div>
        </div>
      )}

      {multipleImages && (
        <div className="mt-12 flex gap-x-3 gap-y-12 flex-wrap justify-center">
          {multipleImages.map((image, index) => (
            <div key={index} className="flex flex-col items-center pb-4">
              <div className="relative  shadow-sm ">
                {isLoad === false && (
                  <div>
                    <div
                      role="status"
                      className="flex w-[300px] h-[375px] object-cover   bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                    >
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                <Image
                  src={image.url}
                  alt="image"
                  width={300}
                  height={375}
                  className="w-[300px] h-[375px] object-cover"
                  onLoad={() => setIsLoad(true)}
                />
                <ViewCarouselIcon
                  style={{
                    color: "white",
                    fontSize: 24,
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                />
              </div>
             

                <button
                onClick={() => {
                  if (image.isVideo && image.videoUrl) {
                  handleStreamDownload(image.videoUrl, "video.mp4");
                  } else {
                  handleStreamDownload(image.url, "picture.jpg");
                  }
                  dissableButton();
                }}
                className={`bg-blue-500 text-white px-3 py-[10px] rounded-[10px] mt-4 inline-block ${
                  isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
                }`}
                disabled={isButtonDisabled}
                >
                {image.isVideo ? "Download Video" : "Download Image"}
                </button>
            </div>
          ))}
          <hr />
        </div>
      )}

      {imageUrl && (
        <div className="mt-12 justify-center">
          <div className="flex flex-col items-center  pb-4">
            <div className="relative bg-slate-500">
            {isLoad === false && (
                  <div>
                    <div
                      role="status"
                      className="flex w-[300px] h-[375px] object-cover   bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                    >
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              <Image
                src={imageUrl}
                alt="image"
               
                className="w-[300px] h-[375px] object-cover "
                onLoad={() => setIsLoad(true)}
              />
              <InsertPhotoIcon
                style={{
                  color: "white",
                  fontSize: 24,
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              />
            </div>
            <div className="shadow-sm w-[300px] flex justify-center ">
            <button
              onClick={() => {
                handleStreamDownload(imageUrl, "picture.jpg");
                dissableButton();
              }}
              className={`bg-blue-500 text-white px-3 py-[10px] rounded-[10px] my-4 inline-block ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              disabled={isButtonDisabled}
            >
              Download Image
            </button>
            </div>

            
          </div>
        </div>
      )}

      </div>

     





















     
    </div>
  );
}
