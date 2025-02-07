const fs = require('fs');
const path = require('path');

// Function to sync the static HTML with the Next.js build
function syncHtml() {
    const buildPath = path.join(__dirname, '../.next/server/pages/index.html');
    const staticPath = path.join(__dirname, '../index.html');

    // Check if build exists
    if (fs.existsSync(buildPath)) {
        const buildHtml = fs.readFileSync(buildPath, 'utf8');
        fs.writeFileSync(staticPath, buildHtml);
        console.log('HTML files synced successfully!');
    }
}

syncHtml(); 