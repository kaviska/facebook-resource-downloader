"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import GetAppIcon from "@mui/icons-material/GetApp";
import CircularProgress from "@mui/material/CircularProgress";
import TopHero from "@/components/TopHero";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import Toast from "@/components/Toast";

type ToastState = {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
};

export default function Main() {
  const [url, setUrl] = useState<string>("");
  const [pogress, setPogress] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    type: "info"
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    console.log("Input changed:", value);
  };

  // Handle paste functionality
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      console.log("Pasted content:", text);
   
    } catch (error) {
      console.error("Failed to paste:", error);
      setToast({
        open: true,
        message: "Failed to paste content",
        type: "error"
      });
    }
  };

  // Handle clear functionality
  const handleClear = () => {
    setUrl("");
    setApiData(null); // Clear API data
    console.log("Input cleared");
    
  };

  // Send data function
  const sendData = async () => {
    if (!url.trim()) {
      setToast({
        open: true,
        message: "Please enter a valid Instagram URL",
        type: "warning"
      });
      return;
    }

    if (!url.includes("facebook.com")) {
      setToast({
        open: true,
        message: "Please enter a valid Facebook URL",
        type: "warning"
      });
      return;
    }

    setPogress(true);
    console.log("Sending data:", url);
    
    const apiUrl = 'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '3b718006b9msh2d5d11044458229p18a7aejsn27634b6c412a',
        'x-rapidapi-host': 'auto-download-all-in-one.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url.trim()
      })
    };

    try {
      console.log("Making API request to:", apiUrl);
      console.log("Request options:", options);
      
      const response = await fetch(apiUrl, options);
      
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API Response:", result);
      
      if (result && !result.error) {
        setApiData(result); // Store the API response data
        setToast({
          open: true,
          message: "Content fetched successfully!",
          type: "success"
        });
        
        // Scroll to preview section
        setTimeout(() => {
          previewRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        throw new Error(result.message || "Failed to fetch content");
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      
      let errorMessage = "Failed to fetch content";
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = "Content not found. Please check the URL";
        } else if (error.message.includes('403')) {
          errorMessage = "Access denied. Please try again later";
        } else if (error.message.includes('429')) {
          errorMessage = "Too many requests. Please wait and try again";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error. Please try again later";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      setToast({
        open: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setPogress(false);
    }
  };

  // Download functionality
  const handleDownload = async (downloadUrl: string, filename: string, quality: string) => {
    setIsDownloading(true);
    try {
      // Send GET request with url as a query parameter
      const apiUrl = `https://api.savefrominsta.app/api/download-reel?url=${encodeURIComponent(downloadUrl)}&originalUrl=${encodeURIComponent(url)}&quality=${encodeURIComponent(quality)}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;
      downloadLink.click();
      //URL.revokeObjectURL(downloadLink.href);

      setToast({
        open: true,
        message: `${quality} version downloaded successfully!`,
        type: "success"
      });

    } catch (error) {
      console.error('Download error:', error);
      setToast({
        open: true,
        message: "Download failed. Please try again later.",
        type: "error"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Clear preview data
  const clearPreview = () => {
    setApiData(null);
    setUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Disable button logic
  const dissableButton = () => {
    // This function can be used for additional button disable logic if needed
    console.log("Button clicked");
  };

  // Check if button should be disabled
  const isButtonDisabled = !url.trim() || pogress;

  return (
    <div>
      <div className="bg-[#DA08C9] flex flex-col justify-center items-center px-5 py-16 ">
        <TopHero />

        <h1 className="md:text-[32px] text-[28px] text-white  md:text-start text-center mt-8 ">
        FaceBook Content Downloader
        </h1>

        <div className="flex md:flex-row flex-col md:gap-3 gap-5 mt-4">
          <div className="flex items-center border mt-4 h-12 md:pr-1 pr-1  md:py-2 text-black bg-white rounded-[10px] overflow-hidden md:w-[700px] w-[340px]">
            <input
              value={url}
              onChange={handleInputChange}
              className="outline-none flex-1 h-12 px-3 py-2 "
              placeholder="Paste Instagram link here"
            />

            <button
              className="bg-[#AEAEAE] md:px-6 px-2  md:text-[18px] text-[15px] flex gap-3 items-center justify-center text-white py-2 rounded-[10px]"
              onClick={url.trim() ? handleClear : handlePaste}
            >
              {url.trim() ? (
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
            disabled={isButtonDisabled}
          >
            <GetAppIcon style={{ color: "white", fontSize: "24px" }} />
            <span>Download</span>
            {pogress && <CircularProgress color="inherit" size={18} />}
          </button>
        </div>
      </div>

      <div
        ref={previewRef}
        className="container md:max-w-7xl max-w-4xl px-6 py-10 mx-auto"
      >
        {apiData && (
          <div className="space-y-6">
            {/* Header with clear button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Content Preview</h2>
              <button
                onClick={clearPreview}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Download Another Content
              </button>
            </div>

            {/* Main Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-[500px] mx-auto ">
              {/* Header Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {apiData.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {apiData.source.charAt(0).toUpperCase() + apiData.source.slice(1)}
                      </span>
                      <span>By {apiData.author}</span>
                      {apiData.duration && (
                        <span>Duration: {formatDuration(apiData.duration)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Preview */}
                <div className="relative ">
                <Image
                  src={
                  apiData.thumbnail
                    ? apiData.thumbnail
                    : (apiData.medias && apiData.medias.length > 0 && apiData.medias[0].type === "image")
                    ? apiData.medias[0].url
                    : "/no-image.png"
                  }
                  alt={apiData.title}
                  width={800}
                  height={450}
                  className="w-full max-h-96 object-fit"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                  {apiData.medias.some((media: any) => media.type === 'video') ? (
                    <MovieCreationIcon className="text-blue-600" style={{ fontSize: 32 }} />
                  ) : (
                    <InsertPhotoIcon className="text-blue-600" style={{ fontSize: 32 }} />
                  )}
                  </div>
                </div>
                </div>

              {/* Download Options */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Download Options</h4>
                <div className="grid gap-3">
                  {apiData.medias.map((media: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          media.type === 'video' ? 'bg-blue-100 text-blue-600' : 
                          media.type === 'audio' ? 'bg-green-100 text-green-600' : 
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {media.type === 'video' ? (
                            <MovieCreationIcon style={{ fontSize: 20 }} />
                          ) : media.type === 'audio' ? (
                            <span className="text-sm font-bold">♪</span>
                          ) : (
                            <InsertPhotoIcon style={{ fontSize: 20 }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {media.quality} Quality
                          </p>
                          <p className="text-sm text-gray-500">
                            {media.type.charAt(0).toUpperCase() + media.type.slice(1)} • {media.extension.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(
                          media.url, 
                          `${apiData.source}_${media.quality}.${media.extension}`,
                          media.quality
                        )}
                        disabled={isDownloading}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isDownloading 
                            ? 'bg-blue-300 text-white cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isDownloading ? (
                          <div className="flex items-center gap-2">
                            <CircularProgress size={16} color="inherit" />
                            <span>Downloading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <GetAppIcon style={{ fontSize: 18 }} />
                            <span>Download</span>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">ℹ</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-1">Download Information</p>
                      <p className="text-sm text-blue-700">
                        Choose your preferred quality and format. Higher quality files will be larger in size.
                        {apiData.medias.length > 1 && " Multiple formats are available for this content."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>

    
  );
}
