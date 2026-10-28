/**
 * Generates standalone scripts for the user to run directly on Windows/Linux 
 * to recursively scan all local hard drives, photos, and ZIP files.
 */

export function generatePythonDriveScanner(): string {
  return `#!/usr/bin/env python3
"""
OmniForge & Tania - Lokaler Festplatten- & Medien-Scanner
Scannt automatisch alle Festplatten (C:, D:, E: etc.) nach Fotos, Pornos, Videos und ZIPs.
Erstellt ein interaktives Inhaltsverzeichnis (HTML & JSON) für deine private Galerie und Stash.
"""

import os
import sys
import json
import time
from pathlib import Path

# Erkannte Dateiendungen
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'}
VIDEO_EXTS = {'.mp4', '.mkv', '.mov', '.avi', '.wmv', '.webm', '.flv'}
ARCHIVE_EXTS = {'.zip', '.rar', '.7z', '.tar', '.gz'}
CHARACTER_EXTS = {'.json', '.tavern', '.chara'}

# Relevante Schlagwörter im Dateinamen oder Ordnernamen
KEYWORDS = ['frauen', 'girl', 'sex', 'porno', 'nsfw', 'bikini', 'nude', 'hentai', 'tania', 'lila', 'artanis', 'photo', 'dcim', 'pictures']

def get_available_drives():
    drives = []
    if os.name == 'nt':
        import string
        from ctypes import windll
        bitmask = windll.kernel32.GetLogicalDrives()
        for letter in string.ascii_uppercase:
            if bitmask & 1:
                drives.append(f"{letter}:\\\\")
            bitmask >>= 1
    else:
        drives = ['/home', '/media', '/mnt']
    return drives

def scan_drive(drive_path):
    print(f"[*] Starte Scan auf: {drive_path} ... (Bitte warten)")
    results = []
    file_count = 0
    
    for root, dirs, files in os.walk(drive_path, topdown=True, followlinks=False):
        # Systemordner überspringen
        dirs[:] = [d for d in dirs if d.lower() not in {'windows', 'program files', 'appdata', 'node_modules', '$recycle.bin', 'system volume information'}]
        
        for file in files:
            file_count += 1
            if file_count % 5000 == 0:
                print(f"    Geprüft: {file_count} Dateien...")
                
            ext = os.path.splitext(file)[1].lower()
            file_lower = file.lower()
            root_lower = root.lower()
            
            is_media = ext in IMAGE_EXTS or ext in VIDEO_EXTS or ext in ARCHIVE_EXTS or ext in CHARACTER_EXTS
            if not is_media:
                continue
                
            full_path = os.path.join(root, file)
            try:
                stat = os.stat(full_path)
                size_mb = round(stat.st_size / (1024 * 1024), 2)
                
                # Typ bestimmen
                media_type = 'other'
                if ext in IMAGE_EXTS: media_type = 'image'
                elif ext in VIDEO_EXTS: media_type = 'video'
                elif ext in ARCHIVE_EXTS: media_type = 'archive'
                elif ext in CHARACTER_EXTS: media_type = 'character'
                
                # Tags ermitteln
                tags = []
                for kw in KEYWORDS:
                    if kw in file_lower or kw in root_lower:
                        tags.append(kw)
                        
                results.append({
                    "name": file,
                    "path": full_path,
                    "directory": root,
                    "size_mb": size_mb,
                    "type": media_type,
                    "extension": ext,
                    "tags": tags,
                    "modified": time.ctime(stat.st_mtime)
                })
            except Exception:
                continue
                
    return results

def main():
    print("=" * 60)
    print(" OmniForge Lokaler Festplatten-Scanner")
    print(" Sucht Bilder, Videos, Zips & Charaktere")
    print("=" * 60)
    
    drives = get_available_drives()
    print(f"Gefundene Laufwerke: {', '.join(drives)}")
    
    all_findings = []
    for d in drives:
        try:
            findings = scan_drive(d)
            print(f"[✓] {len(findings)} Medien auf {d} gefunden.")
            all_findings.extend(findings)
        except Exception as e:
            print(f"[!] Fehler bei {d}: {e}")
            
    # JSON Export
    json_path = os.path.join(os.path.expanduser("~"), "Desktop", "OmniForge_Medien_Index.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(all_findings, f, indent=2, ensure_ascii=False)
        
    # HTML Galerie Export
    html_path = os.path.join(os.path.expanduser("~"), "Desktop", "OmniForge_Inhaltsverzeichnis.html")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>OmniForge - Lokales Inhaltsverzeichnis ({len(all_findings)} Medien)</title>
<style>
body {{ font-family: system-ui, sans-serif; background: #0b0f19; color: #f3f4f6; margin: 20px; }}
h1 {{ color: #ec4899; }}
.stat {{ background: #1f2937; padding: 15px; border-radius: 8px; margin-bottom: 20px; }}
table {{ width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }}
th, td {{ padding: 8px 12px; border: 1px solid #374151; text-align: left; }}
th {{ background: #374151; }}
tr:hover {{ background: #1e293b; }}
.tag {{ background: #be185d; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px; }}
</style>
</head>
<body>
<h1>OmniForge Medien-Index</h1>
<div class="stat">
  <b>Gefundene Medien insgesamt:</b> {len(all_findings)}<br>
  <b>Export-Ort:</b> Desktop/OmniForge_Medien_Index.json<br>
  <b>Tipp:</b> Du kannst diese JSON-Datei direkt in Stash oder dein Tania-Studio importieren!
</div>
<table>
<thead>
  <tr><th>Typ</th><th>Dateiname</th><th>Größe</th><th>Pfad</th><th>Tags</th></tr>
</thead>
<tbody>
""")
        for item in all_findings[:2000]: # Top 2000 im HTML
            tag_spans = "".join([f'<span class="tag">{t}</span>' for t in item['tags']])
            f.write(f"<tr><td>{item['type']}</td><td><b>{item['name']}</b></td><td>{item['size_mb']} MB</td><td>{item['path']}</td><td>{tag_spans}</td></tr>\\n")
        f.write("</tbody></table></body></html>")

    print("=" * 60)
    print(f"[FERTIG!] Erfolgreich {len(all_findings)} Dateien katalogisiert!")
    print(f"-> HTML Inhaltsverzeichnis liegt auf deinem Desktop: {html_path}")
    print(f"-> JSON Datenbank liegt auf deinem Desktop: {json_path}")
    print("=" * 60)
    input("Drücke Enter zum Beenden...")

if __name__ == '__main__':
    main()
`;
}

export function generateWindowsBatchScanner(): string {
  return `@echo off
title OmniForge Medien & Festplatten Schnell-Index
color 0D
echo ================================================================
echo   OmniForge Festplatten-Scanner (Fotos, Videos, Pornos, Zips)
echo ================================================================
echo.
echo Suche alle Medien auf C: und D:...
echo Dies kann einige Minuten dauern.
echo.

set OUTFILE="%USERPROFILE%\\Desktop\\OmniForge_Gefundene_Dateien.txt"
echo OmniForge Gefundene Dateien > %OUTFILE%
echo Erstellt am: %date% %time% >> %OUTFILE%
echo ---------------------------------------------------------------- >> %OUTFILE%

echo Scanne Bilder und Videos...
for %%d in (C: D: E:) do (
    if exist %%d\\ (
        echo Pruefe Laufwerk %%d ...
        dir %%d\\*.jpg %%d\\*.png %%d\\*.mp4 %%d\\*.mkv %%d\\*.zip /s /b >> %OUTFILE% 2>nul
    )
)

echo.
echo ================================================================
echo FERTIG! Dein Inhaltsverzeichnis wurde gespeichert unter:
echo %OUTFILE%
echo ================================================================
pause
`;
}
