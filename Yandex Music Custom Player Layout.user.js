// ==UserScript==
// @name         Yandex Music Custom Player Layout
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Перемещение кнопок громкости, лайка, дизлайка и меню к переключателям треков
// @author       Hachikō
// @match        *://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function rearrangeButtons() {
        // 1. Центральные элементы плеера
        const btnPrev = document.querySelector('button[aria-label="Предыдущая песня"]');
        const btnNext = document.querySelector('button[aria-label="Следующая песня"]');

        if (!btnPrev || !btnNext) return;

        // 2. Остальные кнопки.
        // Добавляем привязку к части класса "VibePlayerBar", чтобы скрипт брал меню/лайки
        const btnMenu = document.querySelector('button[class*="VibePlayerBar"][aria-label="Контекстное меню"]')
                     || document.querySelector('button[aria-label="Контекстное меню"][aria-haspopup="menu"]');
        const btnDislike = document.querySelector('button[class*="VibePlayerBar"][aria-label="Не нравится"]')
                        || document.querySelector('button[aria-label="Не нравится"]');
        const btnLike = document.querySelector('button[class*="VibePlayerBar"][aria-label="Нравится"]')
                     || document.querySelector('button[aria-label="Нравится"]');

        // Кнопка громкости
        const btnVolume = document.querySelector('button[class*="ChangeVolume_button"]')
                       || document.querySelector('button[aria-label="Выключить звук"], button[aria-label="Включить звук"]');

        if (btnMenu && btnDislike && btnLike && btnVolume) {

            // Ползунок громкости.
            const volumeContainer = btnVolume.parentElement;

            // Родительский блок, внутри которого лежат кнопки переключения треков
            const centerControls = btnPrev.parentElement;

            // Защита от бесконечного цикла MutationObserver
            if (btnPrev.previousElementSibling === btnDislike && btnNext.nextElementSibling === volumeContainer) {
                return;
            }

            // Строго контролируем порядок элементов.

            // Вставляем Меню, затем Дизлайк ПЕРЕД кнопкой Назад.
            // Итог слева направо: [Меню] -> [Дизлайк] -> [Назад]
            centerControls.insertBefore(btnMenu, btnPrev);
            centerControls.insertBefore(btnDislike, btnPrev);

            // Вставляем Громкость, затем Лайк ПОСЛЕ кнопки Вперед.
            // Итог слева направо: [Вперед] -> [Громкость] -> [Лайк]
            centerControls.insertBefore(volumeContainer, btnNext.nextSibling);
            centerControls.insertBefore(btnLike, volumeContainer.nextSibling);
        }
    }

    const observer = new MutationObserver(() => {
        rearrangeButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    rearrangeButtons();
})();