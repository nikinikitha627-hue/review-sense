"""Auth routes — register, login, token refresh"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from core.security import create_access_token, hash_password, verify_password

router = APIRouter()

# ── In-memory user store (replace with DB model for prod) ─────────
_users: dict = {}


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    username: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/register", status_code=201)
async def register(req: RegisterRequest):
    if req.email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")
    _users[req.email] = {
        "id": str(len(_users) + 1),
        "email": req.email,
        "username": req.username,
        "password_hash": hash_password(req.password),
    }
    return {"message": "User registered", "email": req.email}


@router.post("/token", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = _users.get(form.username)  # username field = email
    if not user or not verify_password(form.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token)


@router.get("/me")
async def me(current_user: dict = Depends(__import__("core.security", fromlist=["get_current_user"]).get_current_user)):
    return current_user
