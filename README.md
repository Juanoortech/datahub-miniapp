### Oort
>
> [!IMPORTANT]
> First of all, to run the project locally, you will need to fill out `.env` using the `.env.example`

```env
SECRET_KEY=

POSTGRES_DATABASE=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=
```

Then you can use the compose system to run the `dev` version. The default docker-compose is working with python on-hot-reloading, so, you will need to rebuild container only if changing models or adding pip packages.

```sh
docker compose --profile full up --build  
```

There are some profiles to separate running.

- `full`
- `backend-only`

> [!NOTE]
> If you want to run it in production, you can use my images or build your own.

_You can use Docker Swarm or k8s (and translate docker files there), but for a small scale app compose system is enough_

Some server's docker-compose files are:

```sh
docker compose -f docker-compose.prod.yaml up --build
docker compose -f docker-compose.test.yaml up --build
```

> [!IMPORTANT]  
> The prod one is a stable version with -demo- images**

_Both of them are not working with sources, they uses docker-images to build and run containers and will create all needed folders._

After all, **you will need to run a reverse proxy** (NGinx for example), if you **want it to be available publicly**, you should add some staticfiles alias to make an admin panel work.
I will not add any examples here, cause It really depends on the situation (what proxy you will use and how).

**Make sure, you have changed the CORS and CSRF settings.**

```python
ALLOWED_HOSTS = [
    "ADDHEREYOURDOMAINS or *"
]
CSRF_TRUSTED_ORIGINS = [
    "ADDHEREYOURDOMAINS or *"
]
CSRF_ALLOWED_ORIGINS = [
    "ADDHEREYOURDOMAINS or *"
]
CORS_ORIGINS_WHITELIST = [
    "ADDHEREYOURDOMAINS or *"
]
```

**And then change CORS plugin settings ([the documentation is here](https://github.com/adamchainz/django-cors-headers)), for instance:**

```python
CORS_ALLOW_ALL_ORIGINS = True ## Ignoring every CORS lists
CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)
CORS_ALLOW_CREDENTIALS = True
```

> [!TIP]
> Then you will need to create a root user, if you want to use an admin panel.

```sh
$ docker exec -it backend sh
$ python manage.py createsuperuser
# Then follow the instructions
```

<http://localhost:8000/api/v1/docs>
<http://localhost:8000/api/docs> (redirects to /api/v1/docs)
<http://localhost:8000/admin/>

# DataHub MiniApp

## Getting Started (Docker)

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd datahub-miniapp
```

### 2. Environment Variables
- Copy `.env.example` to `.env` and fill in any required secrets.

### 3. Build and Start the Stack
```sh
docker-compose up --build
```
- This will start the backend, frontend, and database containers.

### 4. Run Migrations (First Time or After Model Changes)
```sh
docker-compose exec backend python manage.py makemigrations
# (Optional: for specific apps)
docker-compose exec backend python manage.py makemigrations accounts challenges tasks service

docker-compose exec backend python manage.py migrate
```

### 5. Create a Superuser (for Django Admin)
```sh
docker-compose exec backend python manage.py createsuperuser
```

### 6. Access the App
- **Frontend:** http://localhost:3000
- **Backend API/Swagger:** http://localhost:8000/api/docs
- **Django Admin:** http://localhost:8000/admin

---

## Web3 Authentication (How to Test)

### 1. Generate a Signature
You need:
- `wallet_address`: Your Ethereum wallet address
- `message`: The message to sign (e.g., `Sign in to DataHub at 2025-05-14T12:00:00Z`)
- `signature`: The signature of the message, signed by your wallet

#### **MetaMask**
- Open MetaMask, go to "Sign Message" (or use a dApp that lets you sign messages)
- Enter the message and sign it
- Copy the resulting signature (should start with `0x` and be 130 hex characters)

#### **Ethers.js (Node.js)**
```js
const { ethers } = require("ethers");
const privateKey = "YOUR_PRIVATE_KEY"; // for testing only!
const wallet = new ethers.Wallet(privateKey);
const message = "Sign in to DataHub at 2025-05-14T12:00:00Z";
wallet.signMessage(message).then(signature => {
  console.log(signature);
});
```

#### **MyCrypto/MyEtherWallet**
- Use the "Sign Message" tool
- Copy the signature

### 2. Test the Endpoint
- Go to http://localhost:8000/api/docs
- Use the `/api/v1/accounts/auth/web3/` endpoint
- Example request body:
```json
{
  "wallet_address": "0xYourWalletAddress",
  "signature": "0x...",
  "message": "Sign in to DataHub at 2025-05-14T12:00:00Z"
}
```

---

## Troubleshooting
- **Missing table errors:**
  - Run migrations for all apps:
    ```sh
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    ```
- **Signature errors:**
  - Make sure you are sending a 65-byte (130 hex chars) signature, not a hash or private key.
- **Resetting migrations (if needed):**
  - Danger: This will delete all data!
    ```sh
    docker-compose exec backend python manage.py migrate challenges zero
    docker-compose exec backend python manage.py migrate tasks zero
    docker-compose exec backend python manage.py migrate accounts zero
    docker-compose exec backend python manage.py migrate service zero
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    ```

---

## Notes
- All user authentication and relations are Web3-native (by wallet address).
- No Telegram logic remains in the backend.
- For any issues, check logs with:
  ```sh
  docker-compose logs backend
  ```
