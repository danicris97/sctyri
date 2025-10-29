import Subtitle from "@/components/web/subtitle";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/layouts/web/page-layout";

export default function uvt(){
    return (
        <PageLayout>
            <Subtitle title="UNIDAD DE VINCULACIÓN TECNOLÓGICA" />

            <div>
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                COMISIÓN DE VINCULACIÓN TECNOLÓGICA
                            </h2>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                
                                {/* Sección de descripción principal */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-[#0d3b66]">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Fue creada según resolución <a href="https://bo.unsa.edu.ar/dr/R2012/R-DR-2012-0828.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0d3b66]">R-N° 828-12</a> y tiene como objetivo fortalecer la comunicación interna entre las Facultades, Institutos de investigación y Secretarias involucradas en el tema de cooperación técnica de la Universidad, con el fin de generar políticas y gestiones de vinculación con el medio socio-productivo.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        Buscando diseñar e implementar una política de vinculación eficaz que permita la transferencia de los servicios técnicos, tecnológicos y académicos como así también generar espacios y acciones que dirijan al conocimiento científico y tecnológico, social a la producción y crecimiento integral de la provincia y de la Región.
                                    </p>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#0d3b66] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Sección de miembros */}
                                <div>
                                    <div className="flex items-center mb-6">
                                        <h3 className="text-2xl font-bold text-[#0d3b66] mr-4">
                                            Miembros actuales – Comisión 2025
                                        </h3>
                                        <a 
                                            href="https://bo.unsa.edu.ar/dr/R2023/R-DR-2023-1144.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >
                                            <span className="mr-1">📄</span>
                                            TBD
                                        </a>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-[#0d3b66] mb-3 pb-2 border-b border-gray-200">
                                                Secretaria de Cooperación Técnica y Relaciones Internacionales
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="font-semibold text-gray-800">Responsable:</span>
                                                    <span className="ml-2 text-gray-700">Dr. Nilsa María Sarmiento Barbieri</span>
                                                </div>
                                                
                                                <div>
                                                    <span className="font-semibold text-gray-800">Asistentes Técnicos:</span>
                                                    <ul className="mt-2 ml-6 space-y-1">
                                                        <li className="text-gray-700 flex items-start">
                                                            <span className="w-2 h-2 bg-[#0d3b66] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                            Lic. SEGÓN, María Ximena
                                                        </li>
                                                        <li className="text-gray-700 flex items-start">
                                                            <span className="w-2 h-2 bg-[#0d3b66] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                            Sra. ARIAS, Rosa Patricia
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#488edf]">
                                            <p className="text-sm text-gray-600 italic">
                                                <span className="font-medium">Nota:</span> Los miembros restantes de la comisión están conformados por un representante titular y/o uno o más suplentes de cada una de las Unidades Académicas, Consejo de Investigación, Sedes Regionales y Representantes externos (Secretaria de Ciencias y Tecnología – Ministerio de Educación, Ciencias y Tecnología de la Provincia de Salta; CCT CONICET Salta). Los datos se encuentran en las resoluciones de nombramientos correspondientes.
                                            </p>
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
                                OFERTAS TECNOLÓGICAS
                            </h2>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}