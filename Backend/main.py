from fastapi import FastAPI
from router import auth

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

app.include_router(auth.router)