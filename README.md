# ClassNote AI

**AI-Powered Lecture Note Generation System**

ClassNote AI is a comprehensive web application that captures lecture audio, transcribes it using AI, and generates well-formatted, intelligent notes with relevant images and diagrams.

## Features

- 🎙️ **Audio Recording & Upload**: Upload lecture recordings in various formats (WAV, MP3, M4A)
- 🤖 **AI Transcription**: Automatic speech-to-text conversion using Whisper
- 📝 **Smart Note Generation**: AI-generated structured notes with:
  - Learning objectives
  - Key concepts and definitions
  - Practice questions
  - Flashcards
  - Exam tips
- 🖼️ **Visual Enhancement**: Automatic image search and custom diagram generation
- ✏️ **Rich Text Editing**: Full-featured WYSIWYG editor with LaTeX support
- 🎨 **Material 3 Design**: Beautiful, modern UI with Rose Dark theme
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **ReactQuill** - Rich text editor
- **React Markdown** - Markdown rendering with math support
- **KaTeX** - LaTeX math rendering
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
   Navigate to `http://localhost:5173`

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

1. **Login** to your account
2. **Upload** a lecture recording
3. **Wait** for AI processing (transcription + note generation)
4. **Review** your generated notes
5. **Edit** notes using the rich text editor
6. **Export** or share your notes

## Contributing

This is a student project from VNR VJIET. Contributions are welcome!

## License

All rights reserved. A student innovation project by VNR VJIET.

## Contact

For questions or support, contact: contact@classnoteai.edu

---

Built with ❤️ by students at VNR VJIET, Hyderabad, India
