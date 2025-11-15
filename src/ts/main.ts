import '/src/css/styles/main.scss';

import './header.ts';
import './rating.ts';
import './clock.ts';

const favicon: HTMLElement | null = document.getElementById('favicon');
function isHTMLLinkElement(value: unknown): value is HTMLLinkElement {
    return value instanceof HTMLLinkElement;
}

if (isHTMLLinkElement(favicon)) {
    const originalFavicon = favicon.href;
    const inactiveFavicon: string = '/public/images/icons/favicon_inactive.ico';

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            favicon.href = inactiveFavicon;
        } else {
            favicon.href = originalFavicon;
        }
    });
}

const originalTitle: string = document.title;
const inactiveTitle: string = 'Хочешь печеньку? 🍪';

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        document.title = inactiveTitle;
    } else {
        document.title = originalTitle;
    }
});
