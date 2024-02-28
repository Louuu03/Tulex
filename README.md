# Tulex - The Ultimate Language Exchange Platform

Welcome to Tulex, a dynamic platform designed to revolutionize the way language learners engage in exchange experiences. Focusing solely on writing and speaking, Tulex offers a unique blend of structured challenges and social interaction to enhance language learning in a comprehensive and enjoyable manner. Here's what makes Tulex stand out:

## Features

### Writing Exchange

- **Themed Challenges**: Dive into a variety of writing themes, such as Weekly Challenges, Grammar Focus, and IELTS Preparation. Each theme offers a fresh set of prompts generated regularly by the ChatGPT API, ensuring a diverse and stimulating learning experience.
- **Feedback and Improvement**: Submit your writings to receive constructive feedback and a detailed article with suggestions and discussions on how to improve. Tulex's innovative approach not only motivates learners but also guides them towards mastery in writing.

### Speaking Exchange (Under Development)

- **Varied Themes**: Similar to the writing exchange, the speaking part will include themes like Weekly Challenges, Grammar Focus, IELTS Preparation, and Travel Topics. Sign up for themes of interest and explore different topics generated weekly.
- **Virtual Gatherings**: Users will come together through a third-party platform for virtual events, providing a real-time language exchange experience that sharpens speaking skills in a fun and interactive setting.

### Leaderboard and Badges

- **Recognition and Motivation**: Engage in friendly competition with our leaderboard system, tracking your progress and achievements in both writing and speaking exchanges. Earn badges as you reach new milestones, showcasing your dedication and skill improvement in language learning. This gamified element adds an extra layer of excitement and motivation, encouraging continuous engagement and improvement.

## Development Stack

### Frontend

- **React and Next.js**: Our user interface is built using React for its powerful UI capabilities, with Next.js enhancing server-side rendering for optimal performance and SEO.

### Backend

- **AWS Lambda**: Manages backend logic, including API requests to the ChatGPT API and processing user submissions.
- **MongoDB**: A robust database to store user-generated content, application data, and the dynamic content generated through the ChatGPT API.

### ChatGPT API Integration

- Integrated through AWS Lambda, the ChatGPT API is pivotal in generating the diverse and engaging content that powers our writing and speaking challenges.

### DevOps and CI/CD

- **GitHub Actions** and **Terraform**: These tools automate our deployment workflows and manage AWS resources, ensuring smooth and efficient updates and infrastructure management.

### AWS Services

- Utilizing a suite of AWS services such as S3 for static file storage, API Gateway for backend access, IAM for secure access management, and CloudWatch for operational insights.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribute

We welcome contributions! If you're interested in improving Tulex or have suggestions, please contact me through email [lou.yiw@gmail.com](lou.yiw@gmail.com).

Join us at Tulex and embark on a language learning adventure that's as enriching as it is enjoyable. Let's break down language barriers together!
