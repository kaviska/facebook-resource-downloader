export default {
    name: 'mainImage',
    title: 'Main Image',
    type: 'image',
    options: {
        hotspot: true,
    },
    fields: [
        {
            name: 'caption',
            title: 'Caption',
            type: 'string',
        },
        {
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
        },
    ],
};