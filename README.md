# InterviewIQ

Simple interview-practice webapp (client + server).

**Prerequisites**
- Node.js (16+ recommended)
- npm
- MongoDB Atlas account (or a reachable MongoDB instance)

**Repository layout**
- `client/` — React + Vite frontend
- `server/` — Express API, MongoDB via Mongoose

**Environment**
Copy `.env` files and fill values:

- Server env: [server/.env](server/.env#L1-L8)

Key variables (examples):
```
PORT=8000
MONGODB_URL=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

Important MongoDB note
- On some Windows machines the Node driver may fail SRV DNS lookups (error: `querySrv ECONNREFUSED`).
- If you see that, use a non-SRV (mongodb://) connection string that lists the replica set hosts instead of `mongodb+srv://` — this bypasses the SRV lookup. Example format used during troubleshooting:
```
mongodb://<user>:<pass>@host1:27017,host2:27017,host3:27017/?authSource=admin&replicaSet=your-replicaset&tls=true&retryWrites=true&w=majority
```
- If you reach Atlas but get `MongoServerError: bad auth`, verify the Atlas database user credentials and that the user has the correct authentication database and roles.

**Run (development)**
Start server from the `server` folder:

```powershell
cd server
npm install
npm run dev
```

Start client from the workspace root or `client` folder:

```bash
cd client
npm install
npm run dev
```

**Troubleshooting**
- DNS/SRV errors: try the non-SRV URI as above.
- Authentication errors: double-check user/password in [server/.env](server/.env#L1-L8) and the Atlas user config.
- Network/connectivity: ensure your machine can reach the Atlas hosts on port 27017 (firewall/ISP may interfere).

**Next steps**
- Update the values in [server/.env](server/.env#L1-L8) with correct Atlas credentials and retry.

---
Created to help get the project running and capture the MongoDB SRV troubleshooting steps encountered locally.