const starsContainer: HTMLElement | null = document.getElementById('stars-container');
const feedbackArea: HTMLElement | null = document.getElementById('feedback-interaction-area');
const submitButton: HTMLElement | null = document.getElementById('submit-btn');
const feedbackForm: HTMLElement | null = document.getElementById('feedback-form');

const RATING_STORAGE_KEY = 'StarRating';
const TEXT_STORAGE_KEY = 'FeedbackText';
const CLOSE_TABS_KEY = 'CloseAllTabsSignal';
let currentRating: number = 0;

function isHTMLElement(value: unknown): value is HTMLElement {
    return value instanceof HTMLElement;
}

function isHTMLFormElement(value: unknown): value is HTMLFormElement {
    return value instanceof HTMLFormElement;
}

function isHTMLButtonElement(value: unknown): value is HTMLButtonElement {
    return value instanceof HTMLButtonElement;
}

function isHTMLTextAreaElement(value: unknown): value is HTMLTextAreaElement {
    return value instanceof HTMLTextAreaElement;
}

function setActiveState(rating: number): void {
    if (!isHTMLElement(starsContainer)) return;

    const allStars: HTMLElement[] = Array.from(starsContainer.children).filter(
        (child) => child instanceof HTMLElement
    );

    if (allStars.length !== 5) return;

    allStars.forEach((star, index) => {
        if (index > rating - 1) {
            star.className = 'star';
        } else {
            if (rating === 1 && index == 0) {
                star.classList.add('active-feedback-low');
            } else if (rating === allStars.length && index === rating - 1) {
                star.classList.add('active-feedback-high');
            } else {
                star.classList.add('active-feedback-normal');
            }
        }
    });
}

function updateRatingState(rating: number): void {
    currentRating = rating;
    setActiveState(rating);

    if (isHTMLFormElement(feedbackArea)) {
        if (rating > 0 && rating <= 3) {
            feedbackArea.classList.add('is-text-active');
        } else {
            feedbackArea.classList.remove('is-text-active');
        }
    }

    let isTextEntered = false;
    if (isHTMLTextAreaElement(feedbackForm)) {
        isTextEntered = feedbackForm.value.trim() !== '';
    }
    if (isHTMLButtonElement(submitButton)) {
        if (rating >= 4 || isTextEntered) {
            submitButton.disabled = false;
            if (rating >= 4 && isHTMLTextAreaElement(feedbackForm)) {
                localStorage.removeItem(TEXT_STORAGE_KEY);
                feedbackForm.value = '';
            }
        } else {
            submitButton.disabled = true;
        }
    }
}

function InitializePage(): void {
    if (isHTMLTextAreaElement(feedbackForm)) {
        const savedText = localStorage.getItem(TEXT_STORAGE_KEY);
        if (savedText) {
            feedbackForm.value = savedText;
        }

        const savedRatingRaw = localStorage.getItem(RATING_STORAGE_KEY);
        if (savedRatingRaw) {
            try {
                const savedRating = JSON.parse(savedRatingRaw);
                if (typeof savedRating === 'number') {
                    updateRatingState(savedRating);
                }
            } catch (e) {
                console.error('Failed to parse initial rating:', e);
                updateRatingState(0);
            }
        } else {
            updateRatingState(0);
        }
    }
}

if (isHTMLElement(starsContainer)) {
    const allStars: HTMLElement[] = Array.from(starsContainer.children).filter(
        (child) => child instanceof HTMLElement
    );

    if (allStars.length > 0) {
        allStars.forEach((star, index) => {
            const rating: number = index + 1;

            star.onmouseenter = (): void => {
                allStars.forEach((s, i) => {
                    s.className = 'star';
                    if (i < rating) {
                        if (rating === 1 && i === 0) {
                            s.classList.add('hover-feedback-low');
                        } else if (rating === allStars.length && i === rating - 1) {
                            s.classList.add('hover-feedback-high');
                        } else {
                            s.classList.add('hover-feedback-normal');
                        }
                    }
                });
            };

            star.onclick = (): void => {
                updateRatingState(rating);

                setTimeout(() => {
                    localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(rating));
                    console.log(`Рейтинг ${rating} сохранен для синхронизации.`);
                }, 1000);
            };
        });

        starsContainer.onmouseleave = () => {
            setActiveState(currentRating);
        };
    }
}

if (isHTMLTextAreaElement(feedbackForm)) {
    let textSyncTimeout: ReturnType<typeof setTimeout>;
    feedbackForm.addEventListener('input', (): void => {
        feedbackForm.style.height = 'auto';
        feedbackForm.style.height = `${feedbackForm.scrollHeight}px`;

        updateRatingState(currentRating);

        clearTimeout(textSyncTimeout);

        textSyncTimeout = setTimeout(() => {
            localStorage.setItem(TEXT_STORAGE_KEY, feedbackForm.value);
            console.log(`Текст отзыва сохранен для синхронизации.`);
        }, 2000);
    });

    window.addEventListener('storage', (event: StorageEvent): void => {
        if (event.key === RATING_STORAGE_KEY && event.newValue) {
            try {
                const newRating = JSON.parse(event.newValue);
                if (typeof newRating === 'number') {
                    updateRatingState(newRating);
                }
            } catch (e) {
                console.error('Ошибка синхронизации рейтинга:', e);
            }
        }
        if (event.key === TEXT_STORAGE_KEY && event.newValue) {
            console.log('Получено событие синхронизации текста!');

            feedbackForm.value = event.newValue;

            feedbackForm.style.height = 'auto';
            feedbackForm.style.height = `${feedbackForm.scrollHeight}px`;

            updateRatingState(currentRating);
        }
        if (event.key === CLOSE_TABS_KEY && event.newValue === 'Y') {
            window.close();
        }
    });
}

if (isHTMLFormElement(feedbackArea)) {
    feedbackArea.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault();

        localStorage.removeItem(TEXT_STORAGE_KEY);
        if (isHTMLTextAreaElement(feedbackForm)) {
            feedbackForm.value = '';
            feedbackForm.style.height = 'auto';
        }
        localStorage.removeItem(RATING_STORAGE_KEY);
        updateRatingState(0);

        console.log('Рейтинг и текст сброшены и удалены из хранилища.');

        localStorage.setItem(CLOSE_TABS_KEY, 'Y');
        setTimeout(() => {
            localStorage.removeItem(CLOSE_TABS_KEY);
            window.close();
        }, 200);
    });
}

InitializePage();
