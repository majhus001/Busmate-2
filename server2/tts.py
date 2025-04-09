import pyttsx3
import sys

def speak(text):
    engine = pyttsx3.init()
    engine.setProperty("rate", 150)
    engine.setProperty("volume", 1.0)
    engine.say(text)
    engine.runAndWait()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        speak(sys.argv[1])
