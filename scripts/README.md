# 🚀 Scripts Collection

This directory contains utility scripts, automation tools, and miscellaneous code files.

## 📂 Directory Structure

### `/sql/` - Database Scripts
All SQL scripts for database operations, testing, and maintenance.
See [sql/README.md](sql/README.md) for detailed information.

### `/deployment/` - Deployment Automation
Scripts and tools for application deployment:
- Batch files for automated deployment
- Environment setup scripts
- Configuration management tools

## 📄 Root Level Scripts

### JavaScript/TypeScript Files
- `*.js` - Utility scripts and automation
- `*.ts` - TypeScript utilities and helpers
- `create-payment-clean.ts` - Clean payment implementation
- `temp-password-approach.js` - Authentication utilities

### Code Snippets
- `CREATE_RECURRING_LESSONS_CODE.txt` - Code templates
- `EMERGENCY_METADATA_FIX.js` - Emergency fixes

### Batch Files
- `*.bat` - Windows automation scripts
- `RECURRING_PAYMENT_UPDATE.bat` - Payment system updates

## 🔧 Usage Guidelines

### Development Scripts
- Use for local development automation
- Test thoroughly before deploying
- Keep backup copies of working versions

### Production Scripts
- **Never run directly in production**
- Test in staging environment first
- Have rollback procedures ready
- Monitor system after execution

### Maintenance Scripts
- Run during low-traffic periods
- Backup data before major operations
- Log all script executions
- Validate results after completion

## 📝 Script Management

### Adding New Scripts
1. Use clear, descriptive naming
2. Add appropriate file extensions
3. Include comprehensive comments
4. Document usage instructions
5. Test in development environment

### Script Categories
- **Utility**: Helper functions and common operations
- **Automation**: Scheduled tasks and batch operations
- **Deployment**: Build and deployment automation
- **Emergency**: Quick fixes and emergency procedures
- **Testing**: Validation and testing utilities

## ⚠️ Security Notes

- Store sensitive scripts in secure locations
- Use environment variables for credentials
- Avoid hardcoding API keys or passwords
- Review third-party scripts before use
- Keep audit trail of script executions