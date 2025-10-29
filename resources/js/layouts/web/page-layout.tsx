import { Head } from "@inertiajs/react";
import Navbar from "@/components/web/navbar";
import Footer from "@/components/web/footer";
import WhatsappFloat from "@/components/web/whatsapp-float";

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head title="Cooperación Técnica y Relaciones Internacionales">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <Navbar/>

            <WhatsappFloat phone="5493875391627" defaultText="Hola, quisiera mas información." />

            {children}

            <Footer/>
        </>
    );
}
