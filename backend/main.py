from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from routes.finance import finance_router
from logging_config import setup_logging

setup_logging()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://172.27.128.1:3000"],  # Allow your Next.js app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(finance_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}