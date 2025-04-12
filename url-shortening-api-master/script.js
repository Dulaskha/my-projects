function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}
// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.shorten_input');
    const input = form.querySelector('input');
    const submitButton = form.querySelector('button');
    const shortenLinkSection = document.querySelector('.shorten_link');
    
    // Store shortened links
    let shortenedLinks = [];
    
    // Add event listener to the form
    submitButton.addEventListener('click', handleShortenUrl);
    
    // Allow form submission with Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleShortenUrl();
        }
    });
    
    async function handleShortenUrl() {
        // Get the URL from input
        const urlToShorten = input.value.trim();
        
        // Validate URL
        if (!urlToShorten) {
            showError('Please add a link');
            return;
        }
        
        // Check if URL is valid
        if (!isValidUrl(urlToShorten)) {
            showError('Please enter a valid URL');
            return;
        }
        
        // Change button text to loading state
        submitButton.textContent = 'Shortening...';
        submitButton.disabled = true;
        
        try {
            // Call API to shorten URL
            const shortUrl = await shortenUrl(urlToShorten);
            
            // Add to stored links
            shortenedLinks.unshift({
                original: urlToShorten,
                shortened: shortUrl
            });
            
            // Display the links
            displayShortenedLinks();
            
            // Clear input field
            input.value = '';
            
            // Remove any error styling
            input.classList.remove('error');
            if (document.querySelector('.error-message')) {
                document.querySelector('.error-message').remove();
            }
        } catch (error) {
            showError('Failed to shorten link. Please try again.');
            console.error('Error shortening URL:', error);
        } finally {
            // Reset button state
            submitButton.textContent = 'Shorten It!';
            submitButton.disabled = false;
        }
    }
    
    async function shortenUrl(url) {
        // Encode the URL properly for the query parameter
        const encodedUrl = encodeURIComponent(url);
        
        // Make API call to is.gd
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodedUrl}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the API returned an error
        if (data.errorcode) {
            throw new Error(data.errormessage || 'Unknown error from is.gd');
        }
        
        return data.shorturl;
    }
    
    function displayShortenedLinks() {
        // Remove existing links display if any
        const existingLinksContainer = document.querySelector('.shortened-links-container');
        if (existingLinksContainer) {
            existingLinksContainer.remove();
        }
        
        // Create container for shortened links
        const linksContainer = document.createElement('div');
        linksContainer.className = 'shortened-links-container';
        
        // Add each link to the container
        shortenedLinks.forEach(link => {
            const linkElement = createLinkElement(link);
            linksContainer.appendChild(linkElement);
        });
        
        // Insert the container after the shorten_link section
        shortenLinkSection.parentNode.insertBefore(linksContainer, shortenLinkSection.nextSibling);
    }
    
    function createLinkElement(link) {
        const linkElement = document.createElement('div');
        linkElement.className = 'shortened-link';
        
        linkElement.innerHTML = `
            <div class="original-link">${truncateUrl(link.original)}</div>
            <div class="short-link-container">
                <a href="${link.shortened}" class="short-link" target="_blank">${link.shortened}</a>
                <button class="copy-btn">Copy</button>
            </div>
        `;
        
        // Add event listener for copy button
        const copyButton = linkElement.querySelector('.copy-btn');
        copyButton.addEventListener('click', () => {
            copyToClipboard(link.shortened, copyButton);
        });
        
        return linkElement;
    }
    
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            // Change button text and style
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
    
    function showError(message) {
        // Add error styling to input
        input.classList.add('error');
        
        // Remove existing error message if any
        if (document.querySelector('.error-message')) {
            document.querySelector('.error-message').remove();
        }
        
        // Create and add error message
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        form.appendChild(errorMessage);
    }
    
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function truncateUrl(url) {
        // Truncate long URLs for display
        return url.length > 50 ? url.substring(0, 50) + '...' : url;
    }
    
    
});