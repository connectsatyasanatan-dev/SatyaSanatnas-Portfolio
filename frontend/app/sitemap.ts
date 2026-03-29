import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://satya-sanatan.com' // Replace with your actual domain

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // If you had separate pages for projects, blog, etc., you would add them here:
        // {
        //     url: `${baseUrl}/projects`,
        //     lastModified: new Date(),
        //     changeFrequency: 'monthly',
        //     priority: 0.8,
        // }
    ]
}
