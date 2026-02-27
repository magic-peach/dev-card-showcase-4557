let ratingsData = {
    ratings: {},
    reviews: [],
    metadata: {
        version: "1.0",
        lastUpdated: new Date().toISOString()
    }
};

const RATING_STORAGE_KEY = 'dev_card_ratings';

function loadRatings() {
    try {
        const stored = localStorage.getItem(RATING_STORAGE_KEY);
        if (stored) {
            ratingsData = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading ratings:', error);
    }
    return ratingsData;
}

function saveRatings() {
    try {
        ratingsData.metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(ratingsData));
    } catch (error) {
        console.error('Error saving ratings:', error);
    }
}

function getProjectRating(projectId) {
    const ratings = ratingsData.ratings[projectId];
    if (!ratings) return { average: 0, count: 0, breakdown: {} };
    
    const values = Object.values(ratings);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = values.length > 0 ? (sum / values.length).toFixed(1) : 0;
    
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    values.forEach(r => {
        if (breakdown[r] !== undefined) breakdown[r]++;
    });
    
    return { average: parseFloat(average), count: values.length, breakdown };
}

function hasUserRated(projectId) {
    return ratingsData.ratings[projectId]?.userRated === true;
}

function rateProject(projectId, rating) {
 (!ratingsData    if.ratings[projectId]) {
        ratingsData.ratings[projectId] = {};
    }
    
    ratingsData.ratings[projectId][Date.now()] = rating;
    ratingsData.ratings[projectId].userRated = true;
    
    saveRatings();
    updateProjectRatingDisplay(projectId);
}

function addReview(projectId, reviewText, authorName) {
    const review = {
        id: Date.now(),
        projectId: projectId,
        text: reviewText,
        author: authorName || 'Anonymous',
        timestamp: new Date().toISOString()
    };
    
    ratingsData.reviews.push(review);
    saveRatings();
    return review;
}

function getProjectReviews(projectId) {
    return ratingsData.reviews.filter(r => r.projectId === projectId);
}

function createRatingStars(rating, interactive = false, projectId = null) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (hasHalf) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    if (interactive) {
        starsHtml = `
            <div class="rating-interactive" data-project-id="${projectId}">
                <div class="rating-stars-display">${starsHtml}</div>
                <div class="rating-input">
                    ${[1, 2, 3, 4, 5].map(i => 
                        `<button class="rating-btn" data-rating="${i}" title="${i} star${i > 1 ? 's' : ''}">
                            <i class="fa${i <= rating ? 's' : 'r'} fa-star"></i>
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    return starsHtml;
}

function updateProjectRatingDisplay(projectId) {
    const ratingInfo = getProjectRating(projectId);
    const card = document.querySelector(`[data-id="${projectId}"]`);
    if (!card) return;
    
    let ratingEl = card.querySelector('.project-rating');
    if (!ratingEl) {
        ratingEl = document.createElement('div');
        ratingEl.className = 'project-rating';
        card.insertBefore(ratingEl, card.querySelector('.project-description'));
    }
    
    ratingEl.innerHTML = `
        <div class="rating-display">
            ${createRatingStars(ratingInfo.average)}
            <span class="rating-value">${ratingInfo.average}</span>
            <span class="rating-count">(${ratingInfo.count})</span>
        </div>
    `;
}

function setupRatingEventListeners() {
    document.addEventListener('click', function(e) {
        const ratingBtn = e.target.closest('.rating-btn');
        if (!ratingBtn) return;
        
        const rating = parseInt(ratingBtn.dataset.rating);
        const container = ratingBtn.closest('.rating-interactive');
        const projectId = container?.dataset.projectId;
        
        if (projectId && rating) {
            rateProject(projectId, rating);
            
            const stars = container.querySelectorAll('.rating-btn i');
            stars.forEach((star, index) => {
                star.className = `fa${index < rating ? 's' : 'r'} fa-star`;
            });
        }
    });
}

function showReviewModal(projectId, projectTitle) {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Review: ${projectTitle}</h2>
            <div class="rating-section">
                <label>Your Rating:</label>
                <div class="rating-input-modal" data-project-id="${projectId}">
                    ${[1, 2, 3, 4, 5].map(i => 
                        `<button class="rating-btn" data-rating="${i}">
                            <i class="far fa-star"></i>
                        </button>`
                    ).join('')}
                </div>
            </div>
            <div class="review-form">
                <label>Your Review (optional):</label>
                <textarea id="reviewText" placeholder="Share your experience with this project..."></textarea>
                <input type="text" id="reviewAuthor" placeholder="Your name (optional)">
                <button class="submit-review-btn">Submit Review</button>
            </div>
            <div class="reviews-list">
                <h3>Recent Reviews</h3>
                <div id="reviewsContainer"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const reviews = getProjectReviews(projectId);
    const reviewsContainer = modal.querySelector('#reviewsContainer');
    reviewsContainer.innerHTML = reviews.length > 0 
        ? reviews.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${r.author}</span>
                    <span class="review-date">${new Date(r.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="review-text">${r.text}</p>
            </div>
        `).join('')
        : '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
    
    let selectedRating = 0;
    modal.querySelectorAll('.rating-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            modal.querySelectorAll('.rating-btn i').forEach((star, index) => {
                star.className = `fa${index < selectedRating ? 's' : 'r'} fa-star`;
            });
        });
    });
    
    modal.querySelector('.submit-review-btn').addEventListener('click', function() {
        if (selectedRating === 0) {
            alert('Please select a rating');
            return;
        }
        const reviewText = modal.querySelector('#reviewText').value;
        const authorName = modal.querySelector('#reviewAuthor').value;
        
        rateProject(projectId, selectedRating);
        if (reviewText.trim()) {
            addReview(projectId, reviewText, authorName);
        }
        
        modal.remove();
        alert('Thank you for your review!');
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function sortByRating(projects) {
    return projects.sort((a, b) => {
        const ratingA = getProjectRating(a.id || a.title).average;
        const ratingB = getProjectRating(b.id || b.title).average;
        return ratingB - ratingA;
    });
}

function filterByMinRating(projects, minRating) {
    return projects.filter(p => {
        const rating = getProjectRating(p.id || p.title).average;
        return rating >= minRating;
    });
}
