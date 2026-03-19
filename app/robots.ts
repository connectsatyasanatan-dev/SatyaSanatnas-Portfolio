import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://satya-sanatan.com' // Replace with your actual domain
    
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/admin/', '/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
