#!/bin/bash
set -e
echo "Starting web-toolkit setup..."
echo ""
echo "== Installing Claude Code skills =="
mkdir -p ~/.claude/skills

if [ ! -f ~/.claude/skills/frontend-design/SKILL.md ]; then
  mkdir -p ~/.claude/skills/frontend-design
  curl -fsSL https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md \
    -o ~/.claude/skills/frontend-design/SKILL.md
  echo "  ✓ frontend-design installed"
else
  echo "  - frontend-design already present, skipping"
fi

if [ ! -d ~/.claude/skills/emilkowalski ]; then
  git clone --depth 1 https://github.com/emilkowalski/skills.git /tmp/emil-skills
  cp -r /tmp/emil-skills/* ~/.claude/skills/ 2>/dev/null || true
  rm -rf /tmp/emil-skills
  echo "  ✓ emilkowalski/skills copied in"
fi

if [ ! -f ~/.claude/skills/web-design-guidelines/SKILL.md ]; then
  mkdir -p ~/.claude/skills/web-design-guidelines
  curl -fsSL https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/web-design-guidelines/SKILL.md \
    -o ~/.claude/skills/web-design-guidelines/SKILL.md 2>/dev/null && echo "  ✓ web-design-guidelines installed" || echo "  ! web-design-guidelines fetch failed"
fi

for repo in "coreyhaines31/marketingskills" "makash/great-web-copy" "boraoztunc/skills"; do
  tmpdir="/tmp/$(basename "$repo")"
  git clone --depth 1 "https://github.com/${repo}.git" "$tmpdir" 2>/dev/null || { echo "  ! failed to clone $repo"; continue; }
  cp -r "$tmpdir"/* ~/.claude/skills/ 2>/dev/null || true
  rm -rf "$tmpdir"
  echo "  ✓ $repo copied in"
done

echo ""
echo "Skill folders now in ~/.claude/skills/:"
ls ~/.claude/skills/
echo ""
echo "== Adding MCP servers =="

claude mcp add playwright -- npx -y @playwright/mcp@latest && echo "  ✓ playwright added" || echo "  ! playwright add failed"
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest && echo "  ✓ context7 added" || echo "  ! context7 add failed"
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest && echo "  ✓ chrome-devtools added" || echo "  ! chrome-devtools add failed"
claude mcp add shadcn -- npx -y shadcn@latest mcp && echo "  ✓ shadcn added" || echo "  ! shadcn add failed"

echo ""
echo "Registered MCP servers:"
claude mcp list
echo ""
echo "== Cloning reference repos =="
mkdir -p ~/reference-repos && cd ~/reference-repos

for repo in "darkroomengineering/lenis" "adrianhajdin/award-winning-website" "pmndrs/react-three-fiber" "pmndrs/drei" "greensock/GSAP" "swup/swup"; do
  name=$(basename "$repo")
  if [ ! -d "$name" ]; then
    git clone --depth 1 "https://github.com/${repo}.git" && echo "  ✓ cloned $repo" || echo "  ! failed to clone $repo"
  else
    echo "  - $name already cloned, skipping"
  fi
done

echo ""
echo "=============================================="
echo "Setup complete."
echo "Skills:   ~/.claude/skills/"
echo "MCP:      run 'claude mcp list' to check"
echo "Repos:    ~/reference-repos/"
echo "=============================================="
