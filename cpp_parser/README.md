# CAFF PARSER	

## Requirements
file structure:
```bash
cpp_parser/
├── previews/
│  └── ciffpreview0.jpeg
│  └── ...
├── logs
│  └── ...
├── caff_files/
│  ├── 1.caff
│  ├── 2.caff
│  └── 3.caff
```

## Usage
Installation:
- use "make" in console
- have g++ installed (used version: 11.2.0)

Usage:
- to test the application, the CAFF file must be in the `caff_files` folder
- `./caffparser <FILENAME>`