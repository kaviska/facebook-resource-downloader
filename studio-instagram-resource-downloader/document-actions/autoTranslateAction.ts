import { DocumentActionComponent } from 'sanity'
import { useClient } from 'sanity'

const AutoTranslateAction: DocumentActionComponent = ({ id, type, published, draft }) => {
  const client = useClient()

  // Check if the document is already published and is not in Spanish
  if (!published || !published.language || published.language === 'es') return null

  return {
    label: 'Auto Translate',
    onHandle: async () => {
      const original = await client.fetch(`*[_id == $id][0]`, { id })
      console.log("oraginal content"+ original.metaDescription)

      // Call the backend API for translation
      const translated = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: original.metaDescription,
          targetLanguage: 'es', // Target language (Spanish)
        }),
      }).then(res => res.json())

      // Create the translated document
      const translatedDoc = {
        _type: type,
        title: translated.translation,
        slug: {
          _type: 'slug',
          current: original.slug.current + '-es',
        },
        content: translated.translation,
        language: 'es',
      }

      // Save the translated document in Sanity
      await client.create(translatedDoc)
      alert('Spanish translation created!')
    },
  }
}

export default AutoTranslateAction
