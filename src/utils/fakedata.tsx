const fakeData = {
  currentUser: {
    name: 'User',
    image: '/path/to/user/image.jpg', // Replace with the actual image path
  },
  eventsData: [
    {
      category: 'IELTS prep',
      topic: 'Opinion Essay on femenism and patriarchy',
      level: 'B2',
      language: 'EN',
      streak: '3 week streak!',
      date: '12/28 18:00',
      statTag: 'Top 10%',
    },
    {
      category: 'Grammar Focus',
      topic: 'Complex Sentences in English ',
      level: 'B1',
      language: 'EN',
      streak: '2 week streak!',
      date: '12/29 17:00',
      statTag: 'Top 20%',
    },
    {
      category: 'Social Topics',
      topic: 'Environmental Issues',
      level: 'C1',
      language: 'EN',
      streak: '4 week streak!',
      date: '12/30 16:00',
      statTag: 'Top 5%',
    },
    {
      category: 'Creative Writing',
      topic: 'Short Story',
      level: 'B2',
      language: 'EN',
      streak: '1 week streak!',
      date: '12/31 15:00',
      statTag: 'Top 15%',
    },
    {
      category: 'Business Writing',
      topic: 'Email Etiquette',
      level: 'C1',
      language: 'EN',
      streak: '5 week streak!',
      date: '01/01 14:00',
      statTag: 'Top 8%',
    },
    {
      category: 'Research Writing',
      topic: 'Citing Sources',
      level: 'B2',
      language: 'EN',
      streak: '3 week streak!',
      date: '01/02 13:00',
      statTag: 'Top 12%',
    },
  ],
  categoriesData: [
    {
      category: 'IELTS Prep',
      id: '2001',
      short: 'Boosts English skills for higher IELTS scores.',
      latest: 'Writing Effective Arguments in IELTS Essays',
    },
    {
      category: 'TOEFL Prep',
      id: '2002',
      short: 'Improves English for better TOEFL results.',
      latest: 'Mastering TOEFL Integrated Writing',
    },
    {
      category: 'Grammar Focus',
      id: '2003',
      short: 'Enhances understanding of advanced English grammar.',
      latest: 'Using Advanced Tenses Correctly',
    },
    {
      category: 'Social Topics',
      id: '2004',
      short: 'Explores global issues with critical insights.',
      latest: 'Discussing Climate Change Impacts',
      long: 'The Social Topics category encompasses a wide array of subjects including current events, societal trends, cultural phenomena, and global issues, encouraging writers to explore, analyze, and discuss the impacts and implications of these topics on society. Writing about such topics in English helps learners to expand their vocabulary, improve their ability to construct coherent arguments and narratives, and gain a deeper understanding of diverse perspectives and cultural contexts.',
    },
    {
      category: 'Creative Writing',
      id: '2005',
      short: 'Encourages imaginative story and character creation.',
      latest: 'Crafting Stories with Dynamic Characters',
    },
    {
      category: 'Business Writing',
      id: '2006',
      short: 'Teaches writing for professional business communication.',
      latest: 'Effective Business Email Etiquette',
    },
    {
      category: 'Research Writing',
      id: '2007',
      short: 'Develops skills for academic and scholarly writing.',
      latest: 'Structuring an Academic Research Paper',
    },
    {
      category: 'Fantasy and Science Fiction',
      id: '2008',
      short: 'Inspires creation of unique, speculative worlds.',
      latest: 'Building Your Own Fantasy World',
    },
    {
      category: 'Poetry and Verse',
      id: '2009',
      short: 'Fosters poetic expression and technique.',
      latest: 'Crafting Poems with Vivid Imagery',
    },
    {
      category: 'Editorial and Opinion Writing',
      id: '2010',
      short: 'Enhances persuasive writing on various topics.',
      latest: 'Opinions on Technology in Education',
    },
  ],
  alleventsData: [
    {
      topic: 'Immigration policies and their effects on societies',
      category: 'social topics',
      isSubscribed: false,
      language: 'fr',
      level: 'B1',
      date: '2024-03-27',
      isSmall: true,
      id: '2001',
      introduction:
        "Immigration policies significantly shape societies, influencing cultural diversity, economic development, and social dynamics. These policies determine who can enter, stay, or work in a country, directly impacting both immigrants and the native population. Understanding these effects offers insight into the broader implications of immigration on a society's fabric.",
      guide_steps: [
        {
          title: 'Identify the Immigration Policies',
          description:
            'Begin by outlining the key immigration policies of a specific country or comparing policies between countries. Mention quotas, skill-based entry, asylum provisions, and any recent changes.',
        },
        {
          title: 'Analyze Societal Impact',
          description:
            'Discuss how these policies affect various aspects of society, such as the labor market, cultural diversity, public services, and social cohesion. Consider both positive and negative impacts.',
        },
        {
          title: 'Use Examples',
          description:
            'Provide real-world examples to illustrate your points, such as the contribution of immigrants to innovation and economic growth or challenges in integration and resource allocation.',
        },
        {
          title: 'Conclude with Reflection',
          description:
            'Reflect on the balance between open, inclusive policies and the need for national security and economic stability. Suggest ways to address challenges while maximizing the benefits of immigration.',
        },
      ],
      article: [
        'Immigration policies shape the fabric of societies, influencing economic, cultural, and social dynamics. Policies vary by country, affecting who can enter, stay, or work, with profound impacts on both immigrants and host societies.',
        "Consider Canada's Express Entry system, which has positively impacted its economy by addressing labor shortages and enriching cultural diversity. Yet, immigration poses challenges like integration and resource allocation, demanding thoughtful policy-making.",
        "Reflecting on these dynamics, it's clear that immigration policies are a balance of values and practicalities. By fostering integration and recognizing the potential of immigrants, policies can enrich society while addressing economic and social needs.",
      ],
    },
    {
      topic: 'The future of work in the age of automation',
      category: 'social topics',
      isSubscribed: true,
      language: 'en',
      level: 'B2',
      date: '2024-03-02',
      isSmall: true,
      id: '2002',
    },
    {
      topic: 'Cultural diversity in the workplace',
      category: 'social topics',
      isSubscribed: false,
      language: 'en',
      level: 'B1',
      date: '2024-03-27',
      isSmall: true,
      id: '2003',
    },
    {
      topic: 'Economic inequality and social unrest',
      category: 'social topics',
      isSubscribed: false,
      language: 'en',
      level: 'A2',
      date: '2024-03-22',
      isSmall: true,
      id: '2004',
    },
    {
      topic: 'The influence of celebrities on youth culture',
      category: 'social topics',
      isSubscribed: true,
      language: 'en',
      level: 'C2',
      date: '2024-03-20',
      isSmall: true,
      id: '2005',
    },
    {
      topic: 'The impact of social media on privacy',
      category: 'social topics',
      isSubscribed: true,
      language: 'fr',
      level: 'A2',
      date: '2024-03-03',
      isSmall: true,
      id: '2006',
    },
    {
      topic: 'The role of technology in modern communication',
      category: 'social topics',
      isSubscribed: true,
      language: 'fr',
      level: 'B1',
      date: '2024-03-20',
      isSmall: true,
      id: '2007',
    },
    {
      topic: 'Global warming and its social implications',
      category: 'social topics',
      isSubscribed: false,
      language: 'fr',
      level: 'B1',
      date: '2024-03-29',
      isSmall: true,
      id: '2008',
    },
    {
      topic: 'Education reform for the 21st century',
      category: 'social topics',
      isSubscribed: false,
      language: 'fr',
      level: 'B1',
      date: '2024-03-29',
      isSmall: true,
      id: '2009',
    },
    {
      topic: 'Public health strategies during pandemics',
      category: 'social topics',
      isSubscribed: true,
      language: 'fr',
      level: 'B2',
      date: '2024-03-22',
      isSmall: true,
      id: '2010',
    },
  ],
  feedbackData: {
    feedback:
      'The article provides a balanced overview of immigration policies and their impacts on societies. It succinctly explains both the positive and negative effects, promoting an understanding of the complexity involved. To enhance clarity and engagement, consider incorporating specific examples or case studies that illustrate these impacts. Additionally, breaking down complex ideas into simpler, more relatable terms could further align with the B2 language level, making the content more accessible to a broader audience.',
    line: 'Great job conveying complex ideas simply and effectively!',
    rating: '8',
    highlights: [
      {
        word: 'shape',
        explanation:
          'to clarify the role of immigration policies more explicitly',
      },
      {
        word: 'influencing society profoundly',
        explanation:
          'to emphasize the significant impact on societal structures',
      },
      {
        word: 'foster cultural diversity',
        explanation: 'highlighting the positive aspect of cultural enrichment',
      },
      { word: 'scarce', explanation: 'simplifying language for clarity' },
      {
        word: 'inflated living costs',
        explanation: 'to specify the type of economic challenge',
      },
      {
        word: 'spark concerns',
        explanation:
          'to convey the emotional response of the local population more vividly',
      },
      {
        word: 'innovation and entrepreneurship',
        explanation: 'to underscore the positive economic impact of immigrants',
      },
      {
        word: 'smooth operation',
        explanation:
          'to highlight the essential role of immigrants in workforce',
      },
      {
        word: 'careful planning',
        explanation: 'emphasizing the necessity for strategic policy-making',
      },
    ],
    article:
      'Immigration policies shape the framework for who can enter and reside in a country, influencing society profoundly. Such policies can foster cultural diversity, introducing a variety of foods, music, and customs, thereby enriching the societal fabric. However, these policies also pose challenges, particularly when resources like jobs or housing are scarce, potentially leading to unemployment or inflated living costs. Furthermore, rapid changes in the societal landscape can spark concerns among local populations.   On the upside, immigrants often contribute significantly to the economy through innovation and entrepreneurship. They also play a crucial role in filling labor shortages, ensuring the smooth operation of essential services. In essence, while immigration policies have the potential to transform societies positively, fostering cultural exchange and economic growth, they necessitate careful planning to balance the needs and well-being of both newcomers and existing residents.',
  },
};

export default fakeData;
