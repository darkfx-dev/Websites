# Setting Up Claude Code for a New Web Project

This guide explains how to use the web toolkit configuration files to instantly connect all skills, MCP servers, and references to a new Claude Code project.

## 📋 Files Included

- **`CLAUDE.md`** - Project documentation with skills inventory and setup instructions
- **`.claude.json`** - Configuration file with all MCP servers and skills pre-configured
- **`setup-web-toolkit.sh`** - Automated setup script for global installation

## 🚀 For a New Project

### Option 1: Quick Copy (Recommended)

When starting a new Claude Code project, copy these files from the web toolkit directory:

```bash
# Copy CLAUDE.md
cp /path/to/web-toolkit/CLAUDE.md ./CLAUDE.md

# Copy .claude.json
cp /path/to/web-toolkit/.claude.json ./.claude.json

# Copy setup script (optional)
cp /path/to/web-toolkit/setup-web-toolkit.sh ./setup-web-toolkit.sh
```

Then run setup once:
```bash
./setup-web-toolkit.sh
```

This gives you:
- ✅ All 40+ skills automatically available
- ✅ All 4 MCP servers configured
- ✅ All 12 reference repos cloned to `~/reference-repos/`
- ✅ Full project documentation in CLAUDE.md

### Option 2: Manual Project Configuration

In your new project's directory:

1. **Create CLAUDE.md** with your project description and skills
2. **Create .claude.json** listing the MCP servers you need
3. **Run** `setup-web-toolkit.sh` for global setup

Example minimal `.claude.json` for a simple project:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  },
  "skills": [
    "frontend-design",
    "gsap",
    "copywriting"
  ]
}
```

## 🎯 Common Project Setups

### React Component Library

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "mcp"]
    }
  },
  "skills": [
    "frontend-design",
    "emil-design-eng",
    "vercel-react-best-practices",
    "code-review"
  ]
}
```

### Animation-Heavy Site

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  },
  "skills": [
    "gsap",
    "apple-design",
    "three",
    "waapi",
    "make-interfaces-feel-better",
    "review-animations"
  ]
}
```

### Marketing/Landing Page

```json
{
  "skills": [
    "copywriting",
    "content-strategy",
    "page-cro",
    "seo-audit",
    "schema-markup",
    "frontend-design"
  ]
}
```

### 3D Graphics Project

```json
{
  "skills": [
    "three",
    "gsap",
    "waapi",
    "vercel-react-best-practices"
  ]
}
```

### Video/Hyperframes Project

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  },
  "skills": [
    "hyperframes",
    "hyperframes-cli",
    "hyperframes-media",
    "hyperframes-registry",
    "gsap",
    "waapi"
  ]
}
```

## 💾 What Gets Installed Where

### Global (one-time setup via `setup-web-toolkit.sh`)
- `~/.claude/skills/` - All 40+ Claude Code skills
- `~/reference-repos/` - All 12 reference repositories
- `~/.claude.json` - Global MCP server configuration

### Per-Project (in your project directory)
- `CLAUDE.md` - Project documentation
- `.claude.json` - Project-specific MCP and skill config
- `package.json` - Your project dependencies

### Per-Project Dependencies (in individual projects)
```bash
npm i motion    # Framer Motion
npm i gsap      # GSAP (if not already globally installed)
npm i lenis     # Smooth scrolling
```

## 🔧 Workflow

### First Time in Claude Code

1. Copy `CLAUDE.md` and `.claude.json` to your project
2. Run `./setup-web-toolkit.sh` (first time only, takes ~5 min)
3. Restart Claude Code
4. All skills and MCP servers automatically available

### Starting a New Project

```bash
# Create project
mkdir my-web-project
cd my-web-project

# Copy toolkit files
cp /path/to/web-toolkit/CLAUDE.md ./CLAUDE.md
cp /path/to/web-toolkit/.claude.json ./CLAUDE.json

# Customize CLAUDE.md with your project info
# Customize .claude.json with only the skills you need

# Create your project (e.g., with Vite, Next.js, etc.)
npm create vite@latest . -- --template react-ts

# That's it! Claude Code now has all your tools
```

## 📚 Using Skills in Claude Code

Once configured, use skills by name:

```
/frontend-design
/gsap
/copywriting
/seo-audit
/code-review
```

Or just mention them naturally in chat:
> "Use the apple-design skill to make this feel more polished"

## 🛠️ MCP Servers in Action

Once configured, MCP servers are automatically available:

**Playwright MCP:**
- Browser automation
- Testing
- Screenshot/PDF generation
- Web scraping

**Chrome DevTools MCP:**
- Performance profiling
- DOM inspection
- Network debugging
- Storage access

**shadcn MCP:**
- Component discovery
- UI pattern browsing
- Copy component code

**Context7 MCP:**
- Store and retrieve context
- Cross-session memory

## 🔄 Updating Skills and Repos

Skills and repos in `~/.claude/skills/` and `~/reference-repos/` are global and shared across all your projects. To update:

```bash
./setup-web-toolkit.sh
```

The script is idempotent—it will skip already-installed items.

## ✅ Verification

Check everything is set up:

```bash
# Verify skills installed
ls ~/.claude/skills/ | wc -l  # Should show 40+

# Verify MCP servers
claude mcp list  # Should show 4 servers

# Verify reference repos
ls ~/reference-repos/  # Should show 9 repos

# Verify project config
cat .claude.json  # Should show your project's config
```

## 🎓 Next Steps

1. Read `CLAUDE.md` for full documentation
2. Browse `~/reference-repos/` for code examples
3. Use `/code-review` on your work
4. Use `/verify` to test changes
5. Use skill names to guide Claude Code's work

## 📝 Customizing

### For a Specific Project

Edit `.claude.json` to include only the skills you need. Example:

```json
{
  "skills": [
    "frontend-design",
    "gsap",
    "code-review"
  ]
}
```

### Adding New Skills

1. Download skill files to `~/.claude/skills/my-skill/`
2. Add to `.claude.json` or just use `/my-skill` in chat
3. Or create custom skills using `/skill-creator`

### Adding New MCP Servers

```bash
claude mcp add <name> -- <command>
```

Then add to `.claude.json` and commit.

## 🆘 Troubleshooting

### Skills not showing up
```bash
# Reload Claude Code
# Check skills installed:
ls ~/.claude/skills/
# Try using skill name: /frontend-design
```

### MCP server not connecting
```bash
# Check health:
claude mcp list

# Reinstall:
claude mcp add <name> -- <command>
```

### Setup script fails
- Check internet connection
- Ensure `git` is installed
- Try running again—some repos may have temporary issues

---

**Web Toolkit Configuration**  
Ready to use in any new Claude Code project.  
All skills and MCP servers pre-configured and documented.
