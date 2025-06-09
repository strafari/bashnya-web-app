from fastapi_users.authentication import CookieTransport, AuthenticationBackend
from fastapi_users.authentication import JWTStrategy

cookie_transport = CookieTransport(
    cookie_name="bonds",
    cookie_max_age=3600,
    cookie_secure=True,        # кука только по HTTPS
    cookie_samesite="none"     # разрешаем кросс-сайт (именно cookie_samesite)
)

SECRET = "SECRET"

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)


