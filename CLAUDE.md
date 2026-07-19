# Web Toolkit Project

A comprehensive web development environment with Claude Code skills, MCP servers, and reference repositories pre-configured.

## 🎯 Project Overview

This project provides an integrated setup for modern web development with:
- 40+ Claude Code skills for design, animation, copywriting, SEO, and performance
- 4 free MCP servers for browser automation, development tools, and UI components
- 12 reference repositories demonstrating web development patterns
- Per-project package management for Motion, GSAP, and Lenis

## 🛠️ MCP Servers

These are automatically available for use in Claude Code:

- **playwright** - Browser automation, testing, and web scraping
  - Command: `npx -y @playwright/mcp@latest`
  - Free, no API key needed

- **context7** - Context storage and retrieval
  - Command: `npx -y @upstash/context7-mcp@latest`
  - Free, no API key needed

- **chrome-devtools** - DevTools integration for debugging and inspection
  - Command: `npx -y chrome-devtools-mcp@latest`
  - Free, no API key needed

- **shadcn** - Component exploration and UI patterns
  - Command: `npx -y shadcn@latest mcp`
  - Free, no API key needed

## 🎨 Available Skills

Claude Code skills are organized in `~/.claude/skills/`. Key skills include:

### Design & Animation
- `frontend-design` - Production-grade frontend interfaces
- `apple-design` - Apple's design philosophy and fluid motion
- `emil-design-eng` - Emil Kowalski's UI polish principles
- `css-animations` - CSS keyframe patterns for HyperFrames
- `gsap` - GSAP animation reference
- `waapi` - Web Animation API patterns
- `make-interfaces-feel-better` - Interface polish techniques
- `review-animations` - Animation critique and improvement
- `find-animation-opportunities` - Identifying animation moments
- `improve-animations` - Animation enhancement
- `animation-vocabulary` - Animation terminology and concepts
- `three` - Three.js 3D graphics
- `lottie` - Lottie animation integration
- `animejs` - Anime.js pattern adapter

### Web Performance & Architecture
- `web-design-guidelines` - Vercel's web design standards
- `web-perf` - Cloudflare web performance optimization
- `vercel-react-best-practices` - React patterns and optimization
- `conductor-rewrite-performance` - Local-first desktop app optimization

### Content & Marketing
- `copywriting` - Marketing copy creation
- `copy-editing` - Copy review and refinement
- `content-strategy` - Content planning and topics
- `competitor-alternatives` - Competitive landing pages
- `ogilvy` - Classic advertising principles
- `page-cro` - Conversion rate optimization
- `stop-slop` - Avoiding AI-generated aesthetics

### Development Productivity
- `schema-markup` - Structured data implementation
- `seo-audit` - SEO analysis and improvement
- `programmatic-seo` - Automated SEO strategies
- `analytics-tracking` - Analytics implementation and GTM
- `hyperframes` - Video composition and animation
- `hyperframes-cli` - HyperFrames CLI tooling
- `hyperframes-media` - Asset preprocessing (TTS, transcription, background removal)
- `hyperframes-registry` - Registry block and component installation

### Utilities
- `docx`, `pdf`, `pptx`, `xlsx` - Document manipulation
- `dataviz` - Chart and data visualization
- `skill-creator` - Custom skill authoring

## 📚 Reference Repositories

Located in `~/reference-repos/`:

- **Lenis** (`darkroomengineering/lenis`) - Smooth scrolling library
- **Award-winning Website** (`adrianhajdin/award-winning-website`) - Production site examples
- **React Three Fiber** (`pmndrs/react-three-fiber`) - React 3D graphics
- **Drei** (`pmndrs/drei`) - React Three Fiber utilities
- **GSAP** (`greensock/GSAP`) - Animation library reference
- **Swup** (`swup/swup`) - Page transition library
- **Anime.js** (`juliangarnier/anime`) - Animation engine
- **OGL** (`oframe/ogl`) - WebGL wrapper
- **GPU Curtains** (`martinlaxenaire/gpu-curtains`) - WebGL curtain effects
- **HyperFrames** - Video composition (included in skills)

### Additional Resources (not repos)
- **Codrops** - Browse https://github.com/codrops for specific demos
- **Utopia** - Free web tool at https://utopia.fyi (no repo)
- **gggrain** - Free web tool at https://fffuel.co (no repo)

## 📦 Per-Project Dependencies

These should be installed INSIDE individual projects, not globally:

```bash
# Inside your React project
npm i motion        # Framer Motion
npm i gsap         # GSAP animation
npm i lenis        # Smooth scroll
```

See `~/reference-repos/README-remember.md` for detailed instructions.

## 🚀 Quick Start

### Run Setup Script
```bash
./setup-web-toolkit.sh
```

This will:
1. Install all Claude Code skills from multiple sources
2. Register all MCP servers
3. Clone all reference repositories

### Verify Installation
```bash
# Check skills
ls ~/.claude/skills/

# Check MCP servers
claude mcp list

# Check reference repos
ls ~/reference-repos/
```

## 💡 Using in Claude Code

When working on web projects in Claude Code:

1. **For animations** → Use `apple-design`, `gsap`, `three`, `waapi`
2. **For UI polish** → Use `frontend-design`, `emil-design-eng`, `make-interfaces-feel-better`
3. **For performance** → Use `web-perf`, `conductor-rewrite-performance`, `vercel-react-best-practices`
4. **For video** → Use `hyperframes`, `hyperframes-cli`, `hyperframes-media`
5. **For content** → Use `copywriting`, `content-strategy`, `seo-audit`
6. **For browser testing** → Use the playwright MCP server
7. **For component patterns** → Use the shadcn MCP server and reference repos

## 🔧 Configuration

All MCP servers are configured in `.claude.json` (project-level) or `~/.claude.json` (global).

To add additional skills or MCP servers:
```bash
# Add a global skill
mkdir -p ~/.claude/skills/my-skill
# Copy SKILL.md files to that directory

# Add an MCP server
claude mcp add <name> -- <command>
```

## 📝 Project Structure

```
.
├── CLAUDE.md                    # This file
├── setup-web-toolkit.sh         # Automated setup script
├── ~/.claude/skills/            # All Claude Code skills
├── ~/reference-repos/           # Reference repositories
└── .claude.json                 # Local MCP configuration
```

## 🎓 Learning Resources

- Read skill files in `~/.claude/skills/` for detailed guidance
- Browse reference repos in `~/reference-repos/` for implementation examples
- Use `/code-review`, `/verify`, `/simplify` when working with Claude Code
- Check skill documentation for specific techniques (e.g., `~/.claude/skills/gsap/SKILL.md`)

## 🔄 Updating

To refresh skills and repos:
```bash
./setup-web-toolkit.sh
```

The script is idempotent—it will skip already-installed items.

## ⚡ Tips

- **Animation workflow**: Reference Lenis, Anime.js, OGL, and GPU Curtains repos alongside GSAP and apple-design skills
- **Performance**: Use web-perf and conductor-rewrite-performance skills when optimizing
- **3D graphics**: Combine React Three Fiber, Drei, and Three.js skills with OGL/GPU Curtains repos
- **Content**: Use copywriting + content-strategy + seo-audit skills together
- **Video**: Use hyperframes skills with chrome-devtools MCP for testing

---

**Setup Date**: Generated with web-toolkit automation  
**Skills**: 40+ pre-configured  
**MCP Servers**: 4 free, no API keys  
**Reference Repos**: 12 cloned and ready
