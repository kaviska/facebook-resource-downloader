"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import GetAppIcon from "@mui/icons-material/GetApp";
import CircularProgress from "@mui/material/CircularProgress";
import TopHero from "@/components/TopHero";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
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
        message: "Please enter a valid  URL",
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
                ? "bg-blue-500 text-white cursor-not-allowed"
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
          <div>
            <div className="flex justify-end mb-3">
              <button
              className="px-3 py-2 rounded-[8px] text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              onClick={clearPreview}
              >
              Download Another Content
              </button>
            </div>
             <div className="flex gap-3 mb-6 justify-end">
                  <button
                    className="px-3 py-2 rounded-[8px] text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
                    onClick={() => {
                      // Download as Zip logic
                      const links = apiData.medias.map((media: any) => media.url);
                      const form = document.createElement('form');
                      form.method = 'POST';
                      form.action = 'https://api.savefrominsta.app/api/download-zip';
                      form.style.display = 'none';
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = 'links';
                      input.value = JSON.stringify(links);
                      form.appendChild(input);
                      document.body.appendChild(form);
                      form.submit();
                      document.body.removeChild(form);
                    }}
                  >
                    Download AS Zip
                  </button>
                </div>
            {/* If multiple images, show grid like MainTemp */}
            {apiData.medias && apiData.medias.length > 1 ? (
              <>
                {apiData.title && (
                  <p className="text-gray-700 mb-6 text-base font-semibold text-center">{apiData.title}</p>
                )}
               
                <div className="mt-6 flex gap-x-3 gap-y-12 flex-wrap justify-center">
                  {apiData.medias.map((media: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center shadow-lg rounded-lg bg-white overflow-hidden pb-4"
                    >
                      <div className="relative">
                        <Image
                          src={
                            media.type === 'image'
                              ? media.url
                              : media.type === 'video'
                              ? media.thumbnail || apiData.thumbnail || '/no-image.png'
                              : apiData.thumbnail || '/no-image.png'
                          }
                          height={375}
                          width={300}
                          alt="hw"
                          className="w-[300px] h-[375px] object-cover"
                        />
                        {media.type === 'video' ? (
                          <MovieCreationIcon
                            style={{
                              color: "white",
                              fontSize: 24,
                              position: "absolute",
                              top: 10,
                              right: 10,
                            }}
                          />
                        ) : (
                          <InsertPhotoIcon
                            style={{
                              color: "white",
                              fontSize: 24,
                              position: "absolute",
                              top: 10,
                              right: 10,
                            }}
                          />
                        )}
                      </div>
                      {/* Card Footer */}
                      <div className="py-4 px-0 max-w-[300px] text-[16] w-full">
                        <p className="text-gray-700 mb-2 text-sm text-center">{media.quality}</p>
                        <button
                          onClick={() => handleDownload(
                            media.url,
                            `${apiData.source || 'facebook'}_${media.quality || 'media'}.${media.extension || 'jpg'}`,
                            media.quality || ''
                          )}
                          disabled={isDownloading}
                          className={`bg-blue-500 f text-white px-3 py-[10px] rounded-[10px] mt-2 flex justify-center w-full ${
                            isDownloading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-600"
                          }`}
                        >
                          {isDownloading ? (
                            <span className="flex items-center gap-2"><CircularProgress size={16} color="inherit" /> Downloading...</span>
                          ) : (
                            <span className="flex items-center gap-2"><GetAppIcon style={{ fontSize: 18 }} /> Download</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center shadow-lg rounded-lg bg-white overflow-hidden pb-4 max-w-[500px] w-full">
                  <div className="relative w-full flex flex-col items-center">
                    <Image
                      src={
                        apiData.thumbnail
                          ? apiData.thumbnail
                          : (apiData.medias && apiData.medias.length > 0 && apiData.medias[0].type === "image")
                          ? apiData.medias[0].url
                          : "/no-image.png"
                      }
                      alt={apiData.title || "Preview"}
                      width={300}
                      height={375}
                      className="min-h-[300px] min-w-[375px] max-w-[320px] object-cover max-h-[400px]"
                    />
                    {apiData.medias && apiData.medias.some((media: any) => media.type === 'video') ? (
                      <MovieCreationIcon
                        style={{
                          color: "white",
                          fontSize: 24,
                          position: "absolute",
                          top: 10,
                          right: 10,
                        }}
                      />
                    ) : (
                      <InsertPhotoIcon
                        style={{
                          color: "white",
                          fontSize: 24,
                          position: "absolute",
                          top: 10,
                          right: 10,
                        }}
                      />
                    )}
                  </div>
                  {/* Card Footer */}
                  <div className="py-4 px-0 max-w-[300px] text-[16] w-full">
                    {apiData.title && (
                      <p className="text-gray-700 mb-3 text-base font-semibold text-center">{apiData.title}</p>
                    )}
                    {apiData.description && (
                      <p className="text-gray-700 mb-3 text-sm text-center">{apiData.description}</p>
                    )}
                    <div className="flex justify-between gap-4 text-gray-600 text-sm mb-2">
                      {apiData.author && (
                        <span>
                          <strong>By:</strong> {apiData.author}
                        </span>
                      )}
                      {apiData.duration && (
                        <span>
                          <strong>Duration:</strong> {formatDuration(apiData.duration)}
                        </span>
                      )}
                    </div>
                    {/* Download Buttons for each media */}
                    <div className="flex flex-col gap-3 mt-4">
                      {apiData.medias && apiData.medias.map((media: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleDownload(
                            media.url,
                            `${apiData.source || 'facebook'}_${media.quality || 'media'}.${media.extension || 'mp4'}`,
                            media.quality || ''
                          )}
                          disabled={isDownloading}
                          className={`bg-blue-500 text-white px-3 py-[10px] rounded-[10px] inline-block w-full ${
                            isDownloading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-600"
                          }`}
                        >
                          {isDownloading ? (
                            <span className="flex items-center gap-2"><CircularProgress size={16} color="inherit" /> Downloading...</span>
                          ) : (
                            <span className="flex items-center gap-2"><GetAppIcon style={{ fontSize: 18 }} /> Download {media.quality ? media.quality : ''} {media.type ? media.type.charAt(0).toUpperCase() + media.type.slice(1) : ''}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
