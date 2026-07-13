// Central Work catalogue — the single source of truth for BOTH the homepage
// Work section (Work.astro) and the per-project gallery pages (/work/[slug]).
// Add / reorder / remove an entry here and both places update automatically.
//
// IMAGES: these are REAL frames pulled from the studio's own Pixieset portfolio
// (snapsbyrosa.mypixieset.com), saved to /public/img/portfolio-NN.jpg at 1500px
// on the long edge. `cover` is shown in a 2:1 cinematic crop on the homepage, so
// each cover is a LANDSCAPE frame (crops cleanly); `gallery` is the full set on
// the project page (shown uncropped, so portraits are fine there). The groupings
// are editorial buckets, not client projects — retitle/re-sort freely.
export const works = [
  {
    slug: 'athlete-lifestyle',
    title: 'Athlete lifestyle',
    cat: 'Photo + short-form',
    desc: 'Training and lifestyle carousels — the stills and the aesthetic edits that go with them.',
    cover: '/img/portfolio-19.jpg',
    gallery: [
      '/img/portfolio-19.jpg',
      '/img/portfolio-07.jpg',
      '/img/portfolio-03.jpg',
      '/img/portfolio-21.jpg',
      '/img/portfolio-05.jpg',
      '/img/portfolio-12.jpg',
      '/img/portfolio-25.jpg',
      '/img/portfolio-24.jpg',
      '/img/portfolio-27.jpg',
    ],
  },
  {
    slug: 'founder-personal-brand',
    title: 'Founder & personal brand',
    cat: 'Personal brand · Photography',
    desc: 'Editorial portraits for people building a personal brand — natural light, real presence.',
    cover: '/img/portfolio-18.jpg',
    gallery: [
      '/img/portfolio-18.jpg',
      '/img/portfolio-01.jpg',
      '/img/portfolio-09.jpg',
      '/img/portfolio-15.jpg',
      '/img/portfolio-34.jpg',
      '/img/portfolio-28.jpg',
      '/img/portfolio-20.jpg',
      '/img/portfolio-22.jpg',
      '/img/portfolio-23.jpg',
    ],
  },
  {
    slug: 'people-behind-the-brand',
    title: 'The people behind the brand',
    cat: 'Company story · Photo + film',
    desc: 'The team, culture and story behind a company — so you tell a story, not just show a logo.',
    cover: '/img/portfolio-16.jpg',
    gallery: [
      '/img/portfolio-16.jpg',
      '/img/portfolio-02.jpg',
      '/img/portfolio-26.jpg',
      '/img/portfolio-11.jpg',
      '/img/portfolio-10.jpg',
      '/img/portfolio-31.jpg',
      '/img/portfolio-32.jpg',
      '/img/portfolio-33.jpg',
      '/img/portfolio-35.jpg',
    ],
  },
  {
    slug: 'milestone-launch',
    title: 'Milestone & launch',
    cat: 'Story · Content day',
    desc: 'A signing, a new business, a milestone — captured across photo and video in one day.',
    cover: '/img/portfolio-14.jpg',
    gallery: [
      '/img/portfolio-14.jpg',
      '/img/portfolio-13.jpg',
      '/img/portfolio-17.jpg',
      '/img/portfolio-30.jpg',
      '/img/portfolio-04.jpg',
      '/img/portfolio-06.jpg',
      '/img/portfolio-08.jpg',
      '/img/portfolio-29.jpg',
    ],
  },
];
