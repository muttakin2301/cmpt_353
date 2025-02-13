# cURL

Curl stands for client URL, it is a free command-line tool for transferring files with URL syntax. Curl supports a number of protocols, including HTTP, FTP, SMB, and SSL certificates

## Installation

Windows: Install chocolatey from [Chocolatey Website](https://chocolatey.org/)

```bash
  choco install curl
```

Mac OS: Install homebrew from [Homebrew Website](https://brew.sh/)

```bash
  brew install curl
```

Linux

```bash
  sudo apt-get update
  sudo apt-get install curl
```

## Example

```bash
  curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY" \
    -H 'Content-Type: application/json' \
    -X POST \
    -d '{
      "contents": [{
        "parts":[{"text": "Explain how AI works"}]
        }]
      }'
```

## Constructing cURL Command

```bash
  curl --help [category]
```

Replace [category] with specific categories such as:

- `all`: Show all options.
- `auth`: Show authentication-related options.
- `http`: Show HTTP-specific options.
- `output`: Show options for controlling output.
- `ssl`: Show SSL and security options.
