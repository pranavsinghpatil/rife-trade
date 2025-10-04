import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMMA_API_KEY = os.getenv("GEMMA_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemma-7b:generateText?key={GEMMA_API_KEY}"

payload = {
    "message": {"text": "Hello from Gemma API!"},
    "temperature": 0.7
}

res = requests.post(url, json=payload)
print(res.status_code)
print(res.text)
