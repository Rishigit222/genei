from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.ingestion.parsers import document_parser
from app.ingestion.extractor import extractor

router = APIRouter()

@router.post("/api/v1/ingest")
async def ingest_document(
    file: Optional[UploadFile] = File(None),
    content: Optional[str] = Form(None),
    file_name: Optional[str] = Form("unnamed.txt")
):
    text_content = ""
    name = file_name

    if file:
        bytes_data = await file.read()
        text_content = bytes_data.decode("utf-8", errors="ignore")
        name = file.filename
    elif content:
        text_content = content
    else:
        raise HTTPException(status_code=400, detail="Must provide file upload or text content")

    parsed = document_parser.parse_markdown(text_content, name)
    result = extractor.process_document(parsed)
    return result
