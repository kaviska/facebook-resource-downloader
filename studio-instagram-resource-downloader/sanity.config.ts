import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization' // Import the plugin
import autoTranslateAction from './document-actions/autoTranslateAction' // Import the auto-translate action

export default defineConfig({
  name: 'default',
  title: 'Instagram Resource Downloader',

  projectId: 'kb9gxr4f',
  dataset: 'production',

  plugins: [structureTool(), visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'es', title: 'Spanish'},
        {id: 'zh', title: 'Chinese'},
        {id: 'hi', title: 'Hindi'},
        {id: 'ar', title: 'Arabic'},
        {id: 'pt', title: 'Portuguese'},
        {id: 'bn', title: 'Bengali'},
        {id: 'ru', title: 'Russian'},
        {id: 'ja', title: 'Japanese'},
        {id: 'de', title: 'German'},
        {id: 'ko', title: 'Korean'},
        {id: 'fr', title: 'French'},
        {id: 'tr', title: 'Turkish'},
        {id: 'it', title: 'Italian'},
        {id: 'vi', title: 'Vietnamese'},
        {id: 'pl', title: 'Polish'},
        {id: 'uk', title: 'Ukrainian'},
        {id: 'nl', title: 'Dutch'},
        {id: 'th', title: 'Thai'},
        {id: 'si', title: 'Sinhala'}, // Sinhala added
      ],
      schemaTypes: [
        'containSection',
        'containSectionReel',
        'containSectionVideo',
        'containSectionPhoto',
        'containSectionCarousel',
     
      ],
    }),
  ],

  

  // document: {
  //   actions: (prev) => [
  //     ...prev,
  //     autoTranslateAction,
  //   ],
  // },

  schema: {
    types: schemaTypes,
  },
})
