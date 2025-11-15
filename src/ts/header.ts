const main_header: HTMLElement | null = document.getElementById('main-header');

if (main_header) {
    let clickTimeout: ReturnType<typeof setTimeout>;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let spaceTimeout: ReturnType<typeof setTimeout>;

    document.addEventListener('click', (event: MouseEvent): void => {
        if (event.target instanceof Element && !event.target.closest('a')) {
            main_header.classList.add('main-header-clicked');
            main_header.classList.remove('main-header-scrolled');
            main_header.classList.remove('main-header-spaced');

            clearTimeout(clickTimeout);

            clickTimeout = setTimeout(() => {
                main_header.classList.remove('main-header-clicked');
            }, 1000);
        }
    });

    window.addEventListener('scroll', (): void => {
        main_header.classList.add('main-header-scrolled');
        main_header.classList.remove('main-header-clicked');
        main_header.classList.remove('main-header-spaced');

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function () {
            main_header.classList.remove('main-header-scrolled');
        }, 1000);
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.target instanceof Element) {
            if (event.code === 'Space') {
                main_header.classList.add('main-header-spaced');
                main_header.classList.remove('main-header-clicked');
                main_header.classList.remove('main-header-scrolled');

                clearTimeout(spaceTimeout);

                spaceTimeout = setTimeout(() => {
                    main_header.classList.remove('main-header-spaced');
                }, 1000);
            }
        }
    });
}
