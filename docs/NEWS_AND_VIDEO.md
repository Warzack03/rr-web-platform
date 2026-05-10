# News and video

## MVP decision

News are part of the new platform MVP. They are created in the new backoffice, not in WordPress.

WooCommerce remains in WordPress. WordPress is not the main CMS for the new public website.

## News fields

- `title`
- `slug`
- `excerpt`
- `body` using Markdown or a simple rich-text/editor-safe format
- `coverImageUrl`
- `status`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `publishedAt`
- `authorId`
- `featured`
- related teams optional
- external links optional
- external video URL optional

## Content rules

- Prefer Markdown/simple editor for MVP.
- Avoid arbitrary unsafe HTML.
- Sanitize rendered content.
- Hide unpublished news publicly.
- Published news should have SEO metadata.

## Videos

Videos are stored as external URLs, not uploaded files.

Supported use cases:

- News can include external video links.
- First-team played matches can include match video links.

Potential providers:

- YouTube
- Vimeo
- Instagram
- TikTok
- Google Drive public link
- Other public URL

Do not upload videos to Hostinger in MVP.

