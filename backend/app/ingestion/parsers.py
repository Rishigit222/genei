import json
import csv
import io
from typing import Dict, Any, List

class DocumentParser:
    """
    Multi-format document parser supporting Markdown, JSON, CSV, and plain TXT files.
    """
    @staticmethod
    def parse_text(content: str, file_name: str) -> Dict[str, Any]:
        return {
            "file_name": file_name,
            "format": "txt",
            "content": content,
            "sections": [{"title": "Main", "text": content}]
        }

    @staticmethod
    def parse_markdown(content: str, file_name: str) -> Dict[str, Any]:
        lines = content.splitlines()
        sections = []
        current_title = "Header"
        current_text = []

        for line in lines:
            if line.startswith("#"):
                if current_text:
                    sections.append({"title": current_title, "text": "\n".join(current_text)})
                    current_text = []
                current_title = line.lstrip("#").strip()
            else:
                current_text.append(line)

        if current_text:
            sections.append({"title": current_title, "text": "\n".join(current_text)})

        return {
            "file_name": file_name,
            "format": "md",
            "content": content,
            "sections": sections
        }

    @staticmethod
    def parse_json(content: str, file_name: str) -> Dict[str, Any]:
        try:
            data = json.loads(content)
            formatted = json.dumps(data, indent=2)
            return {
                "file_name": file_name,
                "format": "json",
                "content": formatted,
                "sections": [{"title": "Root JSON", "text": formatted}]
            }
        except Exception:
            return DocumentParser.parse_text(content, file_name)

    @staticmethod
    def parse_csv(content: str, file_name: str) -> Dict[str, Any]:
        reader = csv.reader(io.StringIO(content))
        rows = list(reader)
        text_lines = [", ".join(row) for row in rows]
        full_text = "\n".join(text_lines)
        return {
            "file_name": file_name,
            "format": "csv",
            "content": full_text,
            "sections": [{"title": "CSV Data", "text": full_text}]
        }

document_parser = DocumentParser()
