interface LoadingMessageProps {
  message?: string;
}

export default function LoadingMessage({
  message = "Loading...",
}: LoadingMessageProps) {
  return <p>{message}</p>;
}
