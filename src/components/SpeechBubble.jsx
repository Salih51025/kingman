export default function SpeechBubble({ text, variant = "idle" }) {
  if (!text) {
    return null;
  }

  return (
    <p className={`speech-bubble ${variant}`}>
      {text}
    </p>
  );
}
