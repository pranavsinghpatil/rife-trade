def check_services() -> StatusResponse:
    ...
    # Ollama
    try:
        r = requests.post("http://localhost:11434/api/generate",
                          json={"model": "gpt-oss:20b", "prompt": "ping"})
        ollama_ok = r.status_code == 200
    except:
        pass
