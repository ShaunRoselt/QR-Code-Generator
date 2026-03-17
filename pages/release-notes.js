// Release Notes Page Module
const ReleaseNotesPage = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">
                        <i class="bi bi-journal-text"></i>
                        Release Notes
                    </h1>
                    <p class="content-subtitle">Version history and changelog</p>
                </div>
                
                <div class="release-notes-container" id="releaseNotesContent">
                    <div class="loading-spinner">
                        <i class="bi bi-arrow-repeat spin"></i>
                        <p>Loading release notes...</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    async init() {
        try {
            // Fetch release notes from RELEASE_NOTES.md
            const response = await fetch('RELEASE_NOTES.md');
            if (!response.ok) {
                throw new Error('Failed to load release notes');
            }
            
            const markdown = await response.text();
            
            // Simple markdown to HTML conversion
            const html = this.markdownToHTML(markdown);
            
            const container = document.getElementById('releaseNotesContent');
            container.innerHTML = `<div class="release-notes-content">${html}</div>`;
        } catch (error) {
            console.error('Error loading release notes:', error);
            document.getElementById('releaseNotesContent').innerHTML = `
                <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    <p>Failed to load release notes. Please try again later.</p>
                </div>
            `;
        }
    },
    
    markdownToHTML(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Unordered lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');
        
        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/^(?!<[hul])/gm, '<p>');
        html = html.replace(/(?<![>])$/gm, '</p>');
        
        // Clean up extra p tags
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<[hul])/g, '$1');
        html = html.replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
        
        return html;
    }
};
