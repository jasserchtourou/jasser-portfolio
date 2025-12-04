# 🚀 Jasser Portfolio — AI Engineer Portfolio by Jasser Chtourou

Welcome to **Jasser Portfolio**, an interactive 3D neural-universe portfolio that visualizes my AI engineering experience as a living system of interconnected nodes.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Add Your Photo
Your photo is already set up at: `/public/images/jasser-photo.png`
- The photo will display automatically on the About page
- If you want to update it, replace the file at the same location
- Formats supported: JPG, PNG, or WebP

### 3. (Optional) Add Local Video
If you want the Plug&Plai video to play locally instead of LinkedIn:
- Download the video from LinkedIn
- Save as: `/public/videos/plug-plai-demo.mp4`
- The site will automatically use the local video if available

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **React Three Fiber** (3D)
- **Three.js**
- **Framer Motion**
- **TailwindCSS**
- **Zustand** (State Management)

## 📁 Project Structure

```
/app                 # Next.js pages
  /about            # About page
  /landing          # Landing page
  page.jsx          # Main 3D universe page
/src
  /components        # React components
    - NeuralGraph   # Main 3D graph component
    - Node          # 3D node component
    - Edge          # 3D edge/connection component
    - ProjectPanel  # Project details panel
    - SidebarPanel  # Core node panel
    - NavBar        # Navigation bar
  /data             # JSON data files
    - projects.json
    - experience.json
    - skills.json
  /lib              # Utilities
    - graphLayout.js
    - colorMap.js
  /store            # State management
    - useStore.js
```

## 📬 Contact

**Jasser Chtourou**  
AI Engineer (RAG, NLP, CV, Voice AI)  
📧 jasser278@gmail.com  
🔗 LinkedIn: linkedin.com/in/jasser-chtourou  
🐙 GitHub: github.com/jasserchtourou

