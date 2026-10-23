# LinkedIn Profile Card JS

A lightweight, customizable and **unofficial** LinkedIn profile link card for your website. No LinkedIn API, authentication, scraping, third-party JavaScript or dependencies required.

![Sample profile cards with geometric, white, transparent, solid-color and SVG backgrounds](https://raw.githubusercontent.com/pleger/linkedin-profile-card-js/main/assets/demo-1440.png)

## Features

- One self-contained JavaScript file containing the layout, CSS and default geometric SVG background
- Geometric, white, transparent, solid-color and custom SVG backgrounds
- Configurable name, title, affiliation, avatar, colors, padding, width and fonts
- Responsive, keyboard accessible, and Shadow DOM isolated
- Suitable for Ghost, WordPress (where custom scripts are allowed), GitHub Pages and ordinary HTML sites
- MIT licensed

## Quick start

Include the script once:

```html
<script defer src="https://YOUR-DOMAIN/linkedin-profile-card.js"></script>
```

Then add a container to your page:

```html
<div data-linkedin-card
     data-name="Jane Doe"
     data-role="Software Engineer"
     data-affiliation="Example University"
     data-profile-url="https://www.linkedin.com/in/your-profile/"
     data-logo-url="https://example.com/photo.png"
     data-background="geometric"
     data-card-width="650px"
     data-affiliation-font-size="15px"></div>
```

If no photo URL is given, the card displays initials automatically.

## Background choices

| Style | HTML attributes |
| --- | --- |
| Geometric | `data-background="geometric"` |
| White | `data-background="white"` |
| Transparent | `data-background="transparent"` |
| Solid color | `data-background="color" data-background-color="#eaf4ff"` |
| SVG image | `data-background="svg" data-background-svg-url="https://example.com/background.svg"` |

For SVG backgrounds, you can also set `data-background-size="cover"` and `data-background-position="center"`. The SVG URL resolves relative to the *hosting page* when it is not absolute.

## Other customizations

- Text: `data-name`, `data-role`, `data-affiliation`, `data-eyebrow`, `data-action-text`
- Links and images: `data-profile-url`, `data-logo-url`
- Size: `data-card-width`, `data-card-padding`, `data-affiliation-font-size`
- Colors: `data-text-color`, `data-muted-color`, `data-accent-color`, `data-eyebrow-color`, `data-border-color`
- Appearance: `data-shadow="false"`

## JavaScript API

```html
<div id="my-profile"></div>
<script src="linkedin-profile-card.js"></script>
<script>
  LinkedInProfileCard.init({
    target: '#my-profile',
    name: 'Jane Doe',
    role: 'Software Engineer',
    affiliation: 'Example University',
    profileUrl: 'https://www.linkedin.com/in/your-profile/',
    background: 'color',
    backgroundColor: '#eaf4ff',
    cardWidth: '650px',
    affiliationFontSize: '15px'
  });
</script>
```

For an inline SVG background set `background: 'svg'` and `backgroundSvg: '<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'`. This is rendered as a CSS background image, not inserted as executable markup.

## Ghost integration

Create an HTML card in your page and paste the container from *Quick start*. Include the script once under **Settings → Code Injection → Site Footer** (or in the page's Footer injection). Host the JavaScript in GitHub Pages or on your own server.

## Demo

Open `demo.html` to view examples; `background-example.svg` is a sample custom background.

## Notes

This tool does **not** retrieve live LinkedIn profile data. Provide your own information. This is an independent project and is not affiliated with or endorsed by LinkedIn. Observe LinkedIn trademark rules when using their branding.

## License

MIT — see [LICENSE](LICENSE).
