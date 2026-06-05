FROM python:3.10-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app
COPY . .
EXPOSE 8000
CMD ["uvicorn", "20_OPERATIONAL_CORE.04_KNOWLEDGE_API.main:app", "--host", "0.0.0.0", "--port", "8000"]
