import Subtitle from "@/components/web/subtitle";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import PageLayout from "@/layouts/web/page-layout";


export default function Ingresantes(){
    return (
        <PageLayout>
            <Subtitle title="INGRESANTES" />
            <div>
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                GUÍA DEL ESTUDIANTE
                            </h2>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8">
                                
                                {/* Sección descriptiva */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-[#0d3b66] mb-8">
                                    <div className="flex items-start">
                                        <div className="w-16 h-16 bg-gradient-to-r from-[#0d3b66] to-[#488edf] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                                            <FileText className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0d3b66] mb-3">
                                                Información para Estudiantes de Intercambio
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                Esta guía contiene toda la información necesaria para estudiantes de la Universidad Nacional de Salta que deseen participar en programas de intercambio internacional. 
                                            </p>
                                            <p className="text-gray-700 leading-relaxed">
                                                Encontrarás detalles sobre requisitos, procedimientos, documentación necesaria, cronogramas, y consejos prácticos para hacer de tu experiencia de intercambio un éxito académico y personal.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center mb-8">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#0d3b66] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Sección de descarga */}
                                <div className="text-center">
                                    <div className="bg-white border-2 border-dashed border-[#488edf] rounded-lg p-8 hover:border-[#0d3b66] transition-colors duration-200">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                                <FileText className="w-10 h-10 text-white" />
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-[#0d3b66] mb-2">
                                                Guía del Estudiante
                                            </h3>
                                            
                                            <p className="text-gray-600 mb-6 max-w-md">
                                                Descarga la guía completa con toda la información que necesitas para tu intercambio internacional
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Botón de descarga */}
                                                <a 
                                                    href="/docs/guia-estudiante_compressed.pdf" 
                                                    download="Guia-del-Estudiante-UNSa.pdf"
                                                    className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0d3b66] to-[#488edf] text-white font-semibold rounded-lg hover:from-[#488edf] hover:to-[#0d3b66] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                >
                                                    <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                                                    Descargar Guía
                                                </a>

                                                {/* Botón de visualización */}
                                                <a 
                                                    href="/docs/guia-estudiante_compressed.pdf" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group inline-flex items-center px-6 py-3 bg-white border-2 border-[#0d3b66] text-[#0d3b66] font-semibold rounded-lg hover:bg-[#0d3b66] hover:text-white transition-all duration-200 transform hover:scale-105"
                                                >
                                                    <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                                                    Ver Online
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                DONDE HOSPEDARME
                            </h2>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}