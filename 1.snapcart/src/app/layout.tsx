import type { Metadata } from "next";


import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";



export const metadata: Metadata = {
  title: "Snapcart | 10 Minutes Grocery Delivery App",
  description: "Snapcart is a grocery delivery app that promises to deliver groceries to your doorstep in just 10 minutes. Shop from a wide range of products including fresh produce, dairy, snacks, beverages, and household essentials. Enjoy the convenience of quick delivery and easy payment options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
        <Provider>
          <StoreProvider>
            <InitUser/>
          {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
