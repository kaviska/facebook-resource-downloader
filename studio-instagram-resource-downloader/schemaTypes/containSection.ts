// filepath: c:\xampp\htdocs\lms\instragram-resource-downloader\studio-instagram-resource-downloader\schemaTypes\containSection.ts
export default {
  name: 'containSection',
  title: 'Home Page ',
  type: 'document',
  fields: [
    {
      name: 'howToDownloadHeader',
      title: 'Add Title For the Page',
      type: 'string',
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true, // Prevent manual editing
      hidden: true,   // Hide from the UI
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'A short description of the blog post (Max: 160 words)',
    
    },
    {
      name:'body',
      type:'blockContent',

    },

    // {
    //   name: 'howToDownloadSteps',
    //   title: 'How to Download Steps',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'object',
    //       fields: [
    //         { name: 'title', title: 'Step Title', type: 'string' },
    //         { name: 'description', title: 'Step Description', type: 'text' },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   name: 'saveFromInstaHeader',
    //   title: 'Save From Insta Header',
    //   type: 'string',
    // },
    // {
    //   name: 'saveFromInstaContent',
    //   title: 'Save From Insta Content',
    //   type: 'text',
    // },
    // {
    //   name: 'featuresHeader',
    //   title: 'Features Header',
    //   type: 'string',
    // },
   
    // {
    //   name: 'features',
    //   title: 'Features',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'object',
    //       fields: [
    //         { name: 'title', title: 'Feature Title', type: 'string' },
    //         { name: 'description', title: 'Feature Description', type: 'text' },
    //       ],
    //     },
    //   ],
    // },
    // {
    //     name: 'whyShouldUse',
    //     title: 'Why Should Use',
    //     type: 'array',
    //     of: [
    //       {
    //         type: 'object',
    //         fields: [
    //           { name: 'title', title: 'Why Should We Use Title', type: 'string' },
    //           { name: 'description', title: 'Why Should We Use Description', type: 'text' },
    //         ],
    //       },
    //     ],
    //   },
     {
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
          ],
        },
      ],
    },
    // {
    //   name: 'visibility',
    //   title: 'Visibility',
    //   type: 'object',
    //   fields: [
    //     { name: 'showHowToDownload', title: 'Show How to Download', type: 'boolean' },
    //     { name: 'showSaveFromInsta', title: 'Show Save From Insta', type: 'boolean' },
    //     { name: 'showFeatures', title: 'Show Features', type: 'boolean' },
    //     { name: 'showFAQ', title: 'Show FAQ', type: 'boolean' },
    //     { name: 'showWhyShouldUse', title: 'Show Why Should Use', type: 'boolean' },
    //   ],
    // },
  ],
};