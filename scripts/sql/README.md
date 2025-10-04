# 🔧 SQL Scripts Collection

This directory contains all SQL scripts for database operations, testing, and maintenance.

## 📂 Script Categories

### 🏗️ Setup Scripts
- `setup_users_table.sql` - User table creation and configuration
- `setup_user_invites.sql` - User invitation system setup
- `setup_admin_deletion_refunds.sql` - Admin refund system
- `setup_automatic_payments_cron.sql` - Automated payment processing

### 🔒 Security & Permissions
- `add_admin_policies.sql` - Admin role policies
- `add_tutor_policies.sql` - Tutor permission policies
- `add_tutor_delete_policies.sql` - Tutor deletion permissions
- `fix_rls_policies.sql` - Row Level Security fixes
- `debug_rls_policies.sql` - RLS troubleshooting

### 🧪 Testing Scripts
- `test_user_creation.sql` - User creation testing
- `test_recurring_lessons.sql` - Recurring booking tests
- `test_group_sessions.sql` - Group session validation
- `test_payment_logs.sql` - Payment system testing
- `create_test_data.sql` - Test data generation
- `create_test_bookings.sql` - Test booking creation

### 🔧 Maintenance & Fixes
- `cleanup_bookings_safe.sql` - Safe booking cleanup
- `cleanup_database.sql` - Database maintenance
- `fix_auth_system.sql` - Authentication fixes
- `fix_users_table_rls_recursion.sql` - RLS recursion fixes
- `prevent_double_booking.sql` - Booking conflict prevention

### 📊 Analytics & Diagnosis
- `diagnose_tutor_permissions.sql` - Permission diagnostics
- `diagnose_user_issues.sql` - User problem analysis

### 🚨 Emergency Scripts
- `emergency_disable_rls_users.sql` - Emergency RLS disable
- `emergency_fix_rls.sql` - Emergency RLS repairs

## 🔄 Usage Instructions

### For Development:
1. Use test scripts to validate functionality
2. Create test data for local development
3. Debug permissions with diagnostic scripts

### For Production:
1. **Always backup before running maintenance scripts**
2. Test on staging environment first
3. Run during low-traffic periods
4. Monitor logs after execution

### For Troubleshooting:
1. Start with diagnostic scripts
2. Use debug scripts to identify issues
3. Apply appropriate fix scripts
4. Validate with test scripts

## ⚠️ Safety Guidelines

- **Never run scripts directly in production without testing**
- **Always backup database before maintenance operations**
- **Review script contents before execution**
- **Monitor application behavior after changes**
- **Keep emergency contact information available**

## 📝 Adding New Scripts

When adding new SQL scripts:
1. Use descriptive, categorized naming
2. Add comprehensive comments
3. Include rollback procedures where applicable
4. Test thoroughly in development environment
5. Update this README with new script descriptions