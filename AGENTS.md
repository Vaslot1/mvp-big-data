# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Repository Overview

This is an OpenCode configuration repository containing MCP server configurations and GitHub skills. The repository is minimal and primarily contains configuration files for OpenCode tooling.

## Build/Lint/Test Commands

This repository doesn't contain traditional source code with build tools. However, here are the relevant operations:

### General Repository Operations
```bash
# Check repository status
git status

# Add and commit changes
git add .
git commit -m "descriptive message"

# Push changes to remote
git push origin main
```

### GitHub Operations
```bash
# Create a pull request
gh pr create --title "PR Title" --body "Description"

# Merge pull request with squash
gh pr merge <pr-number> --squash

# List pull requests
gh pr list

# View pull request details
gh pr view <pr-number>
```

### Stack Pull Request Workflow
For managing stacked PRs (see skills/github/references/stacked-pr-workflow.md):

```bash
# Rebase PR onto main (excluding old base commits)
git rebase --onto origin/main <old-base-branch> <current-branch>

# Force push with lease (safer than force push)
git push --force-with-lease origin <branch-name>

# Update PR base to main
gh pr edit <pr-number> --base main

# Merge with squash using PR title
gh pr merge <pr-number> --squash --title "PR Title (#<pr-number>)"
```

## Code Style Guidelines

### File Structure
- Configuration files go in `.opencode/`
- Skills are organized in `.opencode/skills/<skill-name>/`
- Each skill should have a `SKILL.md` with frontmatter
- References and documentation go in `references/` subdirectories

### Configuration Files
- Use JSON format for OpenCode configuration
- Follow the schema at https://opencode.ai/config.json
- MCP server configurations go under the `mcp` key
- Keep API keys as placeholders (`your_api_key_here`)

### Markdown Files
- Use YAML frontmatter with proper metadata
- Include title, tags, and description where appropriate
- Use GitHub-flavored markdown
- Keep line length reasonable for readability

### Naming Conventions
- Use kebab-case for directory names
- Use lowercase with hyphens for file names
- Skill names should be descriptive and single-word when possible
- PR titles should be concise and descriptive

### Error Handling
- When Git operations fail, provide clear error messages
- For merge conflicts during rebase operations, always ask user to resolve manually
- Use `--force-with-lease` instead of `--force` for safer force pushes
- Never auto-resolve conflicts - always pause and ask for user intervention

### Git Workflow
- Always run `git status` before making changes to understand current state
- Pull latest changes before starting new work
- Use descriptive commit messages that explain the "why" not just "what"
- When working with stacked PRs, follow the documented workflow carefully

### Security Practices
- Never commit actual API keys or secrets
- Use placeholder values for sensitive configuration
- Keep `.gitignore` updated to exclude sensitive files
- Review changes before committing to ensure no secrets are included

## Testing

This repository doesn't contain traditional unit tests. However, you can validate configurations by:

1. Checking JSON syntax:
```bash
# Validate JSON files
cat .opencode/opencode.json | jq .
```

2. Testing GitHub CLI commands:
```bash
# Verify gh CLI is working
gh auth status

# Test PR creation (dry run)
gh pr create --dry-run
```

## OpenCode Specific Guidelines

- MCP servers should be configured as remote when possible
- Include proper headers for API authentication
- Use descriptive names for MCP server configurations
- Keep skill documentation focused and actionable
- Reference external documentation with absolute URLs when needed

## Common Issues

- If API keys are missing, agents should prompt users to configure them
- For GitHub operations, ensure authentication is set up with `gh auth login`
- When working with stacked PRs, always verify the branch structure before making changes
- If `git rebase` encounters conflicts, stop and ask user to resolve manually

## Repository Maintenance

- Regularly update skill documentation
- Keep references current with latest GitHub CLI patterns
- Review and update MCP server configurations as needed
- Ensure all JSON files are valid and follow the schema