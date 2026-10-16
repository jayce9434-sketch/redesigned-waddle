# Orbit Darts

Orbit Darts is a progression-heavy browser arcade game built for GitHub Pages. Fire darts into a spinning target without colliding with darts already embedded in the ring, clear stages, complete missions, fight boss stages, collect effects, and build permanent upgrades.

## Main systems

- Precision spinning-target dart gameplay with changing stage patterns
- Boss stage every 5 stages
- Stage missions, combo multipliers, account levels, lives, shields, and progression
- Two currencies: Coins and Prisms
- Nine permanent Coin upgrades
- Twenty collectible dart effects across Common, Uncommon, Rare, Epic, Legendary, Mythical, and Divine rarities
- Effects visually change darts, trails, impact styling, and give gameplay boosts
- Effect pity system plus duplicate-to-Shard conversion
- Daily Prize Wheel with a visible 5% Grand Prize segment
- Daily Scratch Ticket with three separate grand-prize outcomes in its reward table
- Daily 4x4 Memory Grid with performance-based rewards
- One free use per daily activity, plus Prism refreshes and instant Quick Claim options
- Six hard-to-obtain permanent passes, including Triple Roll License
- Triple Roll unlock lets you roll three effects at once permanently
- Local save data and full reset option
- Master volume setting from 0% to 20,000%, with compression at extreme values
- Screen shake, particles, and reduced-motion settings
- Responsive desktop/tablet/mobile layout
- Install-ready app icon and web manifest
- No emoji characters are used in the game UI or source text

## Controls

- Tap or click the play field, or press Space, to fire a dart.
- Use the navigation panels to open Upgrades, Effects, Daily Arcade, Permanent Passes, and Settings.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload every file from this package to the repository root. Do not put the files inside another folder.
3. In the repository, open Settings > Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will provide the public game URL after deployment finishes.

## Files

- `index.html` - game layout and screens
- `styles.css` - full visual design and responsive styling
- `game.js` - gameplay, progression, saves, daily systems, effects, upgrades, passes, and audio
- `icon.png` - 1024x1024 app icon
- `manifest.json` - install/app metadata
- `screenshot1-gameplay.png` through `screenshot5-memory.png` - screenshots captured from the running build for QA

## Save data

Progress is stored with browser `localStorage`. Clearing browser site data or using Reset Save Data inside Settings will erase the local save.
