# Kinan Maarrawi - Personal Portfolio Website MK3

Welcome to the repository for my personal portfolio website! This project showcases my work, skills, and projects as a full-stack developer and computer science student. The website is designed to be modern, interactive, and responsive, with a focus on performance and usability.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Components](#components)
- [Development Process](#development-process)
- [Previous Website & Lessons Learned](#previous-website--lessons-learned)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

---

## Overview

This website is my updated personal portfolio, created to replace my old site. Its purpose is to:

- Showcase my skills in front-end and back-end development
- Present my personal projects in a visually engaging way
- Allow visitors to contact me directly via a contact form & Social media links
- Highlight my interests and experiences

The website is built with a React and Tailwind CSS frontend, combined with a Netlify serverless backend for handling the contact form, providing a fast, modern, and interactive user experience.

---

## Features

- **Interactive Sections**: Hero, About, Projects, and Footer
- **Animated Text**: ASCII-styled greetings using `ASCIIText`
- **Dynamic Project Carousel**: Projects displayed with hover effects
- **Contact Form**: Sends emails via Netlify serverless function using Nodemailer
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Animated Components**: Using `Framer Motion` for smooth animations
- **Particles and Visual Effects**: Background particles, glitch effects, and rotating text

---

## Technologies Used

- **React.js** – Core front-end framework
  - **Framer Motion** – animations for text and UI components
- **Tailwind CSS** – utility-first CSS framework used for responsive layouts, typography, spacing, and hover effects
    - **Styled Components** – modular CSS-in-JS for component-specific styling

- **Backend / Serverless**:
    - **Netlify Functions** – serverless backend for the contact form


---

## Project Structure

```text
src/
├── components/
│   ├── About.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Projects.jsx
│   ├── CardModal.jsx
│   ├── CardComponents.jsx
│   ├── Particles.jsx
│   ├── RotatingText.jsx
│   ├── SplitText.jsx
│   ├── ASCIIText.jsx
│   └── FaultyTerminal.jsx
├── functions/
│   └── contact.js       # Netlify serverless function for contact form
└── App.jsx
```
- `components/`: Contains all React components, including reusable UI components and animations.  
- `functions/contact.js`: Handles sending emails via the contact form.  
- `App.jsx`: Main container, orchestrates all sections and visibility tracking.

---

## Components

Some notable components and their purpose:

- **Hero**: Animated ASCII text greeting with `FaultyTerminal` background.  
- **About**: Interactive card-based introduction to my skills, hobbies, and personal info.  
- **Projects**: Rotating text showing skills and a grid of clickable project cards linking to their respective GitHub repos.  
- **Footer**: Contact form with toast notifications and social media links.  
- **CardModal**: Reusable modal for project cards.  

> Many components like `FaultyTerminal`, `ASCIIText`, `Particles`, `LogoLoop`, `RotatingText`, and `SplitText` were sourced online, then customized extensively to fit my personal branding, colors, and design preferences.

---

## Development Process

1. **Planning**:  
   - Decided on a modern, minimalistic aesthetic with interactive features.  
   - Identified the sections and UI interactions needed.  

2. **Component Selection and Customization**:  
   - Researched open-source animated components.  
   - Modified existing components for personal styling, performance, and responsiveness.  

3. **Responsive Layout**:  
   - Used a combination of `styled-components` and CSS grid/flexbox to create adaptive layouts.  
   - Implemented screen-size detection for adaptive font sizes and layouts.  

4. **Interactivity & Animations**:  
   - Leveraged `Framer Motion` for entrance animations, hover effects, and popups.  

5. **Backend Integration**:  
   - Built a Netlify function using `Nodemailer` to handle contact form submissions.  
   - Tested email delivery and error handling thoroughly.  

6. **Deployment**:  
   - Hosted on Netlify with continuous deployment linked to GitHub repository.  
   - Ensured environment variables (like email credentials) are handled securely.

---

## Previous Website & Lessons Learned

My previous website had several issues:  

- **Poor code quality**: Hard-to-maintain and unorganized structure.  
- **Outdated design**: Colors, layout, and components felt outdated.  
- **Limited hosting capabilities**: Hosted on Hostinger, not ideal for continuous updates or serverless functions.  
- **Limited interactivity**: Lacked modern animations and dynamic components.  

> From this experience, I learned better project organization, modern React practices, responsive design, and effective use of serverless functions. This new website is cleaner, faster, and showcases my improved programming skills.

---

## Deployment

- Deployed on **Netlify** directly from GitHub for automatic updates.  
- Uses environment variables for email credentials.  

**Live Site:** [kinan.maarrawi.com](https://kinan.maarrawi.com)  

---

## Future Improvements

- Use less online sourced components, make more components from scratch
- Develop full on backend using MongoDB or the likes for contact form
- Use TypeScript (even though I don't believe in TS)

---

## License

This project is personal and open-source for educational purposes. You are free to explore, fork, and modify it for learning purposes.  

---

## Contact

If you want to get in touch, check out the **Footer** section of the site or send me an email via the contact form.  

---

*This portfolio demonstrates my growth as a full-stack developer and my journey to create a professional, interactive, and modern personal website.*
