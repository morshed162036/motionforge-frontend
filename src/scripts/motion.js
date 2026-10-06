import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 700px)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ========================================
   HEADER + MOBILE MENU
======================================== */

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const setHeaderState = () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
};

setHeaderState();

window.addEventListener('scroll', setHeaderState, {
  passive: true
});

const closeMenu = () => {
  mobileMenu?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = !mobileMenu?.classList.contains('open');

  mobileMenu?.classList.toggle('open', open);

  menuButton?.setAttribute(
    'aria-expanded',
    String(open)
  );

  document.body.classList.toggle(
    'menu-open',
    open
  );
});

mobileMenu
  ?.querySelectorAll('a')
  .forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});


/* ========================================
   REDUCED MOTION
======================================== */

const loader = document.querySelector('[data-loader]');
const loaderLine = document.querySelector('[data-loader-line]');

if (reduceMotion) {
  loader?.remove();

  gsap.set(
    [
      '.hero-eyebrow',
      '.hero-status',
      '.title-line > span',
      '.hero-text',
      '.hero-actions > *',
      '.hero-proof',
      '.hero-stage'
    ],
    {
      clearProps: 'all'
    }
  );

} else {

  /* ========================================
     INITIAL LOADER + HERO
  ======================================== */

  const loadTl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    }
  });

  loadTl
    .to(loaderLine, {
      scaleX: 1,
      duration: 0.65,
      ease: 'power2.inOut'
    })

    .to(
      '.loader-brand, .loader-copy, .loader-line',
      {
        y: -12,
        opacity: 0,
        duration: 0.35,
        stagger: 0.035
      },
      '+=0.08'
    )

    .to(
      loader,
      {
        yPercent: -100,
        duration: 0.72,
        ease: 'power4.inOut'
      },
      '-=0.08'
    )

    .set(loader, {
      display: 'none'
    })

    .from(
      '.hero-eyebrow, .hero-status',
      {
        y: 16,
        opacity: 0,
        stagger: 0.07,
        duration: 0.55
      },
      '-=0.22'
    )

    .from(
      '.title-line > span',
      {
        yPercent: 115,
        stagger: 0.11,
        duration: 0.95,
        ease: 'power4.out'
      },
      '-=0.36'
    )

    .from(
      '.hero-text',
      {
        y: 24,
        opacity: 0,
        duration: 0.62
      },
      '-=0.55'
    )

    .from(
      '.hero-actions > *',
      {
        y: 18,
        opacity: 0,
        stagger: 0.08,
        duration: 0.52
      },
      '-=0.42'
    )

    .from(
      '.hero-proof',
      {
        y: 14,
        opacity: 0,
        duration: 0.5
      },
      '-=0.32'
    )

    .from(
      '.hero-stage',
      {
        scale: 0.92,
        opacity: 0,
        rotationY: -5,
        duration: 1.05,
        ease: 'power3.out'
      },
      '-=0.82'
    )

    .from(
      '.hero-stage .motion-card',
      {
        y: 76,
        rotation: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8
      },
      '-=0.85'
    );


  /* ========================================
     HERO AMBIENT LOOP
  ======================================== */

  gsap.to('.marquee-track', {
    xPercent: -35,
    ease: 'none',
    duration: 18,
    repeat: -1
  });

  gsap.to('.cursor-dot', {
    x: 115,
    y: -72,
    duration: 2.7,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.orbit-a', {
    rotation: '+=360',
    duration: 30,
    repeat: -1,
    ease: 'none'
  });

  gsap.to('.orbit-b', {
    rotation: '-=360',
    duration: 38,
    repeat: -1,
    ease: 'none'
  });

  gsap.to('.glow-a', {
    x: -45,
    y: 35,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.glow-b', {
    x: 50,
    y: -28,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });


  /* ========================================
     HERO 3D PARALLAX
  ======================================== */

  if (canHover) {
    const heroStage = document.querySelector('[data-hero-stage]');

    heroStage?.addEventListener('pointermove', (event) => {
      const rect = heroStage.getBoundingClientRect();

      const nx =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const ny =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      gsap.to(heroStage, {
        rotateY: nx * 5.5,
        rotateX: -ny * 4.5,
        duration: 0.55,
        ease: 'power2.out'
      });

      heroStage
        .querySelectorAll('[data-depth]')
        .forEach((element) => {
          const depth = Number(
            element.dataset.depth || 1
          );

          gsap.to(element, {
            x: nx * 24 * depth,
            y: ny * 20 * depth,
            duration: 0.55,
            ease: 'power2.out'
          });
        });
    });

    heroStage?.addEventListener(
      'pointerleave',
      () => {
        gsap.to(heroStage, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out'
        });

        heroStage
          .querySelectorAll('[data-depth]')
          .forEach((element) => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'power3.out'
            });
          });
      }
    );


    /* ========================================
       MAGNETIC BUTTON
    ======================================== */

    document
      .querySelectorAll('[data-magnetic]')
      .forEach((element) => {
        element.addEventListener(
          'pointermove',
          (event) => {
            const rect =
              element.getBoundingClientRect();

            gsap.to(element, {
              x:
                (
                  event.clientX -
                  rect.left -
                  rect.width / 2
                ) * 0.12,

              y:
                (
                  event.clientY -
                  rect.top -
                  rect.height / 2
                ) * 0.18,

              duration: 0.25,
              ease: 'power2.out'
            });
          }
        );

        element.addEventListener(
          'pointerleave',
          () => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.55,
              ease: 'elastic.out(1,.45)'
            });
          }
        );
      });
  }


  /* ========================================
     GENERIC REVEAL
  ======================================== */

  gsap.utils
    .toArray('.reveal')
    .forEach((element) => {
      gsap.from(element, {
        y: 42,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true
        }
      });
    });


  /* ========================================
     FEATURE CARD TILT
  ======================================== */

  document
    .querySelectorAll('[data-feature-card]')
    .forEach((card) => {
      if (!canHover) return;

      card.addEventListener(
        'pointermove',
        (event) => {
          const rect =
            card.getBoundingClientRect();

          gsap.to(card, {
            rotateX:
              -(
                event.clientY -
                rect.top -
                rect.height / 2
              ) / 35,

            rotateY:
              (
                event.clientX -
                rect.left -
                rect.width / 2
              ) / 35,

            transformPerspective: 900,
            duration: 0.25
          });
        }
      );

      card.addEventListener(
        'pointerleave',
        () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power3.out'
          });
        }
      );
    });


  /* ========================================
     TWO ROW OPPOSITE HORIZONTAL SCROLL
  ======================================== */

  const counterShell =
    document.querySelector(
      '[data-counter-shell]'
    );

  const topRow =
    document.querySelector(
      '[data-counter-row-top]'
    );

  const bottomRow =
    document.querySelector(
      '[data-counter-row-bottom]'
    );

  if (
    counterShell &&
    topRow &&
    bottomRow
  ) {

    const distance = (row) => {
      return Math.max(
        0,
        row.scrollWidth -
          window.innerWidth +
          100
      );
    };

    // TOP ROW → LEFT
    gsap.fromTo(
      topRow,

      {
        x: 80
      },

      {
        x: () => -distance(topRow),
        ease: 'none',

        scrollTrigger: {
          trigger: counterShell,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );


    // BOTTOM ROW → RIGHT
    gsap.fromTo(
      bottomRow,

      {
        x: () => -distance(bottomRow)
      },

      {
        x: 80,
        ease: 'none',

        scrollTrigger: {
          trigger: counterShell,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
  }


 /* =========================================
   FINAL TUNED STACKED CARDS
   Reference-style: lower sticky point,
   progressive blur + shrink + layered gap
========================================= */

const stackStage = document.querySelector('[data-stack-stage]');
const stackCards = gsap.utils.toArray('[data-stack-card]');

if (stackStage && stackCards.length > 1) {
  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 701px)',
      mobile: '(max-width: 700px)'
    },

    (context) => {
      const { desktop } = context.conditions;

      /* -------------------------------------
         TUNING VALUES
      ------------------------------------- */

      const ACTIVE_Y = desktop ? 110 : 72;

      const STACK_GAP = desktop ? 34 : 22;

      const MIN_STACK_Y = desktop ? 28 : 18;

      const INCOMING_Y = desktop ? 760 : 620;

      const SHRINK_STEP = desktop ? 0.03 : 0.02;

      const BLUR_STEP = desktop ? 3.2 : 2;

      const OPACITY_STEP = desktop ? 0.07 : 0.05;


      /* -------------------------------------
         STATE GENERATOR
      ------------------------------------- */

      const getState = (cardIndex, activeIndex) => {

        // ACTIVE CARD
        if (cardIndex === activeIndex) {
          return {
            y: ACTIVE_Y,
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
            zIndex: 100
          };
        }


        // PREVIOUS / STACKED CARDS
        if (cardIndex < activeIndex) {
          const depth = activeIndex - cardIndex;

          const y = Math.max(
            MIN_STACK_Y,
            ACTIVE_Y - STACK_GAP * depth
          );

          return {
            y,

            scale:
              1 - SHRINK_STEP * depth,

            filter:
              `blur(${BLUR_STEP * depth}px)`,

            opacity:
              Math.max(
                0.74,
                1 - OPACITY_STEP * depth
              ),

            zIndex:
              90 - depth
          };
        }


        // UPCOMING CARDS
        const futureDepth =
          cardIndex - activeIndex;

        return {
          y:
            INCOMING_Y +
            futureDepth * 55,

          scale: 1,

          filter: 'blur(0px)',

          opacity: 1,

          zIndex:
            110 + cardIndex
        };
      };


      /* -------------------------------------
         INITIAL STATE
      ------------------------------------- */

      stackCards.forEach((card, index) => {
        gsap.set(
          card,
          getState(index, 0)
        );
      });


      /* -------------------------------------
         MAIN TIMELINE
      ------------------------------------- */

      const stackTl = gsap.timeline({
        scrollTrigger: {
          trigger: stackStage,

          start: desktop
            ? 'top top+=70'
            : 'top top+=45',

          end:
            `+=${(stackCards.length - 1) *
            (desktop ? 1050 : 800)}`,

          pin: true,

          scrub:
            desktop ? 1.35 : 0.85,

          anticipatePin: 1,

          invalidateOnRefresh: true

          // markers: true
        }
      });


      /* -------------------------------------
         CARD TRANSITIONS
      ------------------------------------- */

      for (
        let activeIndex = 1;
        activeIndex < stackCards.length;
        activeIndex++
      ) {

        const label =
          `stack-step-${activeIndex}`;

        stackCards.forEach(
          (card, cardIndex) => {

            const state =
              getState(
                cardIndex,
                activeIndex
              );

            stackTl.to(
              card,
              {
                y: state.y,

                scale:
                  state.scale,

                filter:
                  state.filter,

                opacity:
                  state.opacity,

                zIndex:
                  state.zIndex,

                duration: 1,

                ease:
                  'power2.inOut'
              },

              label
            );
          }
        );


        /*
         * ছোট hold
         * যাতে next card settle করার পর
         * reference video-এর মতো pause feel আসে
         */

        stackTl.to(
          {},
          {
            duration: 0.2
          }
        );
      }


      /* -------------------------------------
         CLEANUP
      ------------------------------------- */

      return () => {

        stackTl.scrollTrigger?.kill();

        stackTl.kill();

        gsap.set(
          stackCards,
          {
            clearProps:
              'transform,filter,opacity,zIndex'
          }
        );
      };
    }
  );
}
}