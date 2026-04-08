import { ThemeProvider } from "@figma/astraui";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppThemeProvider } from "./contexts/theme-context";

export default function App() {
  return (
    <AppThemeProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AppThemeProvider>
  );
}