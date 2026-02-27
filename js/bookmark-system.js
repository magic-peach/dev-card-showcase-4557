const BOOKMARKS_KEY = 'dev_card_bookmarks';

function loadBookmarks() {
    try {
        const stored = localStorage.getItem(BOOKMARKS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        return [];
    }
}

function saveBookmarks(bookmarks) {
    try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
        console.error('Error saving bookmarks:', error);
    }
}

function isBookmarked(projectId) {
    const bookmarks = loadBookmarks();
    return bookmarks.some(b => b.id === projectId);
}

function toggleBookmark(project) {
    const bookmarks = loadBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.id === project.id);
    
    if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
    } else {
        bookmarks.push({
            id: project.id || project.title,
            title: project.title,
            description: project.description,
            author: project.author,
            tags: project.tags,
            links: project.links,
            bookmarkedAt: new Date().toISOString()
        });
    }
    
    saveBookmarks(bookmarks);
    return !isBookmarked(project.id || project.title);
}

function getBookmarks() {
    return loadBookmarks();
}

function clearAllBookmarks() {
    saveBookmarks([]);
}

function renderBookmarkButton(projectId) {
    const bookmarked = isBookmarked(projectId);
    return `
        <button class="bookmark-btn" onclick="handleBookmarkClick(event, '${projectId}')" 
                title="${bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
            <i class="${bookmarked ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
    `;
}

function handleBookmarkClick(event, projectId) {
    event.stopPropagation();
    const project = getProjectById(projectId);
    if (project) {
        const isNowBookmarked = toggleBookmark(project);
        const btn = event.currentTarget;
        btn.innerHTML = `<i class="${isNowBookmarked ? 'fas' : 'far'} fa-bookmark"></i>`;
        btn.title = isNowBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
    }
}

function getProjectById(projectId) {
    if (typeof projectsData !== 'undefined') {
        return projectsData.find(p => (p.id || p.title) === projectId);
    }
    return null;
}

function showBookmarksPage() {
    const bookmarks = getBookmarks();
    const container = document.getElementById('projectsContainer');
    
    if (!container) return;
    
    if (bookmarks.length === 0) {
        container.innerHTML = `
            <div class="no-bookmarks" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="far fa-bookmark fa-3x"></i>
                <p style="margin-top: 20px; font-size: 1.1rem;">No bookmarked projects yet</p>
                <p style="color: var(--text-secondary);">Click the bookmark icon on any project to save it here.</p>
            </div>
        `;
        return;
    }
    
    displayProjects(bookmarks);
}
