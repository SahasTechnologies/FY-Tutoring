/**
 * Sorry for the excessive notes here, this code is quite complicated
 * i should write a doc at some time
 */

const svgNS = 'http://www.w3.org/2000/svg'; //im not bothered typing it later
const WAVE_PATH = 'M4,14 C30,9 65,17 100,12 C132,7 165,16 200,11 C235,6 268,15 305,10 C335,6 365,13 395,10 C408,8 416,12 418,11';

//find nearest nonstatic positioned ancestor thats also not inline
//and then append the wave svgs to it so coords are realtive
function getPositionedAncestor(el: HTMLElement): HTMLElement {
    let cur: HTMLElement | null= el.parentElement;
    while(cur) {
        const {position, display} = getComputedStyle(cur);
        if (position !== 'static' && !display.includes('inline')) return cur;
        cur = cur.parentElement;
    }
    return document.body;
}

//get rid of all the wave SVGs that were injected before for hl-wrap elements
function clearWaves(el: HTMLElement): void {
    const id = el.dataset.waveId;
    if (id) document.querySelectorAll(`[data-wave-for="${id}"]`).forEach(n => n.remove());

}

/**
 * Build one wave SVG forevery line rect of the element
 * IF animate=true THEN it has the dashoffset animation
 * ELSEIF animate=false (resize) THEN waves appear instantly in position
 */
function buildWaves(el: HTMLElement, animate: boolean): void {
    clearWaves(el);

    //either reuse it if its there or generate new ID
    const waveId = el.dataset.waveId || ('w' + Math.random().toString(36).slice(2, 8));
    el.dataset.waveId = waveId;

    //lovely ts formatting
    const container      =  getPositionedAncestor(el);
    const containerRect  =  container.getBoundingClientRect();
    const lineRects      =  Array.from(el.getClientRects());

    // getClientRects() returns one DOMRect for line fragment for the inlinne elements
    lineRects.forEach((rect, i) => {
        const svg = document.createElementNS(svgNS, 'svg');
        svg.dataset.waveFor = waveId;
        svg.setAttribute('viewBox', '0 0 420 20');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');
        svg.classList.add('hl-svg-line');
        if (animate) svg.classList.add('animate');

        //Position the SVG right under the text line
        //relateive to container
        Object.assign(svg.style, {
            position: 'absolute',
            left:          `${rect.left - containerRect.left - 5}px`,
            top:           `${rect.bottom - containerRect.top - 10}px`,
            width:         `${rect.width + 10}px`,
            height:        '20px',
            pointerEvents: 'none',
            overflow:      'visible',
            zIndex:        '10',
        });

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', WAVE_PATH);
        //each line is slightly staggered to draw in sequence
        if (animate) path.style.animationDelay = `${0.3 + i * 0.18}s`;
        svg.appendChild(path);
        container.appendChild(svg);
    });
    
}
// okay the complex part is done no more commetns now 


function initUnderlines(): void {
    const els = document.querySelectorAll<HTMLElement>('[data-underline-hl]');
    if (!els.length) return;

    els.forEach(el => {
        clearWaves(el);
        el.classList.remove('drawn');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            buildWaves(el, true);
            el.classList.add('drawn');
            observer.unobserve(el);
        });
    }, { threshold: 0.3 });

    els.forEach(el => observer.observe(el));

    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll<HTMLElement>('[data-underline-hl].drawn').forEach(el => {
                buildWaves(el, false);
            });
        }, 100);

    }, {passive: true});
}

document.addEventListener('DOMContentLoaded', initUnderlines);
document.addEventListener('astro:page-load', initUnderlines);

// yes... all this code was for a wavy SVG line