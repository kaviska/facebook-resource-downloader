"use client";
import { useEffect, useState } from "react";
import { client } from "../app/lib/sanity"; // Import the Sanity client
import HowToCard from "./HowToCard";
import FAQ from "./FAQ";

export default function ContainSection() {
  interface Step {
    title: string;
    description: string;
  }

  interface Data {
    visibility: {
      showHowToDownload: boolean;
      showSaveFromInsta: boolean;
      showFeatures: boolean;
      showFAQ: boolean;
      showWhyShouldUse: boolean;
    };
    howToDownloadHeader: string;
    howToDownloadSteps: Step[];
    saveFromInstaHeader: string;
    saveFromInstaContent: string;
    featuresHeader: string;
    features: Step[];
    faq: { question: string; answer: string }[];
    whyShouldUse: { title: string; description: string }[];
  }

  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function fetchData() {
      const query = `*[_type == "containSectionPhoto"][0]`;
      const result = await client.fetch(query);
      setData(result);
    }
    fetchData();
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center ">
        <div>
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-center mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );

  // Add default values for visibility
  const {
    visibility = {
      showHowToDownload: false,
      showSaveFromInsta: false,
      showFeatures: false,
      showFAQ: false,
      showWhyShouldUse: false,
    },
    howToDownloadHeader,
    howToDownloadSteps,
    saveFromInstaHeader,
    saveFromInstaContent,
    featuresHeader,
    features,
    faq,
    whyShouldUse,
  } = data;

  return (
    <div>
      {visibility.showHowToDownload && (
        <div className="container md:px-0 px-6 max-w-4xl py-6 mx-auto container-section">
          <h2 className="text-2xl font-semibold text-gray-800 lg:text-3xl mb-5 mt-8">
            {howToDownloadHeader}
          </h2>
          <div className="flex md:gap-9 gap-3 ">
            <div className="flex flex-col gap-8">
              {howToDownloadSteps.map((step, index) => (
                <HowToCard key={index} title={step.title} description={step.description} />
              ))}
            </div>
          </div>
        </div>
      )}

      {visibility.showSaveFromInsta && (
        <div className="container md:px-0 px-6 mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 lg:text-3xl mb-5 mt-8">
            {saveFromInstaHeader}
          </h2>
          <p>{saveFromInstaContent}</p>
        </div>
      )}

      {visibility.showFeatures && (
        <div className="container md:px-0 px-6 mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 lg:text-3xl mb-5 mt-12">
            {featuresHeader}
          </h2>
          <div className="flex md:gap-9 gap-3">
            <div className="flex flex-col gap-8">
              {features.map((feature, index) => (
                <HowToCard key={index} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </div>
      )}

      {visibility.showWhyShouldUse && (
        <div className="container md:px-0 px-6 mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 lg:text-3xl mb-5 mt-12">
            Why Should You Use This?
          </h2>
          <div className="flex md:gap-9 gap-3">
            <div className="flex flex-col gap-8">
              {whyShouldUse.map((item: { title: string; description: string }, index: number) => (
                <div key={index}>
                  <span className="text-14px font-medium">{item.title}: </span>
                  <span className="text-[14px]">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {visibility.showFAQ && (
        <div className="mt-12">
          <FAQ faq={faq} />
        </div>
      )}
    </div>
  );
}