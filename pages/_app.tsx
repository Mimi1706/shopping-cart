import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { Container } from "react-bootstrap";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { ShoppingCartProvider } from "../context/ShoppingCartContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ShoppingCartProvider>
      <Navbar />
      <Container>
        <Component {...pageProps} />
      </Container>
      <Footer />
    </ShoppingCartProvider>
  );
}
