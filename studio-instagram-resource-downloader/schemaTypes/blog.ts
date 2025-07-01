export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'mainImage',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Set as featured blog. Only one blog can be featured at a time.',
    },
    {
      name:'download',
      title:' Show Download',
      type:'boolean',
      description:'Show Download Section'
    },
    {
      name: 'sidebar',
      title: 'Sidebar Availability',
      type: 'boolean',
      description: 'Set as sidebar Available or not.',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Add multiple tags for this blog post',
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'titleDescription',
      title: 'Title Description',
      type: 'text',
      description: 'A short description of the blog title (Max: 100 words)',
      validation: (Rule) =>
        Rule.required().custom((description) => {
          if (!description) return true // Allow empty but required later
          const wordCount = description.trim().split(/\s+/).length
          return wordCount <= 100 ? true : 'Title description must not exceed 100 words'
        }),
    },
    {
      name: 'catalog',
      title: 'Catalog',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Add multiple tags for this blog post',
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
            },
          ],
        },
      ],
      description: 'Add frequently asked questions for this blog post.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'mainImage',
    },
    prepare({title, type, media}) {
      return {
        title,
        subtitle: type,
        media,
      }
    },
  },
  __experimental_actions: ['create', 'update', 'delete', 'publish'],
  async beforeUpdate({patch, documentId, schemaType}) {
    if (schemaType === 'blog' && patch.set && patch.set.featured === true) {
      const client = require('part:@sanity/base/client').default
      const query = `*[_type == "blog" && featured == true && _id != $documentId]`
      const params = {documentId}
      const existingFeatured = await client.fetch(query, params)
      if (existingFeatured.length > 0) {
        throw new Error('Only one blog can be featured at a time.')
      }
    }
  },
}
