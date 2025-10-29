import Subtitle from "@/components/web/subtitle";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/layouts/web/page-layout";

export default function CoopeInfo(){
    return (
        <PageLayout>
            <Subtitle title="INFORMACIÓN GENERAL" />

            <div>
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                REGLAMENTOS
                            </h2>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8 space-y-8"> {/* Agregamos espacio entre secciones */}
                                <ol className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Resolución de Beca de Formacion<a 
                                            href="http://bo.unsa.edu.ar/cs/R2009/R-CS-2009-0470.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            R-CS-470/09
                                        </a>. Modificatorias <a 
                                            href="http://bo.unsa.edu.ar/cs/R2022/R-CS-2022-0151.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            R-CS-151/22
                                        </a> y <a 
                                            href="http://bo.unsa.edu.ar/cs/R2022/R-CS-2022-0364.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            R-CS-364/22
                                        </a>.</li>
                                    <li>Resolución del Sistema de Pasantías Educativas&nbsp;<a 
                                            href="http://bo.unsa.edu.ar/cs/R2012/R-CS-2012-0380.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            R-CS-380/12
                                        </a>.</li>
                                    <li>Resolución del Convenio de aceptación Práctica Profesional Supervisada (PPS) <a 
                                            href="http://bo.unsa.edu.ar/cs/R2018/R-CS-2018-0382.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            R-CS-382/18
                                        </a>.</li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>

            <div>
                <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                CIRCUITO DE CONVENIO DE PASANTÍAS
                            </h2>
                        </div>

                        <div className="flex justify-center flex-wrap">
                            <img src="/images/Diagrama-convenio-azul-ver.png" alt="diagrama-circuito" id="with-animate"/>
                        </div>

                        <p className="mt-8">* Circuito establecido para el Tramite de convenio de pasantías – Establecido en <a 
                                            href="http://bo.unsa.edu.ar/cs/R2012/R-CS-2012-0380.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            R-CS-380/12
                                        </a>.</p>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}