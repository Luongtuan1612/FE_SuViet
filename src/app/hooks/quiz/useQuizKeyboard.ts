import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

interface UseQuizKeyboardParams {
  totalQuestions: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

export function useQuizKeyboard({
  totalQuestions,
  setCurrentIndex,
}: UseQuizKeyboardParams) {
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        event.stopPropagation();

        setCurrentIndex((prev) => {
          if (prev <= 0) return prev;
          return prev - 1;
        });
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        event.stopPropagation();

        setCurrentIndex((prev) => {
          if (prev >= totalQuestions - 1) return prev;
          return prev + 1;
        });
      }
    };

    document.addEventListener("keydown", handleKeyboard, true);

    return () => {
      document.removeEventListener("keydown", handleKeyboard, true);
    };
  }, [totalQuestions, setCurrentIndex]);
}
