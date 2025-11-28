# ClassNote AI

**AI-Powered Lecture Note Generation System**

ClassNote AI is a comprehensive web application that captures lecture audio, transcribes it using AI, and generates well-formatted, intelligent notes with relevant images and diagrams.

## Features

- 🎙️ **Dual Recording Methods**:
  - Upload audio files (WAV, MP3, M4A)
  - Real-time recording via ESP32 wireless microphone
- 🤖 **AI Transcription**: Automatic speech-to-text with timestamps using Whisper
- 📝 **Smart Note Generation**: AI-generated structured markdown notes with:
  - Auto-generated summaries (2-3 sentences)
  - Learning objectives
  - Key concepts and subtopics
  - Interactive flashcards with image support
  - Practice questions
  - Exam tips
- 🖼️ **Intelligent Visual Enhancement**: 
  - Multi-tier image search (DuckDuckGo, Wikipedia, Pixabay)
  - Custom STEM diagram generation
  - Optimized image count (3-5 relevant images per lecture)
  - Smart image placement (avoids flashcards/practice sections)
- 🎵 **Audio-Synced Transcript**: Real-time highlighting and auto-scroll during playback
- ✏️ **Rich Text Editing**: Full-featured WYSIWYG editor with LaTeX support
- 🎨 **Material 3 Design**: Beautiful, modern UI with Rose Dark theme
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- 🗑️ **Full CRUD**: Create, read, update, and delete lectures

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **ReactQuill** - Rich text editor
- **React Markdown** - Markdown rendering with math support
- **KaTeX** - LaTeX math rendering
- **ESP32Recorder Component** - WebSocket-based ESP32 audio streaming
- **Upload Progress Context** - Real-time upload status tracking
- **Vite** - Build tool

### Backend
- **Python/Flask** - Server framework
- **Whisper** - Speech-to-text
- **Gemini AI** - Note generation and enhancement
- **Ollama** - Local AI model integration

### Styling
- **Material 3 Expressive Design**
- **Rose Dark Theme**
- **Custom CSS animations**

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NUCLEARxDYNAMO/ClassNoteAI.git
   cd ClassNoteAI
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file with your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   python dt.py
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3001`

## Project Structure

```
ClassNoteAI/
├── src/
│   ├── components/       # Reusable React components
│   ├── views/           # Page components
│   ├── styles/          # Global styles and animations
│   └── index.jsx        # App entry point
├── public/              # Static assets
├── build/               # Production build output
├── dt.py               # Backend server
└── package.json        # Frontend dependencies
```

## Usage

### Web Upload Method
1. **Login** to your account
2. **Upload** a lecture recording (WAV, MP3, M4A)
3. **Wait** for AI processing (transcription + note generation)
4. **Review** your generated notes with:
   - Auto-generated summary
   - Audio-synced transcript
   - Relevant images and diagrams
   - Interactive flashcards
5. **Edit** notes using the rich text editor
6. **Export** or share your notes

### ESP32 Recording Method
1. **Setup ESP32**:
   - Flash `Arduino Files/sketch_nov4a.ino` to your ESP32
   - Configure WiFi credentials
   - Set server IP to your machine's local IP
2. **Start Recording**:
   - Click "Record from ESP32" button
   - ESP32 streams audio in real-time
   - Live transcription and processing
3. **Review** auto-generated notes immediately after recording

## Contributing

This is a student project from VNR VJIET. Contributions are welcome!

## License

All rights reserved. A student innovation project by VNR VJIET.

## Contact

For questions or support, contact: contact@classnoteai.edu

---

Built with ❤️ by students at VNR VJIET, Hyderabad, India
