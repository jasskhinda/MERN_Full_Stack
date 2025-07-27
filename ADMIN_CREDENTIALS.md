# 🛡️ Admin Access Credentials

## Demo Administrator Account

The system has been configured with a single administrator account for demo purposes:

**Email:** `admin@mernstack.com`  
**Password:** `Admin@123!`

## Important Security Notes

⚠️ **For Production Use:**
- Change the admin password immediately after deployment
- Use strong, unique passwords
- Enable two-factor authentication if available
- Regularly rotate credentials

## Admin Panel Access

1. Visit: `https://your-domain.com/admin/login`
2. Enter the credentials above
3. You will be redirected to the admin dashboard

## Admin Capabilities

- ✅ View all users and system statistics
- ✅ Delete regular user accounts (with confirmation)
- ✅ Configure system settings
- ✅ Monitor audit logs
- ✅ View comprehensive dashboard analytics
- ❌ Cannot delete own admin account
- ❌ Cannot promote other users to admin (single admin system)
- ❌ Cannot demote admin role (protection against lockout)

## System Design

This system maintains **exactly one administrator** to ensure:
- Clear authority structure
- No accidental admin privilege escalation
- Protection against administrative lockout
- Simplified permission management

---

🤖 Generated with [Claude Code](https://claude.ai/code)