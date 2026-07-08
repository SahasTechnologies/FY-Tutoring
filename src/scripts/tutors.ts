function initTutorsCarousel() {

    const track = document.getElementById('tutors-track') as HTMLUListElement | null;
    const btnPrev = document.getElementById('tutors-prev') as HTMLButtonElement | null;
    const btnNext = document.getElementById('tutors-next') as HTMLButtonElement | null;

    if (!track || !btnPrev || !btnNext) return;

    const getScrollAmount = () => {
        const slide = track.querySelector('.tutors-slide') as HTMLLIElement | null;
        if (!slide) return 300;
        const slideWidth = slide.getBoundingClientRect().width;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 24;
        return slideWidth + gap;
    };

    btnPrev.addEventListener('click', () => {
        track.scrollBy({left: -getScrollAmount(), behavior: 'smooth'});
    });
    btnNext.addEventListener('click', () => {
        track.scrollBy({left: getScrollAmount(), behavior: 'smooth'});
    })

    const toggleButtons = () => {
        
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;

        if (scrollLeft <= 5) {
            btnPrev.style.opacity = '0.35';
            btnPrev.style.pointerEvents = 'none';
        } 
        else {
            btnPrev.style.opacity = '1';
            btnPrev.style.pointerEvents = 'auto';
        }
        if (scrollLeft >= maxScroll - 5) {
            btnNext.style.opacity = '0.35';
            btnNext.style.pointerEvents= 'none';

        }
        else {
            btnNext.style.opacity = '1';
            btnNext.style.pointerEvents = 'auto';
        }
    };

    track.addEventListener('scroll', toggleButtons, {passive: true});
    window.addEventListener('resize', toggleButtons, {passive: true});
    setTimeout(toggleButtons, 100); //if your device is slower than this then sorry
}
document.addEventListener('DOMContentLoaded', initTutorsCarousel);
document.addEventListener('astro:page-load', initTutorsCarousel);