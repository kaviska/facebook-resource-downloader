import blog from "./blog";
import author from "./author";
import mainImage from "./mainImage";
import category from "./category";
import blockContent from "./blockContent";
import containSection from "./containSection"; // Import the new schema
import containSectionReel from "./containSectionReel"; // Import the new schema for the reel page
import containSectionVideo from "./containSectionVideo";
import containSectionPhoto from "./containSectionPhoto"; // Import the new schema for the photo page
import containSectionCarousel from "./containSectionCarousel"; // Import the new schema for the carousel page
import containSectionProfilePic from "./containSectionProfilePic";
import containSectionActiveStory from "./containSectionActiveStory";
import containSectionStory from "./containSectionStory";
import test from "./test"; // Import the new schema for the test page`

export const schemaTypes = [
    blog,
    author,
    mainImage,
    category,
    blockContent,
    containSection, // Add this line
    // Add other schemas here as needed
    // containSectionReel, // Add this line for the reel page
    // containSectionVideo,
    // containSectionPhoto,
    // containSectionCarousel,
    // test
   // containSectionStory
    

];
