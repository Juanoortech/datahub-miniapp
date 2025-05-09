### Oort
> [!IMPORTANT]
> First of all, to run the project locally, you will need to fill out `.env` using the `.env.example`

```env
SECRET_KEY=

POSTGRES_DATABASE=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=

TELEGRAM_TOKEN=
TELEGRAM_URI=

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
$ docker compose -f docker-compose.prod.yaml up --build
$ docker compose -f docker-compose.test.yaml up --build
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

http://localhost:8000/api/v1/docs
http://localhost:8000/api/docs (redirects to /api/v1/docs)
http://localhost:8000/admin/