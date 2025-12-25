# Database Connection Troubleshooting

## Current Issue

The development environment cannot connect to the PostgreSQL database at `praywith.faith:5432`. All connection attempts fail with TLS/SSL errors or timeout.

## Symptoms

- API returns 500 errors for all database queries
- Prayer generation and retrieval fail
- Console shows: "Failed query: select..." errors
- Direct connection tests fail with: "Client network socket disconnected before secure TLS connection was established"

## Attempted Fixes

1. ✗ Added `ssl: 'require'` - TLS handshake fails
2. ✗ Added `ssl: { rejectUnauthorized: false }` - TLS handshake fails  
3. ✗ Added `ssl: 'prefer'` - Connection timeout
4. ✗ Tried `ssl: false` - Protocol errors ("Unknown Message: 97")

## Possible Causes

1. **Firewall/Network**: Database server may not accept connections from sandbox IP
2. **SSL Configuration**: Server requires specific SSL/TLS setup not compatible with current config
3. **Protocol Version**: PostgreSQL version mismatch between client and server
4. **Authentication**: Connection string may need additional parameters

## Recommended Solutions

### Option 1: Check Database Server Configuration
SSH into `praywith.faith` and verify:
```bash
# Check if PostgreSQL is accepting external connections
sudo netstat -tulpn | grep 5432

# Check pg_hba.conf for allowed IPs
sudo cat /var/lib/postgresql/data/pg_hba.conf

# Check postgresql.conf for SSL settings
sudo grep ssl /var/lib/postgresql/data/postgresql.conf
```

### Option 2: Update DATABASE_URL
The connection string may need additional parameters:
```
postgresql://user:pass@praywith.faith:5432/dbname?sslmode=require
postgresql://user:pass@praywith.faith:5432/dbname?sslmode=disable
```

### Option 3: Allow Sandbox IP
Add the sandbox IP to PostgreSQL's allowed connections in `pg_hba.conf`.

### Option 4: Use Connection Pooler
If using a service like PgBouncer or Supabase, ensure the connection string points to the pooler, not direct PostgreSQL.

## Testing Connection

After making changes, test with:
```bash
cd /home/ubuntu/praywith-faith
node -e "import('postgres').then(async ({default: postgres}) => { 
  const sql = postgres(process.env.DATABASE_URL, {ssl: 'prefer'}); 
  const result = await sql\`SELECT version()\`; 
  console.log('Connected:', result); 
  await sql.end(); 
});"
```

## Current Workaround

The production server at `https://praywith.faith` has working database connectivity. The issue is isolated to the development sandbox environment.

## Files Modified

- `server/db.ts` - Updated database connection configuration with SSL options
