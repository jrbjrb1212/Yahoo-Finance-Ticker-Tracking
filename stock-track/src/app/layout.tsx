import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@/components/Theme";

export const metadata: Metadata = {
  title: "Simple Stock Track",
  description: "Research and track stock ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: Theme.colors.background }}>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
