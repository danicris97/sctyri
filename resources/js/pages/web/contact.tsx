import Subtitle from "@/components/web/subtitle";
import PageLayout from "@/layouts/web/page-layout";
import ContactForm from "@/components/forms/contact-form";

export default function Salientes(){
    return (
        <PageLayout>
            <Subtitle title="CONTACTO" />
            <div>
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                Envía un mail a nuestras dependencias
                            </h2>
                            <div className="max-w-2xl mx-auto space-y-4">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}