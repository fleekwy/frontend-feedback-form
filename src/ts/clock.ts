type Language = 'ru' | 'zh';

const clockElement: HTMLElement | null = document.getElementById('real-time-clock');
const ruButton: HTMLElement | null = document.getElementById('lang-btn-ru');
const zhButton: HTMLElement | null = document.getElementById('lang-btn-zh');

const LANG_STORAGE_KEY = 'ClockLanguage';

function isHTMLElement(value: unknown): value is HTMLElement {
    return value instanceof HTMLElement;
}

function isLanguage(value: unknown): value is Language {
    return value === 'ru' || value === 'zh';
}

function getSavedLanguage(): Language {
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLanguage(savedLang)) {
        return savedLang;
    }
    return 'ru';
}

const updateLangButtonsState = (lang: Language): void => {
    if (ruButton) {
        if (lang === 'ru') ruButton.classList.add('active');
        else ruButton.classList.remove('active');
    }
    if (zhButton) {
        if (lang === 'zh') zhButton.classList.add('active');
        else zhButton.classList.remove('active');
    }
};

if (clockElement) {
    const locales = {
        ru: 'ru-RU',
        zh: 'zh-CN',
    };

    let currentLang: Language = getSavedLanguage();
    updateLangButtonsState(currentLang);
    let lastDisplayedDate: Date = new Date();

    const formatClockString = (date: Date): string => {
        return new Intl.DateTimeFormat(locales[currentLang], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            weekday: 'long',
        }).format(date);
    };

    const updateClock = (): void => {
        lastDisplayedDate = new Date();
        clockElement.textContent = formatClockString(lastDisplayedDate);
    };

    const startSmartInterval = (): void => {
        const now: Date = new Date();
        const milliseconds: number = now.getMilliseconds() + now.getSeconds() * 1000;

        const msecondsToTen: number = 10000 - (milliseconds % 10000);

        setTimeout(() => {
            updateClock();
            startSmartInterval();
        }, msecondsToTen);
    };

    // const startInterval = (): void => {

    //     const now: Date = new Date();
    //     const milliseconds: number = now.getMilliseconds() + now.getSeconds() * 1000;
    //     const msecondsToTen: number = 10000 - (milliseconds % 10000);

    //     setTimeout(() => {
    //         updateClock();
    //         setInterval(() => {
    //             updateClock();
    //         }, 10000)
    //     }, msecondsToTen);
    // };

    const changeLang = (event: MouseEvent): void => {
        const button: unknown = event.currentTarget;
        if (isHTMLElement(button)) {
            const newLang: unknown = button.dataset.lang;
            if (isLanguage(newLang) && newLang !== currentLang) {
                currentLang = newLang;
                localStorage.setItem(LANG_STORAGE_KEY, currentLang);
                clockElement.textContent = formatClockString(lastDisplayedDate);

                updateLangButtonsState(currentLang);
            }
        }
    };

    if (ruButton) {
        ruButton.onclick = changeLang;
    }

    if (zhButton) {
        zhButton.onclick = changeLang;
    }

    window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === LANG_STORAGE_KEY) {
            console.log('Получено событие синхронизации языка из другой вкладки!');
            const newLang = event.newValue;

            if (isLanguage(newLang) && newLang !== currentLang) {
                currentLang = newLang;
                clockElement.textContent = formatClockString(lastDisplayedDate);

                updateLangButtonsState(currentLang);
            }
        }
    });

    updateClock();
    startSmartInterval();
}
