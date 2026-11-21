# Contributing to Sling

Thank you for your interest in contributing to Sling! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

- Use the GitHub issue tracker to report bugs
- Check if the issue has already been reported
- Include steps to reproduce the issue
- Provide your environment details (OS version, browser, etc.)

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make your changes
4. Run tests and ensure code quality:
   ```bash
   pnpm run check
   pnpm run build
   ```
5. Commit your changes with a clear message
6. Push to your fork and submit a pull request

### Code Style

- We use Biome for linting and formatting
- Run `pnpm run check:fix` before committing
- Follow the existing code patterns

### Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run checks
pnpm run check
```

## License

By contributing to Sling, you agree that your contributions will be licensed under the MIT License.