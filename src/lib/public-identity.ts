export const publicIdentity = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://sarthakagrawal.dev/#person',
      name: 'Sarthak Agrawal',
      jobTitle: 'AI Infrastructure & Product Engineer',
      url: 'https://sarthakagrawal.dev',
      image: 'https://avatars.githubusercontent.com/u/43884471?v=4',
      sameAs: [
        'https://sarthakagrawal.dev',
        'https://www.linkedin.com/in/sarthakagrawal927',
        'https://github.com/sarthakagrawal927',
        'https://x.com/sarthakcodes',
        'https://huggingface.co/sarthakagrawal927',
      ],
      knowsAbout: [
        'AI infrastructure',
        'Local-first software',
        'Post-training language models',
        'AI code review',
        'Cloudflare Workers',
        'TypeScript',
        'Rust',
      ],
      affiliation: {
        '@type': 'Organization',
        '@id': 'https://sassmaker.com/#app',
        name: 'SaaS Maker',
        url: 'https://sassmaker.com',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://significanthobbies.com/#org',
      name: 'Significant Hobbies',
      url: 'https://significanthobbies.com',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'sarthakagrawal@agentmail.to',
        url: 'https://significanthobbies.com',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://significanthobbies.com/#app',
      name: 'Live',
      alternateName: [
        'Live by Significant Hobbies',
        'Significant Hobbies',
        'significanthobbies.com',
      ],
      url: 'https://significanthobbies.com',
      applicationCategory: 'LifestyleApplication',
      description:
        'Find bucket-list ideas and side quests, keep your own list, log what you do, and write one private entry each week.',
      publisher: {
        '@id': 'https://sarthakagrawal.dev/#person',
      },
      isPartOf: {
        '@id': 'https://significanthobbies.com/#org',
      },
      sameAs: ['https://github.com/Significant-Hobbies/live'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://significanthobbies.com/#website',
      name: 'Live',
      url: 'https://significanthobbies.com',
      publisher: {
        '@id': 'https://significanthobbies.com/#org',
      },
      creator: {
        '@id': 'https://sarthakagrawal.dev/#person',
      },
    },
  ],
};
