# LCT 2025 - AR Interactive Experience

An augmented reality (AR) web application featuring interactive Soviet cartoon characters from classic Russian animations. Users can scan AR markers to interact with beloved characters like Gena the Crocodile, Cheburashka, Wolf, and Shapoklyak through mini-games and animations.

## Features

- **AR Marker Detection**: Scan physical markers to bring characters to life
- **Interactive Characters**:
  - **Gena the Crocodile**: Musical quiz game - guess the song Gena plays
  - **Wolf**: Egg-catching mini-game with scoring system
  - **Cheburashka**: Dynamic background changing
  - **Shapoklyak**: Interactive animations with her rat companion Lariska
- **3D Models**: High-quality GLB character models with animations
- **Audio Integration**: Character voices and sound effects
- **Responsive Design**: Optimized for both mobile and desktop devices

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics rendering
- **AR.js** - Augmented reality marker tracking
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router 7** - Navigation

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (recommended) or npm
- Webcam-enabled device for AR functionality

### Installation

```bash
# Install pnpm globally (if not already installed)
sudo npm i -g pnpm

# Clone the repository
git clone https://github.com/belchushka/lct-2025.git

# Navigate to project directory
cd lct-2025

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

```bash
# Create production build
pnpm run build

# Preview production build
pnpm run preview
```

## Project Structure

```
lct-2025/
├── public/                    # Static assets
│   ├── audio/                # Character audio files
│   ├── background/           # Background videos/images
│   ├── *.glb                 # 3D character models
│   ├── pattern-*.patt        # AR marker patterns
│   └── camera_para.dat       # AR camera parameters
├── src/
│   ├── characters/           # Character class implementations
│   │   ├── base.ts          # Base character class
│   │   ├── gena.ts          # Gena the Crocodile
│   │   ├── cheburashka.ts   # Cheburashka
│   │   ├── volk.ts          # Wolf
│   │   ├── shapoklyak.ts    # Shapoklyak
│   │   └── lariska.ts       # Lariska (rat)
│   ├── components/
│   │   ├── ui/              # UI components
│   │   └── EggCatchGame.tsx # Wolf's mini-game
│   ├── pages/
│   │   ├── start.tsx        # Landing page
│   │   └── ar.tsx           # Main AR experience
│   ├── App.tsx              # Application root
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## How to Use

1. **Start the Application**: Launch the app and grant camera permissions
2. **Print AR Markers**: Print the marker patterns from the `/public` directory:
   - `pattern-gena_marker.patt`
   - `pattern-volk_marker.patt`
   - `pattern-cheburashka.patt`
   - `pattern-shapoklyak_marker.patt`
3. **Scan Markers**: Point your camera at the printed markers to activate characters
4. **Interact**: Follow on-screen prompts to play games and interact with characters

## Character Interactions

### Gena the Crocodile
- Plays his iconic accordion
- Musical quiz: Guess the song ("Голубой вагон")
- Special goodbye animation and video on correct answer

### Wolf
- Interactive egg-catching game
- Score tracking
- Robot reveal animation after game completion

### Cheburashka
- Background changing feature
- Simple interaction with visual feedback

### Shapoklyak
- Animated character with Lariska the rat
- Multiple animation states

## Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build

## Browser Support

- Mobile browsers with camera access

## License

Private project - All rights reserved

## Contributors

- [belchushka](https://github.com/belchushka)
- [justmeowme](https://github.com/justmeowme)

---

Built with ❤️ for LCT 2025
