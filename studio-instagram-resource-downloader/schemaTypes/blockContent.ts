export default {
    name: 'blockContent',
    title: 'Block Content',
    type: 'array',
    of: [
        {
            type: 'block',
        },
        {
            type: 'image',
            fields: [
                {
                    name: 'caption',
                    title: 'Caption',
                    type: 'string',
                    options: { isHighlighted: true },
                },
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                },
            ],
        },
    ],
};