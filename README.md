# Travel Website Project

This is a full-stack travel website built using HTML, CSS, JavaScript, and other web technologies.  
It allows users to explore travel destinations, view packages, and interact with features like booking forms and galleries.

---

## Demo Videos

The project includes several demo videos showing the website in action.  
**Note:** The `.mp4` files are not stored on GitHub because GitHub cannot display large media files.  

You can view or download the demo videos from Google Drive:

[View Demo Videos](https://drive.google.com/drive/folders/1e8NnCmGxKCNktp6V4cAIsu53UB9MRoC4?usp=drive_link)

---

## Features

- Explore travel destinations with images and descriptions
- View travel packages and pricing
- Contact form for inquiries
- Responsive design for mobile and desktop

"# Travel_Explorer_website" 

---

## New: Explore Destinations (Unsplash + OpenWeatherMap)

Search any destination to see recent photos and current weather.

### Setup API Keys

1. Create a free account and get keys:
   - Unsplash Developer: `https://unsplash.com/developers`
   - OpenWeatherMap: `https://openweathermap.org/api`

2. Provide keys to the app (pick one):
   - Inline in HTML (quick demo): add this before the closing `</body>` in `index.html`:

```html
<script>
  window.UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';
  window.OPENWEATHERMAP_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
  // Alternatively, edit js/script.js and replace the placeholder strings
</script>
```

3. Open `index.html` in a browser and use the Explore section.

### Notes
- The app falls back to placeholders (`YOUR_..._KEY`) if keys are not provided; API calls will fail until keys are set.
- Weather is shown in °C using Kelvin→C conversion.
- Unsplash photos link to the original on Unsplash in a new tab.